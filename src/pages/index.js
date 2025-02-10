import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-12 bg-gradient-to-br from-gray-900 via-black to-gray-900 
      relative overflow-hidden before:absolute before:w-[800px] before:h-[800px] before:bg-purple-500/20 before:top-0 before:left-0 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:blur-[150px] before:animate-[pulse_4s_ease-in-out_infinite]
      after:absolute after:w-[800px] after:h-[800px] after:bg-blue-500/20 after:bottom-0 after:right-0 after:translate-x-1/2 after:translate-y-1/2 after:rounded-full after:blur-[150px] after:animate-[pulse_4s_ease-in-out_infinite_1s]"
    >
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20 animate-[pulse_5s_ease-in-out_infinite]"></div>
      <div className="absolute inset-0 bg-[url('/hex-grid.svg')] opacity-10 animate-[float_20s_linear_infinite]"></div>
      <div className="absolute inset-0 bg-[url('/particles.svg')] opacity-30 animate-[float_40s_linear_infinite]"></div>

      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_2s_ease-in-out_infinite_1s]"></div>

      <h1 className="text-8xl font-black text-center relative z-10 mb-8 perspective-[1000px] transform-style-3d animate-[float_4s_ease-in-out_infinite]">
        <span
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent 
          block animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]
          [text-shadow:0_0_30px_rgba(139,92,246,0.5)]"
        >
          CHOOSE YOUR
        </span>
        <span
          className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent 
          block mt-2 animate-[pulse_2s_ease-in-out_infinite_0.5s] drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]
          [text-shadow:0_0_30px_rgba(59,130,246,0.5)]"
        >
          CHALLENGE
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 relative z-10 perspective-[1000px]">
        <Link href="/games/tic-tac-toe">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.8)] 
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-blue-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-blue-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              🎮
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Tic Tac Toe
            </span>
          </button>
        </Link>

        <Link href="/games/word-battle">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-green-600/90 to-teal-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-green-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-green-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              📚
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Word Battle
            </span>
          </button>
        </Link>

        <Link href="/games/memory">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-yellow-600/90 to-orange-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)]
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-yellow-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-yellow-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              🧠
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Memory Game
            </span>
          </button>
        </Link>

        <Link href="/games/snake">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-emerald-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-emerald-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              🐍
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Snake Game
            </span>
          </button>
        </Link>

        <Link href="/games/word-scramble">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)]
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-purple-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-purple-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              🔤
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Word Scramble
            </span>
          </button>
        </Link>
        <Link href="/games/maze">
          <button
            className="group w-full px-8 py-8 text-xl font-bold bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white rounded-2xl 
            shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)]
            hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out
            border-2 border-cyan-400/30 backdrop-blur-md relative
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
            before:skew-x-12 before:transform-gpu
            after:absolute after:inset-0 after:border-2 after:border-cyan-400/30 after:rounded-2xl after:transition-all
            after:content-[''] after:scale-105 after:opacity-0 hover:after:scale-100 hover:after:opacity-100
            overflow-hidden transform-gpu"
          >
            <div className="absolute inset-0 bg-[url('/cyber-frame.svg')] opacity-50 transition-opacity group-hover:opacity-100"></div>
            <span className="block text-4xl mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform relative z-10">
              🌀
            </span>
            <span className="relative inline-block animate-[textglow_2s_ease-in-out_infinite] z-10">
              Cyber Maze
            </span>
          </button>
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-500/50 rounded-tl-3xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-blue-500/50 rounded-tr-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-blue-500/50 rounded-bl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-blue-500/50 rounded-br-3xl"></div>
    </div>
  );
}
