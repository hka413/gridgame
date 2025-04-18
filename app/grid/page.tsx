"use client";

import { useState, useEffect } from "react";

const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1],   // cardinal directions
  [-1, -1], [-1, 1], [1, -1], [1, 1]  // diagonal directions
];

// Define multiple levels
const levels = [
  [-1, -1, -1, -1, 1, -1, -1, -1, -1], // Level 1
  [1, 1, 1, 1, -1, 1, 1, 1, 1], // Level 2
  [1, 3, 2, -1, 3, -2, 1, 3, 2], // Level 3
];

export default function GridGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState([...levels[currentLevel]]);
  const [showResult, setShowResult] = useState(false); // New state for delaying result screen

  function handleClick(index: number) {
    const newGrid = [...grid];
    const value = newGrid[index];
    if (value === 0) return;

    newGrid[index] = 0;
    const row = Math.floor(index / 3);
    const col = index % 3;

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      const adjIndex = newRow * 3 + newCol;

      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        newGrid[adjIndex] += value;
      }
    });

    setGrid(newGrid);
  }

  function nextLevel() {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setGrid([...levels[currentLevel + 1]]);
    } else {
      resetGame(); // If it's the last level, restart from level 1
    }
  }

  function resetLevel() {
    setGrid([...levels[currentLevel]]);
  }

  function resetGame() {
    setCurrentLevel(0);
    setGrid([...levels[0]]);
  }

  const allZeros = grid.every((cell) => cell === 0);
  const onlyPositives = grid.every((cell) => cell >= 0); // Check if all cells are positive
  const onlyNegatives = grid.every((cell) => cell <= 0); // Check if all cells are negative
  const noMovesLeft = onlyPositives || onlyNegatives; // No moves left if all are positive or all are negative

  useEffect(() => {
    if (allZeros || noMovesLeft) {
      setTimeout(() => setShowResult(true), 1000); // Delay result screen by 1 second
    } else {
      setShowResult(false);
    }
  }, [allZeros, noMovesLeft]);

  if ((allZeros || noMovesLeft) && showResult) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "white",
          fontSize: "24px",
        }}
      >
        <div>
          {allZeros
            ? `Level ${currentLevel + 1} Complete!`
            : "No possible moves!"}
        </div>
        <button
          onClick={allZeros ? nextLevel : resetLevel}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "20px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {allZeros ? "Next Level" : "Restart"}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "white",
      }}
    >
      <h2
        style={{
          alignItems: "center",
          fontFamily: "Calibri, sans-serif",
          fontSize: "32px",
          color: "#177fbf",
          marginBottom: "20px",
          textShadow: "2px 2px 4px #000",
        }}
    >
        Level {currentLevel + 1}
    </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "5px",
        }}
      >
        {grid.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "24px",
              backgroundColor: "black",
              border: "2px solid white",
              color: "white",
            }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
