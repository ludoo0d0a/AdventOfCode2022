import { readFile, matrixArray, printArray, printDoubleArray } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const DAY = 8;
const LIMIT = 5;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}b.txt`)

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
const gh = matrix.length
const gw = matrix[0].length
createVisibility()
parseMatrix()

function parseMatrix(){
    for (let i = 0; i < matrix.length; ++i) {
        const row = matrix[i];
        for (let j = 0; j < row.length; ++j) {
            isVisible(i,j);
        }
        log.debug('Next row')
    }
}

function createVisibility(){
    //empty visibility matrix to retain last height on the direction
    visibilityDirs[DIR_RIGHT]=Array(gw).fill(-1);  // ->
    visibilityDirs[DIR_LEFT]=Array(gw).fill(-1);  // <-
    visibilityDirs[DIR_TOP]=Array(gh).fill(-1);  // | to top
    visibilityDirs[DIR_BOTTOM]=Array(gh).fill(-1);  // | to bottom

    visibility = matrixArray(gw, gh, false)
}

function isVisible(i,j){
    log.debug(' ');
    log.debug('@[%d,%d] =>', i, j)
    //const filter = [ 'left', 'right' ];
    const filter = [ 'left', 'top', '_bottom' ];
    const v1 = (filter.includes('right')) && checkTree(i       ,j      ,DIR_RIGHT, i) // ->
    const v2 = (filter.includes('left')) && checkTree(i       ,gh-j   ,DIR_LEFT, i)  // <-
    const v3 = (filter.includes('top')) && checkTree(gw-i-1    ,j      ,DIR_TOP, j)  // to top
    const v4 = (filter.includes('bottom')) && checkTree(i       ,j      ,DIR_BOTTOM, j)  // to bottom
    return (v1 || v2 || v3 || v4);
}

function checkTree(i,j, dir, vIndex){
    // left [3,3] -1 > 4
    log.debug('  %s [%d,%d] ...', getDir(dir), i, j)
    const h = +matrix[i][j];
    const lastHeight = visibilityDirs[dir][vIndex]
    if (h>lastHeight){
        // visible from this side
        if (!visibility[i][j]){
            log.info('%s [%d,%d] %d > %d', getDir(dir), i, j, lastHeight, h)
            ++total;
            visibility[i][j]=h;
            if (DEBUG){
                printArray(visibility)
                //printDoubleArray(matrix, visibility)
            }
            visibilityDirs[dir][vIndex]=h;
        }
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