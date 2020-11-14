class Game {
    constructor() {
        this.turn = 2;     // 1: palyer1, 2: palyer2
        this.selectedChecker = -1;  // for the id of the selected checker
        this.selectedCheckerLocation = [-1, -1];
        this.selectedTile = -1;
    }

    moveCheckerP1(locC, locT) {
        console.log(this.turn);
        currBoard.board[locC[0]][locC[1]] = 0;
        currBoard.board[locT[0]][locT[1]] = 1;
        this.next();
    };

    moveCheckerP2(locC, locT) {
        console.log(this.turn);
        currBoard.board[locC[0]][locC[1]] = 0;
        currBoard.board[locT[0]][locT[1]] = 2;
        this.next();
    };

    validDiagonalP1(locC, locT) { // red - moves down
        return (((locC[0] + 1 == locT[0]) && (locC[1] - 1 == locT[1]))
            || ((locC[0] + 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };

    validDiagonalP2(locC, locT) {   // blue - moves up
        return (((locC[0] - 1 == locT[0]) && (locC[1] - 1 == locT[1]))
            || ((locC[0] - 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };

    next() {
        this.turn = (this.turn == 1) ? 2 : 1;
        this.selectedChecker = -1;
        this.selectedCheckerLocation[-1, -1];
        this.selectedTile = -1;
        currBoard.reDrawBoard();
    }
}

// function whatever() {
//     console.log("hi");
//     currBoard.board=[
//             [0, 1, 0, 1, 0, 1, 0, 1],
//             [0, 0, 1, 0, 1, 0, 1, 0],
//             [0, 1, 0, 1, 0, 1, 0, 1],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [2, 0, 2, 0, 2, 0, 2, 0],
//             [0, 2, 0, 2, 0, 2, 0, 2],
//             [2, 0, 2, 0, 2, 0, 2, 0]];

//     currBoard.reDrawBoard();
// };

