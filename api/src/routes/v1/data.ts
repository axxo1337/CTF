import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "@/utils/db";

import jwt from "jsonwebtoken";
import * as utils from "@/utils/utils";

//
// Routes
//

async function Time(req: FastifyRequest, rep: FastifyReply) {
  rep.status(200).send(utils.start_epoch);
}

async function User(req: FastifyRequest, rep: FastifyReply) {
  try {
    const user = await pool
      .query({
        text: 'SELECT id, "name" FROM users WHERE id=$1 AND status & 1 = 0',
        values: [req.params["*"]],
      })
      .then((res) => {
        return res.rows[0];
      });

    if (!user) return rep.status(404).send();

    const user_score = await pool
      .query({
        text: "SELECT SUM(CASE WHEN (c.score + d.base_points > 500) THEN 500 ELSE (c.score + d.base_points) END) AS score FROM done d INNER JOIN challenges c ON d.cid = c.id WHERE d.uid=$1",
        values: [user.id],
      })
      .then((res) => {
        return res.rows[0];
      });

    rep.status(200).send({
      id: user.id,
      name: user.name,
      score: user_score.score,
    });
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

async function Scoreboard(req: FastifyRequest, rep: FastifyReply) {
  try {
    const users = await pool
      .query(
        'SELECT u.id, u."name", SUM(CASE WHEN (c.score + d.base_points > 500) THEN 500 ELSE (c.score + d.base_points) END) AS score FROM users u LEFT JOIN done d ON u.id = d.uid LEFT JOIN challenges c ON d.cid = c.id where u.status & 1 = 0 GROUP BY u.id'
      )
      .then((res) => {
        return res.rows;
      });

    rep.status(200).send(users);
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

async function Sections(req: FastifyRequest, rep: FastifyReply) {
  try {
    if (!utils.IsCTFStarted()) return rep.status(418).send("CTF not started");

    let decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY);

    if (!decoded) return rep.status(401).send();

    const sections = await pool.query("SELECT * FROM sections").then((res) => {
      return res.rows;
    });

    rep.status(200).send(JSON.stringify(sections));
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

async function Challenges(req: FastifyRequest, rep: FastifyReply) {
  try {
    if (!utils.IsCTFStarted()) return rep.status(418).send("CTF not started");

    let decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY);

    if (!decoded || decoded.status & utils.user_status_flags.BANNED)
      return rep.status(401).send();

    const challenges = await pool
      .query({
        text: 'SELECT c.id, c."name", c."desc", c.score, (CASE WHEN (SELECT id FROM done WHERE uid = $1 AND cid=c.id) IS NULL THEN false ELSE true END) AS solved FROM challenges c WHERE c.section_id = $2',
        values: [decoded.id, req.params["*"]],
      })
      .then((res) => {
        return res.rows;
      });

    rep.status(200).send(challenges);
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

//
// Configuration
//

export const routing = "/v1/data";

export async function data(fastify, opts) {
  fastify.get(`${routing}/time`, Time);
  fastify.get(`${routing}/scoreboard`, Scoreboard);
  fastify.get(`${routing}/user/*`, User);
  fastify.get(`${routing}/sections`, Sections);
  fastify.get(`${routing}/challenges/*`, Challenges);
}
