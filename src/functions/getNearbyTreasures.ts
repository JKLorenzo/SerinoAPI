import { getDistance, isPointWithinRadius } from "geolib";
import { db } from "../db/database.js";
import Treasure from "../models/treasure.js";
import MoneyValue from "../models/money_value.js";

export default function getNearbyTreasures(
  lat: number,
  lng: number,
  distance: 1 | 10,
  prize_value: number | undefined
) {
  // Filter money_values based on prize_value
  const money_values = db
    .prepare("SELECT * FROM MONEY_VALUES WHERE amount >= ?;")
    .all(prize_value ?? 0) as MoneyValue[];

  // Filter money_values based on treasure_id with their corresponding minimum amount
  const money_values_map = new Map<number, number>();
  for (const money_value of money_values) {
    // Check if treasure_id exists in the map, amount will have a value if it exists
    const amount = money_values_map.get(money_value.treasure_id);
    // Skip if the current amount is greater than the amount stored in the map
    if (typeof amount === "number" && amount < money_value.amount) continue;

    // Store the current amount in the map
    money_values_map.set(money_value.treasure_id, money_value.amount);
  }

  // Get corresponding treasures based on treasure values
  const treasures = [...money_values_map.entries()].map((money_value) => {
    const [treasure_id, amount] = money_value;

    // Get treasure based on treasure_id
    const treasure = db
      .prepare("SELECT * FROM TREASURES WHERE id = ?")
      .get(treasure_id) as Treasure;

    // Calculate distance (in KM) of each treasure from the latlng parameter
    const distance =
      getDistance(
        { lat, lng },
        { lat: treasure.latitude, lng: treasure.longitude }
      ) / 1000;

    return {
      ...treasure,
      amount,
      distance,
    };
  });

  return (
    treasures
      // Filter treasures based on distance
      .filter((treasure) => treasure.distance <= distance)
      // Sort from nearest to furthest
      .sort((a, b) => a.distance - b.distance)
  );
}
