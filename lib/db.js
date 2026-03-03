const { createClient } = require("@libsql/client");

/**
 * SECURE DATABASE CONNECTION
 * We use process.env to keep your keys private.
 * This prevents GitHub from flagging your account.
 */
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

/**
 * NOTE: Automatic table creation (initDB) is removed to prevent 
 * migration 400 errors during Vercel function execution.
 */

module.exports = db;
