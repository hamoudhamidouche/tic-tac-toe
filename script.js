function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;
  
    // const dropToken = (column, player) => {
    //   const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
  
    //   if (!availableCells.length) return;
  
    //   const lowestRow = availableCells.length - 1;
    //   board[lowestRow][column].addToken(player);
    // };

    const choosen = (row, column, player) => {
        if (board[row][column].getValue() == ".") {
            board[row][column].addToken(player);
        }
    }
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    return { getBoard, choosen, printBoard };
}

function Cell() {
    let value = ".";
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: "X"
      },
      {
        name: playerTwoName,
        token: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row, column) => {
        const checkWinner = (player) => {
            let cells = board.getBoard();
            let symbol = player.token;
          
            if (
              (cells[0][0].getValue() == symbol && cells[0][1].getValue() == symbol && cells[0][2].getValue() == symbol) ||
              (cells[1][0].getValue() == symbol && cells[1][1].getValue() == symbol && cells[1][2].getValue() == symbol) ||
              (cells[2][0].getValue() == symbol && cells[2][1].getValue() == symbol && cells[2][2].getValue() == symbol) ||
              (cells[0][0].getValue() == symbol && cells[1][0].getValue() == symbol && cells[2][0].getValue() == symbol) ||
              (cells[0][1].getValue() == symbol && cells[1][1].getValue() == symbol && cells[2][1].getValue() == symbol) ||
              (cells[0][2].getValue() == symbol && cells[1][2].getValue() == symbol && cells[2][2].getValue() == symbol) ||
              (cells[0][0].getValue() == symbol && cells[1][1].getValue() == symbol && cells[2][2].getValue() == symbol) ||
              (cells[2][0].getValue() == symbol && cells[1][1].getValue() == symbol && cells[0][2].getValue() == symbol)
            ) {
              alert(`${player.name} Wins`);
              board.getBoard().forEach(row => {
                row.forEach(cell => {
                  cell.addToken("."); // Reset the cell value to 0
                });
              });
            }
          };
        board.choosen(row, column, getActivePlayer().token);
    
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */

        if (board.getBoard().every(row => row.every(cell => cell.getValue() !== "."))) {alert("It's a tie");
            board.getBoard().forEach(row => {
                row.forEach(cell => {
                  cell.addToken("."); // Reset the cell value to 0
                });
              });
            }
        checkWinner(players[0]);
        checkWinner(players[1]);

        switchPlayerTurn();
        printNewRound();
        
        };
    
        printNewRound();
    
        return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
        };
  }

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn..., play your ${activePlayer.token}`;
  
      // Render board squares
      board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
      
          // Set data attributes for row and column
          cellButton.dataset.column = columnIndex;
          cellButton.dataset.row = rowIndex;
      
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        });
      });
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      const selectedRow = e.target.dataset.row;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn) return;
      if (game.getBoard()[selectedRow][selectedColumn].getValue() === ".") { 
        game.playRound(selectedRow, selectedColumn);
      updateScreen();};
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}
  
ScreenController();

