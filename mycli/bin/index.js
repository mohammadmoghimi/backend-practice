#!/usr/bin/env node


const yargs = require("yargs")
const chalk = require('chalk');  
const boxen = require('boxen');

const options = yargs
.usage(usage)
.option("l", {alias:"language", describe: "Translate to language", type: "string", demandOption: false })
.option("s", {alias:"sentence", describe: "Sentence to be translated", type: "string", demandOption: false })
.help(true)
.argv;

const usage = chalk.keyword('violet')("\nUsage: mycli -l <language>  -s <sentence> \n"
+ boxen(chalk.green("\n" + "Translates a sentence to specific language" + "\n"), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");

translate(sentence, {to: language}).then(res => {console.log("\n" + boxen(chalk.green("\n" + res.text + "\n"
), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");}).catch(err => {                            
     console.error(err);  
 });