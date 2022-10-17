// variables
const $columns = $(".column");
const player1 = "player1";
const player2 = "player2";
let currentPlayer = player1;
let winningFour = [];

// array to store the location of the last placed coin [col,row]
let lastCoinPlaced = [];

const board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];

$(".mouse-coin").addClass("player1");
document.addEventListener("mousemove", (e) => {
    if (currentPlayer == "player1") {
        $(".mouse-coin").removeClass("player1");
        $(".mouse-coin").addClass("player2");
    } else {
        $(".mouse-coin").removeClass("player2");
        $(".mouse-coin").addClass("player1");
    }

    $(".mouse-coin")[0].style.top = `${e.clientY}px`;
    $(".mouse-coin")[0].style.left = `${e.clientX}px`;
});

// function to switch players
function switchPlayer() {
    if (currentPlayer == player2) {
        currentPlayer = player1;
    } else if (currentPlayer == player1) {
        currentPlayer = player2;

        // $("body").css("background-color", "black");
    }
}

//function to check for the empty slot in board and add a coin for the respective player
function addTileToBoard(column) {
    for (let row = board[column].length - 1; row >= 0; row--) {
        if (board[column][row] == 0) {
            board[column][row] = currentPlayer;
            renderTile(column, row);
            checkForWinnerRow();
            checkForWinnerCol();
            checkForWinnerDiagonals();
            switchPlayer();
            //console.log(board);
            break;
        }
    }
}

// event listner to return which column thw user is clicking on, and to call add to board function
$columns.click(function (e) {
    // we need to know which column we clicked
    addTileToBoard($columns.index(this));
    let coinPlace = $(e.target).parent().offset().left;

    $("#animation").css("left", coinPlace + "px");
    if (currentPlayer == "player1") {
        $("#animation").css("background-color", "#f1f1f1");
    } else {
        $("#animation").css("background-color", "#232323");
    }

    $("#animation").addClass("animation-coin");
    setTimeout(() => {
        $("#animation").removeClass("animation-coin");
    }, 2000);
});

// funciton to render the coin
function renderTile(col, row) {
    lastCoinPlaced = [col, row];
    setTimeout(() => {
        if (currentPlayer == player1) {
            $columns.eq(col).children().eq(row).addClass("player1");
        } else if (currentPlayer == player2) {
            $columns.eq(col).children().eq(row).addClass("player2");
        }
    }, 100);
}

//function to check for winners in rows
function checkForWinnerRow() {
    let rowCounter = 0;
    for (let col = 0; col <= board.length - 1; col++) {
        if (board[col][lastCoinPlaced[1]] == currentPlayer) {
            rowCounter++;
            winningFour.push([col, lastCoinPlaced[1]]);
            if (rowCounter === 4) {
                ShowWinningFour();
                setTimeout(() => {
                    announceWinner(currentPlayer);
                }, 1000);
                console.log(currentPlayer + " is WINNER!");
            }
        } else {
            rowCounter = 0;
            winningFour = [];
        }
    }
}

//function to check for winners in col
function checkForWinnerCol() {
    let colCounter = 0;
    for (let row = lastCoinPlaced[1]; row <= lastCoinPlaced[1] + 3; row++) {
        if (board[lastCoinPlaced[0]][row] == currentPlayer) {
            colCounter++;
            winningFour.push([lastCoinPlaced[0], row]);
            if (colCounter === 4) {
                ShowWinningFour();
                setTimeout(() => {
                    announceWinner(currentPlayer);
                }, 1000);

                console.log(currentPlayer + " is WINNER!");
            }
        } else {
            colCounter = 0;
            winningFour = [];
        }
    }
}

//function to check for winners in diagonals ----------------------->

// diagonal stepping to left side
// Test
// board[c4][r1];
// board[c3][r2];
// board[c2][r3];
// board[c1][r4];

function checkForWinnerDiagonals() {
    let diagonalLeftCounter = 0;
    let diagonalRightCounter = 0;
    let r1 = lastCoinPlaced[1];
    let r2 = lastCoinPlaced[1];

    // check for diagonals stepping to left side
    for (let i = lastCoinPlaced[0]; i >= 0; i--) {
        if (board[i][r1] == currentPlayer) {
            diagonalLeftCounter++;
            winningFour.push([i, r1]);
            if (diagonalLeftCounter === 4) {
                ShowWinningFour();
                setTimeout(() => {
                    announceWinner(currentPlayer);
                }, 1000);
                console.log(currentPlayer + " is WINNER! diagonal left");
            }
        } else {
            diagonalLeftCounter = 0;
            winningFour = [];
        }
        r1++;
    }
    // diagonal stepping to left side
    // Test
    // board[c3][r0];
    // board[c4][r1];
    // board[c5][r2];
    // board[c6][r3];

    // check for diagonals stepping to right side
    for (let i = lastCoinPlaced[0]; i <= 6; i++) {
        //console.log(i + "+" + r2);
        if (board[i][r2] == currentPlayer) {
            diagonalRightCounter++;
            winningFour.push([i, r2]);
            if (diagonalRightCounter === 4) {
                ShowWinningFour();
                setTimeout(() => {
                    announceWinner(currentPlayer);
                }, 1000);
                console.log(currentPlayer + " is WINNER! diagonal right");
            }
        } else {
            diagonalRightCounter = 0;
            winningFour = [];
        }
        r2++;
    }
}

// Announce Winner and reset game
function announceWinner(winnerPlayer) {
    $(".winner-container").css("display", "flex");
    if (winnerPlayer == "player1") {
        $(".winner-container").children().css("color", "white");
    } else {
        $(".winner-container").children().css("color", "black");
    }
}
// reset game click event
$(".restart").click(() => {
    $(".winner-container").css("display", "none");
    location.reload();
});

// function to highlight the winning four
function ShowWinningFour() {
    console.log(winningFour);

    winningFour.forEach((element) => {
        $columns
            .eq(element[0])
            .children()
            .eq(element[1])
            .addClass("winning-four");
    });
}

function points(games) {
    // your code here
    let score = 0;

    for (let i = 0; i < games.length; i++) {
        if (games[i][0] > games[i][2]) {
            score += 3;
        } else if (games[i][0] == games[i][2]) {
            score++;
        }
    }

    return score;
}

console.log(
    points([
        "1:0",
        "2:0",
        "3:0",
        "4:0",
        "2:1",
        "3:1",
        "4:1",
        "3:2",
        "4:2",
        "4:3",
    ])
);
