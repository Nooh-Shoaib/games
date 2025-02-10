import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DIFFICULTY_LEVELS = {
  easy: { minLength: 4, maxLength: 6, timeLimit: 60 },
  medium: { minLength: 6, maxLength: 8, timeLimit: 45 },
  hard: { minLength: 8, maxLength: 12, timeLimit: 30 },
};

const WORD_LISTS = {
  easy: [
    { word: "LETTER", hint: "Written communication" },
    { word: "GAME", hint: "Play for fun" },
    { word: "BOOK", hint: "Reading material" },
    { word: "PHONE", hint: "Communication device" },
    { word: "WATER", hint: "Essential liquid" },
    { word: "SMILE", hint: "Happy expression" },
    { word: "CHAIR", hint: "Sitting furniture" },
    { word: "TABLE", hint: "Flat surface furniture" },
    { word: "LIGHT", hint: "Illumination source" },
    { word: "MUSIC", hint: "Melodic sounds" },
  ],
  medium: [
    { word: "COMPUTER", hint: "Electronic device" },
    { word: "KEYBOARD", hint: "Input device" },
    { word: "PROGRAM", hint: "Software instructions" },
    { word: "NETWORK", hint: "Connected systems" },
    { word: "BROWSER", hint: "Web explorer" },
    { word: "SCREEN", hint: "Display surface" },
    { word: "WINDOW", hint: "View opening" },
    { word: "PICTURE", hint: "Visual representation" },
    { word: "GARDEN", hint: "Plant growing area" },
    { word: "LIBRARY", hint: "Book collection place" },
  ],
  hard: [
    { word: "ALGORITHM", hint: "Problem-solving steps" },
    { word: "DEVELOPER", hint: "Software creator" },
    { word: "INTERFACE", hint: "Connection point" },
    { word: "DATABASE", hint: "Information storage" },
    { word: "FRAMEWORK", hint: "Development structure" },
    { word: "JAVASCRIPT", hint: "Web programming language" },
    { word: "BUTTERFLY", hint: "Colorful flying insect" },
    { word: "CHEMISTRY", hint: "Study of substances" },
    { word: "TELESCOPE", hint: "Star viewing device" },
    { word: "ADVENTURE", hint: "Exciting journey" },
  ],
};

export default function WordScramble() {
  const router = useRouter();
  const [gameState, setGameState] = useState("menu"); // menu, playing, success, failed
  const [difficulty, setDifficulty] = useState("easy");
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [hint, setHint] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [totalWordsPlayed, setTotalWordsPlayed] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [showFinalStats, setShowFinalStats] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("wordScrambleHighScore");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const scrambleWord = (word) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const scrambled = arr.join("");
    return scrambled === word ? scrambleWord(word) : scrambled;
  };

  const getRandomWord = useCallback(() => {
    const availableWords = WORD_LISTS[difficulty].filter(
      ({ word }) => !usedWords.has(word)
    );

    if (availableWords.length === 0) {
      setShowFinalStats(true);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  }, [difficulty, usedWords]);

  const startGame = useCallback(() => {
    setUsedWords(new Set());

    const wordData = getRandomWord();
    if (!wordData) return;

    const { word, hint } = wordData;
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setHint(hint);
    setUserInput("");
    setShowHint(false);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setGameState("playing");
    setUsedWords((prev) => new Set([...prev, word]));
    setTotalWordsPlayed((prev) => prev + 1);
  }, [difficulty, getRandomWord]);

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

  const handleInputChange = (e) => {
    const input = e.target.value.toUpperCase();
    setUserInput(input);

    if (input === currentWord) {
      const timeUsed = DIFFICULTY_LEVELS[difficulty].timeLimit - timeLeft;
      setTotalTimeUsed((prev) => prev + timeUsed);
      setCorrectWords((prev) => prev + 1);
      setAverageTime((prev) => (totalTimeUsed + timeUsed) / (correctWords + 1));

      const newScore =
        score +
        Math.floor(
          timeLeft *
            (difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1)
        );
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("wordScrambleHighScore", newScore.toString());
      }

      setGameState("success");
    }
  };

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (gameState === "playing") {
          setIsPaused((prev) => !prev);
          setShowMenu((prev) => !prev);
        }
      } else if (e.key === "Enter" && gameState === "success") {
        startGame();
      }
    },
    [gameState, startGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const GameMenu = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      style={{ pointerEvents: "auto" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-purple-900 rounded-xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          {isPaused ? "Game Paused" : "Menu"}
        </h2>

        <div className="space-y-4">
          {gameState === "playing" && (
            <button
              onClick={() => {
                setIsPaused(false);
                setShowMenu(false);
              }}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-500 
                       rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2"
            >
              <svg
                className="w-6 h-6"
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
              Continue Game
            </button>
          )}

          <button
            onClick={() => {
              setUsedWords(new Set());
              setScore(0);
              setIsPaused(false);
              setShowMenu(false);
              startGame();
            }}
            className="w-full px-6 py-4 bg-yellow-600 hover:bg-yellow-500 
                     rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Restart Game
          </button>

          <button
            onClick={() => {
              setGameState("menu");
              setUsedWords(new Set());
              setScore(0);
              setIsPaused(false);
              setShowMenu(false);
            }}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 
                     rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Game
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-4 bg-red-600 hover:bg-red-500 
                     rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Quit to Menu
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-purple-300">
          Press ESC to {isPaused ? "resume" : "pause"} game
        </div>
      </motion.div>
    </motion.div>
  );

  const FinalStats = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
    >
      <div className="bg-purple-900 rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Game Complete!</h2>

        <div className="space-y-4">
          <div className="bg-purple-800/50 rounded-lg p-4">
            <div className="text-4xl font-bold text-center text-purple-200 mb-2">
              {score}
            </div>
            <div className="text-center text-purple-300">Final Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-center mb-1">
                {correctWords}
              </div>
              <div className="text-sm text-center text-purple-300">
                Words Correct
              </div>
            </div>

            <div className="bg-purple-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-center mb-1">
                {Math.round(averageTime)}s
              </div>
              <div className="text-sm text-center text-purple-300">
                Avg. Time per Word
              </div>
            </div>

            <div className="bg-purple-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-center mb-1">
                {totalWordsPlayed}
              </div>
              <div className="text-sm text-center text-purple-300">
                Total Words
              </div>
            </div>

            <div className="bg-purple-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-center mb-1">
                {Math.round((correctWords / totalWordsPlayed) * 100)}%
              </div>
              <div className="text-sm text-center text-purple-300">
                Accuracy
              </div>
            </div>
          </div>

          {score > highScore && (
            <div className="text-yellow-400 text-center font-bold mt-4">
              New High Score!
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                setShowFinalStats(false);
                setGameState("menu");
                setUsedWords(new Set());
                setTotalWordsPlayed(0);
                setCorrectWords(0);
                setTotalTimeUsed(0);
                setScore(0);
              }}
              className="flex-1 px-6 py-3 bg-purple-700 hover:bg-purple-600 
                       rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-6 py-3 bg-purple-700/50 hover:bg-purple-600/50 
                       rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-8">
      <div className="fixed top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg 
                   hover:bg-white/20 transition-all flex items-center gap-2"
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
          Back
        </button>
      </div>

      {gameState === "playing" && (
        <div className="fixed top-4 right-4 flex items-center gap-4">
          <div className="text-sm text-purple-200">Press ESC to pause</div>
          <button
            onClick={() => {
              setIsPaused(true);
              setShowMenu(true);
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Game Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Word Scramble</h1>
          <p className="text-purple-200">
            Unscramble the word before time runs out!
          </p>
        </div>

        {gameState === "menu" && (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Select Difficulty</h2>
              <div className="flex justify-center gap-4">
                {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setDifficulty(level);
                      startGame();
                    }}
                    className={`px-6 py-3 rounded-lg text-lg font-semibold
                      ${
                        level === "easy"
                          ? "bg-green-500 hover:bg-green-600"
                          : level === "medium"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-red-500 hover:bg-red-600"
                      }
                      transition-all transform hover:scale-105`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {highScore > 0 && (
              <p className="text-purple-200">High Score: {highScore}</p>
            )}
          </div>
        )}

        {(gameState === "playing" ||
          gameState === "success" ||
          gameState === "failed") && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-xl">Score: {score}</div>
              <div
                className={`text-xl font-bold ${
                  timeLeft <= 10 ? "text-red-500" : "text-white"
                }`}
              >
                Time: {timeLeft}s
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
              <div className="flex justify-center gap-2">
                {scrambledWord.split("").map((letter, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center
                             text-2xl font-bold"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                disabled={gameState !== "playing" || isPaused}
                className="w-full bg-white/20 rounded-lg px-4 py-3 text-center text-2xl
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type your answer..."
                autoFocus
              />

              <div className="text-center">
                {!showHint && gameState === "playing" && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    Show Hint
                  </button>
                )}
                {showHint && <p className="text-purple-300">Hint: {hint}</p>}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {gameState === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <p className="text-green-400 text-2xl font-bold mb-4">
                    Correct!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Next Word
                  </button>
                </motion.div>
              )}

              {gameState === "failed" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <p className="text-red-400 text-2xl font-bold mb-2">
                    Time&apos;s Up!
                  </p>
                  <p className="text-purple-200 mb-4">
                    The word was: {currentWord}
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showMenu && <GameMenu />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showFinalStats && <FinalStats />}
        </AnimatePresence>
      </div>
    </div>
  );
}
