import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const DIFFICULTY_LEVELS = {
  easy: { size: 15, name: "Easy", timeLimit: 60 },
  medium: { size: 21, name: "Medium", timeLimit: 90 },
  hard: { size: 31, name: "Hard", timeLimit: 120 },
  extreme: { size: 41, name: "Extreme", timeLimit: 180 },
};

const CELL_SIZE = 20;

function GameMenu({ onResume, onRestart, onExit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-xl space-y-4 max-w-sm w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Game Paused</h2>
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
          >
            Resume
          </button>
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Restart
          </button>
          <button
            onClick={onExit}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Exit to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MazeGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState("menu"); // menu, playing, success
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bestScores, setBestScores] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Generate maze using Recursive Backtracking algorithm
  const generateMaze = useCallback((mazeSize) => {
    const newMaze = Array(mazeSize)
      .fill()
      .map(() => Array(mazeSize).fill(1));

    function carve(x, y) {
      newMaze[y][x] = 0;

      const directions = [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0],
      ].sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX > 0 &&
          newX < mazeSize - 1 &&
          newY > 0 &&
          newY < mazeSize - 1 &&
          newMaze[newY][newX] === 1
        ) {
          newMaze[y + dy / 2][x + dx / 2] = 0;
          carve(newX, newY);
        }
      }
    }

    carve(1, 1);
    newMaze[mazeSize - 2][mazeSize - 2] = 0;
    return newMaze;
  }, []);

  // Solve maze using BFS
  const solveMaze = useCallback((maze, mazeSize) => {
    const start = { x: 1, y: 1 };
    const end = { x: mazeSize - 2, y: mazeSize - 2 };
    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const { x, y } = path[path.length - 1];

      if (x === end.x && y === end.y) return path;

      const directions = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        const key = `${newX},${newY}`;

        if (
          newX >= 0 &&
          newX < mazeSize &&
          newY >= 0 &&
          newY < mazeSize &&
          maze[newY][newX] === 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push([...path, { x: newX, y: newY }]);
        }
      }
    }
    return [];
  }, []);

  const startGame = useCallback(
    (selectedDifficulty = difficulty) => {
      const mazeSize = DIFFICULTY_LEVELS[selectedDifficulty].size;
      const newMaze = generateMaze(mazeSize);
      setMaze(newMaze);
      setPlayerPos({ x: 1, y: 1 });
      setSolution(solveMaze(newMaze, mazeSize));
      setTimeLeft(DIFFICULTY_LEVELS[selectedDifficulty].timeLimit);
      setMoves(0);
      setGameState("playing");
      setShowSolution(false);
      setIsPaused(false);
    },
    [difficulty, generateMaze, solveMaze]
  );

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("failed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, isPaused]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && gameState === "playing") {
        setIsPaused((prev) => !prev);
        setShowMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing" || isPaused) return;

      const mazeSize = DIFFICULTY_LEVELS[difficulty].size;
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          newY--;
          break;
        case "ArrowDown":
        case "s":
          newY++;
          break;
        case "ArrowLeft":
        case "a":
          newX--;
          break;
        case "ArrowRight":
        case "d":
          newX++;
          break;
        default:
          return;
      }

      // Check if move is valid
      if (
        newX >= 0 &&
        newX < mazeSize &&
        newY >= 0 &&
        newY < mazeSize &&
        maze[newY][newX] === 0
      ) {
        setPlayerPos({ x: newX, y: newY });
        setMoves((prev) => prev + 1);

        // Check if reached destination
        if (newX === mazeSize - 2 && newY === mazeSize - 2) {
          setGameState("success");
          const newBestScore =
            !bestScores[difficulty] || moves + 1 < bestScores[difficulty];
          if (newBestScore) {
            setBestScores((prev) => ({
              ...prev,
              [difficulty]: moves + 1,
            }));
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, maze, gameState, isPaused, difficulty, moves, bestScores]);

  // Add virtual controls for mobile
  const handleMove = (direction) => {
    if (gameState !== "playing" || isPaused) return;

    const mazeSize = DIFFICULTY_LEVELS[difficulty].size;
    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (direction) {
      case "up":
        newY--;
        break;
      case "down":
        newY++;
        break;
      case "left":
        newX--;
        break;
      case "right":
        newX++;
        break;
    }

    if (
      newX >= 0 &&
      newX < mazeSize &&
      newY >= 0 &&
      newY < mazeSize &&
      maze[newY][newX] === 0
    ) {
      setPlayerPos({ x: newX, y: newY });
      setMoves((prev) => prev + 1);

      if (newX === mazeSize - 2 && newY === mazeSize - 2) {
        setGameState("success");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 overflow-x-hidden">
      <button className="">
        <Link
          href="/"
          className="!w-[150px] text-white/80 hover:text-white transition-colors  gap-2 bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/50 flex justify-center items-center"
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
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Home</span>
        </Link>
      </button>

      {/* Home Button and Menu Button */}
      {gameState === "playing" && (
        <div className="flex justify-between w-full px-4">
          <div></div>
          <button
            onClick={() => {
              setIsPaused(true);
              setShowMenu(true);
            }}
            className="text-white/80 hover:text-white transition-colors bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/50"
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
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="absolute top-4 flex justify-between w-full px-4"></div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Cyber Maze</h1>
          <p className="text-purple-200">
            Navigate through the maze before time runs out!
          </p>
        </div>

        {gameState === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Select Difficulty</h2>
              <div className="flex justify-center gap-4">
                {Object.entries(DIFFICULTY_LEVELS).map(([level, { name }]) => (
                  <button
                    key={level}
                    onClick={() => {
                      setDifficulty(level);
                      startGame(level);
                    }}
                    className={`px-6 py-3 rounded-lg text-lg font-semibold
                      ${
                        level === "easy"
                          ? "bg-green-500 hover:bg-green-600"
                          : level === "medium"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : level === "hard"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-purple-500 hover:bg-purple-600"
                      }
                      transition-all transform hover:scale-105`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 relative"
          >
            {/* Game Stats Bar */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xl">Moves: {moves}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  timeLeft <= 10 ? "animate-pulse" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={`text-xl font-bold ${
                    timeLeft <= 10 ? "text-red-400" : "text-white"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-sm border-2 border-purple-400"></div>
                <span className="text-purple-200">Player</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm border-2 border-green-400 animate-pulse"></div>
                <span className="text-green-200">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-900 rounded-sm border-2 border-gray-700"></div>
                <span className="text-gray-300">Wall</span>
              </div>
            </div>

            {/* Maze Container */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 relative z-10 shadow-xl">
              <div className="overflow-y-auto overflow-x-hidden max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
                <div className="flex flex-col items-center">
                  {maze.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <motion.div
                          key={`${x}-${y}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (x + y) * 0.01 }}
                          style={{ width: CELL_SIZE, height: CELL_SIZE }}
                          className={`
                            ${
                              cell === 1
                                ? "bg-gray-900 border border-gray-800"
                                : "bg-gray-700/50"
                            }
                            ${
                              playerPos.x === x && playerPos.y === y
                                ? "bg-purple-500 border-4 border-purple-400 shadow-lg shadow-purple-500/50"
                                : ""
                            }
                            ${
                              showSolution &&
                              solution.some((pos) => pos.x === x && pos.y === y)
                                ? "bg-blue-500/30 border border-blue-400/30"
                                : ""
                            }
                            ${
                              x === maze[0].length - 2 && y === maze.length - 2
                                ? "bg-green-500 animate-pulse border-2 border-green-400 shadow-lg shadow-green-500/50"
                                : ""
                            }
                            ${
                              x === 1 && y === 1
                                ? "ring-2 ring-purple-500/50"
                                : ""
                            }
                          `}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Virtual Controls for Mobile */}
            <div className="md:hidden space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={() => handleMove("up")}
                  className="w-16 h-16 bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gray-700/80 active:scale-95 transition-all shadow-lg"
                >
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-4">
                {["left", "down", "right"].map((direction) => (
                  <button
                    key={direction}
                    onClick={() => handleMove(direction)}
                    className="w-16 h-16 bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gray-700/80 active:scale-95 transition-all shadow-lg"
                  >
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {direction === "left" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      )}
                      {direction === "down" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      )}
                      {direction === "right" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      )}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Legend */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-purple-400 font-semibold mb-2">Controls</p>
              <p className="text-gray-300">Arrow Keys or WASD to move</p>
            </div>

            {/* Solution Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {gameState === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold text-green-400">
              Maze Completed! 🎉
            </h2>
            <p className="text-xl">Moves: {moves}</p>
            {bestScores[difficulty] === moves && (
              <p className="text-yellow-400">New Best Score! 🏆</p>
            )}
            <button
              onClick={() => startGame()}
              className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        )}

        {/* Failure State */}
        {gameState === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-8 rounded-xl space-y-6 max-w-sm w-full mx-4 text-center">
              <h2 className="text-3xl font-bold text-red-400">
                Time&apos;s Up! ⏰
              </h2>
              <div className="space-y-2">
                <p className="text-xl">Moves Made: {moves}</p>

                <p className="text-gray-400">
                  Keep trying, you&apos;re getting better!
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => startGame()}
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showMenu && (
            <GameMenu
              onResume={() => {
                setIsPaused(false);
                setShowMenu(false);
              }}
              onRestart={() => {
                startGame();
                setShowMenu(false);
              }}
              onExit={() => {
                setGameState("menu");
                setShowMenu(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
