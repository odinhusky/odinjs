export function useForm() {
  function convertValuesToNumber(obj: any): any {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        obj[key] = convertValuesToNumber(obj[key])
      } else {
        obj[key] = parseFloat(obj[key])
      }
    }
    return obj
  }

  return {
    convertValuesToNumber
  }
}
