
//JSON.parse(JSON.stringify(object))
//AI player 1 red
//board object
function AInextMove() {
    //check if game eneded in another function that calls the move
    //check if forced jump first //no need //implemented in findmoves function 
    //if no forced jump find optimal move

    let maxValue = Number.NEGATIVE_INFINITY;
    let nextMove;
    //console.log("inside AInextMove");
    let children = findMovesAI(currBoard.board, currBoard.kingsList, 1);

    //cloning
    let boardTem = JSON.parse(JSON.stringify(currBoard.board));
    let kingsTem = JSON.parse(JSON.stringify(currBoard.kingsList));

    //console.log("number of moves" + children.length);

    for (let i = 0; i < children.length; i++) {
        let v = alphabeta(boardTem, kingsTem, children[i], 4, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
        //console.log("inside loop " + v);
        if (v > maxValue) {
            //console.log("yes it's better");
            maxValue = v;
            nextMove = children[i];
        }
    }
    return nextMove;
}

//usign  15F
function evaluate(board, kings) {
    let val = 0;
    let c1 = inDanger_safe(board, 1);
    let c2 = inDanger_safe(board, 2);
    //no. of tiles
    let param1 = noTiles(board, 1) - noTiles(board, 2);
    //no. of kings
    let param2 = noKings(kings, 1) - noKings(kings, 2);
    //no. of tiles that are in danger, can be changed to no. of safe tiles only
    let param3 = c2[0] - c1[0];
    //no. of safe tiles adjacant to edge
    let param4 = c1[1] - c2[1];
    //moves available
    let param5 = findMovesAI(board, kings, 1).length - findMovesAI(board, kings, 2).length;
    //patterns
    let param6 = triaP(board, 1);
    let param7 = oreoP(board, 1);
    let param8 = bridgeP(board, 1);

    //coefficients will be adjusted with tests
    val = 3 * param1 + 4 * param2 + 2 * param3 + 3 * param4 + param5 + 2 * param6 + 2 * param7 + 2 * param8;
    return val;
}

//function findmoves not implemented yet
function alphabeta(bList, kingsTem, move, depth, alpha, beta, maxiplayer) {
    //make move
    //board is a list of the piece 0 1 2
    //kings row hold [player, [row,col]]
    let board = JSON.parse(JSON.stringify(bList));
    let kings = JSON.parse(JSON.stringify(kingsTem));

    makeMoveAI(board, kings, move, maxiplayer + 1);

    if (depth == 0 || noMoreMoves(board, kings, maxiplayer + 1)) {
        return evaluate(board, kings);
    }
    if (maxiplayer) {
        let v = Number.NEGATIVE_INFINITY
        let children = findMovesAI(board, kings, maxiplayer + 1);
        for (let i = 0; i < children.length; i++) {
            v = Math.max(v, alphabeta(board, kings, children[i], depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, v);
            if (beta <= alpha) {
                break;
            }
        }
        return v;
    }
    else {
        let v = Number.POSITIVE_INFINITY
        let children = findMovesAI(board, kings, maxiplayer + 1);
        for (let i = 0; i < children.length; i++) {
            v = Math.min(v, alphabeta(board, kings, children[i], depth - 1, alpha, beta, true));
            alpha = Math.min(alpha, v);
            if (beta <= alpha) {
                break;
            }
        }
        return v;
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


function noMoreMoves(board, kings, player) {
    // console.log("inside no more moves");
    if (findMovesAI(board, kings, player).length == 0) {
        return true;
    }
    return false;

}

function isKing(player, loc, kings) {
    for (let i = 0; i < kings.length; i++) {
        if (kings[i][0] == player) {
            if ((kings[i][1] == loc[0]) && (kings[i][2] == loc[1]))
                return true;
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

                if (player == 2 || kingFlag) {
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

function isValidMove(locC, locT, temMvs) {
    console.log(locC);
    console.log(locT);

    for (let i = 0; i < temMvs.length; i++) {
        console.log(temMvs[i].pastlocation);
        console.log(temMvs[i].nextlocation);

        if ((temMvs[i].pastlocation[0] == locC[0]) && (temMvs[i].pastlocation[1] == locC[1]) &&
            (temMvs[i].nextlocation[0] == locT[0]) && (temMvs[i].nextlocation[1] == locT[1])) {
            return true;
        }

    }
    return false;
}

