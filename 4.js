import { readFile, stop, sliceIntoChunks, filteredArray } from './io.js';
import log from 'loglevel';

const DEBUG = false;
const DAY = 4;
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
    let values = line.split(',') //46-75,45-76
    group = {
        range1: values[0].split('-').map(i => +i), 
        range2: values[1].split('-').map(i => +i)
        //score: 0
    };
    total += process(group, line)
    groups.push(group)
})

log.info('total = ', total);

function process(group, line){
    const includes = includesAll(group.range1, group.range2) ||
                     includesAll(group.range2, group.range1);
    const score = includes ? 1 : 0;
    log.debug('%s > %d', line,  score)
    return score;
}

// 2-3,1-9 = 2-3 = true
function includesAll(r1, r2){
    return (r1[0]>=r2[0] && r1[1]<=r2[1]);
}