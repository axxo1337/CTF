import fastify from "fastify";
import cors from "@fastify/cors";
import * as V1Auth from "./routes/v1/auth";
import * as V1Data from "./routes/v1/data";

try {
  const server = fastify();

  await server.register(cors, { origin: "*" });

  server.register(V1Auth.auth);
  server.register(V1Data.data);

  server.listen({ port: 8080 });

  console.log("[+] API up on port 8080");
} catch (e) {
  console.log(e);
}
