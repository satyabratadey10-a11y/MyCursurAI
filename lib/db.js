import { createClient } from '@libsql/client';

// Pure environment-based connection
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
