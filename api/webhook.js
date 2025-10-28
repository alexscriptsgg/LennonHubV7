// api/webhook.js
export default async function handler(req, res) {
  const SECRET = process.env.GAME_SECRET;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check the secret
  const sentSecret = req.headers["x-game-secret"];
  if (!sentSecret || sentSecret !== SECRET) {
    return res.status(401).json({ error: "Invalid secret" });
  }

  try {
    // Forward the payload to Discord
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
