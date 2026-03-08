import { createClient } from '@libsql/client';

// Initializing with the keys you provided
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
