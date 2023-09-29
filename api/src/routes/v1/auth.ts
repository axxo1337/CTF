import { FastifyReply, FastifyRequest } from "fastify";
import { pool } from "@/utils/db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//
// Routes
//

const Regexs = {
  username: "/^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/g",
  password: "/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,16}$/g",
};

async function Signin(req: FastifyRequest, rep: FastifyReply) {
  try {
    const username = req.query["a"];
    const password = req.query["b"];
    const remember = parseInt(req.query["c"]);

    // Check username then check password
    if (Regexs.username.match(username) != null) return rep.status(400).send();
    if (Regexs.password.match(password) != null) return rep.status(400).send();

    const user = await pool
      .query({ text: "SELECT * FROM users WHERE name=$1", values: [username] })
      .then((res) => {
        return res.rows[0];
      });

    // Check if user was found then check passwords match
    if (!user) return rep.status(400).send();
    if ((await Bun.password.verify(password, user.password)) == false)
      return rep.status(400).send();

    rep.status(200).send(
      jwt.sign(
        { id: user.id, name: username, status: user.status },
        process.env.TOKEN_KEY,
        {
          expiresIn: remember ? "168h" : "2h",
        }
      )
    );
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

async function Signup(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { key, username, password }: any = req.body;

    // Check secret key, username and password
    if (key != process.env.SECRET_KEY) return rep.status(400).send();
    if (Regexs.username.match(username) != null) return rep.status(400).send();
    if (Regexs.password.match(password) != null) return rep.status(400).send();

    /* Check if user exists */
    if (
      await pool
        .query({
          text: "SELECT id FROM users WHERE name=$1",
          values: [username],
        })
        .then((res) => {
          return res.rows[0];
        })
    )
      return rep.status(403).send();

    /* Create user */
    await pool
      .query({
        text: "INSERT INTO users (name, password) VALUES ($1, $2)",
        values: [
          username,
          await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 }),
        ],
      })
      .then((res) => {
        return res.rows[0];
      });

    rep.status(201).send();
  } catch (e) {
    console.log("[-] Something went wrong -> " + e);
    rep.status(500).send();
  }
}

//
// Configuration
//

export const routing = "/v1/auth";

export async function auth(fastify: any, opts: any) {
  fastify.get(`${routing}/signin`, Signin);
  fastify.post(`${routing}/signup`, Signup);
}
