
let tem = passBoard();

//function show(){
//    console.log(tem.board);
//}

//JSON.parse(JSON.stringify(object))
//AI player 1 red
//board object
function AInextMove(){
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

    for (let i = 0; i< children.length; i++) {
        let v = alphabeta(boardTem, kingsTem, children[i], 3,  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
        //console.log("inside loop " + v);
        if( v > maxValue ){
            //console.log("yes it's better");
            maxValue = v;
            nextMove = children[i];
        }
    }    
    return nextMove;
}

//usign  15F
function evaluate(board, kings){
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
    let param5 = findMovesAI(board,kings, 1).length - findMovesAI(board,kings, 2).length;
    //patterns
    let param6 = triaP(board, 1);
    let param7 = oreoP(board, 1);
    let param8 = bridgeP(board, 1);
    
    //coefficients will be adjusted with tests
    val = param1 + 2*param2 + param3 + 2*param4 + param5 + param6 + param7 + param8;
    return val;
}

//function findmoves not implemented yet
function alphabeta(bList, kingsTem, move, depth, alpha, beta, maxiplayer){
    //make move
    //board is a list of the piece 0 1 2
    //kings row hold [player, [row,col]]
    let board = JSON.parse(JSON.stringify(bList));
    let kings = JSON.parse(JSON.stringify(kingsTem));
    
    makeMoveAI(board, kings, move, maxiplayer+1);

    if (depth == 0 || noMoreMoves(board, kings, maxiplayer+1)){
        return evaluate(board, kings);
    }
    if(maxiplayer){
        let v = Number.NEGATIVE_INFINITY
        let children = findMovesAI(board, kings, maxiplayer+1);
        for (let i = 0; i< children.length; i++) {
            v = Math.max(v,alphabeta(board, kings, children[i], depth-1, alpha, beta, false));
            alpha = Math.max(alpha, v);
            if( beta <= alpha ){
                break;
            }
        }
        return v;
    }
    else{
        let v = Number.POSITIVE_INFINITY
        let children =  findMovesAI(board, kings, maxiplayer+1);
        for (let i = 0; i< children.length; i++) {
            v = Math.min(v,alphabeta(board, kings, children[i], depth-1, alpha, beta, true));
            alpha = Math.min(alpha, v);
            if( beta <= alpha ){
                break;
            }
        }
        return v;
    }

}

function inDanger_safe(board, player){
    //count [inDanger, safe, movable]
    let count = [0,0];
    let opp = (player == 1? 2 : 1);
    for(let row in board){
        for(let col in board[row]){
            if(board[row][col] == player){

                //edge pieces
                if(row == 0 || row==7 || col==0 || col == 7){
                    count[0]++;
                }
                //only one attack counted
                //king attacks not counted yet
                else if(board[parseInt(row)+1][parseInt(col)-1] == opp && board[parseInt(row)-1][parseInt(col)+1] == 0){
                    count[1]++;
                }
                else if(board[parseInt(row)+1][parseInt(col)+1] == opp && board[parseInt(row)-1][parseInt(col)-1] == 0){
                    count[1]++;
                }

            }

        }
    }
    return count;
}

function triaP(board, player){
    if(board[0][1]==player && board[0][3]==player && board[1][2]==player){
        return 1;
    }
    else return 0;
}

function oreoP(board, player){
    if(board[0][3]==player && board[0][5]==player && board[1][4]==player){
        return 1;
    }
    else return 0;
    
}

function bridgeP(board, player){
    if(board[0][1]==player && board[0][5]==player){
        return 1;
    }
    else return 0;
}

function noTiles(board, player){
    let count = 0;
    for(let row in board){
        for(let col in board[row]){
            if(board[row][col] == player){
                count++;
            }
        }
    }
    return count;
}

function noKings(kings, player){
    let count = 0;
    for(let row in kings){
        if(kings[0] == player){
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
    for(let t in kings){
        if (kings[0] == player){
            if(kings[1] == loc[0] && kings[2] == loc[1])
            return true;
        }
    }
    return false;
}

function findMovesAI(board, kings, player){
    //return array of moves
    let finalMvs = [];
    let mvs = [];
    let mvsCount = 0;
    let kingFlag = false;
    let opp = (player == 1? 2 : 1);
    for(let row in board){
        for(let col in board[row]){
            if(board[row][col] == player){
                kingFlag = isKing(player, [row,col], kings);
                
                //moving left down
                if( col > 0 && row < 7){
                    if(board[parseInt(row) + 1][parseInt(col) - 1] == 0){
                        mvs[mvsCount] = new Move([row,col], [parseInt(row) + 1 , parseInt(col) - 1], player, false);
                        mvsCount++;
                    }
                    else if(col > 1 && row < 6){
                        if((board[ parseInt(row) + 1 ][ parseInt(col) - 1 ] == opp) && (board[ parseInt(row) + 2 ][ parseInt(col) - 2 ] == 0)){
                            mvs[mvsCount] = new Move([row,parseInt(col)], [ parseInt(row) + 2 , parseInt(col) - 2 ], player, true);
                            mvsCount++;
                        }
                    }
                }
                
                //moving right down
                if( col < 7 && row < 7){
                    if(board[ parseInt(row) + 1 ][ parseInt(col) + 1 ] == 0){
                        mvs[mvsCount] = new Move([row,col], [ parseInt(row) + 1 , parseInt(col) + 1 ], player, false);
                        mvsCount++;
                    }
                    else if(col < 6 && row < 6){
                        if((board[ parseInt(row) + 1 ][ parseInt(col) + 1 ] == opp) && (board[ parseInt(row) + 2 ][ parseInt(col) + 2 ] == 0)){
                            mvs[mvsCount] = new Move([row,col], [ parseInt(row) + 2 , parseInt(col) + 2 ], player, true);
                            mvsCount++;
                        }
                    }
                }
                //two additional direction up right and up left
                
                if(kingFlag){
                    //moving up left
                    if( col > 0 && row > 0){
                        if(board[ parseInt(row) - 1 ][ parseInt(col) - 1 ] == 0){
                            mvs[mvsCount] = new Move([row,col], [ parseInt(row) - 1 , parseInt(col) - 1 ], player, false);
                            mvsCount++;
                        }
                        else if(col > 1 && row > 1){
                            if((board[ parseInt(row) - 1 ][ parseInt(col) - 1 ] == opp) && (board[ parseInt(row) - 2 ][ parseInt(col) - 2 ] == 0)){
                                mvs[mvsCount] = new Move([row,col], [ parseInt(row) - 2 , parseInt(col) - 2 ], player, true);
                                mvsCount++;
                            }
                        }
                    }
                    
                    //moving up right 
                    if( col < 7 && row > 0){
                        if(board[ parseInt(row) - 1 ][ parseInt(col) + 1 ] == 0){
                            mvs[mvsCount] = new Move([row,col], [ parseInt(row) - 1 , parseInt(col) + 1 ], player, false);
                            mvsCount++;
                        }
                        else if(col < 6 && row > 1){
                            if((board[ parseInt(row) - 1 ][ parseInt(col) + 1 ] == opp) && (board[ parseInt(row) - 2 ][ parseInt(col) + 2 ] == 0)){
                                mvs[mvsCount] = new Move([row,col], [ parseInt(row) - 2 ,parseInt(col) + 2 ], player, true);
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
    for(let i =0; i <mvs.length ; i++){
        if ( mvs[i].jump ){
            finalMvs[fCount] = mvs[i];
            flag = true;
            fCount++;
        }
    }
    
    if ( flag ){
        return finalMvs;
    }
    return mvs;
}

function makeMoveAI(board, kings, move, player){
    //need to update checkers list, checker king status and movable attribute, and if there's kings
    //remove checker by setting player 0
    //updat board list
   
    board[move.pastlocation[0]][move.pastlocation[1]] = 0;
    board[move.nextlocation[0]][move.nextlocation[1]] = player;
    
    let killedloc = [0, 0];
    let kingFlag = isKing(player, move.loc, kings);
    //check if killed king to remove from kings list, not implemented
    //updating king status
    if(!kingFlag && move.nextlocation[0] == 7){
        kings.push(player, move.nextlocation[0],move.nextlocation[1]);
    }
    if(move.jump){
        //king case going up
        if(move.pastlocation[0] > move.nextlocation[0]){
            //left
            if(move.pastlocation[1] > move.nextlocation[1]){
                //killed tile
                killedloc = [move.pastlocation[0]-1, move.pastlocation[1]-1];
                board[move.pastlocation[0]-1][move.pastlocation[1]-1] = 0;
            }
            //right
            else{
                killedloc = [move.pastlocation[0]-1, parseInt(move.pastlocation[1])+1];
                board[move.pastlocation[0]-1][parseInt(move.pastlocation[1])+1] = 0;
            }
        }
        //going down
        else{
            if(move.pastlocation[1] > move.nextlocation[1]){
                
               
                killedloc = [parseInt(move.pastlocation[0])+1, parseInt(move.pastlocation[1])-1];
                board[parseInt(move.pastlocation[0])+1][move.pastlocation[1]-1] = 0;
            }
            else{
                killedloc = [parseInt(move.pastlocation[0])+1, parseInt(move.pastlocation[1])+1];
                board[parseInt(move.pastlocation[0])+1][parseInt(move.pastlocation[1])+1] = 0;
            }

        }
        removeKing(kings, killedloc, 2);               
    }

}

function removeKing(kings, killedloc, player){
    for(let t in kings){
        if (kings[0] == player && kings[1] == killedloc[0] && kings[2] == killedloc[1]){
            kings[0] = 0;
            return;
        }
    }

}