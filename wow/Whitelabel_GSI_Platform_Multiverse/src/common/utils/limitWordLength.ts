export const limitWordLength = (word: string, limitNum = 14) => {
  const judgement = word && word.length > limitNum
  return judgement ? word.slice(0, limitNum) + "..." : word
}

export default limitWordLength
