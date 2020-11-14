
let tem = passBoard();

//function show(){
//    console.log(tem.board);
//}

//AI player 1 red
function AInextMove(){
 //check if game eneded
//check if forced jump first
//if no forced jump find optimal move
alphabeta(tem, 6, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);

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
function alphabeta(board, depth, alpha, beta, maxiplayer){
    if (depth == 0 || board.noMoreMoves(maxiplayer)){
        return evaluate(board);
    }
    if(maxiplayer){
        let v = Number.NEGATIVE_INFINITY
        let children = board.findMoves(maxiplayer+1);
        for (let child in children) {
            v = Math.max(v,alphabeta(child, depth-1, alpha, beta, false));
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
            v = Math.min(v,alphabeta(child, depth-1, alpha, beta, true));
            alpha = Math.min(alpha, v);
            if( beta <= alpha ){
                break;
            }
        }
        return v;
    }

}