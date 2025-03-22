"use client";

import { useState } from "react";

export default function GameInstructions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center"
        title="How to Play"
      >
        <img src="/question.svg" alt="Help" className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-black p-6 rounded-lg max-w-md border border-gray-800 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>

            <h3 className="font-bold mb-3 text-xl">
              Lexicon Rush - Game Rules
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click letters to form words (minimum 2 letters)</li>
              <li>Submit valid words to clear those letters from the board</li>
              <li>New letters will flood the board over time</li>
              <li>Game ends when the board fills up completely</li>
              <li>Longer words score more points!</li>
            </ul>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                Scoring: 2-letter word = 1 point, 3-letter word = 2 points,
                4-letter word = 4 points, etc.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
