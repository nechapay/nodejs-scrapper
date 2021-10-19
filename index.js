import chalk from 'chalk'

import { PuppeteerHandler } from './helpers/puppeteer'
import queue from 'async/queue'
// import saveData from "./handlers/saver"
import saveToExcel from "./handlers/excel"


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
    done()
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
      console.log(`${res[i][j].region}&${res[i][j].title}&${res[i][j].score}`)
    }
  }

  // await saveData(data)
  data.sort(function (a, b) {
    return b.score - a.score
  })
  await saveToExcel(data, __dirname)
  p.closeBrowser()
  process.exit()
})

;(function main() {
  for (let i = 0; i < pages; i++) {
    taskQueue.push(
      () => listContestants(`${SITE}${i + 1}`),
      err => {
        if (err) {
          console.log(err);
          throw new Error(`Error getting data from page# ${SITE}${i + 1}`)
        }
        console.log(chalk.green.bold(`Completed getting data from page`), chalk.blue(`${SITE}${i + 1}\n`))
      }
    )
  }
})()

async function listContestants(url) {
  try {
    const data = await p.getDataFromPage(url)
    res.push(data)
  } catch (err) {
    console.log(chalk.red('An error has occurred \n'))
    console.log(err)
  }
}

