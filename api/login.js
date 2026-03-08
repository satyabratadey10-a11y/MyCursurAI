const db = require('../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, email, password } = req.body;

  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE username = ? AND email = ? AND password = ?",
      args: [username, email, password]
    });

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: "Database Connection Failed" });
  }
}
