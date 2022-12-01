import { readFile, log } from './io.js';

var lines = readFile('1.txt')
var groups = [];
var group = {weight:0};
groups.push(group)
lines.map(line => {
    if (!line){
        group = {weight:0};
        groups.push(group)
    }
    group.weight += (+line);
})

groups.sort((a,b)=> {
    return (a && b && a.weight < b.weight) ? 1 : -1;
})

log("Heaviest elf carry ", groups[0].weight);
log("Opposite elf carry ", groups[groups.length -1].weight);

log("Top 3 ", groups[0].weight+groups[1].weight+groups[2].weight);