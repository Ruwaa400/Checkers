class Tile {
    constructor(board, obj, location) {
        this.board = board;
        this.obj = obj;
        this.location = location;

        //can only play on black tiles
        if ((this.location[0] + this.location[1]) % 2) {
            this.available = true;
        }
        else {
            this.available = false;
        }

        // adding the onclick handler ... for the tile
        this.obj.addEventListener('click', () => {

            // if tile is empty
            if (this.board[this.location[0]][this.location[1]] == 0) {
                
                let id = this.obj.getAttribute('id');
                console.log("you clicked the tile with id: " + id);

                if ((myGame.turn == 1) && (myGame.selectedChecker != -1) && this.available
                    && myGame.validDiagonalP1(myGame.selectedCheckerLocation, this.location)) { // red

                    // save the selected tile
                    myGame.saveTile(id, this.location);
                    myGame.moveCheckerP1(myGame.selectedCheckerLocation, this.location);

                } else if ((myGame.turn == 2) && (myGame.selectedChecker != -1) && this.available
                    && myGame.validDiagonalP2(myGame.selectedCheckerLocation, this.location)) {  // blue

                    // save the selected tile
                    myGame.saveTile(id, this.location);
                    myGame.moveCheckerP2(myGame.selectedCheckerLocation, this.location);

                } else {
                    // mybe tell the user that this is invalid.
                    console.log("not a valid tile :(");
                }

            }
        });
    };

};