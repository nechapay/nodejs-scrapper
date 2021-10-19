import xlsx from 'exceljs'
import path from "path"
import chalk from "chalk"

export const saveToExcel = async (data, dir) => {
  const wb = new xlsx.Workbook()
  let date = new Date()
  const fileName = path.join(dir, 'data', `голосование_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}_${getRandomName()}.xlsx`)
  const ws = wb.addWorksheet('poll')
  ws.state = 'visible'
  let row = 1
  for (const item of data) {
    ws.getCell(`A${row}`).value = item.region
    ws.getCell(`B${row}`).value = item.title
    ws.getCell(`C${row}`).value = item.score
    row++
  }
  const colA = ws.getColumn('A')
  colA.width = 40
  const colB = ws.getColumn('B')
  colB.width = 80
  colB.alignment = { wrapText: true }
  await saveWorkbook(wb, fileName)
}

async function saveWorkbook (wb, fileName) {
  await wb.xlsx.writeFile(fileName)
  console.log(chalk.blue('File was saved successfully: ') + chalk.blue.bold(fileName) + '\n')
}

function getRandomName() {
  const str = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out =''
  for (let i = 0; i < 6; i++) {
    out += str.split('')[getRandomInt(0, str.length - 1)]
  }
  return out
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default saveToExcel

