import { readFile, sliceIntoChunks, filteredArray } from './io.js';
import log from 'loglevel';

log.setDefaultLevel('debug')
//log.setDefaultLevel('info')

// https://adventofcode.com/2022/day/3
log.info('Day 3 - star 2')

var lines = readFile('3.txt')

var groups = [];
var total = 0;

//lines=lines.slice(0, 3 * 5)

lines.map(line => {
    if (!line) return;
    let values = line.split('')
    let group = {
        line,
        pack: values  
    };
    groups.push(group)
})

let groupedValues = sliceIntoChunks(groups, 3)
groupedValues.map(group => {
    total += process({commons:null, group})
})

log.info('total = ', total);

function process(r){
    processGroup(r);
    const score = computeScore(r.commons)
    log.debug('> %d', score, r.commons)
    return score;
}

function processGroup(r){
    r.group.map(grp => {
        if (!grp.line) return;
        if (r.commons){
            r.commons = filteredArray(grp.pack, r.commons)
        }else{
            r.commons= grp.pack
        }
    });
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
