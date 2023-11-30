import { isString } from "lodash"

// 取得雲端gls档案，将它重新转成图片base64格式内容 (APP使用)
export const reductionGlsToBase64ForAPP = function (glsFile, resetLength) {

  const stream = weex.requireModule("stream")

  return new Promise((resolve, reject) => {
    stream.fetch(
      {
        method: "GET",
        url: glsFile,
      },
      (res) => {
        if (res.status === 200) {

          const txtContent = res.data

          if (txtContent) {
            // 重组base64字串
            let fileExtension = ""

            const moveStrToStart = txtContent.substring(
              txtContent.length - resetLength,
              txtContent.length
            )


            // 判断是否是GIF文件
            const first3Chars = moveStrToStart.substring(0, 3)
            if (first3Chars === "R0l") {
              fileExtension = "gif"
            } else {
              fileExtension = "png"
            }

            const defaultStr = `data:image/${fileExtension};base64,`
            const sliceStr = txtContent.slice(0, -resetLength)


            resolve(defaultStr + moveStrToStart + sliceStr)
          }
        } else {
          reject(`圖片请求失败`)
        }
      }
    )
  })
}

// - uni-app 可能需要多處理一個步驟，但 weex 不用
// export const previewImgForAPP = function (base64String) {

//   return new Promise((resolve, reject) => {
//     base64ToPath(base64String)
//       .then((path) => {
//         resolve(path)
//       })
//       .catch((error) => {
//         reject("图片出错", error)
//       })
//   })
// }

export const base64stringReset = function (str, resetLength) {
  // 将前面面特定数量(resetLength)的字串移除，并添加至最後面

  if (isString(str) && str.length <= resetLength) return str

  // 取得字串的前 X 個字符
  const leadingStr = str.slice(0, resetLength)

  // 取得字串的其餘部分（去掉前 X 個字符的部分）
  const restStr = str.slice(resetLength)

  // 將前 X 個字符移到最後方並返回結果
  const resultString = `${restStr}${leadingStr}`
  return resultString
}

export default {
  reductionGlsToBase64ForAPP,
  base64stringReset,
}
