import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: "../../.env" });

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: false,
});
