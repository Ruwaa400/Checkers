class Checker {
    constructor(board, ele, location, ID) {
        this.board = board;
        this.element = ele;
        this.location = location;   // array[row, col]
        this.king = false;
        this.ID = ID;
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
};