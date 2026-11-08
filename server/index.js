// Bantu Tugas API entry point: wires the MySQL pool and email notifier into the
// request handler (app.js). Runs behind Apache (ProxyPass /api/ -> 127.0.0.1:PORT/api/).
import http from "node:http";
import mysql from "mysql2/promise";
import { createHandler } from "./app.js";
import { createNotifier } from "./mailer.js";

const env = process.env;
const PORT = Number(env.PORT || 4200);

const db = mysql.createPool({
  host: env.DB_HOST || "127.0.0.1",
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 5,
  dateStrings: true,
});

if (!env.ADMIN_PASSWORD) console.log("admin area disabled (ADMIN_PASSWORD not set)");
else if (env.ADMIN_PASSWORD.length < 10) console.warn("warning: ADMIN_PASSWORD is shorter than 10 characters");

const handler = createHandler({
  db,
  notify: createNotifier(env),
  adminPassword: env.ADMIN_PASSWORD || "",
  sessionSecret: env.SESSION_SECRET || "",
  secureCookie: env.COOKIE_SECURE !== "false",
});

http.createServer(handler).listen(PORT, "127.0.0.1", () => {
  console.log(`bantutugas-api listening on 127.0.0.1:${PORT}`);
});
