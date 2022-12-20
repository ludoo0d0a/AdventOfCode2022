import { readFile, stop, cloneObject } from './io.js';
import log from 'loglevel';

const DEBUG = true;
const SAMPLE = true;
const DAY = 19;
const LIMIT = 5;
const LIMIT_blueprints = 1;
const MINUTES = DEBUG ? 7 : 24; //in 24 minutes
const COLUMN = 15
let MINUTE_START = 1; 

// response= 
// blueprint1 = 9
// blueprint2 = 12
let blueprints=[]
let b={max:0}

log.setDefaultLevel(DEBUG?'debug':'info')
log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`, SAMPLE);
var total = 0;

// Limit for test
if (!SAMPLE && DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

parseLines();
if (DEBUG && LIMIT_blueprints>0){
    blueprints=blueprints.slice(0, LIMIT_blueprints)
}

const types = ['ore', 'obsidian','clay','geode']
const root = {
    has: {
        ore:0,
        obsidian:0,
        clay:0,
        geode:0  // MAX
    },
    robots: {
        ore:1,
        obsidian:0,
        clay:0,
        geode:0
    },
    minute:MINUTE_START,
    actions: []
};
blueprints.map((b,i) => {
    const _root = cloneObject(root)
    _root.bp = i; // current blueprint
    log.info('## Blueprint %d', i+1)
    //tagNode(_root, 'start')
    b.max = processMinute(_root, MINUTE_START)
    log.info('## Total blueprint %d : %d', i+1, b.max)
})

printTotal();

function pad(txt, char=' '){
    return txt.padEnd(COLUMN, char)
}
function logHistory(_node){
    const lines = _node.actions.map(act=>{
        const {node,action} = act;
        return {
            action,
            minute: node.minute,
            has: node.has,
            robots: node.robots
        }
    })
    const lineSeparator = pad('>>')+lines.map(line =>  pad(' ---')).join('|')
    log.debug(lineSeparator)
    const lineMinutes = pad('minute:')+lines.map(line =>  pad(' '+line.minute) ).join('|')
    log.debug(lineMinutes)
    const lineAction = pad('action:')+lines.map(line =>  pad(line.action) ).join('|')
    log.debug(lineAction)

    types.map(type=>{
        const lineHas = pad('-'+type) + lines.map(line => pad(formatType(line.has, type), '.') ).join('|')
        log.debug(lineHas)
    })
    types.map(type=>{
        const lineRobots = pad('robot '+type)+ lines.map(line => pad(formatType(line.robots, type), '.') ).join('|')
        log.debug(lineRobots)
    })

    const lineSeparatorEnd = pad('<<')+lines.map(line => {
        return pad(' ---')
    }).join('|')
    log.debug(lineSeparatorEnd)
    log.debug(' ')
}

function formatHas(node){
    return formatTypes(node.has);
}
function formatRobots(node){
    return formatTypes(node.robots);
}
function formatType(r, type){
    if (r[type]>0){
        return `${r[type]}`
    }else{
        return '';
    }
}
function formatTypes(r){
    const s=[];
    for (const type in r) {
        if (r[type]>0){
            s.push(`${r[type]} ${type}`)
        }
    }
    let msg = '(nothing)'
    if (s.length>0){
        msg = s.join(',')
    }
    return msg;
}
function logTypes(txt, r){
    const s = txt + ' ' + formatTypes(r);
    log.debug(s);
}
function logHas(node){
    logTypes('has', node.has);
}
function logRobots(node){
    logTypes('robots', node.robots);
}

function processMinute(node, minute){
    log.info('Minute %d @%s', minute, node.path);
    node.minute=minute;
    //get production
    produce(node)
    //compute possible solutions (included wait)
    node.solutions = findSolutions(node)

    logHas(node);
    logRobots(node);
    logHistory(node);

    ++minute;
    // remove wait of the count
    log.info('  %d solutions with buy something', node.solutions.length-1);
    if (minute<=MINUTES){
        const len = node.solutions.length;
        const geodes = node.solutions.map((solution,i) => {
            log.debug(`  >solution(${i+1}/${len}): ${solution.action}`)
            return processMinute(solution, minute)
        })
        const max = geodes.sort()[0];
        if (max>0){
            log.info('%d geodes found', max)
        }
        // return max geodes of solutions
        return max;
    }else{
        log.info('STOP');
        if (node.has.geode>0){
            log.info('%d geodes found', node.has.geode)
        }
        return node.has.geode;
    }
}

//robots produce types..
function produce(node){
    for (const type in node.robots) {
        const count = node.robots[type]
        node.has[type]+=count;
        if (count>0){
            log.debug(`  ${count} robots produces ${type} : now = ${node.has[type]} ${type}`)
        }
    }
}

function tagNode(node, action){
    node.action = action;
    if (!node.path){
        node.path = action;
    }else{
        node.path += ' '+action;
    }
    // set actions
    node.actions=[...node.actions]
    node.actions.push({
        node: cloneObject(node),
        action,
    });

}

function findSolutions(node){
    const waitNode = cloneObject(node);
    tagNode(waitNode, 'wait');
    //thisNode.path = thisNode.path+'-w';
    //const solutions = [thisNode]; //include wait (pay nothing, just wait next minute)
    const solutions = []; //include wait (pay nothing, just wait next minute)
    const b = blueprints[node.bp]
    b.items.map(item => {
        let canBuy = true;
        for (const type in item.costs) {
            if (node.has[type] < item.costs[type]){
                canBuy=false; // once = stop
                break;
            }
            /*
            else{
                log.debug(`  Can partially buy robot ${item.type} for ${item.costs[type]} ${type} `);
            }*/
        }

        if (canBuy){
            //add this product to solution
            const _node = cloneObject(node);
            _node.addType = item.type
            //pay for it
            let price = '';
            for (const type in item.costs) {
                _node.has[type]-=item.costs[type]; 
                price += `+${item.costs[type]} ${type} `
            }
            log.debug(`  __ can buy robot ${item.type} for ${price}`)
            ++_node.robots[item.type]; //get it
            solutions.push( _node );
        }    

    })
    const len = solutions.length
    solutions.map((sol,i) => {
        tagNode(sol, `+${sol.addType} ${i+1}/${len}`);
    })

    solutions.push(waitNode); // in the end
    return solutions;
}

function parseLines(){
    lines.map(line => {
        if (!line) return;
        line=line.trim()
        let values = line.split(' ')
        if (values[0]=='Blueprint'){
            b = {
                max:0, 
                items: [],
                index: +(values[1].replace(':', ''))
            }
            blueprints.push(b)
        }else{
            process(b, line)
        }
    })
    log.info('%d blueprints', blueprints.length)
}


function process(b, line){
    let values = line.replace('.','').split(' ')
    //Each ore robot costs 4 ore.
    //Each obsidian robot costs 3 ore and 14 clay.

    let item={
        type: values[1] //ore,obsidian,clay,geode
    };

    values = values.slice(4)
    // 4 ore.
    item.costs={}
    item.costs[values[1]] = +(values[0]);

    if (values.length>2){
        // 3 ore and 14 clay.
        item.costs[values[4]] = +(values[3])
        //ctrl = `Each ${b.type} robot costs ${b.costs[0].count} ${b.costs[0].type} and ${b.costs[1].count} ${b.costs[1].type}.`;
    }else{
        //ctrl = `Each ${b.type} robot costs ${b.costs[0].count} ${b.costs[0].type}.`;
    }
    /*if (line!==ctrl){
        log.info('>', line)
        log.info('>', ctrl)
        log.error('Not the same as expected')
    }*/
    b.items.push(item)
}


function printTotal(){
    // sum 
    // the largest number of geodes you could open in 24 minutes is 9
    blueprints.map((b,i)=>{
        total += (i+1)*b.max;
    })

    log.info('total = ', total);
}