
window.setInterval(function(){
    myGame.AIturn();
  }, 1000);
//
 
class Game {
    constructor() {
        this.turn = 0;     // 1: palyer1, 2: palyer2
        this.AI = false; //by default two players
        this.selectedChecker = -1;  // for the id of the selected checker
        this.selectedCheckerLocation = [-1, -1];
        this.selectedTile = -1;
        this.winner = 0;
        this.playerMove;
        this.thinking = false;
    }

    moveCheckerP1(locC, locT) {
        if(!this.AI){
            console.log(this.turn);
            //currBoard.board[locC[0]][locC[1]] = 0;
            //currBoard.board[locT[0]][locT[1]] = 1;
            let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 1);
            let tem = findMovePlayer(locC, locT, temMvs);
            makeMoveAI(currBoard.board, currBoard.kingsList, tem, 1);
            this.next();

            if(noMoreMoves(currBoard.board, currBoard.kingsList, 2)){
                this.winner = 1;
                this.turn = 0;
                document.getElementById("winner").innerHTML = "Player 1 won!";
                return;
            }

        }
        
    };

    moveCheckerP2(locC, locT) {
        
        console.log(this.turn);
        //currBoard.board[locC[0]][locC[1]] = 0;
        //currBoard.board[locT[0]][locT[1]] = 2;

        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 2);
        let tem = findMovePlayer(locC, locT, temMvs);
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, 2);
        this.next();
        
        //still deciding the best implementation
        //trying to merge the codes 
        if(noMoreMoves(currBoard.board, currBoard.kingsList, 1)){
            this.winner = 2;
            this.turn = 0;
            document.getElementById("winner").innerHTML = "Player 2 won!";
            clearInterval();
            return;
        }
        
    };

    validDiagonalP1(locC, locT) { // red - moves down
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 1);
        return isValidMove(locC, locT, temMvs);

        //return (((locC[0] + 1 == locT[0]) && (locC[1] - 1 == locT[1]))
         //   || ((locC[0] + 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };

    validDiagonalP2(locC, locT) {   // blue - moves up
        let temMvs = findMovesAI(currBoard.board, currBoard.kingsList, 2);
        console.log("moooves");
        console.log(temMvs);
        return isValidMove(locC, locT, temMvs);
        //return (((locC[0] - 1 == locT[0]) && (locC[1] - 1 == locT[1]))
         //   || ((locC[0] - 1 == locT[0]) && (locC[1] + 1 == locT[1]))) ? true : false;
    };


    //added this cause i noticed some lag when moveAI is put in checker turn , night change it later
    AIturn(){
        if(this.AI && (this.turn == 1) && !this.thinking){
            this.moveAI();
        }
        
    }
    moveAI(){
        
        console.log("turn" + this.turn);
        this.thinking = true;
        let tem = AInextMove();
        makeMoveAI(currBoard.board, currBoard.kingsList, tem, 1);
        console.log(currBoard.kingsList);
        this.next();

        //console.log(noMoreMoves(currBoard.board, currBoard.kingsList, 2));
        if(noMoreMoves(currBoard.board, currBoard.kingsList, 2)){
            console.log("game ended");
            this.winner = 1;
            this.turn = 0;
            document.getElementById("winner").innerHTML = "Player 1 won!";
            clearInterval();
            return;
        }
    }
    next() {
        this.turn = (this.turn == 1) ? 2 : 1;
        this.selectedChecker = -1;
        this.selectedCheckerLocation[-1, -1];
        this.selectedTile = -1;
        currBoard.reDrawBoard();
        console.log("next turn " + this.turn);
        this.thinking = false;
    }

    onePlayer(){
        this.AI = true;
        this.turn = 2;
        document.getElementById("two").disabled = true;
    }
    twoPlayers(){
        this.AI = false;
        this.turn = 2;
        document.getElementById("one").disabled = true;
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

