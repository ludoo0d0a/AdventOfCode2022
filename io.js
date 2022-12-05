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

export function readFile(name){
    var content = fs.readFileSync('data/'+name, 'utf8');
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
