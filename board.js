
class Move{
    constructor(pastlocation, nextlocation, checkerID) {
        this.pastlocation = pastlocation;
        this.nextlocation = nextlocation;
        this.checker = checkerID;
    };
};

class Tile{
    constructor(board, obj, location) {
        this.board = board;
        this.obj = obj;
        this.location = location;

        //can only play on black tiles
        if( (this.location[0] + this.location[1])%2 ){
            this.available = true;
        }
        else{
            this.available = false;
        }
    };
    
};

class Checker{
    constructor(board, ele, location) {
        this.board = board;
        this.element = ele;
        this.location = location;
        this.king = false;
        this.movable = false;
        // who has the checker
        if (this.element.getAttribute('id') < 12) {
            this.player = 1;
        } else {
            this.player = 2;
        }
    };
    
};

class Board {
    
    constructor() {
        this.size = 8;
        this.lastMove;
        this.board = this.Init();
        this.tiles = [];
        this.checkers = [];
        this.redKings = 0;
        this.blueKings = 0;
        this.redTiles = 12;
        this.blueTiles = 12;

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
                else board[i][j] = 0;
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
        let mvs = [];
        for(let piece in this.checkers){
            if(piece.player == player && piece.movable){
                
                
            }
        }



    }


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

                //checker.addEventListener('click', this.Select);

                if (this.board[row][col] === 1) {
                    checker.classList.add('red');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row,+col])
                    chekersCount++;
                    if(row == 2) {
                        tem.movable = true;
                    }
                    this.checkers[chekersCount] = tem;
                } else if (this.board[row][col] === 2) {
                    checker.classList.add('blue');
                    tile.appendChild(checker);
                    let tem = new Checker(this.board, checker, [+row,+col])  
                    chekersCount++;
                    if(row == 5) {
                        tem.movable = true;
                    }
                    this.checkers[chekersCount] = tem;
                }
            }

            tilesDiv.appendChild(line);
        }
    };
};