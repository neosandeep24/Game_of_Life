import React, { useState, useCallback, useRef, useEffect } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 30;

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const countNeighbors = (grid, row, col) => {
  const neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return neighbors.reduce((count, [r, c]) => {
    const newRow = row + r;
    const newCol = col + c;
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      count += grid[newRow][newCol];
    }
    return count;
  }, 0);
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((grid) => {
      return produce(grid, (newGrid) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(grid, i, j);
            if (grid[i][j] === 1) {
              newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
              newGrid[i][j] = neighbors === 3 ? 1 : 0;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleCellClick = (row, col) => {
    const newGrid = produce(grid, (newGrid) => {
      newGrid[row][col] = grid[row][col] ? 0 : 1;
    });
    setGrid(newGrid);
  };

  return (
    <div className="App">
    <h1>Game of LIFE</h1>
      <div className="controls">
        <button onClick={() => setRunning(!running)} className='button'>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())} className='button'>Clear</button>
        <button onClick={runSimulation} className='button'>Next Generation</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${grid[rowIndex][colIndex] ? 'alive' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
