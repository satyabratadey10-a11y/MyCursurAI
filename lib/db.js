const { createClient } = require("@libsql/client");

// Connects to your Turso Database
const db = createClient({
  url: "libsql://cursor-db-satyabratadey10-a11y.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzI1MzE1MzMsImlkIjoiMDE5Y2IzMWMtNjAwMS03ODU4LThlMzQtZTljMGUwZWViNWJhIiwicmlkIjoiNzk3NWI2MDAtMzMzNi00YjAyLWEzNjMtNzIxOTY4Y2FjMjVlIn0.QgJx6Fd23n0htj-t8lRT56ZVB0JgPTtGkB5q2OLVCW1bLvVxoSdrXzCgFLmKgFyjcaEwE1avhz3H-eiuaaoPDA"
});

// Create tables automatically if they don't exist
async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE,
      content TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
initDB();

module.exports = db;
