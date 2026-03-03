const db = require('../lib/db');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { username, email, password } = req.body;

    try {
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE username = ? AND email = ?",
            args: [username, email]
        });

        const user = result.rows[0];
        if (user) {
            // Logic: In production, compare hashed passwords here
            res.status(200).json({ user: { id: user.id, username: user.username } });
        } else {
            res.status(401).json({ error: "Invalid User or Email" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
