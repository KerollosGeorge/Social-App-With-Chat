import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kero@1842001",
  database: "social_and_chat",
});
