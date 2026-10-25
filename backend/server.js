
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get("/", (req, res) => {
  res.json({ message: "FindBack backend is running!" });
});

app.get("/api/db-check", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DATABASE() AS database_name"
    );

    res.json({
      message: "MySQL connected successfully!",
      database: rows[0].database_name,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      message: "Database connection failed.",
    });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const [items] = await db.query(
      "SELECT * FROM items ORDER BY created_at DESC"
    );

    res.json(items);
  } catch (error) {
    console.error("Fetch items failed:", error.message);
    res.status(500).json({
      message: "Could not fetch items.",
    });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      item_type,
      location,
      contact,
    } = req.body;

    if (!title || !item_type) {
      return res.status(400).json({
        message: "Title and item type are required.",
      });
    }

    if (!["Lost", "Found"].includes(item_type)) {
      return res.status(400).json({
        message: "Item type must be Lost or Found.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO items
       (title, description, category, item_type, location, contact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        category || null,
        item_type,
        location || null,
        contact || null,
      ]
    );

    res.status(201).json({
      message: "Item added successfully!",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Add item failed:", error.message);
    res.status(500).json({
      message: "Could not add item.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `FindBack backend running on http://localhost:${PORT}`
  );
});
