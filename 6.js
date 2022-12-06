import { readFile, stop, sliceIntoChunks, filteredArray } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const DAY = 6;
const LIMIT = 5;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`)

var groups = [];
var total = 0;
var group = {};
groups.push(group)

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    group = {
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