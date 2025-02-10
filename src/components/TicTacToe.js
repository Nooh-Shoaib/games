import { useState } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";

export default function TicTacToe() {
  const router = useRouter();
  const [gameMode, setGameMode] = useState(null); // null, 'computer', 'friend'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      position: null,
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const result = calculateWinner(squares);

    if (result) {
      return result.winner === "O" ? 10 - depth : depth - 10;
    }

    if (!squares.includes(null)) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = "O";
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = "X";
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "O";
        const score = minimax(squares, 0, false);
        squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const handleClick = async (index) => {
    if (board[index] || calculateWinner(board) || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";

    const newHistory = history.slice(0, stepNumber + 1);
    setHistory([
      ...newHistory,
      {
        squares: newBoard,
        position: index,
      },
    ]);
    setStepNumber(newHistory.length);
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      celebrateWin();
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
    }

    if (gameMode === "computer" && isXNext && !result) {
      setIsThinking(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const computerMove = findBestMove(newBoard);
      newBoard[computerMove] = "O";

      setHistory([
        ...newHistory,
        {
          squares: newBoard,
          position: computerMove,
        },
      ]);
      setStepNumber(newHistory.length + 1);
      setBoard(newBoard);

      const computerResult = calculateWinner(newBoard);
      if (computerResult) {
        celebrateWin();
        setScores((prev) => ({
          ...prev,
          [computerResult.winner]: prev[computerResult.winner] + 1,
        }));
      }
      setIsThinking(false);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const playSound = (type) => {
    const audio = new Audio(
      type === "move"
        ? "/pop.mp3"
        : type === "win"
        ? "/victory.mp3"
        : "/draw.mp3"
    );
    audio.play().catch(() => {});
  };

  const celebrateWin = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsThinking(false);
    setWinningLine(null);
    setGameHistory([]);
    setHistory([
      {
        squares: Array(9).fill(null),
        position: null,
      },
    ]);
    setStepNumber(0);
  };

  const startNewGame = (mode) => {
    setGameMode(mode);
    resetGame();
    setScores({ X: 0, O: 0 });
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setBoard(history[step].squares);
    setIsXNext(step % 2 === 0);
  };

  const getPositionDescription = (position) => {
    if (position === null) return "";
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;
    return ` (${row},${col})`;
  };

  const result = calculateWinner(board);
  const winner = result?.winner;
  const isDraw = !winner && !board.includes(null);

  const getStatus = () => {
    if (winner)
      return `Winner: ${winner}${
        gameMode === "computer" && winner === "O" ? " (Computer)" : ""
      }`;
    if (isDraw) return "It's a draw!";
    if (isThinking) return "Computer is thinking...";
    return `Next player: ${isXNext ? "X" : "O"}${
      gameMode === "computer" && !isXNext ? " (Computer)" : ""
    }`;
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => startNewGame("friend")}
            className="px-8 py-4 text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
          >
            Play with Friend
          </button>
          <button
            onClick={() => startNewGame("computer")}
            className="px-8 py-4 text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
          >
            Play with Computer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Add Back to Games button */}
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

      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>

        <div className="flex gap-8 text-xl">
          <div className="flex flex-col items-center">
            <span className="text-blue-600 font-bold">
              X {gameMode === "computer" ? "(You)" : ""}
            </span>
            <span className="text-2xl">{scores.X}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-600 font-bold">
              O {gameMode === "computer" ? "(Computer)" : ""}
            </span>
            <span className="text-2xl">{scores.O}</span>
          </div>
        </div>

        <div
          className={`text-2xl font-semibold mb-4 ${
            isThinking ? "animate-pulse" : ""
          }`}
        >
          {getStatus()}
        </div>

        <div className="grid grid-cols-3  gap-4 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={
                square ||
                winner ||
                isThinking ||
                (gameMode === "computer" && !isXNext)
              }
              className={`
                w-24 h-24 text-5xl font-bold
                rounded-lg
                transition-all duration-300
                transform hover:scale-105
                ${!square && !winner && !isThinking ? "hover:bg-gray-100" : ""}
                ${
                  result?.line?.includes(index)
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-100 glowing"
                    : "bg-gray-50"
                }
                ${square === "X" ? "text-blue-600" : "text-red-600"}
                shadow-lg hover:shadow-xl
                active:scale-95
                glass-effect
              `}
            >
              {square && (
                <span className="animate-pop-in floating">{square}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
          >
            New Game
          </button>
          <button
            onClick={() => setGameMode(null)}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            Change Mode
          </button>
          <button
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            {isHistoryVisible ? "Hide History" : "Show History"}
          </button>
        </div>
      </div>

      {/* Game History Panel */}
      {isHistoryVisible && (
        <div className="md:w-80 bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-xl border border-gray-200 self-stretch">
          <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Game History
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              Move {stepNumber}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((step, move) => (
              <button
                key={move}
                onClick={() => jumpTo(move)}
                className={`
                  w-full px-4 py-3 text-left rounded-lg
                  font-medium 
                  flex items-center justify-between
                  transition-all duration-200
                  group
                  ${
                    stepNumber === move
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-102"
                      : "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md border border-gray-200"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`
                    w-8 h-8 flex items-center justify-center rounded-full
                    ${
                      stepNumber === move
                        ? "bg-white bg-opacity-20"
                        : "bg-gray-100"
                    }
                  `}
                  >
                    {move === 0 ? "🔄" : move % 2 === 0 ? "⭕" : "❌"}
                  </span>
                  <span>{move === 0 ? "Game Start" : `Move #${move}`}</span>
                </div>
                {step.position !== null && (
                  <span
                    className={`
                    text-sm px-2 py-1 rounded-md
                    ${
                      stepNumber === move
                        ? "bg-white bg-opacity-20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }
                  `}
                  >
                    {getPositionDescription(step.position)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {history.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => jumpTo(0)}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                         bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors
                         flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Reset to Start
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
