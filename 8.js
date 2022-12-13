import { readFile, matrixArray, printArray, printDoubleArray } from './io.js';
import log from 'loglevel';

const DEBUG = false;
const DAY = 8;
const LIMIT = 5;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`)

var total = 0;
var matrix = [];
var visibilityDirs = [];
var visibility = [];
const [DIR_RIGHT, DIR_LEFT, DIR_TOP, DIR_BOTTOM] = [0,1,2,3];
const textdirs = ['right', 'left', 'up', 'bottom'];
function getDir(dir){
    return textdirs[dir];
}

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map(line => {
    if (!line) return;
    let values = line.split('')
    matrix.push(values)
    //total += process(group, line)
})
const rows = matrix.length
const cols = matrix[0].length
log.info('Matrix %dx%d : rows=%d, cols=%d', cols, rows, rows, cols)
createVisibility()
parseMatrix()

function parseMatrix(){
    for (let row = 0; row < rows; ++row) {
        const line = matrix[row];
        for (let col = 0; col < cols; ++col) {
            isVisible(row,col);
        }
        log.debug('Next row')
    }
}

function createVisibility(){
    //empty visibility matrix to retain last height on the direction
    visibilityDirs[DIR_RIGHT]=Array(cols).fill(-1);  // ->
    visibilityDirs[DIR_LEFT]=Array(cols).fill(-1);  // <-
    visibilityDirs[DIR_TOP]=Array(rows).fill(-1);  // ^
    visibilityDirs[DIR_BOTTOM]=Array(rows).fill(-1);  // v

    visibility = matrixArray(cols, rows, false)
}

function isVisible(row,col){
    log.debug(' ');
    const h = +matrix[row][col];
    log.debug('@[%d,%d] = %d =>', row, col, h)
    //const filter = [ 'left', 'right' ];
    const filter = [ 'left', 'top', 'bottom' , 'right' ];
    const rc = {row, col};
    const v1 = (filter.includes('right')) && checkTree(row       ,col      ,DIR_RIGHT,  row, rc) // ->
    const v2 = (filter.includes('left')) && checkTree(row        ,cols-col-1   ,DIR_LEFT,   row, rc)  // <-
    const v3 = (filter.includes('top')) && checkTree(rows-row-1    ,col      ,DIR_TOP,    col, rc)  // ^
    const v4 = (filter.includes('bottom')) && checkTree(row      ,col      ,DIR_BOTTOM, col, rc)  // v
    return (v1 || v2 || v3 || v4);
}

function checkTree(row, col, dir, vIndex, rc){
    // left [3,3] -1 > 4
    const h = +matrix[row][col];
    const lastHeight = visibilityDirs[dir][vIndex]
    log.debug('___%s [%d,%d] %d > %d ...', getDir(dir), row, col, lastHeight, h)
    if (h>lastHeight){
        // visible from this side
        
        log.debug('%s [%d,%d] %d > %d', getDir(dir), row, col, lastHeight, h)
        if (visibility[row][col]===false){
            ++total;
        }
        visibility[row][col]=h;
        if (DEBUG){
            printArray(visibility)
            //printDoubleArray(matrix, visibility)
        }
        visibilityDirs[dir][vIndex]=h;
        
        return true;
    }
    return false;
}

if (DEBUG){
    printArray(visibility)
}

log.info('total = ', total);

function process(group, line){

    const score = 0;

    //TODO

    log.debug('%s > %d', line,  score)
    return score;
}