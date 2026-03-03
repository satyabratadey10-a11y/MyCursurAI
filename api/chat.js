const db = require('../lib/db');

// Secure Server-Side Keys
const KEYS = {
    gemini: "AIzaSyC7Q15NjqrcFbiBaLSBmgWRg8eo11mUclU",
    groq: "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",
    huggingface: "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"
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { prompt, model, mode } = req.body;

    // 1. Style System Enforcement on the Server
    if (mode === 'normal' && (prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("file"))) {
        return res.status(403).json({ error: "Mode Not Supported: Code generation is disabled in Normal Mode." });
    }

    try {
        let aiText = "";
        const systemPrompt = mode === 'coding' 
            ? "System: Coding Mode. You have file permissions. Output code wrapped exactly in [FILE: path/name.ext] code [END]. To run terminal commands, output [TERM: command]."
            : "System: Normal Mode. Answer normally. Do NOT output code files.";

        // 2. Route to correct AI
        if (model === 'gemini') {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEYS.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt + "\n" + prompt }] }] })
            });
            const data = await response.json();
            aiText = data.candidates[0].content.parts[0].text;
        } else if (model === 'qwen') {
            const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${KEYS.huggingface}`, "Content-Type": "application/json", "x-wait-for-model": "true" },
                body: JSON.stringify({ model: "Qwen/Qwen2.5-Coder-32B-Instruct", messages: [{ role: "user", content: systemPrompt + "\n" + prompt }] })
            });
            const data = await response.json();
            aiText = data.choices[0].message.content;
        }

        // 3. Save Chat to Turso Database
        await db.execute({
            sql: "INSERT INTO chat_history (role, content) VALUES (?, ?)",
            args: ["user", prompt]
        });
        await db.execute({
            sql: "INSERT INTO chat_history (role, content) VALUES (?, ?)",
            args: ["ai", aiText]
        });

        // 4. Return to Frontend
        res.status(200).json({ response: aiText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
