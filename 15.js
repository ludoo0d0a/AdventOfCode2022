import { readFile, stop, matrixArray, printArray } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const SAMPLE = true;
const DAY = 15;
const LIMIT = 100;
const EXTRA = 20;
const TARGET= SAMPLE ? 10 : 2000000

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`, SAMPLE)

const groups = [];

let cols = 0, rows = 0; 
let startCols = 0, startRows = 0; 
var total = 0;

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map((line,i) => {
    if (!line) return;
    // Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    let values = line.split(' ')
    const s =  {
        x: +(values[2].replace('x=', '').replace(',', '')), 
        y: +(values[3].replace('y=', '').replace(':', ''))
    };
    const b = {
        x: +(values[8].replace('x=', '').replace(',', '')), 
        y: +(values[9].replace('y=', ''))    
    };
    const group = {
        i,
        sensor: s,
        beacon: b
    };
    cols = Math.max(b.x, cols);
    cols = Math.max(s.x, cols);
    rows = Math.max(b.y, rows);
    rows = Math.max(s.y, rows);

    startCols = Math.min(b.x, startCols);
    startCols = Math.min(s.x, startCols);
    startRows = Math.min(b.y, startRows);
    startRows = Math.min(s.y, startRows);
    //total += process(group, line)
    groups.push(group)
})

log.info('%d sensors', groups.length);

log.info(`cols=${rows}, rows=${rows}`);
log.info(`startCols=${startCols}, startRows=${startRows}`);

const offset = {
    x: Math.abs(startCols)+EXTRA,
    y: Math.abs(startRows)+EXTRA
}
cols+=EXTRA
rows+=EXTRA

const targetLines = Array(rows+offset.x);

function getManhattanDistance(a, b){
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function putGrid(x, value){
    targetLines[x + offset.x]=value;
}
function isCrossedLine(s, b){
    // TARGET
    return ((s.y >= TARGET && b.y <= TARGET) || (b.y >= TARGET && s.y <= TARGET));
}
function getIntersections(s, b){
    // segment [m-n] sur droite y=10
    const len = getManhattanDistance(s,b)
    log.info(' - sensor [%d,%d] len=%d',s.x, s.y, len)
    const m = s.x - (Math.ceil(Math.sqrt(Math.pow(len,2) + Math.pow(Math.abs(s.y-TARGET), 2))));
    const n = s.x + (Math.ceil(Math.sqrt(Math.pow(len,2) + Math.pow(Math.abs(s.y-TARGET), 2))));
    log.info(' range [%d-%d]', m, n);
    for (let i = m; i < n; i++) {
        putGrid(i,1);
    }
}

function fillGrid(){
    groups.map(group => {
        const s = group.sensor;
        //putGrid(s.x, s.y, 'S');
        const b = group.beacon;
        //putGrid(b.x, b.y, 'B');
        if (isCrossedLine(s, b)){
            log.debug('>sensor %d %d,%d -> %d,%d', group.i, s.x, s.y, b.x, b.y)
            getIntersections(s, b)
        }
    })

}
fillGrid();

function countNoBeacon(y){
    const count = targetLines.filter(c => c===1).length;
    log.info('@line %d = %d', y,  count)
    return count;
}

countNoBeacon(TARGET);
