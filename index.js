import chalk from 'chalk'

import { PuppeteerHandler } from './helpers/puppeteer'
import queue from 'async/queue'
import saveData from "./handlers/saver"


const SITE = 'https://shkolagoda.menobr.ru/competition/stage7_teamlead/regions/'
const pages = 79
const concurrency = 10
const startTime = new Date()
let res = []

export const p = new PuppeteerHandler()
export const taskQueue = queue(async (task, done) => {
  try {
    await task()
    console.log(chalk.bold.magenta('Task completed, tasks left: ' + taskQueue.length() + '\n'))
    done();
  } catch (err) {
    throw err
  }
}, concurrency)

taskQueue.drain(async function() {
  const endTime = new Date()
  console.log(chalk.green.bold(`All items completed [${(endTime - startTime) / 1000}s]\n`))
  let data = []
  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < res[i].length; j++) {
      data.push(res[i][j])
      console.log(`${res[i][j].region}&&${res[i][j].title}&&${res[i][j].score}`)
    }
  }
  await saveData(data)
  p.closeBrowser()
  process.exit()
});

(function main() {
  for (let i = 0; i < pages; i++) {
    taskQueue.push(
      () => listContestants(`${SITE}${i + 1}`),
      err => {
        if (err) {
          console.log(err);
          throw new Error(`Error getting data from page# ${SITE}${i + 1}`)
        }
        console.log(chalk.green.bold(`Completed getting data from page\n`))
      }
    )
  }
})();

async function listContestants(url) {
  try {
    const data = await p.getDataFromPage(url)
    res.push(data)
    console.log(chalk.green(`data ${data}`))
  } catch (err) {
    console.log(chalk.red('An error has occurred \n'))
    console.log(err)
  }
}

