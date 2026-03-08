import { OpenAI } from "openai";
const db = require('../lib/db');

const hfClient = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

export default async function handler(req, res) {
  const { prompt, mode, depth } = req.body;

  const systemMessage = depth === 'hyper' 
    ? "HYPER SELF MODE: Analyze all files, fix errors, and output 100% working code." 
    : "Standard Mode: Assistant.";

  try {
    const response = await hfClient.chat.completions.create({
      model: "Qwen/Qwen3.5-35B-A3B",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ]
    });

    const aiText = response.choices[0].message.content;

    // Log to Turso for history
    await db.execute({
      sql: "INSERT INTO chat_history (role, content) VALUES (?, ?)",
      args: ["user", prompt]
    });

    res.status(200).json({ response: aiText });
  } catch (error) {
    res.status(500).json({ error: "AI Service Unavailable" });
  }
}
