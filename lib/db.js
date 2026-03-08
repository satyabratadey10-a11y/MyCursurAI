import { createClient } from '@libsql/client';

// Pure connection logic using environment variables
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default client;
