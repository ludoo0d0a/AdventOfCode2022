import { readFile, stop, transpose } from './io.js';
import log from 'loglevel';
import { planckTemperature } from 'mathjs/lib/entry/pureFunctionsAny.generated.js';

const DEBUG = false;
const DAY = 5;
const LIMIT = 15;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`)

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

let istacks = [];
let moves = [];
lines.map(line => {
    if (!line) return;
    
    if (line.startsWith('[')){
        istacks.push(line.split(''))
    }else if (line.startsWith('move')){
        moves.push(parseMove(line))
    }
})

const stacks=transpose(istacks)
    .map(r => r.reverse())
    .filter(c => c[0]!='[' && c[0]!=']' && c[0]!=' ')
    .map(r => {
        return r.filter(c => c.trim()!='')
    })

process(stacks, moves)

moves.map(move => {
    if (!move) return;
    process(stacks, move)
})

const total = stacks.map(stack => {
    return stack.peek(true)
}).join('');

log.info('total = ', total);

function process(stacks, move){
    const buffer = [];
    for (let i = 0; i < move.count; i++) {
        if (!stacks[move.from]){
            return;
        }
        const el = stacks[move.from].pop();
        //stacks[move.to].push(el)
        buffer.push(el)
    }
    buffer.reverse();

    buffer.map(el => {
        stacks[move.to].push(el)
    })
}

// move 2 from 4 to 6
function parseMove(line){
    const r = line.split(' ');
    return {
        count: +r[1], 
        from: (+r[3])-1,
        to: (+r[5])-1
    };
}

// 5-7,7-9 => 7
// 5-7,8-9 => -
// 5-9,7-8 => 7-8
function overlap(x, y){
    return ( x[0]<=y[0] &&  y[0]<=x[1] )
        || 
        ( x[0]<=y[1] &&  y[1]<=x[1] );
}