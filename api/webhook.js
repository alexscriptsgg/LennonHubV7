// api/webhook.js
export default async function handler(req, res) {
  const SECRET = process.env.GAME_SECRET;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (req.headers["x-game-secret"] !== SECRET) return res.status(401).json({ error: "Invalid secret" });

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Discord failed", text });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
