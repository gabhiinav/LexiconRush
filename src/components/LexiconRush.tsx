"use client";

import { useState, useEffect, useCallback } from "react";
import { wordsByLength } from "../dictionary";

interface Tile {
  id: string;
  letter: string;
  selected: boolean;
  position: { row: number; col: number };
}

const BOARD_SIZE = 6;
const LETTER_SPAWN_INTERVAL = 2000; // 2 seconds

interface LexiconRushProps {
  onScoreChange?: (score: number) => void;
}

export default function LexiconRush({ onScoreChange }: LexiconRushProps = {}) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());

  // Load dictionary from dictionary.ts file
  useEffect(() => {
    // Create a Set from all words in the wordsByLength object
    const allWords = new Set<string>();

    // Iterate through each word length category and add words to the Set
    Object.values(wordsByLength).forEach((wordsArray) => {
      wordsArray.forEach((word) => {
        allWords.add(word.toLowerCase());
      });
    });

    setDictionary(allWords);
  }, []);

  // Generate a random letter with higher probability for vowels
  const getRandomLetter = () => {
    // Increased vowel probability by adding more vowels to the distribution
    // A, E, I, O, U appear multiple times to increase their probability
    const letters = "AAAEEEIIIOOOUUBCDFGHJKLMNPQRSTVWXYZ";
    return letters.charAt(Math.floor(Math.random() * letters.length));
  };

  // Generate a random empty position on the board
  const getRandomEmptyPosition = useCallback((currentTiles: Tile[]) => {
    // Get all occupied positions
    const occupiedPositions = new Set(
      currentTiles.map((tile) => `${tile.position.row},${tile.position.col}`)
    );

    // Find all empty positions
    const emptyPositions = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const posKey = `${row},${col}`;
        if (!occupiedPositions.has(posKey)) {
          emptyPositions.push({ row, col });
        }
      }
    }

    // Return a random empty position or null if board is full
    if (emptyPositions.length === 0) {
      return null;
    }
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  }, []);

  // Add a new tile to the board
  const addNewTile = useCallback(() => {
    if (gameOver) return;

    setTiles((prevTiles) => {
      const emptyPosition = getRandomEmptyPosition(prevTiles);
      if (!emptyPosition) {
        setGameOver(true);
        return prevTiles;
      }

      const newTile: Tile = {
        id: `tile-${Date.now()}-${Math.random()}`,
        letter: getRandomLetter(),
        selected: false,
        position: emptyPosition,
      };

      return [...prevTiles, newTile];
    });
  }, [gameOver, getRandomEmptyPosition]);

  // Start the game
  useEffect(() => {
    if (gameOver) return;

    // Initialize the game only once
    if (tiles.length === 0) {
      // Add initial tiles - using a different approach to avoid state update issues
      const initialPositions: string[] = [];
      const initialTiles: Tile[] = [];

      // Generate 5 unique random positions
      for (let i = 0; i < 5; i++) {
        let row, col, posKey;
        do {
          row = Math.floor(Math.random() * BOARD_SIZE);
          col = Math.floor(Math.random() * BOARD_SIZE);
          posKey = `${row},${col}`;
        } while (initialPositions.includes(posKey));

        initialPositions.push(posKey);

        initialTiles.push({
          id: `tile-initial-${Date.now()}-${Math.random()}-${i}`,
          letter: getRandomLetter(),
          selected: false,
          position: { row, col },
        });
      }

      // Set all initial tiles at once
      setTiles(initialTiles);
    }

    // Set up interval to add new tiles
    const tileInterval = setInterval(() => {
      addNewTile();
    }, LETTER_SPAWN_INTERVAL);

    // Clean up interval
    return () => {
      clearInterval(tileInterval);
    };
  }, [gameOver, addNewTile, tiles.length]);

  // Handle tile click
  const handleTileClick = (clickedTile: Tile) => {
    if (gameOver) return;

    // Check if the tile is already selected
    if (clickedTile.selected) {
      // If it's the last selected tile, deselect it
      if (selectedTiles[selectedTiles.length - 1].id === clickedTile.id) {
        setSelectedTiles((prevSelected) => prevSelected.slice(0, -1));
        setTiles((prevTiles) =>
          prevTiles.map((tile) =>
            tile.id === clickedTile.id ? { ...tile, selected: false } : tile
          )
        );
      }
      return;
    }

    // Select the tile
    setSelectedTiles((prevSelected) => [...prevSelected, clickedTile]);
    setTiles((prevTiles) =>
      prevTiles.map((tile) =>
        tile.id === clickedTile.id ? { ...tile, selected: true } : tile
      )
    );
  };

  // Submit the current word
  const submitWord = () => {
    if (selectedTiles.length < 2) {
      setMessage("Words must be at least 2 letters long");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const word = selectedTiles
      .map((tile) => tile.letter)
      .join("")
      .toLowerCase();

    if (dictionary.has(word)) {
      // Valid word - remove tiles and add score
      const wordScore = Math.pow(2, selectedTiles.length - 1); // Exponential scoring for longer words
      setScore((prevScore) => {
        return prevScore + wordScore;
      });

      // Update the score in the parent component outside of the setState function
      const newScore = score + wordScore;
      if (onScoreChange) {
        // Use setTimeout to ensure this happens after the current render cycle
        setTimeout(() => onScoreChange(newScore), 0);
      }

      // Remove the selected tiles
      const selectedIds = new Set(selectedTiles.map((tile) => tile.id));
      setTiles((prevTiles) =>
        prevTiles.filter((tile) => !selectedIds.has(tile.id))
      );

      setMessage(`+${wordScore} points!`);
      setTimeout(() => setMessage(""), 2000);
    } else {
      // Invalid word - deselect tiles
      setMessage("Not a valid word");
      setTimeout(() => setMessage(""), 2000);
      setTiles((prevTiles) =>
        prevTiles.map((tile) => ({
          ...tile,
          selected: false,
        }))
      );
    }

    // Clear selected tiles
    setSelectedTiles([]);
  };

  // Reset the game
  const resetGame = () => {
    setTiles([]);
    setSelectedTiles([]);
    setScore(0);
    setGameOver(false);
    setMessage("");

    // Notify parent component about score reset if callback exists
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Game board */}
      <div className="grid grid-cols-6 gap-1 mb-4 w-full aspect-square bg-black p-2 rounded-lg border border-gray-800">
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const row = Math.floor(index / BOARD_SIZE);
          const col = index % BOARD_SIZE;
          const tile = tiles.find(
            (t) => t.position.row === row && t.position.col === col
          );

          return (
            <div
              key={index}
              className={`flex items-center justify-center rounded-md ${
                tile ? "bg-gray-900" : "bg-black"
              }`}
            >
              {tile && (
                <button
                  className={`w-full h-full flex items-center justify-center text-xl font-bold rounded-md transition-colors ${
                    tile.selected
                      ? "bg-green-600 text-white"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleTileClick(tile)}
                >
                  {tile.letter}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Current word */}
      <div className="mb-4 h-8">
        <div className="text-xl font-bold">
          {selectedTiles.map((tile) => tile.letter).join("")}
        </div>
      </div>

      {/* Message */}
      <div className="mb-4 h-6 text-center">
        <div
          className={`text-lg ${
            message.includes("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={submitWord}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-lg min-w-[140px]"
          disabled={selectedTiles.length < 2 || gameOver}
        >
          Submit Word
        </button>
        <button
          onClick={() => {
            setSelectedTiles([]);
            setTiles((prevTiles) =>
              prevTiles.map((tile) => ({ ...tile, selected: false }))
            );
          }}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-lg min-w-[140px]"
          disabled={selectedTiles.length === 0 || gameOver}
        >
          Clear
        </button>
        <button
          onClick={resetGame}
          className="p-2 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Restart Game"
        >
          <img src="/restart.svg" alt="Restart" className="w-6 h-6" />
        </button>
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
          <div className="bg-black p-8 rounded-lg text-center border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Your score: {score}</p>
            <button
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
