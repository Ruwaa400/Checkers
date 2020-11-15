
class Move{
    constructor(pastlocation, nextlocation, checkerID, jump) {
        this.pastlocation = pastlocation;
        this.nextlocation = nextlocation;
        this.checkerID = checkerID;
        this.jump = jump;
    };
};


class Board {
    
    constructor() {
        this.size = 8;
        this.lastMove;
        this.board = this.Init();
        this.tiles = [];
        this.checkers = [];
        this.kingsList = [];
        //this.redKings = 0;
        //this.blueKings = 0;
        //this.redTiles = 12;
        //this.blueTiles = 12;

    };

    Init() {
        let board = [];
        let even = true;

        for (let i = 0; i < this.size; i++) {
            board[i] = [];

            for (let j = 0; j < this.size; j++) {
                if( i == 1 && even) {
                    board[i][j] = 1; 
                }
                else if( (i == 0 || i == 2) && !even) {
                    board[i][j] = 1;
                }
                else if( i == 6 && !even) {
                    board[i][j] = 2;
                }
                else if( (i == 5 || i == 7) && even) {
                    board[i][j] = 2;
                }
                else {
                    board[i][j] = 0;
                }
                even = !even;
            }
        }

        // board = [
        //     [0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0],
        //     [0, 1, 0, 1, 0, 1, 0, 1],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [2, 0, 2, 0, 2, 0, 2, 0],
        //     [0, 2, 0, 2, 0, 2, 0, 2],
        //     [2, 0, 2, 0, 2, 0, 2, 0]];

        return board;
    };


    inDanger_safe(player){
        //count [inDanger, safe, movable]
        let count = [0,0];
        let opp = (player == 1? 2 : 1);
        for(let row in this.board){
            for(let col in this.board[row]){
                if(this.board[row][col] == player){

                    //edge pieces
                    if(row == 0 || row==7 || col==0 || col == 7){
                        count[0]++;
                    }
                    //only one attack counted
                    //king attacks not counted yet
                    else if(this.board[row+1][col-1] == opp && this.board[row-1][col+1] == 0){
                        count[1]++;
                    }
                    else if(this.board[row+1][col+1] == opp && this.board[row-1][col-1] == 0){
                        count[1]++;
                    }

                }

            }
        }

    }

    
    moveableTiles(player){
        let count = 0;
        for(let piece in this.checkers){
            if(piece.player == player && piece.movable){
                count++;
            }
        }
        return count;
    }

    triaP(player){
        if(this.board[0][1]==player && this.board[0][3]==player && this.board[1][2]==player){
            return 1;
        }
    }

    oreoP(player){
        if(this.board[0][3]==player && this.board[0][5]==player && this.board[1][4]==player){
            return 1;
        }
        
    }

    bridgeP(player){
        if(this.board[0][1]==player && this.board[0][5]==player){
            return 1;
        }
    }

    //needs king to be decided later if needed
    DogP(player){
        
    }

    noMoreMoves(maxiplayer){
        if(this.moveableTiles(maxiplayer+1) != 0){
            return false;
        }
        return true;

    }


    findMoves(player){
        //return array of moves
        let finalMvs = [];
        let mvs = [];
        let mvsCount = 0;
        let opp = (player == 1? 2 : 1);
        for(let piece in this.checkers){
            if(piece.player == player && piece.movable){

                //moving left jump or no jump down
                if( piece.location[1] > 0 && piece.location[0] < 7){
                    if(this.board[ piece.location[0] + 1 ][ piece.location[1] - 1 ] == 0){
                        mvs[mvsCount] = new Move(piece.location, [ piece.location[0] + 1 , piece.location[1] - 1 ], piece.ID, false);
                        mvsCount++;
                    }
                    else if(piece.location[1] > 1 && piece.location[0] < 6){
                        if((this.board[ piece.location[0] + 1 ][ piece.location[1] - 1 ] == opp) && (this.board[ piece.location[0] + 2 ][ piece.location[1] - 2 ] == 0)){
                            mvs[mvsCount] = new Move(piece.location, [ piece.location[0] + 2 , piece.location[1] - 2 ], piece.ID, true);
                            mvsCount++;
                        }
                    }
                }
                
                //moving right down
                if( piece.location[1] < 7 && piece.location[0] < 7){
                    if(this.board[ piece.location[0] + 1 ][ piece.location[1] + 1 ] == 0){
                        mvs[mvsCount] = new Move(piece.location, [ piece.location[0] + 1 , piece.location[1] + 1 ], piece.ID, false);
                        mvsCount++;
                    }
                    else if(piece.location[1] < 6 && piece.location[0] < 6){
                        if((this.board[ piece.location[0] + 1 ][ piece.location[1] + 1 ] == opp) && (this.board[ piece.location[0] + 2 ][ piece.location[1] + 2 ] == 0)){
                            mvs[mvsCount] = new Move(piece.location, [ piece.location[0] + 2 , piece.location[1] + 2 ], piece.ID, true);
                            mvsCount++;
                        }
                    }
                }
                //two additional direction up right and up left
                if(piece.king){
                    //moving up left
                    if( piece.location[1] > 0 && piece.location[0] > 0){
                        if(this.board[ piece.location[0] - 1 ][ piece.location[1] - 1 ] == 0){
                            mvs[mvsCount] = new Move(piece.location, [ piece.location[0] - 1 , piece.location[1] - 1 ], piece.ID, false);
                            mvsCount++;
                        }
                        else if(piece.location[1] > 1 && piece.location[0] > 1){
                            if((this.board[ piece.location[0] - 1 ][ piece.location[1] - 1 ] == opp) && (this.board[ piece.location[0] - 2 ][ piece.location[1] - 2 ] == 0)){
                                mvs[mvsCount] = new Move(piece.location, [ piece.location[0] - 2 , piece.location[1] - 2 ], piece.ID, true);
                                mvsCount++;
                            }
                        }
                    }
                    
                    //moving up right 
                    if( piece.location[1] < 7 && piece.location[0] > 0){
                        if(this.board[ piece.location[0] - 1 ][ piece.location[1] + 1 ] == 0){
                            mvs[mvsCount] = new Move(piece.location, [ piece.location[0] - 1 , piece.location[1] + 1 ], piece.ID, false);
                            mvsCount++;
                        }
                        else if(piece.location[1] < 6 && piece.location[0] > 1){
                            if((this.board[ piece.location[0] - 1 ][ piece.location[1] + 1 ] == opp) && (this.board[ piece.location[0] - 2 ][ piece.location[1] + 2 ] == 0)){
                                mvs[mvsCount] = new Move(piece.location, [ piece.location[0] - 2 , piece.location[1] + 2 ], piece.ID, true);
                                mvsCount++;
                            }
                        }
                    }

                }
            }
        }

        //if theres jumps dont include other moves
        let fCount = 0;
        let flag = false; //is false return mvs as it is 
        for(let t in mvs){
            if ( t.jump ){
                finalMvs[fCount] = t;
                flag = true;
            }
        }
        if ( flag ){
            return finalMvs;
        }
        return mvs;
    }

    makeMove(move, player){
        //need to update checkers list, checker king status and movable attribute, and if there's kings
        //remove checker by setting player 0
        //updat board list
        this.lastMove = move;
        this.board[move.pastlocation[0]][move.pastlocation[1]] = 0;
        this.board[move.nextlocation[0]][move.nextlocation[1]] = player;
        this.checkers[move.checkerID].location = [move.nextlocation[0], move.nextlocation[1]];
        
        //check if killed king to remove count , not implemented

        //check if checker movable 
        //this.checkers[move.checkerID].movable = this.checkers[move.checkerID].movable(player);

        //updating king count and status
        if(!this.checkers[move.checkerID].king && (move.nextlocation[0] == 0 || move.nextlocation[0] == 7)){
            this.checkers[move.checkerID].king = true;
            if(player == 1){
                this.board.redKings++;
            }
            else{
                this.board.blueKings++;
            }
        }
        if(move.jump){
            if(player == 1){
                this.board.blueTiles--;
            }
            else{
                this.board.redTiles--;
            }
            //king case going up
            if(move.pastlocation[0] > move.nextlocation[0]){
                //left
                if(move.pastlocation[1] > move.nextlocation[1]){
                    //
                    this.board[move.pastlocation[0]-1][move.pastlocation[1]-1] = 0;
                }
                //right
                else{
                    this.board[move.pastlocation[0]-1][move.pastlocation[1]+1] = 0;
                }
            }
            //going down
            else{
                if(move.pastlocation[1] > move.nextlocation[1]){
                    this.board[move.pastlocation[0]+1][move.pastlocation[1]-1] = 0;
                }
                else{
                    this.board[move.pastlocation[0]+1][move.pastlocation[1]+1] = 0;
                }

            }               
        }


        
    }
       
    // 0 1 0 1 0 0    0,3 -> 2,1 jump 1,2 down left
    // 0 0 2 0 2 0    0,3 -> 2,5 jump 1,4 down right
    // 0 0 0 1 0 0    4,3 -> 2,1 jump 3,2 up left
    // 0 0 2 0 2 0    4,3 -> 2,5 jump 3,4 up right
    // 0 1 0 1 0 0

    DrawBoard() {
        let tilesDiv = document.querySelector('div.tiles');
        let tilesCount = 0;
        let chekersCount = 0;

        for (let row in this.board) {
            let line = document.createElement('div');
            line.classList.add('tileRow');

            for (let col in this.board[row]) {

                let tile = document.createElement('div');
                tile.classList.add('tile');
                tile.setAttribute('id', 'tile' + tilesCount);

                // the function needs implementation
                // tile.addEventListener('click', gameManager.Select);

                line.appendChild(tile); 
                this.tiles[tilesCount] = new Tile(this.board, tile, [+row,+col]);
                tilesCount++;

                //cheker
                let checker = document.createElement('div');
                checker.classList.add('checker');
                checker.setAttribute('id', chekersCount);
                //<i class="fas fa-crown"></i>
                //let icon = document.createElement('i');
                
                //icon.classList.add('em', 'em-crown');

                if (this.board[row][col] === 1) {
                    checker.classList.add('red');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row,+col], chekersCount);
                    if(row == 2) {
                        tem.movable = true;
                    }
                    this.checkers[chekersCount] = tem;
                    chekersCount++;
                    if(isKing(1, [row, col], currBoard.kingsList)){
                        let icon = document.createElement('i');
                        icon.classList.add('em', 'em-crown');checker.appendChild(icon);
                        checker.appendChild(icon);
                    }
                } else if (this.board[row][col] === 2) {
                    checker.classList.add('blue');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row,+col], chekersCount);
                    if(row == 5) {
                        tem.movable = true;
                    }
                    this.checkers[chekersCount] = tem;
                    chekersCount++;
                    if(isKing(1, [row, col], currBoard.kingsList)){
                        let icon = document.createElement('i');
                        icon.classList.add('em', 'em-crown');checker.appendChild(icon);
                        checker.appendChild(icon);
                    }
                }
            }

            tilesDiv.appendChild(line);
        }
    };

    reDrawBoard(){
        // Removes an element from the document
        let element = document.getElementsByClassName("tiles");
        console.log(element);
        // element[0].remove();
        // return false;
        while (element[0].firstChild) {
            element[0].removeChild(element[0].lastChild);
          }
        
        this.DrawBoard()
    };
};