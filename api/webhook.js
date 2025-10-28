// api/webhook.js
const fetch = require("node-fetch"); // only needed if your environment doesn't have global fetch

module.exports = async (req, res) => {
  const SECRET = process.env.GAME_SECRET;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  console.log("Received request:", req.method, req.body);

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log("Rejected: method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check the secret
  const sentSecret = req.headers["x-game-secret"];
  if (!sentSecret || sentSecret !== SECRET) {
    console.log("Rejected: invalid secret", sentSecret);
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
      console.log("Discord failed:", text);
      return res.status(500).json({ error: "Discord failed", text });
    }

    console.log("Successfully forwarded to Discord");
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
