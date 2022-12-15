import { readFile, stop, matrixArray } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const SAMPLE = true;
const DAY = 0;
const LIMIT = 5;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`, SAMPLE)

var groups = [];
var total = 0;
const rows = lines.length
const cols = lines[0].length
const grid = matrixArray(cols, rows, false)

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    const group = {
        res: values[0], 
        req: values[1]  
        //score: 0
    };
    total += process(group, line)
    groups.push(group)
})

log.info('total = ', total);


function process(group, line){

    const score = 0;

    //TODO

    log.debug('%s > %d', line,  score)
    return score;
}