import { readFile, stop, cloneObject } from './io.js';
import log from 'loglevel';
import { partitionSelectDependencies } from 'mathjs/lib/entry/dependenciesAny.generated.js';

const DEBUG = true;
const SAMPLE = true;
const DAY = 19;
const LIMIT = 5;
const MINUTES = DEBUG ? 3 : 24; //in 24 minutes
let minute = 1; 

// response= 
// blueprint1 = 9
// blueprint2 = 12
const blueprints=[]
let b={max:0}

log.setDefaultLevel(DEBUG?'debug':'info')

log.info(`Day ${DAY} - star 1`)

var lines = readFile(`${DAY}.txt`, SAMPLE)

var total = 0;
//const rows = lines.length
//const cols = lines[0].length
//const grid = matrixArray(cols, rows, false)
const tree = [];

// Limit for test
if (!SAMPLE && DEBUG && LIMIT>0){
    lines=lines.slice(0, LIMIT)
}

parseLines();
loopMinutes({
    path: 'a',
    has: {
        ore:0,
        obsidian:0,
        clay:0,
        geode:0
    },
    robots: {
        ore:1,
        obsidian:0,
        clay:0,
        geode:0
    }
}, 1)
printTotal();

function formatHas(node){
    formatTypes('has', node.has);
}
function formatRobots(node){
    formatTypes('robots', node.robots);
}
function formatTypes(txt, r){
    const s=[];
    for (const type in r) {
        if (r[type]>0){
            s.push(`${r[type]} ${type}`)
        }
    }
    if (s.length>0){
        const msg = '  -'+txt+': '+s.join(',')
        log.debug(msg)
    }
}

function loopMinutes(prevNode, minute){
    log.info('Minute %d', minute);
    //formatHas(prevNode);
    //formatRobots(prevNode);
    const has = cloneObject(prevNode.has)
    const robots = cloneObject(prevNode.robots)
    const node = {
        minute,
        path: prevNode.path+'x',
        /*optional*/ prevNode,
        has,
        robots
    }
    
    //get production
    produce(node)

    //compute possible solutions (included wait)
    node.solutions = evalBlueprints(node)

    formatHas(node);
    formatRobots(node);

    tree.push(node)
    ++minute;
    // remove wait of the count
    log.info('  %d solutions with buy something', node.solutions.length-1);
    if (minute<=MINUTES){
        const len = node.solutions.length;
        node.solutions.map((solution,i) => {
            if (solution.action){
                log.debug(`  >solution(${i+1}/${len}): ${solution.action}`)
            }else{
                log.debug(`  >solution(${i+1}/${len}): WAIT NEXT TURN`)
            }
            loopMinutes(solution, minute)
        })
    }else{
        log.info('STOP');
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

function evalBlueprints(node){
    const thisNode=cloneObject(node);
    //thisNode.path = thisNode.path+'-w';
    //const solutions = [thisNode]; //include wait (pay nothing, just wait next minute)
    const solutions = []; //include wait (pay nothing, just wait next minute)
    blueprints.map((b,i)=>{
        return b.items.map(item => {
            for (const type in item.costs) {
                if (node.has[type] >= item.costs[type]){
                    //add this product to solution
                    log.debug(`  [${thisNode.path}] can buy ${item.type} for ${item.costs[type]} ${type}`)
                    const _node = cloneObject(node);
                    _node.action = `buy 1 ${item.type}`;
                    _node.path += _node.action;
                    _node.has[type]-=item.costs[type]; //pay for it
                    ++_node.robots[item.type]; //get it
                    solutions.push( _node );
                }
            }
        })
    })
    solutions.push(thisNode); // in the end
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
    blueprints.map((b,i)=>{
        total += (i+1)*b.max;
    })

    log.info('total = ', total);
}