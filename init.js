// source: https://gist.github.com/MathisHammel/0e0e55fcf682086af7d3cd2f66d4a31e

import fetch from 'node-fetch';
import log from 'loglevel';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'


const argv = yargs(hideBin(process.argv))
  .command('init', 'Init day', {
  })
  .command('submit', 'Submit answer', {
  })
  .option('day', {
    alias: 'd',
    description: 'Tell the present day',
    type: 'number'
  })
  .option('level', {
    alias: 'l',
    description: 'Tell the level (1 or 2)',
    type: 'number'
  })
  .help()
  .alias('help', 'h').argv;

const AOC_COOKIE='';
const YEAR = '2022' || ((new Date().getFullYear()-2000)) // this year
const DAY = argv.day || (new Date().getDate()) //today?
const LEVEL = argv.level || 1

if (argv.init){
    get_input(DAY)
}else if (argv.submit){
    //# Your code here
    ans = 123456
    submit(DAY, LEVEL, ans)
}

async function getInput(day){
    const req = await fetch(`https://adventofcode.com/${YEAR}/day/${day}/input`, {
            method: 'get',
            headers: {'cookie': `session=${AOC_COOKIE}` }
    });
    fs.writeFileSync(`data/${DAY}.txt`, req.text)   
}    

async function getExample(day,offset){
    if (!offset) offset=0;
    const req = await fetch(`https://adventofcode.com/${YEAR}/day/${day}`, {
            method: 'get',
            headers: {'cookie': `session=${AOC_COOKIE}` }
    });
    const text = req.text.split('<pre><code>')[offset+1].split('</code></pre>')[0]
    fs.writeFileSync(`samples/${DAY}.txt`, text)   
}

async function submit(day, level, answer){
    log.info('You are about to submit the follwing answer:\n>>>>>>>>>>>>>>>>> {answer}\nPress enter to continue or Ctrl+C to abort.')
    const data = {
      'level': ''+level,
      'answer': ''+answer
    }

    const response = await fetch(`https://adventofcode.com/${YEAR}/day/${day}`, {
            method: 'post',
            body: data,
            headers: {'cookie': `session=${AOC_COOKIE}` }
    });

    if (response.text.contains('You gave an answer too recently')){
        log.error('VERDICT : TOO MANY REQUESTS')
    }else if (response.text.contains('not the right answer')){
        if (response.text.contains('too low')){
            log.warn('VERDICT : WRONG (TOO LOW)')
        } else if (response.text.contains('too high')){
            log.warn('VERDICT : WRONG (TOO HIGH)')
        } else{
            log.error('VERDICT : WRONG (UNKNOWN)')
        }
    } else if (response.text.contains('seem to be solving the right level.')) {
        log.error('VERDICT : INVALID LEVEL')
    }else {
        log.info('VERDICT : OK !')
    }
}
