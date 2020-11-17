
window.setInterval(function () {
    myGame.AIturn();
}, 1000);
//

class Game {
    constructor() {
        this.turn = 2;     // 1: palyer1, 2: palyer2
        this.AI = false; //by default two players
        this.selectedChecker = -1;  // for the id of the selected checker
        this.selectedCheckerLocation = [-1, -1];
        this.selectedTile = -1;
        this.selectedTileLocation = [-1, -1];
        this.winner = 0;
        this.playerMove;
        this.isDoubleMode = false;
    }

    moveCheckerP1(locC, locT) {
        if (!this.AI) {
            console.log(this.turn);
            //currBoard.board[locC[0]][locC[1]] = 0;
            //currBoard.board[locT[0]][locT[1]] = 1;
            let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
            let tem = findMovePlayer(locC, locT, temMvs);
            makeMoveAI(currBoard.board, currBoard.kingsList, tem, this.turn);
            this.next(tem);

            if (noMoreMoves(currBoard.board, currBoard.kingsList, 2)) {
                this.winner = 1;
                document.getElementById("winner").innerHTML = "Player 1 won!";
                return;
            }

        }

    };

    moveCheckerP2(locC, locT) {

        console.log(this.turn);
        //currBoard.board[locC[0]][locC[1]] = 0;
        //currBoard.board[locT[0]][locT[1]] = 2;

        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
        let tem = findMovePlayer(locC, locT, temMvs);
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, this.turn);
        this.next(tem);

        //still deciding the best implementation
        //trying to merge the codes 
        if (noMoreMoves(currBoard.board, currBoard.kingsList, 1)) {
            this.winner = 2;
            document.getElementById("winner").innerHTML = "Player 2 won!";
            clearInterval();
            return;
        }

    };

    validDiagonalP1(locC, locT) { // red - moves down
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
        return isValidMove(locC, locT, temMvs);

        //return (((locC[0] + 1 == locT[0]) && (locC[1] - 1 == locT[1]))
        //   || ((locC[0] + 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };

    validDiagonalP2(locC, locT) {   // blue - moves up
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
        return isValidMove(locC, locT, temMvs);
        //return (((locC[0] - 1 == locT[0]) && (locC[1] - 1 == locT[1]))
        //   || ((locC[0] - 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };


    //added this cause i noticed some lag when moveAI is put in checker turn , night change it later
    AIturn() {
        if (this.AI && (this.turn == 1)) {
            this.moveAI();
        }

    }
    moveAI() {

        console.log("turn" + this.turn);
        let tem = AInextMove();
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, 1);
        console.log(currBoard.kingsList);
        this.next(tem);

        console.log(noMoreMoves(currBoard.board, currBoard.kingsList, 2));
        if (noMoreMoves(currBoard.board, currBoard.kingsList, 2)) {
            console.log("game ended");
            this.winner = 1;
            document.getElementById("winner").innerHTML = "Player 1 won!";
            clearInterval();
            return;
        }
    }
    next(lastMove) {
        if (this.isDoubleJump() && lastMove.jump) {
            this.turn = (this.turn == 1) ? 1 : 2;
            // selected checker must remains the same.
            console.log("checker new loc: " + this.selectedCheckerLocation);
            console.log("tile old loc: " + this.selectedTileLocation);
            this.selectedCheckerLocation = this.selectedTileLocation;
            this.isDoubleMode = true;
        } else {
            this.turn = (this.turn == 1) ? 2 : 1;
            this.selectedCheckerLocation = [-1, -1];
            this.isDoubleMode = false;
        }
        this.selectedChecker = -1;  // appearantly the id changes with each render...
        this.selectedTileLocation = [-1, -1];
        this.selectedTile = -1;
        currBoard.reDrawBoard();
        console.log("next turn " + this.turn);
    }

    onePlayer() {
        this.AI = true;
        this.turn = 2;
        document.getElementById("two").disabled = true;
    }
    twoPlayers() {
        this.AI = false;
        this.turn = 2;
        document.getElementById("one").disabled = true;
    }

    saveChecker(id, loc) {
        this.selectedChecker = id;
        this.selectedCheckerLocation = loc;
    }

    saveTile(id, loc) {
        this.selectedTile = id;
        this.selectedTileLocation = loc;
    }

    isDoubleJump() {
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, this.turn);
        if (temMvs.length != 0) {
            if ((temMvs[0].jump)) {   // if the first one is jump, then all the list is possible jumps for the player
                for (let i = 0; i < temMvs.length; i++) {   // just check if the jumps are double or not ...

                    console.log("temMvs[i].pastlocation : " + temMvs[i].pastlocation);
                    console.log("this.selectedTileLocation : " + this.selectedTileLocation);

                    if ((temMvs[i].pastlocation[0] == this.selectedTileLocation[0]) && (temMvs[i].pastlocation[1] == this.selectedTileLocation[1])) {
                        console.log("it's double, yeah!");
                        return true;
                    }
                }
            }
        }
        return false;
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

