import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const { gameType, userId } = req.query;

    const savedGame = await db.collection("games").findOne({
      userId,
      gameType,
    });

    if (!savedGame) {
      return res.status(404).json({ message: "No saved game found" });
    }

    res.status(200).json(savedGame);
  } catch (error) {
    console.error("Load game error:", error);
    res.status(500).json({ message: "Error loading game state" });
  }
}
