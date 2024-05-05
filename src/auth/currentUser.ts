import { db } from "../db/database.js";
import ACCESS_TOKEN from "../models/access_token.js";
import User from "../models/user.js";

export default function currentUser(userToken: string) {
  const access_token = db
    .prepare("SELECT * FROM ACCESS_TOKENS WHERE token = ?")
    .get(userToken) as ACCESS_TOKEN | undefined;
  if (typeof access_token === "undefined") throw "Invalid token.";

  const user = db
    .prepare("SELECT * FROM USERS WHERE id = ?")
    .get(access_token.user_id) as User | undefined;
  if (typeof user === "undefined") throw "User does not exist.";

  return user;
}
