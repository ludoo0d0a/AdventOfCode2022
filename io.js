import fs from 'fs';
import { loadavg } from 'os';

export function loga(m, ...args){
    process.stdout.write(m, args);
}
export function log(m, ...args){
    console.log(m, args);
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