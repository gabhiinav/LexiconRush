"use client";

import { useState } from "react";

export default function GameInstructions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-400 hover:text-white underline underline-offset-2"
      >
        {isOpen ? "Hide Instructions" : "How to Play"}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-black rounded-lg text-sm border border-gray-800">
          <h3 className="font-bold mb-2 text-base">
            Lexicon Rush - Game Rules
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click letters to form words (minimum 2 letters)</li>
            <li>Submit valid words to clear those letters from the board</li>
            <li>New letters will flood the board over time</li>
            <li>Game ends when the board fills up completely</li>
            <li>Longer words score more points!</li>
          </ul>
          <div className="mt-2 text-xs text-gray-400">
            <p>
              Scoring: 2-letter word = 1 point, 3-letter word = 2 points,
              4-letter word = 4 points, etc.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
