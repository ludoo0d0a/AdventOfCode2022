import fs from 'fs';
import log from 'loglevel';

Array.prototype.peek = function (soft) {
    if (this.length === 0) {
      if (soft) 
        return ''
      else
        throw new Error("out of bounds");
    }
    return this[this.length - 1];
};

export function loga(m, ...args){
    process.stdout.write(m, args);
}

export function saveAsjson(name, o){
    fs.writeFileSync('out/'+name, JSON.stringify(o))
}
export function readJson(name){
    const path = 'out/'+name;
    let o = null;
    if (fs.existsSync(path)){
        var content = fs.readFileSync(path, 'utf8');
        o = JSON.parse(content);
    }
    return o;
}

export function saveFile(name, out){
    // let out = [];
    // out.push(rs.sum)
    // out.push(rs.s.join(' '))
    fs.writeFileSync('out/'+name, out.join('\n'))
}

export function readFile(name, useSample){
    const dir = useSample ? 'samples' : 'data';
    var content = fs.readFileSync(dir+'/'+name, 'utf8');
    var lines = content.split('\n');
    return lines;
}

export function stop(){
    console.log('Stop !!')
    process.exit();
}


export function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

export function intersect(array1, array2) {
    return array1.filter(value => array2.includes(value));
}
//export filteredArray=intersect;

export function transpose(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

export function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function matrixArray(width, height, defaultValue){
    return Array(height).fill(null).map(()=>Array(width).fill(defaultValue))
}

function formatEl(el, defaultValue='x'){
    return (el===null || el<0 || el===false) ? defaultValue : el;
}
export function printArray(arr, defaultValue='.', lineNumber=false){
    let l = 0;
    const text = arr.map(row => {
        const n = lineNumber ? (''+l).padStart(2, '0')+' ' : '';
        ++l;
        const line = row.map(el => {
            return formatEl(el, defaultValue);
        }).join('')
        return n + line;
    }).join('\n')
    log.info(text);
}

export function printDoubleArray(arr, arr2, defaultValue='.'){
    const text = arr.map((row, i) => {
        const line = row.map((el, j) => {
            return '' + formatEl(el, defaultValue) + 
            '(' + formatEl(arr2[i][j], defaultValue) + ')'
            ;
        }).join('')
        return line;
    }).join('\n')
    log.info(text);
}

export function cloneObject(a){
    return Object.assign({}, a);
}