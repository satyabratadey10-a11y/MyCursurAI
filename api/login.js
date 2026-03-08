import db from '../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { username, password } = req.body;

    // Direct execution - No migration or table creation checks
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1",
      args: [username, password],
    });

    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, user: result.rows[0] });
    } else {
      return res.status(401).json({ success: false, error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Turso Connection Error:", error);
    // This sends the message that triggers your 'Database Connection Failed' alert
    return res.status(500).json({ success: false, error: "Database Connection Failed" });
  }
}
