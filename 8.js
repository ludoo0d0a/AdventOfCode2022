import { readFile, matrixArray, printArray, printDoubleArray } from './io.js';
import log from 'loglevel';

const DEBUG = false;
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
    const defaultValue={h:-1}
    visibilityDirs[DIR_RIGHT]=Array(cols).fill(defaultValue);  // ->
    visibilityDirs[DIR_LEFT]=Array(cols).fill(defaultValue);  // <-
    visibilityDirs[DIR_TOP]=Array(rows).fill(defaultValue);  // ^
    visibilityDirs[DIR_BOTTOM]=Array(rows).fill(defaultValue);  // v

    visibility = matrixArray(cols, rows, false)
}

function isVisible(row,col){
    log.debug(' ');
    const h = +matrix[row][col];
    log.debug('@[%d,%d] = %d =>', row, col, h)
    //const filter = [ 'left', 'right' ];
    const filter = [ 'left', 'top', 'bottom' , 'right' ];
    const v1 = (filter.includes('right')) && checkTree(row       ,col          ,DIR_RIGHT,  row, col) // ->
    const v2 = (filter.includes('left')) && checkTree(row        ,cols-col-1   ,DIR_LEFT,   row, col)  // <-
    const v3 = (filter.includes('top')) && checkTree(rows-row-1  ,col          ,DIR_TOP,    col, row)  // ^
    const v4 = (filter.includes('bottom')) && checkTree(row      ,col          ,DIR_BOTTOM, col, row)  // v
    return (v1 || v2 || v3 || v4);
}

function checkTree(row, col, dir, vIndex, vOther){
    // left [3,3] -1 > 4
    const h = +matrix[row][col];
    const lastHeight = visibilityDirs[dir][vIndex].h
    log.debug('___%s [%d,%d] %d > %d ...', getDir(dir), row, col, lastHeight, h)
    if (h>lastHeight){
        // visible from this side
        
        log.debug('%s [%d,%d] %d > %d', getDir(dir), row, col, lastHeight, h)
        if (visibility[row][col]===false){
            ++total;
            visibilityDirs[dir][vIndex]={h, len: vOther};
        }
        visibility[row][col]=h;
        if (DEBUG){
            printArray(visibility)
            //printDoubleArray(matrix, visibility)
        }
        //visibilityDirs[dir][vIndex]={h, len: vIndex};
        
        return true;
    }
    return false;
}

if (DEBUG){
    printArray(visibility)
}


log.info('total = ', total);

// TODO https://www.reddit.com/r/adventofcode/comments/zfpnka/2022_day_8_solutions/
// TODO https://tranzystorek-io.github.io/paste/#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
// 

//
// star 2
// 6561 too llow
// 5614714 ko
// 92236816 too high
// 88529281 too high
function findMax(dir1, dir2, comment){
    let items = visibilityDirs[dir1]
        .map((v,i) => {
            const r = visibilityDirs[dir2][i];
            const total = (r && v && r.len>0 && v.len>0) ? (v.len * r.len) : 0 
            return {i, v, total};            
        })
        .sort((a,b)=> {
            return (a && b && a.total < b.total) ? 1 : -1;
        })
    let r = items[0];
    log.info('Max scenic in %s @%d total:%d h=%d', comment, r.i, r.total, r.v.h)
    return r;
}


// find max up+bottom
const rh=findMax(DIR_RIGHT, DIR_LEFT, 'horizontal')
// find max left+right
const rv=findMax(DIR_TOP, DIR_BOTTOM, 'vertical')
// intersection = highest scenic tree

// sample expected : 8, @(3,2)
log.info('max = ', rh.total * rv.total);

log.info(' @%d h = %d', rh.i, visibilityDirs[DIR_RIGHT][rh.i].len, visibilityDirs[DIR_LEFT][rh.i].len);
log.info(' @%d v = %d', rv.i, visibilityDirs[DIR_TOP][rv.i].len, visibilityDirs[DIR_BOTTOM][rv.i].len);



