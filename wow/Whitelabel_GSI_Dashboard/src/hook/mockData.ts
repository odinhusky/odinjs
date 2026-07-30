import { TableColumn } from "src/interface/common"
type RecordType = { [key: string]: any }
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  return Array.from({ length }, () => characters.charAt(getRandomInt(0, characters.length - 1))).join("")
}

function getRandomDecimal(min: number, max: number, precision = 2): string {
  return (Math.random() * (max - min) + min).toFixed(precision)
}

function getMockDataByFieldType(field: string | string[]) {
  if (field.includes("count") || field.includes("number") || field.includes("id")) {
    return getRandomInt(1, 100).toString()
  } else if (field.includes("amount")) {
    return getRandomDecimal(1, 1000)
  } else if (field.includes("switch") || field.includes("active") || field.includes("enabled")) {
    return getRandomInt(0, 1) === 1
  } else if (field.includes("date") || field.includes("time")) {
    return new Date().toISOString()
  }
  return getRandomString(10)
}
function generateMockData(recordCount: number, tableColumns: TableColumn[]): RecordType[] {
  const mockData: RecordType[] = []

  for (let i = 1; i <= recordCount; i++) {
    const record: RecordType = {}
    tableColumns.forEach((column) => {
      record[column.field] = getMockDataByFieldType(column.field)
    })
    mockData.push(record)
  }

  return mockData
}
export { generateMockData }
