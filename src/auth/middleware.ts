import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import currentUser from "./currentUser.js";
import jwt from "jsonwebtoken";
import { JWTSecret } from "../main.js";

export function middleware(
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) {
  // bearer token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const userId = jwt.verify(token, JWTSecret);
    if (typeof userId !== "string") throw "Invalid token.";
    const user = currentUser(token);

    if (Number(userId) === user.id) next();
    else res.sendStatus(403);
  } catch (e) {
    res.status(401).send(e);
  }
}
