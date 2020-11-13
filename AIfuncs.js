
function evaluate(node){[
    
]}

function alphabeta(node, depth, alpha, beta, maxiplayer){
    if (depth == 0 && noMoreMoves()){
        return evaluate(node);
    }
    if(maxiplayer){
        let v = Number.NEGATIVE_INFINITY
        let children = findMoves(node);
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
        let children = findMoves(node);
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