import xlsx from 'exceljs'
import path from "path"
import chalk from "chalk"

export const saveToExcel = async (data, dir) => {
  const wb = new xlsx.Workbook()
  const fileName = path.join(dir, 'data', `голосование-${getName()}.xlsx`)
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

function getName() {
  const date = new Date()
  return `${formatDate(date.getDate())}${formatDate(date.getMonth() + 1)}${formatDate(date.getFullYear())}-${formatDate(date.getHours())}${formatDate(date.getMinutes())}${formatDate(date.getSeconds())}`
}

function formatDate(item) {
  return parseInt(item) < 10 ? '0' + item : item
}

export default saveToExcel

