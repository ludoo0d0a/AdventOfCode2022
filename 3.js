import { readFile, sliceIntoChunks, filteredArray } from './io.js';
import log from 'loglevel';

log.setDefaultLevel('debug')
//log.setDefaultLevel('info')

// https://adventofcode.com/2022/day/3
log.info('Day 3 - star 1')

var lines = readFile('3.txt')

var groups = [];
var total = 0;
var group = {};
groups.push(group)

//lines=lines.slice(0, 5)

lines.map(line => {
    if (!line) return;
    let values = line.split('')
    let groupedValues = sliceIntoChunks(values, values.length/2)
    group = {
        pack1: groupedValues[0], 
        pack2: groupedValues[1]  
        //score: 0
    };
    total +=process(group, line)
    groups.push(group)
})

log.info('total = ', total);

function process(group, line){
    const r = filteredArray(group.pack1, group.pack2)
    const score = computeScore(r)
    log.debug('%s > %d', line, score, r[0])
    return score;
}

function computeScore(r){
    const v = r[0].charCodeAt(0);
    if (v>96){
        // Lowercase item types a through z have priorities 1 through 26.
        // "97": "a", 
        return v - 96;
    }else{
        // Uppercase item types A through Z have priorities 27 through 52.
        // "65": "A",  
        return v - 64 + 26;
    }
}
