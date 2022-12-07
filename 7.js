import { readFile, stop, isNumeric } from './io.js';
import log from 'loglevel';

const DEBUG = false;
const DAY = 7;
const LIMIT = 30;

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`)

let groups = [];
let cmds = [];
let total = 0;
let fs = { name: '/', dirs:[], files:[], size:0 };
let i = 0;
let lastCmd = -1;
let currentCmd = null;

// Limit for test
if (DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

lines.map(line => {
    if (!line) return;
    let values = line.split(' ')
    let group = {
        line,
        isCommand: (values[0]=='$'),
        commands: values.slice(1), // remove $
        outputs: []
    };
    log.debug(line)
    if (group.isCommand) {
        currentCmd = {
            group
        }
        cmds.push(currentCmd)
        lastCmd=i;
    }else{
        currentCmd.group.outputs.push(values)
    }

    //total += process(group, line)
    groups.push(group)
    ++i;
})

if (DEBUG && LIMIT>0){
    cmds=cmds.slice(0, 2)
}

let results=[];
let dir = fs;
cmds.map(cmd => {
    dir = locateDir(cmd.group.commands, dir);
    parseOutputs(cmd.group.outputs, dir)
})
log.info('fs', fs.dirs)

let path='/';
let size=computeSize(fs.dirs[0], 0, path)
log.info('size', size)

function computeSize(dir, size, path){
    dir.filesSize = dir.files.reduce((v, f) => v + f.size ,0)
    if (dir.filesSize>0)
        console.log(' %s ==> %d FILES size:', path, dir.files.length, dir.filesSize)

    let dirSize = 0;
    dir.dirs.map(subdir => {
        dirSize+=computeSize(subdir, 0, path+subdir.name+'/');
    })
    dir.dirSize=dirSize;
    if (dirSize>0)
        console.log(' %s --> DIR size:', path, dirSize)

    dir.size = dir.filesSize + dir.dirSize;
    if (dir.size>0 && dir.size<100000){
        results.push(dir);
        total+=dir.size
        console.log('### %s dirsize: %s', path, dir.size)
    }

    size += dir.size;
    if (size>0)
        console.log(' %s --> TOTAL size:', path, size)
    return size;
}

function locateDir(commands, dir){
    let op = commands[0];
    let value = commands[1];
    log.debug('>', op, value)
    if (op=='cd'){
        if (value=='..'){
            return dir.parent;
        }
        
        let thisDir = {
            type: 'dir',
            name: value,
            dirs: [],
            files: [],
            parent: dir
        }
        dir.dirs = dir.dirs || [];
        dir.dirs.push(thisDir)
        dir = thisDir; // cd
    }else if (op='ls'){
        dir.files = dir.files || [];
    }else{
        console.error('Unknown command', op, value)
    }
    return dir;
}
function parseOutputs(outputs, dir){
    outputs.map(output => {
        dir = parseOutput(output, dir)
        log.debug('dir:', dir)
    })
    log.debug('end outputs')
}
function parseOutput(commands, dir){
    let op = commands[0];
    let value = commands[1];
    log.debug('output:', op, value)
    if (op=='dir'){
        //dir vhjbjr
        let thisDir = {
            type: 'dir',
            name: value,
            dirs: [],
            files: [],
            parent: dir
        }
        dir.dirs = dir.dirs || [];
        dir.dirs.push(thisDir)
    }else if (isNumeric(op)){
        //110209 grbwdwsm.znn
        dir.files = dir.files || [];
        dir.files.push({
            type: 'file',
            name: value,
            size: +op
        })
    }
    return dir;
}

log.info('total = ', total);
