class Checker {
    constructor(board, ele, location, ID) {
        this.board = board;
        this.element = ele;
        this.location = location;   // array[row, col]
        this.king = false;
        this.ID = ID;
        this.movable = false;
        // who has the checker
        if (currBoard.board[this.location[0]][this.location[1]] == 1) {
            this.player = 1;
        } else {
            this.player = 2;
        }

        // adding the onclick handler ... for the checker
        this.element.addEventListener('click', () => {
            console.log("you clicked the checker with id: " + this.element.getAttribute('id'));

            if ((myGame.turn == 1) && (this.player == 1)) {   // red
                // save the selected checker
                myGame.selectedChecker = this.element.getAttribute('id');
                myGame.selectedCheckerLocation = this.location;

            } else if ((myGame.turn == 2) && (this.player == 2)) {  // blue
                // save the selected checker
                myGame.selectedChecker = this.element.getAttribute('id');
                myGame.selectedCheckerLocation = this.location;
            }

        });
     };

    movable(player){
        let opp = (player == 1? 2 : 1);
        let row = this.location[0];
        let col = this.location[1];
        //can only go down
        if(player == 1 || this.king){
            //down left
            if( row < 7 && col > 0 && (this.board[row+1][col-1] == 0) ){
                return true;
            }
            //down right
            if( row < 7 && col < 7 && (this.board[row+1][col+1] == 0) ){
                return true;
            }
            //if there's jump
            //down left
            if( row < 6 && col > 1 && (this.board[row+1][col-1] == opp) ){
                if(this.board[row+2][col-2] == 0){
                    return true;
                }
            }
            //down right
            if( row < 6 && col < 6 && (this.board[row+1][col+1] == opp) ){
                if(this.board[row+2][col+2] == 0){
                    return true;
                }
            }
        }
        else if( player == 2 || this.king){
            //top left
            if( row > 0 && col > 0 && (this.board[row-1][col-1] == 0) ){
                return true;
            }
            //top right
            if( row > 0 && col > 0 && (this.board[row-1][col+1] == 0) ){
                return true;
            }
            //if there's jump
            //top left
            if( row > 1 && col > 1 && (this.board[row-1][col-1] == opp) ){
                if(this.board[row-2][col-2] == 0){
                    return true;
                }
            }
            //top right
            if( row > 1 && col > 1 && (this.board[row-1][col+1] == opp) ){
                if(this.board[row-2][col+2] == 0){
                    return true;
                }
            }
       
        }
        return false;
    }

};