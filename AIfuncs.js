
//JSON.parse(JSON.stringify(object))
//AI player 1 red
//board object
let INFINITY = 10000;
let NEG_INFINITY = -10000;

function AInextMove(){

    //cloning
    var simulated_board = JSON.parse(JSON.stringify(currBoard.board));
    var simulated_kings = JSON.parse(JSON.stringify(currBoard.kingsList));

    var alpha = NEG_INFINITY;
    var beta = INFINITY;
    var available_moves = findMovesAI(simulated_board, simulated_kings, 1);
    var max = alpha_beta(simulated_board, simulated_kings, available_moves, 8, alpha, beta, 1);

    //find all moves that have max-value
    var max_move = null;
    var best_moves = [];
        var max_move = null;
        for(var i=0;i<available_moves.length;i++){
            var next_move = available_moves[i];
            if (next_move.score == max){
                max_move = next_move;
                best_moves.push(next_move);
            }
        }

    //randomize selection, if multiple moves have same max-value
    if (best_moves.length > 1){
        max_move = select_random_move(best_moves);
    }

    return max_move;
}


function evaluate_position(x , y) {
    if (x == 0 || x == 7 || y == 0 || y == 7){
        return 5;
    }
    else {
        return 3;
    }
}
//usign  15F
function evaluate(board, kings){
    var sum = 0;
    var computer_pieces = 0;
    var computer_kings = 0;
    var human_pieces = 0;
    var human_kings = 0;
    var computer_pos_sum = 0;
    var human_pos_sum = 0;

    for(let row in board){
        for(let col in board[row]){
            if(board[row][col] == 1){
                computer_pieces++;
                var computer_pos = evaluate_position(col, row);
                computer_pos_sum += computer_pos;
            }
            else if(board[row][col] == 2){
                human_pieces++;
                var human_pos = evaluate_position(col, row);
	            human_pos_sum += human_pos;
            }
        }
    }

    human_kings = noKings(kings, 2);
    computer_kings = noKings(kings, 1);
    var piece_difference = computer_pieces - human_pieces;
    var king_difference = computer_kings - human_kings;
    var avg_human_pos = human_pos_sum / human_pieces;
    var avg_computer_pos = computer_pos_sum / computer_pieces;
    var avg_pos_diff = avg_computer_pos - avg_human_pos;

    var features = [piece_difference, king_difference, avg_pos_diff];
    var weights = [100, 10, 1];

    var eval = 0;

    for (var f=0; f<features.length; f++){
        var fw = features[f] * weights[f];
        eval += fw;
    }

    return eval;
}

//function findmoves not implemented yet
function alpha_beta(board, kings, moves, depth, alpha, beta, player){
    //make move
    //board is a list of the piece 0 1 2
    //kings row hold [player, [row,col]]
    if (depth <= 0 || noMoreMoves(board, kings, player)) {
        return evaluate(board, kings);
    }
    simulated_board = JSON.parse(JSON.stringify(board));
    simulated_kings = JSON.parse(JSON.stringify(kings));
    if(player == 1){
        var max = NEG_INFINITY;
        for (var i=0;i<moves.length;i++){
            //move computer piece
            var AI_move = moves[i];
            makeMoveAI(simulated_board, simulated_kings, AI_move, 1);
            //get available moves for human
            var player_moves = findMovesAI(simulated_board, simulated_kings, 2);
            //get min value for this move
            var min_score = alpha_beta(simulated_board, simulated_kings, player_moves, depth-1, alpha, beta, 2);
            moves[i].score = min_score;
            //compare to min and update, if necessary
            if (min_score > max) {
                max = min_score;
            }
            if (max >= beta) {
                break;
            }
            if (max > alpha) {
                alpha = max;
            }
        }
        return max;
    }
    else if(player == 2){
        var min = INFINITY;
        for (var i=0;i<moves.length;i++){
            //move human piece
            var player_move = moves[i];
            makeMoveAI(simulated_board, simulated_kings, player_move, 2);

            //get available moves for computer
            var AI_moves = findMovesAI(simulated_board, simulated_kings, 1);

            //get max value for this move
            var max_score = alpha_beta(simulated_board, simulated_kings, AI_moves, depth-1, alpha, beta, 1);

            //compare to min and update, if necessary
            if (max_score < min) {
                min = max_score;
            }
            moves[i].score = min;
            if (min <= alpha) {
                break;
            }
            if (min < beta) {
                beta = min;
            }
        }
        return min;
    }
}

function inDanger_safe(board, player) {
    //count [inDanger, safe]
    let count = [0, 0];
    let opp = (player == 1 ? 2 : 1);
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {

                //edge pieces
                if (row == 0 || row == 7 || col == 0 || col == 7) {
                    count[0]++;
                }
                //only one attack counted
                //king attacks not counted yet
                else if (board[parseInt(row) + 1][parseInt(col) - 1] == opp && board[parseInt(row) - 1][parseInt(col) + 1] == 0) {
                    count[1]++;
                }
                else if (board[parseInt(row) + 1][parseInt(col) + 1] == opp && board[parseInt(row) - 1][parseInt(col) - 1] == 0) {
                    count[1]++;
                }

            }

        }
    }
    return count;
}

function triaP(board, player) {
    if (board[0][1] == player && board[0][3] == player && board[1][2] == player) {
        return 1;
    }
    else return 0;
}

function oreoP(board, player) {
    if (board[0][3] == player && board[0][5] == player && board[1][4] == player) {
        return 1;
    }
    else return 0;

}

function bridgeP(board, player) {
    if (board[0][1] == player && board[0][5] == player) {
        return 1;
    }
    else return 0;
}

function noTiles(board, player) {
    let count = 0;
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {
                count++;
            }
        }
    }
    return count;
}

function noKings(kings, player) {
    let count = 0;
    for (let row in kings) {
        if (row[0] == player) {
            count++;
        }
    }
    return count;

}


function noMoreMoves(board, kings, player){
    if(findMovesAI(board, kings, player).length == 0){
        return true;
    }
    return false;

}

function isKing(player, loc, kings){
    for(let i = 0; i < kings.length ; i++){
        if (kings[i][0] == player){
            if((kings[i][1] == loc[0]) && (kings[i][2] == loc[1])){
                return true;
            }
        }
    }
    return false;
}

function findMovesAI(board, kings, player) {
    //return array of moves
    let finalMvs = [];
    let mvs = [];
    let mvsCount = 0;
    let kingFlag = false;
    let opp = (player == 1 ? 2 : 1);
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {
                kingFlag = isKing(player, [row, col], kings);

                //moving left down
                if (player == 1 || kingFlag) {
                    if (col > 0 && row < 7) {
                        if (board[parseInt(row) + 1][parseInt(col) - 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) + 1, parseInt(col) - 1], player, false);
                            mvsCount++;
                        }
                        else if (col > 1 && row < 6) {
                            if ((board[parseInt(row) + 1][parseInt(col) - 1] == opp) && (board[parseInt(row) + 2][parseInt(col) - 2] == 0)) {
                                mvs[mvsCount] = new Move([row, parseInt(col)], [parseInt(row) + 2, parseInt(col) - 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                    //moving right down
                    if (col < 7 && row < 7) {
                        if (board[parseInt(row) + 1][parseInt(col) + 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) + 1, parseInt(col) + 1], player, false);
                            mvsCount++;
                        }
                        else if (col < 6 && row < 6) {
                            if ((board[parseInt(row) + 1][parseInt(col) + 1] == opp) && (board[parseInt(row) + 2][parseInt(col) + 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) + 2, parseInt(col) + 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                }

                //two additional direction up right and up left 
                
                if((player == 2) || kingFlag){
                    //moving up left
                    if (col > 0 && row > 0) {
                        if (board[parseInt(row) - 1][parseInt(col) - 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) - 1, parseInt(col) - 1], player, false);
                            mvsCount++;
                        }
                        else if (col > 1 && row > 1) {
                            if ((board[parseInt(row) - 1][parseInt(col) - 1] == opp) && (board[parseInt(row) - 2][parseInt(col) - 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) - 2, parseInt(col) - 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                    //moving up right 
                    if (col < 7 && row > 0) {
                        if (board[parseInt(row) - 1][parseInt(col) + 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) - 1, parseInt(col) + 1], player, false);
                            mvsCount++;
                        }
                        else if (col < 6 && row > 1) {
                            if ((board[parseInt(row) - 1][parseInt(col) + 1] == opp) && (board[parseInt(row) - 2][parseInt(col) + 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) - 2, parseInt(col) + 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                }

            }
        }
    }

    //if theres jumps dont include other moves
    let fCount = 0;
    let flag = false; //is false return mvs as it is 
    for (let i = 0; i < mvs.length; i++) {
        if (mvs[i].jump) {
            finalMvs[fCount] = mvs[i];
            flag = true;
            fCount++;
        }
    }

    if (flag) {
        // console.log("jumps: " + finalMvs[0].pastlocation + " to "+ finalMvs[0].nextlocation);
        // if(finalMvs[0].jump) console.log("hey you");
        return finalMvs;
    }
    return mvs;
}

function makeMoveAI(board, kings, move, player) {
    //need to update checkers list, checker king status and movable attribute, and if there's kings
    //remove checker by setting player 0
    //updat board list
    let opp = (player == 1) ? 2 : 1;

    board[move.pastlocation[0]][move.pastlocation[1]] = 0;
    board[move.nextlocation[0]][move.nextlocation[1]] = player;

    let killedloc = [0, 0];
    let kingFlag = isKing(player, move.pastlocation, kings);
    //check if killed king to remove from kings list, not implemented
    //updating king status
    if (!kingFlag && ((move.nextlocation[0] == 7) || (move.nextlocation[0] == 0))) {
        //console.log("should become king");
        //console.log(move.nextlocation);
        kings.push([player, move.nextlocation[0], move.nextlocation[1]]);
        //console.log(kings[0][0] + " " + kings[0][1] +" "+ kings[0][2]);
        //console.log(isKing(player, move.nextlocation, kings));
    }
    //update king list
    if (kingFlag) {
        //console.log("update king location");
        //console.log(move.nextlocation);
        updateKingLoc(kings, player, move.pastlocation, move.nextlocation);
        //console.log(kings);
    }

    if (move.jump) {
        //king case going up
        if (move.pastlocation[0] > move.nextlocation[0]) {
            //left
            if (move.pastlocation[1] > move.nextlocation[1]) {
                //killed tile
                killedloc = [move.pastlocation[0] - 1, move.pastlocation[1] - 1];
                board[move.pastlocation[0] - 1][move.pastlocation[1] - 1] = 0;
            }
            //right
            else {
                killedloc = [move.pastlocation[0] - 1, parseInt(move.pastlocation[1]) + 1];
                board[move.pastlocation[0] - 1][parseInt(move.pastlocation[1]) + 1] = 0;
            }
        }
        //going down
        else {
            if (move.pastlocation[1] > move.nextlocation[1]) {


                killedloc = [parseInt(move.pastlocation[0]) + 1, parseInt(move.pastlocation[1]) - 1];
                board[parseInt(move.pastlocation[0]) + 1][move.pastlocation[1] - 1] = 0;
            }
            else {
                killedloc = [parseInt(move.pastlocation[0]) + 1, parseInt(move.pastlocation[1]) + 1];
                board[parseInt(move.pastlocation[0]) + 1][parseInt(move.pastlocation[1]) + 1] = 0;
            }

        }
        removeKing(kings, killedloc, opp);
    }

}

function removeKing(kings, killedloc, player) {
    for (let t in kings) {
        if (t[0] == player && t[1] == killedloc[0] && t[2] == killedloc[1]) {
            t[0] = 0;
            return;
        }
    }

}

function updateKingLoc(kings, player, pastlocation, nextlocation) {
    for (let i = 0; i < kings.length; i++) {
        if ((kings[i][0] == player) && (kings[i][1] == pastlocation[0]) && (kings[i][2] == pastlocation[1])) {
            kings[i][1] = nextlocation[0];
            kings[i][2] = nextlocation[1];
            return;
        }
    }
}

function findMovePlayer(locC, locT, temMvs) {
    for (let i = 0; i < temMvs.length; i++) {
        if ((temMvs[i].pastlocation[0] == locC[0]) && (temMvs[i].pastlocation[1] == locC[1]) &&
            (temMvs[i].nextlocation[0] == locT[0]) && (temMvs[i].nextlocation[1] == locT[1])) {
            return temMvs[i];
        }

    }

}

function isValidMove(locC, locT, temMvs){
    for(let i = 0; i < temMvs.length ; i++){
        if((temMvs[i].pastlocation[0] == locC[0]) && (temMvs[i].pastlocation[1] == locC[1]) && 
            (temMvs[i].nextlocation[0] == locT[0]) && (temMvs[i].nextlocation[1] == locT[1])){
                return true;
        }

    }
    return false;
}

function select_random_move(moves){
    // Randomly select move
    var index = Math.floor(Math.random() * (moves.length - 1));
    var selected_move = moves[index];

    return selected_move;
}

