import React, { useEffect, useRef, useState } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';
import congratsGif from '../Assets/congrats.gif';

// Initialize the game state
let data = ["", "", "", "", "", "", "", "", ""];

const TicTacToe = () => {
  const [count, setCount] = useState(0); // Turn counter
  const [lock, setLock] = useState(false); // Lock the game state
  const [shownPopups, setShownPopups] = useState({ player1: false, player2: false }); // Popup tracking
  const [winner, setWinner] = useState(null); // Track the winner
  const titleRef = useRef(null); // Title reference
  const boxRefs = Array.from({ length: 9 }, () => React.createRef()); // Box references

  // Show Player 1's turn message on page load after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!shownPopups.player1) {
        alert("Player 1's turn!");
        setShownPopups({ ...shownPopups, player1: true });
      }
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [shownPopups]);

  // Toggle box on click
  const toggle = (e, num) => {
    if (lock || data[num]) return; // Prevent clicks on locked boxes or already filled boxes

    if (count % 2 === 0) {
      // Player 1's turn
      if (!shownPopups.player1) {
        alert("Player 1's turn!");
        setShownPopups({ ...shownPopups, player1: true });
      }
      e.target.innerHTML = `<img src='${cross_icon}' alt='X'>`;
      data[num] = 'x';
    } else {
      // Player 2's turn
      if (!shownPopups.player2) {
        alert("Player 2's turn!");
        setShownPopups({ ...shownPopups, player2: true });
      }
      e.target.innerHTML = `<img src='${circle_icon}' alt='O'>`;
      data[num] = 'o';
    }
    setCount(count + 1);
    checkWin();
  };

  // Check for win or tie
  const checkWin = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (data[a] && data[a] === data[b] && data[b] === data[c]) {
        won(data[a]);
        return;
      }
    }

    if (!data.includes("") && !lock) {
      tie();
    }
  };

  // Handle win
  const won = (winner) => {
    setLock(true);
    setWinner(winner);
    titleRef.current.innerHTML = `Congratulations: <img src="${winner === 'x' ? cross_icon : circle_icon}" alt="${winner.toUpperCase()}"> Wins`;
  };

  // Handle tie
  const tie = () => {
    setLock(true);
    titleRef.current.innerHTML = "It's a Tie!";
  };

  // Reset game state
  const reset = () => {
    setLock(false);
    setWinner(null); // Clear winner
    data = ["", "", "", "", "", "", "", "", ""]; // Reset data
    setCount(0);
    setShownPopups({ player1: false, player2: false }); // Reset pop-ups
    titleRef.current.innerHTML = 'Tic Tac Toe Game In <span>React</span>'; // Reset title
    boxRefs.forEach((ref) => {
      ref.current.innerHTML = ""; // Clear boxes
    });
  };

  return (
    <div className="container">
      {/* Display winner GIF */}
      {winner && (
        <div className="congrats">
          <img src={congratsGif} alt="Congratulations!" className="congrats-gif" />
        </div>
      )}
      <h1 className="title" ref={titleRef}>
        Tic Tac Toe Game In <span>React</span>
      </h1>
      <div className="board">
        {/* Render the 3x3 grid */}
        {[0, 1, 2].map((row) => (
          <div className={`row row${row + 1}`} key={row}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <div
                  className="boxes"
                  ref={boxRefs[index]}
                  key={index}
                  onClick={(e) => toggle(e, index)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <button className="reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;
