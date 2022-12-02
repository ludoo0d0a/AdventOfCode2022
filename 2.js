import { readFile, stop } from './io.js';
import log from 'loglevel';

//log.setDefaultLevel('debug')
log.setDefaultLevel('info')


// R: A for Rock, B for Paper, and C for Scissors
// Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock.
// A/X defeats C/Z, C/Z defeats B/Y, and B/Y defeats A/X.
const wins = {
    A: 'C',  // A wins over C
    B: 'A',
    C: 'B'
}
const loses = {
    A: 'B',  // A lost over B
    B: 'C',
    C: 'A'
}


var lines = readFile('2.txt')

// R: A for Rock, B for Paper, and C for Scissors
// day1 Q: X for Rock, Y for Paper, and Z for Scissors
// day2 Q: X for lose, Y for draw, and Z for win
var groups = [];
var total = 0;
var group = {weight:0};
groups.push(group)
lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    group = {
        res: values[0], //aka response, the opponent
        req: values[1]  //aka request, ie me
        //winner: 
        //score: 0
    };
    computeWinner(group, line)
    groups.push(group)
})
function mapXYZ(value){
    return value.replace('X', 'A').replace('Y', 'B').replace('Z', 'C')
}

function computeWinner(group, line){

    // day2 Q: X for lose, Y for draw, and Z for win
    const youWin = (group.req=='Z');
    const youLose = (group.req=='X');
    const equalsRound = (group.req=='Y');
    const shape = getMyShape(group)
    
    // const youWin = checkWin(group.req,group.res);
    // const youLose = checkWin(group.res,group.req);
    // //const equalsRound = !youWin && !youLose;
    // const shape = group.req;

    // 1 for Rock, 2 for Paper, and 3 for Scissors
    const extra = (shape=='A')?1:((shape=='B')?2:3);
    // 0 if you lost, 3 if the round was a draw, and 6 if you won
    const score = youLose?0:(youWin?6:3);
    group.score = extra + score;
    total+=group.score;
    log.debug('%s > score: %d+%d=%d', line, extra, score, group.score)
}

function getMyShape(group){
    const youWin = (group.req=='Z');
    const youLose = (group.req=='X');
    const equalsRound = (group.req=='Y');
    const otherShape = group.res;
    if (equalsRound){
        return otherShape;
    }else if (youWin){
        //return wins[otherShape];
        return loses[otherShape];
    }else{
        // youLose
        return wins[otherShape];
        //return loses[otherShape];
    }
}

function checkWin(a, b){
    // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock.
    // A/X defeats C/Z, C/Z defeats B/Y, and B/Y defeats A/X.
    return (a=='A' && b=='C') ||
            (a=='C' && b=='B') ||
            (a=='B' && b=='A');
}


log.info("[day2] Total ", total);