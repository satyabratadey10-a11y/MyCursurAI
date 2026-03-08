const { createClient } = require("@libsql/client");

// Pure connection logic to stop migration errors
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// NOTE: initDB() removed because tables exist in Turso Playground
module.exports = db;
