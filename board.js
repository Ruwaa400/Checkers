
class Move{
    constructor(pastPosition, nextPosition, checkerID) {
        this.pastPosition = pastPosition;
        this.nextPosition = nextPosition;
        this.checker = checkerID;
    };
};

class Tile{
    constructor(board, obj, location) {
        this.board = board;
        this.obj = obj;
        this.location = location;

        //can only play on black tiles
        if( (this.position[0] + this.position[1])%2 ){
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
        this.lastMove;
        this.king = false;
        // who has the checker
        if (this.element.getAttribute('id') < 15) {
            this.player = 1;
        } else {
            this.player = 2;
        }
    };
    
};

class Board {
    
    constructor() {
        this.size = 8;
        this.board = this.Init();
        this.tiles = [];
        this.checkers = [];
        this.redKings = 0;
        this.blueKings = 0;
        this.redTiles = 15;
        this.blueTiles = 15;

        this.DrawBoard();
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
                    this.checkers[chekersCount] = new Checker(this.board, checker, [+row,+col]);
                    chekersCount++;
                } else if (this.board[row][col] === 2) {
                    checker.classList.add('blue');
                    tile.appendChild(checker);
                    this.checkers[chekersCount] = new Checker(this.board, checker, [+row,+col]);
                    chekersCount++;
                }
            }

            tilesDiv.appendChild(line);
        }
    };
};