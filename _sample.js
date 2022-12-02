import { readFile, stop } from './io.js';
import log from 'loglevel';

//log.setDefaultLevel('debug')
log.setDefaultLevel('info')

log.info('Day 3 - star 1')

var lines = readFile('3.txt')

var groups = [];
var total = 0;
var group = {};
groups.push(group)
lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    group = {
        res: values[0], 
        req: values[1]  
        //score: 0
    };
    process(group, line)
    groups.push(group)
})

function process(group, line){

    const score = 0;

    //TODO

    log.debug('%s > %d', line,  score)
}