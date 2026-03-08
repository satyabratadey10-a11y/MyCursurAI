import { createClient } from '@libsql/client';

// Hard-coded keys are avoided; strictly using process.env for Vercel
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
