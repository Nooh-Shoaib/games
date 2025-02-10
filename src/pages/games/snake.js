import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 30;
const INITIAL_SPEED = 150;
const MIN_SPEED = 80;
const SPEED_DECREASE = 2;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export default function SnakeGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState("menu"); // menu, playing, paused, gameOver
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [deathAnimation, setDeathAnimation] = useState(false);

  // Load high score on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score
  useEffect(() => {
    localStorage.setItem("snakeHighScore", highScore.toString());
  }, [highScore]);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  }, [snake]);

  const checkCollision = (head) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Self collision - check against all segments except the head
    const selfCollision = snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);

    if (selfCollision) {
      setDeathAnimation(true);
      // Play death animation before game over
      setTimeout(() => {
        setDeathAnimation(false);
        setGameState("gameOver");
        setHighScore((prev) => Math.max(prev, score));
      }, 1000);
      return true;
    }

    return false;
  };

  const moveSnake = useCallback(() => {
    if (gameState !== "playing") return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (checkCollision(head)) {
        setGameState("gameOver");
        setHighScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_DECREASE));
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState, generateFood, score]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [gameState, moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== "playing") return;

      const keyDirections = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
        w: DIRECTIONS.UP,
        s: DIRECTIONS.DOWN,
        a: DIRECTIONS.LEFT,
        d: DIRECTIONS.RIGHT,
      };

      const newDirection = keyDirections[e.key];
      if (!newDirection) return;

      // Prevent 180-degree turns
      const isOpposite =
        newDirection.x === -direction.x && newDirection.y === -direction.y;
      if (!isOpposite) {
        setDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameState]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    generateFood();
    setGameState("playing");
  };

  const togglePause = () => {
    setGameState(gameState === "playing" ? "paused" : "playing");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      {/* Control Buttons */}
      <div className="fixed top-4 left-4 z-20 flex gap-4">
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
        {gameState === "playing" && (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 
                     hover:bg-gray-700 transition-all flex items-center gap-2 font-semibold"
          >
            Pause
          </button>
        )}
      </div>

      {/* Score Display */}
      <div className="fixed top-4 right-4 flex gap-4">
        <div className="bg-gray-800/90 px-6 py-3 rounded-lg border border-gray-700">
          <span className="text-2xl font-bold text-gray-100">
            Score: <span className="text-green-400">{score}</span>
          </span>
        </div>
        <div className="bg-gray-800/90 px-6 py-3 rounded-lg border border-gray-700">
          <span className="text-2xl font-bold text-gray-100">
            High Score: <span className="text-purple-400">{highScore}</span>
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div
        className="grid gap-1 bg-gray-800/90 p-4 rounded-xl border-2 border-gray-600 shadow-2xl backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isFood = food.x === x && food.y === y;
          const isHead = snake[0].x === x && snake[0].y === y;

          return (
            <div
              key={index}
              className={`
                w-[30px] h-[30px] rounded-md transition-all duration-200
                ${
                  isHead
                    ? "bg-gradient-to-br from-emerald-300 to-emerald-500 shadow-lg shadow-emerald-500/50 scale-110 z-10"
                    : isSnake
                    ? `bg-gradient-to-br from-green-400 to-green-600 shadow-md
                       ${deathAnimation ? "animate-shake bg-red-500" : ""}`
                    : isFood
                    ? "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50 animate-pulse scale-105"
                    : "bg-gray-700/50 border border-gray-600/30"
                }
                ${isSnake && !isHead ? "scale-95" : ""}
                ${deathAnimation && isSnake ? "animate-collision" : ""}
              `}
            />
          );
        })}
      </div>

      {/* Menu Screen */}
      {gameState === "menu" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Snake Game
            </h1>
            <p className="text-gray-300 mb-6">Use arrow keys or WASD to move</p>
            <button
              onClick={startGame}
              className="px-8 py-4 text-xl bg-gradient-to-r from-green-500 to-emerald-500 
                       text-white rounded-lg hover:opacity-90 transition-all transform 
                       hover:scale-105 font-bold"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Pause Screen */}
      {gameState === "paused" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">
              Game Paused
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setGameState("playing")}
                className="w-full px-8 py-4 text-xl bg-gradient-to-r from-green-500 to-emerald-500 
                         text-white rounded-lg hover:opacity-90 transition-all transform 
                         hover:scale-105 font-bold"
              >
                Resume
              </button>
              <button
                onClick={startGame}
                className="w-full px-8 py-4 text-xl bg-gray-700 text-white rounded-lg 
                         hover:bg-gray-600 transition-all font-bold"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-red-400">Game Over!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl font-bold text-gray-100">
                Score: <span className="text-green-400">{score}</span>
              </p>
              <p className="text-2xl font-bold text-gray-100">
                High Score: <span className="text-purple-400">{highScore}</span>
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 text-xl bg-gradient-to-r from-green-500 to-emerald-500 
                       text-white rounded-lg hover:opacity-90 transition-all transform 
                       hover:scale-105 font-bold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
