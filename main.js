
let currBoard = new Board();

window.onload = () => {
    currBoard.DrawBoard();
    console.log(currBoard.board);
};

function passBoard(){
    console.log(currBoard.board);
    return currBoard;
}

//maybe put game functions here



