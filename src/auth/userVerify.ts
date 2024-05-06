import { db } from "../db/database.js";
import jwt from "jsonwebtoken";
import { JWTSecret } from "../main.js";
import User from "../models/user.js";

export default function userVerify(token: string) {
  const userId = jwt.verify(token, JWTSecret);
  if (typeof userId !== "string") throw "Invalid token.";

  const user = db.prepare("SELECT * FROM USERS WHERE id = ?;").get(userId) as
    | User
    | undefined;
  if (typeof user === "undefined") throw "User does not exist.";

  return user;
}
