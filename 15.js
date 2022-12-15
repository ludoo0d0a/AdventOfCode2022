import { readFile, stop, matrixArray, printArray } from './io.js';
import log from 'loglevel';

const DEBUG = false;
const SAMPLE = true;
const DAY = 15;
const LIMIT = 1;

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

lines.map(line => {
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

log.info('total = ', total);

log.info(`cols=${rows}, rows=${rows}`);
log.info(`startCols=${startCols}, startRows=${startRows}`);
const offset = {
    x: Math.abs(startCols)+20,
    y: Math.abs(startRows)+20
}
cols+=20
rows+=20
const grid = matrixArray(cols+offset.x+1, rows+offset.y+1, false)

function putGrid(x,y, value){
    if (y+offset.y < 0){
        log.error('Out of bounds Y <0');
        return;
    }
    if (y+offset.y >= grid.length){
        log.error('Out of bounds Y');
        return;
    }
    if (x+offset.x < 0){
        log.error('Out of bounds X <0');
        return;
    }
    if (x+offset.x >= grid[y+offset.y].length){
        log.error('Out of bounds X');
        return;
    }
    const v = grid[y+offset.y][x+offset.x];
    if (v===false){
        grid[y+offset.y][x+offset.x]=value;
    }
}

function fillGrid(){
    groups.map(group => {
        const s = group.sensor;
        putGrid(s.x, s.y, 'S');
        const b = group.beacon;
        putGrid(b.x, b.y, 'B');
    })

}
fillGrid();
drawGrid();

function markAllRanges(){
    groups.map(group => {
        markRange(group)
    })
}

function getManhattanDistance(a, b){
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function markRange(group){
    const s = group.sensor;
    const b = group.beacon;
    //draw range around sensor with #
    const len = getManhattanDistance(s, b);
    for (let y = -len; y <= len; y++) {
        let r = len-Math.abs(y);
        let from = -Math.abs(r);
        let to = Math.abs(from);
        for (let x = from; x <= to; x++) {
            putGrid(s.x + x, s.y + y, '#');
        }
        //drawGrid();
        //const a = 0;
    }
}
markAllRanges();

function drawGrid(){
    //if (DEBUG){
        printArray(grid, '.', true)
    //}
    log.info('-')
}

drawGrid();

function countNoBeacon(y){
    const count = grid[y+offset.y].filter(c => c==='#').length;
    log.info('@line %d = %d', y,  count)
    return count;
}
countNoBeacon(10);
