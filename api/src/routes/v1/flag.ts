import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "@/utils/db";

import jwt from "jsonwebtoken";
import * as utils from "@/utils/utils";

//
// Routes
//

/* Check if flag good */
async function Validate(req: FastifyRequest, rep: FastifyReply) {
  try {
    if (!utils.IsCTFStarted() || !utils.IsCTFOver()) return rep.status(418).send("CTF not started or over");

    let decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY);

    if (
      !decoded ||
      decoded.status & utils.user_status_flags.BANNED ||
      decoded.status & utils.user_status_flags.ADMIN
    )
      return rep.status(401).send();

    const chall_id = req.query["a"];

    const done = await pool
      .query({
        text: "SELECT COUNT(id) AS done FROM done WHERE uid = $1 AND cid = $2",
        values: [decoded.id, chall_id],
      })
      .then((res) => {
        return res.rows[0].done;
      });

    if (done > 0) return rep.status(200).send();

    const challenge = await pool
      .query({
        text: "SELECT CAST(flag AS varchar), score, first_blood_uid, (SELECT COUNT(cid) FROM done WHERE cid=$1) AS solves, (SELECT COUNT(id) FROM users WHERE status & 1 = 0 and status & 2 = 0) AS users FROM challenges WHERE id=$1",
        values: [chall_id],
      })
      .then((res) => {
        return res.rows[0];
      });

    if (challenge.flag !== req.query["b"]) return rep.status(400).send();

    if (challenge.first_blood_uid == null) {
      await pool.query({
        text: "UPDATE challenges SET first_blood_uid = $1 WHERE id = $2",
        values: [decoded.id, chall_id],
      });
    }

    const percent_solves = (parseInt(challenge.solves) + 1) / challenge.users;

    console.log(parseInt(challenge.solves) + 1);

    const base_score =
      utils.max_base_score - Math.round(percent_solves * utils.max_base_score);

    await pool.query({
      text: "INSERT INTO done (uid, cid, base_points) VALUES ($1, $2, $3)",
      values: [decoded.id, chall_id, base_score],
    });

    let new_chall_score =
      challenge.score - Math.round(percent_solves * challenge.score);

    if (new_chall_score < utils.min_chall_score)
      new_chall_score = utils.min_chall_score;

    await pool.query({
      text: "UPDATE challenges SET score = $1 WHERE id = $2",
      values: [new_chall_score, chall_id],
    });

    rep.status(200).send();
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

//
// Configuration
//

export const routing = "/v1/flag";

export async function flag(fastify, opts) {
  fastify.get(`${routing}/validate`, Validate);
}
