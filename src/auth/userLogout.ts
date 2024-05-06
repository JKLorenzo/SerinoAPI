import { db } from "../db/database.js";

export default function userLogout(token: string) {
  const query = db.prepare("DELETE FROM ACCESS_TOKENS WHERE token = ?;");
  const result = query.run(token);
  return result.changes > 0;
}
