import express, { json } from "express";
import { middleware } from "./auth/middleware.js";
import { initDb } from "./db/database.js";
import getNearbyTreasures from "./functions/getNearbyTreasures.js";
import userLogin from "./auth/userLogin.js";
import userLogout from "./auth/userLogout.js";
import currentUser from "./auth/currentUser.js";

export const PORT = 3000;
export const JWTSecret = "this_is_a_secret";

initDb();

const app = express().use(json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const S400 = res.status(400);

  // Validate required fields
  if (typeof email !== "string") return S400.send("Invalid.");
  if (typeof password !== "string") return S400.send("Invalid password.");

  try {
    const token = userLogin(email, password);
    res.json({ token });
  } catch (e) {
    S400.send(e);
  }
});

app.post("/logout", middleware, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]!;
  if (!userLogout(token)) return res.sendStatus(500);
  res.sendStatus(200);
});

app.get("/user", middleware, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]!;
  const user = currentUser(token);
  res.json({ id: user.id, name: user.name, age: user.age, email: user.email });
});

app.post("/nearby_treasures", middleware, (req, res) => {
  const { latitude, longitude, distance, prize_value } = req.body;

  const S400 = res.status(400);
  // Validate required fields
  if (typeof latitude !== "number") return S400.send("Invalid latitude.");
  if (typeof longitude !== "number") return S400.send("Invalid longitude.");
  if (distance !== 1 && distance !== 10)
    return S400.send("Invalid distance. Must be 1 or 10.");

  // Validate optional fields
  if (typeof prize_value !== "undefined") {
    if (typeof prize_value !== "number")
      return S400.send("prize_value must be a number.");
    if (prize_value < 10 || prize_value > 30)
      return S400.send("prize_value must be in the range of 10-30.");
    if (prize_value !== Math.round(prize_value))
      return S400.send("prize_value must be a whole number.");
  }

  res.json(getNearbyTreasures(latitude, longitude, distance, prize_value));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}.`);
});
