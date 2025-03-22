"use client";

import { useState } from "react";
import LexiconRush from "../components/LexiconRush";
import GameInstructions from "../components/GameInstructions";

export default function Home() {
  const [score, setScore] = useState(0);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Game board on the left */}
        <div className="w-full md:w-auto">
          <LexiconRush onScoreChange={setScore} />
        </div>
        {/* Game info on the right */}
        <div className="w-full md:w-64 flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
            Lexicon Rush
          </h1>
          {/* <p className="text-gray-400 mb-6 text-center md:text-left">
            Find words before the board fills up!
          </p> */}

          <div className="flex items-center justify-between w-full mb-6">
            <div className="text-2xl font-bold">Score: {score}</div>
            <GameInstructions />
          </div>
        </div>
      </div>
    </div>
  );
}
