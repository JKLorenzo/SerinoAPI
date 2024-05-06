import jwt from "jsonwebtoken";
import { db } from "../db/database.js";
import User from "../models/user.js";
import { JWTSecret } from "../main.js";

export default function userLogin(email: string, password: string) {
  const user = db
    .prepare("SELECT id, password FROM USERS WHERE email = ?;")
    .get(email) as User | undefined;
  if (typeof user === "undefined") throw "Email is not registered.";

  if (password !== user.password) throw "Password is incorrect.";

  // Generate token
  return jwt.sign(String(user.id), JWTSecret);
}
