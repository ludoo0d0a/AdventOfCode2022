// source: https://gist.github.com/MathisHammel/0e0e55fcf682086af7d3cd2f66d4a31e

import fs from 'fs';
import fetch from 'node-fetch';
import log from 'loglevel';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

//
// Usage:
// init : 
//  auto: node init.js init 
//  day:  node init.js init -day 6 
//
// submit : 
//  auto: node init.js submit 
//  day:  node init.js submit -day 6 
//

const AOC_COOKIE='53616c7465645f5f9179cd45826372bee62318a5012ac23473e28f3d0e54abab2b0e274baf19f9c449e407fb34e9dbb463f9ef738685a99bfec5a9c4d33b9fd5';
const YEAR = '2022' || ((new Date().getFullYear()-2000)) // this year
// const DAY = argv.day || (new Date().getDate()) //today?
// const LEVEL = argv.level || 1

const argv = yargs(hideBin(process.argv))
   .command('init', 'Init day', (yargs) => {
    return yargs
  }, (argv) => {
    if (argv.verbose) console.info(`init on day: ${argv.day}`)
    getInput(argv.day)
    getExample(argv.day)
    getCode(argv.day)
    console.info(`Day ${argv.day} is prepared !`)
  })
  .command('submit [answer]', 'Submit answer', (yargs) => {
    return yargs
      .positional('answer', {
        describe: 'Answer to submit'
      })
  }, (argv) => {
    if (argv.verbose) console.info(`Submit answer ${argv.answer} on day: ${argv.day}`)
    submitAnswer(argv.day, argv.level, argv.answer)
    console.info(`Answer submitted!`)
  })
  .option('day', {
    alias: 'd',
    description: 'Tell the present day',
    type: 'number',
    default: (new Date().getDate()) 
  })
  .option('level', {
    alias: 'l',
    description: 'Tell the level (1 or 2)',
    type: 'number',
    default: 1
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: true
  })
  .help()
  .alias('help', 'h')
  .parse();

  async function getInput(day){
    const req = await fetch(`https://adventofcode.com/${YEAR}/day/${day}/input`, {
            method: 'get',
            headers: {'cookie': `session=${AOC_COOKIE}` }
    });
    fs.writeFileSync(`data/${day}.txt`, await req.text())   
}    

async function getCode(day){
  const file = `${day}.js`;
  fs.copyFileSync('_sample.js', file) 
  // 
  fs.readFile(file, 'utf-8', (err, contents) => {
    const replaced = contents.replace('const DAY = 0;', `const DAY = ${day};`);
    fs.writeFile(file, replaced, 'utf-8', function (err) {
      if (err) {
        console.log(err);
      }else{
        console.info(`Code prepared: ${file}`);
      }
    });
  })  
}    


async function getExample(day, offset){
    if (!offset) offset=0;
    const req = await fetch(`https://adventofcode.com/${YEAR}/day/${day}`, {
            method: 'get',
            headers: {'cookie': `session=${AOC_COOKIE}` }
    });
    const text = await req.text();
    const sample = text.split('<pre><code>')[offset+1].split('</code></pre>')[0]
    fs.writeFileSync(`samples/${day}.txt`, sample)   
}

async function submitAnswer(day, level, answer){
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
    const text = await response.text();

    if (text.contains('You gave an answer too recently')){
        log.error('VERDICT : TOO MANY REQUESTS')
    }else if (text.contains('not the right answer')){
        if (text.contains('too low')){
            log.warn('VERDICT : WRONG (TOO LOW)')
        } else if (text.contains('too high')){
            log.warn('VERDICT : WRONG (TOO HIGH)')
        } else{
            log.error('VERDICT : WRONG (UNKNOWN)')
        }
    } else if (text.contains('seem to be solving the right level.')) {
        log.error('VERDICT : INVALID LEVEL')
    }else {
        log.info('VERDICT : OK !')
    }
}
