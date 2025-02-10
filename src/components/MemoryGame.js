import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const DIFFICULTIES = {
  easy: { pairs: 6, timeLimit: 60 },
  medium: { pairs: 8, timeLimit: 90 },
  hard: { pairs: 12, timeLimit: 120 },
};

const CARD_SYMBOLS = [
  "🌟",
  "🎮",
  "🎲",
  "🎯",
  "🎨",
  "🎭",
  "🎪",
  "🎢",
  "🎠",
  "🎡",
  "🎩",
  "🎬",
  "🎵",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🎭",
];

const SCORING = {
  MATCH_POINTS: 100,
  MISTAKE_PENALTY: 20,
  TIME_BONUS_MULTIPLIER: 5,
  MAX_TIME_BONUS: 500,
};

const generateCards = (pairs) => {
  const symbols = CARD_SYMBOLS.slice(0, pairs);
  return [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
};

export default function MemoryGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState("menu");
  const [difficulty, setDifficulty] = useState("easy");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [highScores, setHighScores] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("memoryGameHighScores");
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Save high scores to localStorage
  useEffect(() => {
    if (Object.values(highScores).some((score) => score > 0)) {
      localStorage.setItem("memoryGameHighScores", JSON.stringify(highScores));
    }
  }, [highScores]);

  // Initialize game
  const initializeGame = (diff) => {
    setDifficulty(diff);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(DIFFICULTIES[diff].timeLimit);
    setGameState("playing");
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (
      gameState !== "playing" ||
      flipped.length === 2 ||
      flipped.includes(cardId) ||
      matched.includes(cardId)
    ) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.symbol === secondCard.symbol) {
        setMatched((prev) => [...prev, firstId, secondId]);
        setScore((prev) => prev + SCORING.MATCH_POINTS);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
        setScore((prev) => Math.max(0, prev - SCORING.MISTAKE_PENALTY));
      }
    }
  };

  // Generate cards when game starts
  useEffect(() => {
    if (gameState === "playing") {
      const { pairs } = DIFFICULTIES[difficulty];
      const newCards = generateCards(pairs);
      setCards(newCards);
    }
  }, [gameState, difficulty]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameOver");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (
      matched.length === cards.length &&
      cards.length > 0 &&
      gameState === "playing"
    ) {
      const timeBonus = Math.min(
        timeLeft * SCORING.TIME_BONUS_MULTIPLIER,
        SCORING.MAX_TIME_BONUS
      );

      const difficultyMultiplier =
        difficulty === "easy" ? 1 : difficulty === "medium" ? 1.2 : 1.5;

      const finalScore = Math.floor((score + timeBonus) * difficultyMultiplier);

      setScore(finalScore);
      setHighScores((prev) => ({
        ...prev,
        [difficulty]: Math.max(prev[difficulty], finalScore),
      }));
      setGameState("gameOver");
    }
  }, [matched.length, cards.length, timeLeft, difficulty, score, gameState]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
      {/* Control buttons */}
      <div className="fixed top-4 left-4 z-20">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 
                   hover:bg-gray-700 transition-all flex items-center gap-2 font-semibold"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Games
        </button>
      </div>

      {/* Game title */}
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Memory Game
      </h1>

      {/* Menu screen */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Select Difficulty
          </h2>
          {Object.keys(DIFFICULTIES).map((diff) => (
            <button
              key={diff}
              onClick={() => initializeGame(diff)}
              className={`
                px-8 py-4 text-xl rounded-lg font-bold
                transition-all transform hover:scale-105
                shadow-md hover:shadow-lg
                ${
                  diff === "easy"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : diff === "medium"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }
                text-white
              `}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Game screen */}
      {(gameState === "playing" || gameState === "gameOver") && (
        <>
          {/* Game stats */}
          <div className="flex gap-8 mb-8">
            {[
              { label: "Score", value: score, color: "blue" },
              { label: "Time", value: `${timeLeft}s`, color: "red" },
              { label: "Moves", value: moves, color: "purple" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-gray-800 px-6 py-3 rounded-lg shadow-md border border-gray-700"
              >
                <span className="text-2xl font-bold text-gray-200">
                  {label}: <span className={`text-${color}-400`}>{value}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Game grid */}
          <div
            className={`grid gap-4 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700
              ${
                difficulty === "easy"
                  ? "grid-cols-4"
                  : difficulty === "medium"
                  ? "grid-cols-4"
                  : "grid-cols-6"
              }
            `}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-20 h-20 text-4xl
                  rounded-lg
                  transition-all duration-300
                  transform perspective-1000
                  shadow-sm hover:shadow-md
                  ${
                    flipped.includes(card.id) || matched.includes(card.id)
                      ? "rotate-y-180 bg-gray-700 border border-gray-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                  }
                  ${matched.includes(card.id) ? "opacity-50" : ""}
                  disabled:cursor-not-allowed
                  active:scale-95
                `}
                disabled={
                  gameState !== "playing" ||
                  flipped.length === 2 ||
                  matched.includes(card.id)
                }
              >
                {(flipped.includes(card.id) || matched.includes(card.id)) && (
                  <span className="block rotate-y-180 animate-pop-in">
                    {card.symbol}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Game over screen */}
      {gameState === "gameOver" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              {matched.length === cards.length
                ? "You Won! 🎉"
                : "Game Over! ⏰"}
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl text-gray-300">
                Final Score:{" "}
                <span className="text-blue-400 font-bold">{score}</span>
              </p>
              <p className="text-xl text-gray-300">
                High Score:{" "}
                <span className="text-purple-400 font-bold">
                  {highScores[difficulty]}
                </span>
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => initializeGame(difficulty)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                         text-white rounded-lg hover:opacity-90 transition-all
                         transform hover:scale-105 font-bold shadow-md"
              >
                Play Again
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg 
                         hover:bg-gray-600 transition-all font-bold"
              >
                Change Difficulty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause screen */}
      {gameState === "paused" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Game Paused
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setGameState("playing")}
                className="w-full px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500 
                         text-white rounded-lg hover:opacity-90 transition-all transform 
                         hover:scale-105 font-bold shadow-md"
              >
                Resume Game
              </button>
              <button
                onClick={() => initializeGame(difficulty)}
                className="w-full px-8 py-4 text-xl bg-gray-700 text-gray-200 rounded-lg 
                         hover:bg-gray-600 transition-all font-bold"
              >
                Restart Game
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="w-full px-8 py-4 text-xl bg-red-500 text-white rounded-lg 
                         hover:bg-red-600 transition-all font-bold shadow-md"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
