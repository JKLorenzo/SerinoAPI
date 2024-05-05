import Database from "better-sqlite3";

export const db = new Database("database.sql");

export function initDb() {
  clearDb();
  createDb();
  seedDb();
}

function clearDb() {
  db.exec(`
    DROP TABLE IF EXISTS USERS;
    DROP TABLE IF EXISTS TREASURES;
    DROP TABLE IF EXISTS MONEY_VALUES;
  `);
}

function createDb() {
  db.exec(`
    CREATE TABLE USERS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      email TEXT,
      password TEXT
    );
    
    CREATE TABLE TREASURES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      latitude INTEGER,
      longitude INTEGER
    );
    
    CREATE TABLE MONEY_VALUES (
      treasure_id INTEGER,
      amount INTEGER,
      FOREIGN KEY (treasure_id) REFERENCES TREASURES (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
  `);
}

function seedDb() {
  db.exec(`
    INSERT INTO
      USERS (id, name, age, password, email)
    VALUES
      (3000, 'U1', 21, '123123', 'u1@kitra.abc'),
      (3001, 'U2', 51, '234234', 'u2@kitra.abc'),
      (3002, 'U3', 31, '345345', 'u3@kitra.abc'),
      (3003, 'U4', 18, '456456', 'u4@kitra.abc'),
      (3004, 'U5', 21, '567567', 'u5@kitra.abc'),
      (3005, 'U6', 35, '678678', 'u6@kitra.abc');

    INSERT INTO
      TREASURES (id, latitude, longitude, name)
    VALUES
      (100, 14.54376481, 121.0199117, 'T1'),
      (101, 14.55320766, 121.0557745, 'T2'),
      (102, 14.54464357, 121.0203656, 'T3'),
      (103, 14.58726159, 120.9795048, 'T4'),
      (104, 14.57320327, 121.0230904, 'T5'),
      (105, 14.52311313, 121.0194573, 'T6'),
      (106, 14.60242292, 121.0115134, 'T7'),
      (107, 14.60857463, 121.0185514, 'T8'),
      (108, 14.49111434, 121.0437482, 'T9'),
      (109, 14.54455953, 121.1060883, 'T10'),
      (110, 14.58798141, 121.058208, 'T11'),
      (111, 14.54886493, 121.0336393, 'T12'),
      (112, 14.53715059, 120.9904302, 'T13'),
      (113, 14.52579666, 121.0208688, 'T14'),
      (114, 14.51709988, 120.9810021, 'T15'),
      (115, 14.50200687, 120.9916181, 'T16'),
      (116, 14.52112441, 121.0427714, 'T17'),
      (117, 14.47720766, 120.9867927, 'T18');

    INSERT INTO
      MONEY_VALUES (treasure_id, amount)
    VALUES
      (100, 15),
      (101, 10),
      (102, 15),
      (103, 15),
      (104, 10),
      (105, 15),
      (106, 15),
      (107, 10),
      (108, 15),
      (109, 15),
      (110, 10),
      (111, 15),
      (112, 15),
      (113, 10),
      (114, 15),
      (115, 15),
      (116, 10),
      (117, 15),
      (100, 20),
      (101, 25),
      (102, 20),
      (103, 25),
      (107, 30),
      (108, 30),
      (109, 30);
  `);
}
