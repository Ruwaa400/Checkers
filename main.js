let currBoard = new Board();
let myGame; // just to save the turn and the selected pieces

window.onload = () => {
    currBoard.DrawBoard();
    console.log(currBoard.board);
    myGame  = new Game();
};

function passBoard(){
    console.log(currBoard.board);
    return currBoard;
}

//maybe put game functions here



