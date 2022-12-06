import { readFile, stop, hasDuplicates } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const DAY = 6;
const LIMIT = 5;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`)

//lines = ['bvwbjplbgvbhsrlpgdmjqwftvncz']; //: first marker after character 5
// lines = ['nppdvjthqldpwncqszvftbrmjlhg'] //: first marker after character 6
// lines = ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'] //: first marker after character 10
// lines = ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'] //: first marker after character 11

const LEN = 14;
var groups = [];
var total = 0;
var group = {};

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map(line => {
    if (!line) return;
    let values = line.split('')
    group = {
        len: LEN,
        values
        //score: 0
    };
    total += process(group, line)
    groups.push(group)
})

log.info('total = ', total);


function process(group, line){
    for (let i = 0; i < group.values.length; i++) {
        const marker = group.values.slice(i, i+group.len)
        if (checkMarker(marker)){
            const score =  i + group.len ;
            log.debug('%s > %d', line,  score)
            return score;
        }
    }
    return -1;
}

function checkMarker(marker){
    return !hasDuplicates(marker);
}
