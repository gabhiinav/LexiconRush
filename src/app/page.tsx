"use client";

import LexiconRush from "../components/LexiconRush";
import GameInstructions from "../components/GameInstructions";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
        Lexicon Rush
      </h1>
      <p className="text-gray-400 mb-6">
        Find words before the board fills up!
      </p>

      <GameInstructions />

      <LexiconRush />
    </div>
  );
}
