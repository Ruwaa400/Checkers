
let tem = currBoard;

function AInextMove(){
 //check if game eneded
//check if forced jump first
//if no forced jump find optimal move


}

//usign  15F
function evaluate(board){
    
}

function alphabeta(board, depth, alpha, beta, maxiplayer){
    if (depth == 0 && noMoreMoves(board)){
        return evaluate(board);
    }
    if(maxiplayer){
        let v = Number.NEGATIVE_INFINITY
        let children = findMoves(board);
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
        let children = findMoves(board);
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