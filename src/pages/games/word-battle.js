import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

const GAME_HEIGHT = 600;
const INITIAL_SPEED = 0.8;
const SPEED_INCREMENT = 0.05;
const INITIAL_SPAWN_INTERVAL = 2000;
const MIN_SPAWN_INTERVAL = 800;
const DIFFICULTY_INCREASE_INTERVAL = 10000;

export default function WordGame() {
  const [gameState, setGameState] = useState("menu"); // menu, playing, paused, gameOver
  const [letters, setLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [spawnInterval, setSpawnInterval] = useState(INITIAL_SPAWN_INTERVAL);
  const router = useRouter();

  // Load saved game state and high score on mount
  useEffect(() => {
    const savedGame = localStorage.getItem("wordBattleGame");
    const savedHighScore = localStorage.getItem("wordBattleHighScore");

    if (savedGame) {
      const { gameState, letters, score, speed, lives, spawnInterval } =
        JSON.parse(savedGame);

      setGameState(gameState);
      setLetters(letters);
      setScore(score);
      setSpeed(speed);
      setLives(lives);
      setSpawnInterval(spawnInterval);
    }

    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save game state on updates
  useEffect(() => {
    if (gameState !== "menu") {
      localStorage.setItem(
        "wordBattleGame",
        JSON.stringify({
          gameState,
          letters,
          score,
          speed,
          lives,
          spawnInterval,
        })
      );
    }
  }, [gameState, letters, score, speed, lives, spawnInterval]);

  // Save high score separately
  useEffect(() => {
    localStorage.setItem("wordBattleHighScore", highScore.toString());
  }, [highScore]);

  const spawnLetter = useCallback(() => {
    if (gameState !== "playing") return;

    // Limit maximum letters on screen
    if (letters.length >= 8) return;

    const letter = {
      id: Date.now(),
      char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: 0,
    };

    setLetters((prev) => [...prev, letter]);
  }, [gameState, letters.length]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setLetters((prevLetters) => {
        const updatedLetters = prevLetters.map((letter) => ({
          ...letter,
          y: letter.y + speed,
        }));

        // Check for letters that hit the bottom
        const hitBottom = updatedLetters.filter(
          (letter) => letter.y >= GAME_HEIGHT
        );
        if (hitBottom.length > 0) {
          setLives((prev) => {
            const newLives = prev - hitBottom.length;
            if (newLives <= 0) {
              setGameState("gameOver");
              setHighScore((current) => Math.max(current, score));
            }
            return Math.max(0, newLives);
          });
        }

        return updatedLetters.filter((letter) => letter.y < GAME_HEIGHT);
      });

      setSpeed((prev) => prev + SPEED_INCREMENT * 0.01);
    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, speed, score]);

  // Difficulty progression
  useEffect(() => {
    if (gameState !== "playing") return;

    const difficultyInterval = setInterval(() => {
      setSpawnInterval((prev) => Math.max(MIN_SPAWN_INTERVAL, prev - 100));
    }, DIFFICULTY_INCREASE_INTERVAL);

    return () => clearInterval(difficultyInterval);
  }, [gameState]);

  // Spawn new letters
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawn = setInterval(spawnLetter, spawnInterval);
    return () => clearInterval(spawn);
  }, [gameState, spawnLetter, spawnInterval]);

  // Keyboard input handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== "playing") return;

      const key = e.key.toUpperCase();
      const letterIndex = letters.findIndex((letter) => letter.char === key);

      if (letterIndex !== -1) {
        setLetters((prev) => prev.filter((_, index) => index !== letterIndex));
        setScore((prev) => prev + 1);

        // Create hit effect
        const effect = document.createElement("div");
        effect.className = "hit-effect";
        effect.style.left = `${letters[letterIndex].x}px`;
        effect.style.top = `${letters[letterIndex].y}px`;
        document.getElementById("game-container").appendChild(effect);
        setTimeout(() => effect.remove(), 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, letters]);

  const startGame = () => {
    setGameState("playing");
    setLetters([]);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setLives(3);
    setSpawnInterval(INITIAL_SPAWN_INTERVAL);
    localStorage.removeItem("wordBattleGame");
  };

  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("playing");
    }
  };

  // Clear game state when navigating away
  const handleBackToGames = () => {
    if (gameState === "playing") {
      // Save current state before navigating
      localStorage.setItem(
        "wordBattleGame",
        JSON.stringify({
          gameState,
          letters,
          score,
          speed,
          lives,
          spawnInterval,
        })
      );
    }
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-900">
      {/* Control Buttons */}
      <div className="fixed top-4 left-4 z-20 flex gap-4">
        <button
          onClick={handleBackToGames}
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
        {(gameState === "playing" || gameState === "paused") && (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 
                     hover:bg-gray-700 transition-all flex items-center gap-2 font-semibold"
          >
            {gameState === "playing" ? (
              <>
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
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resume
              </>
            )}
          </button>
        )}
      </div>

      {/* Score Panel */}
      <div className="fixed top-16 left-0 right-0 flex justify-center gap-8 z-10">
        <div className="bg-gray-800/90 shadow-lg px-6 py-3 rounded-lg border border-gray-700">
          <span className="text-2xl font-bold text-gray-100">
            Score: <span className="text-blue-400">{score}</span>
          </span>
        </div>
        <div className="bg-gray-800/90 shadow-lg px-6 py-3 rounded-lg border border-gray-700">
          <span className="text-2xl font-bold text-gray-100">
            Lives:{" "}
            <span className="text-red-400">
              {lives > 0 ? "❤️".repeat(lives) : "💔"}
            </span>
          </span>
        </div>
        <div className="bg-gray-800/90 shadow-lg px-6 py-3 rounded-lg border border-gray-700">
          <span className="text-2xl font-bold text-gray-100">
            High Score: <span className="text-purple-400">{highScore}</span>
          </span>
        </div>
      </div>

      {/* Menu Screen */}
      {gameState === "menu" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center border border-gray-700">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Letter Fall
            </h1>
            <p className="text-gray-300 text-xl mb-6">
              Type the falling letters before they hit the bottom!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
                       hover:opacity-90 transition-all transform hover:scale-105 font-bold"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Pause Screen */}
      {gameState === "paused" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center border border-gray-700">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">
              Game Paused
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setGameState("playing")}
                className="w-full px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500 
                         text-white rounded-lg hover:opacity-90 transition-all transform 
                         hover:scale-105 font-bold"
              >
                Resume Game
              </button>
              <button
                onClick={startGame}
                className="w-full px-8 py-4 text-xl bg-gray-700 text-white rounded-lg 
                         hover:bg-gray-600 transition-all font-bold"
              >
                Restart Game
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-8 py-4 text-xl bg-red-500 text-white rounded-lg 
                         hover:bg-red-600 transition-all font-bold"
              >
                Quit Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center border border-gray-700">
            <h2 className="text-4xl font-bold mb-6 text-red-400">Game Over!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl font-bold text-gray-100">
                Final Score: <span className="text-blue-400">{score}</span>
              </p>
              <p className="text-2xl font-bold text-gray-100">
                High Score: <span className="text-purple-400">{highScore}</span>
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
                       hover:opacity-90 transition-all transform hover:scale-105 font-bold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div
        id="game-container"
        className="relative w-full h-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, 
              rgba(66, 66, 66, 0.1) 0%, 
              rgba(33, 33, 33, 0.05) 50%, 
              transparent 100%)
          `,
        }}
      >
        {letters.map((letter) => (
          <div
            key={letter.id}
            className="absolute text-4xl font-black transition-transform floating glowing"
            style={{
              left: `${letter.x}px`,
              top: `${letter.y}px`,
              color: `hsl(${Math.random() * 360}, 90%, 70%)`,
              transform: `rotate(${Math.sin(letter.y / 50) * 20}deg)`,
              textShadow: `
                0 0 20px rgba(255,255,255,0.4),
                0 0 40px currentColor,
                0 0 80px currentColor
              `,
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>
    </div>
  );
}
