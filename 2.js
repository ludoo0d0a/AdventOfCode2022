import { readFile, stop } from './io.js';
import log from 'loglevel';

//log.setDefaultLevel('debug')
log.setDefaultLevel('info')

var lines = readFile('2.txt')

// Q: A for Rock, B for Paper, and C for Scissors
// R: X for Rock, Y for Paper, and Z for Scissors
var groups = [];
var total = 0;
var group = {weight:0};
groups.push(group)
lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    group = {
        res: values[0], 
        req: mapXYZ(values[1])
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
    const youWin = checkWin(group.req,group.res);
    const youLose = checkWin(group.res,group.req);
    //const equalsRound = !youWin && !youLose;

    // 1 for Rock, 2 for Paper, and 3 for Scissors
    const extra = (group.req=='A')?1:((group.req=='B')?2:3);
    // 0 if you lost, 3 if the round was a draw, and 6 if you won
    const score = youLose?0:(youWin?6:3);
    group.score = extra + score;
    total+=group.score;
    log.debug('%s > score: %d+%d=%d', line, extra, score, group.score)
}

function checkWin(a, b){
    // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock.
    // A/X defeats C/Z, C/Z defeats B/Y, and B/Y defeats A/X.
    return (a=='A' && b=='C') ||
            (a=='C' && b=='B') ||
            (a=='B' && b=='A');
}


log.info("[day2] Total ", total);