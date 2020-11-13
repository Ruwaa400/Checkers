
class Board {
    
    constructor() {
        this.size = 8;
        this.board = this.Init();
        this.tiles = [];
        this.checkers = [];
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
        let tiles = document.querySelector('div.tiles');
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
                tilesCount++;

                //cheker
                let checker = document.createElement('div');
                checker.classList.add('checker');
                checker.setAttribute('id', chekersCount);

                //checker.addEventListener('click', this.Select);

                if (this.board[row][col] === 1) {
                    checker.classList.add('black');
                    tile.appendChild(checker);
                    //this.board.checkers[chekersCount] = [+row, +col];
                    chekersCount++;
                } else if (this.board[row][col] === 2) {
                    checker.classList.add('white');
                    tile.appendChild(checker);
                    //this.board.checkers[chekersCount] = [+row, +col];
                    chekersCount++;
                }
            }

            tiles.appendChild(line);
        }
    };
};