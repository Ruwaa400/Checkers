
let tem = passBoard();

//function show(){
//    console.log(tem.board);
//}

//AI player 1 red
//board object
function AInextMove(board){
 //check if game eneded in another function that calls the move
//check if forced jump first //no need //implemented in findmoves function 
//if no forced jump find optimal move

    let maxValue = Number.NEGATIVE_INFINITY;
    let nextMove;
    let children = board.findMoves(1);
    for (let child in children) {
        let v = alphabeta(board, child, 5,  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
        if( v > maxValue ){
            maxValue = v;
            nextMove = child;
        }
    }    
    return nextMove;
}

//usign  15F
function evaluate(board){
    let val = 0;
    let c1 = board.inDanger_safe(1);
    let c2 = board.inDanger_safe(2);
    //no. of tiles
    let param1 = board.redTiles - board.blueTiles;
    //no. of kings
    let param2 = board.redKings - board.blueKings;
    //no. of tiles that are in danger, can be changed to no. of safe tiles only
    let param3 = c2[0] - c1[0];
    //no. of safe tiles adjacant to edge
    let param4 = c1[1] - c2[1];
    //movable pieces
    let param5 = board.moveableTiles(1) - board.moveableTiles(2);
    //patterns
    let param6 = board.triaP(1);
    let param7 = board.oreoP(1);
    let param8 = board.bridgeP(1);
    
    //coefficients will be adjusted with tests
    val = param1 + 2*param2 + param3 + 2*param4 + param5 + param6 + param7 + param8;
    return val;
}

//function findmoves not implemented yet
function alphabeta(board, move, depth, alpha, beta, maxiplayer){
    //make move
    board.lastMove = move;
    board.makeMove(move, maxiplayer+1);

    if (depth == 0 || board.noMoreMoves(maxiplayer)){
        return evaluate(board);
    }
    if(maxiplayer){
        let v = Number.NEGATIVE_INFINITY
        let children = board.findMoves(maxiplayer+1);
        for (let child in children) {
            v = Math.max(v,alphabeta(board, child, depth-1, alpha, beta, false));
            alpha = Math.max(alpha, v);
            if( beta <= alpha ){
                break;
            }
        }
        return v;
    }
    else{
        let v = Number.POSITIVE_INFINITY
        let children = board.findMoves(maxiplayer+1);
        for (let child in children) {
            v = Math.min(v,alphabeta(board, child, depth-1, alpha, beta, true));
            alpha = Math.min(alpha, v);
            if( beta <= alpha ){
                break;
            }
        }
        return v;
    }

}