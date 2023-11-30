// import DomainRequest from "./domain-request";
import aesjs from "aes-js"

function decodeAES(encodeStr) {

  //ECB
  //加解密用key
  let key = [
    0x50, 0x96, 0x22, 0x66, 0x70, 0x79, 0x60, 0x66, 0x31, 0x70, 0x68, 0x80,
    0x33, 0x18, 0x28, 0x66,
  ]
  //解密
  const aesEcb = new aesjs.ModeOfOperation.ecb(key)

  const encryptedBytes = aesjs.utils.hex.toBytes(encodeStr)

  const decryptedBytes = aesEcb.decrypt(encryptedBytes)

  let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)


  //因ECB規定資料長度必須為16 bytes的倍數, 後端python會進行補足bytes的動作, 少15bytes最後面補上15個15, 少14bytes補14個14依此類推, 如下例子
  //decryptedBytes: 123,34,104,111,115,116,34,58,32,34,104,116,116,112,115,58,47,47,97,112,105,46,53,108,46,108,97,110,100,105,110,103,109,97,107,108,106,100,104,46,120,121,122,34,44,32,34,117,112,108,111,97,100,34,58,32,34,104,116,116,112,115,58,47,47,97,112,105,46,53,108,46,108,97,110,100,105,110,103,109,97,107,108,106,100,104,46,120,121,122,47,97,112,105,63,109,101,116,104,111,100,61,117,112,108,111,97,100,34,44,32,34,100,111,119,110,108,111,97,100,34,58,32,34,104,116,116,112,115,58,47,47,102,105,108,101,46,53,108,46,108,97,110,100,105,110,103,109,97,107,108,106,100,104,46,120,121,122,47,34,44,32,34,112,111,114,116,97,108,80,67,34,58,32,34,104,116,116,112,115,58,47,47,108,105,118,101,46,53,108,46,108,97,110,100,105,110,103,109,97,107,108,106,100,104,46,120,121,122,34,44,32,34,112,111,114,116,97,108,77,34,58,32,34,104,116,116,112,115,58,47,47,109,46,53,108,46,108,97,110,100,105,110,103,109,97,107,108,106,100,104,46,120,121,122,34,125,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15
  //utf8解出來的會變成下面這樣
  //"{\"host\": \"https://api.5l.landingmakljdh.xyz\", \"upload\": \"https://api.5l.landingmakljdh.xyz/api?method=upload\", \"download\": \"https://file.5l.landingmakljdh.xyz/\", \"portalPC\": \"https://live.5l.landingmakljdh.xyz\", \"portalM\": \"https://m.5l.landingmakljdh.xyz\"}\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f\u000f"
  //導致不能parse成JSON, 只能用 lastIndexOf '}' 來切字串, 這樣是最穩的方式
  const lastIndex = decryptedText.lastIndexOf("}") //取得最後一個 "}" 的索引位置

  const envConfig = JSON.parse(decryptedText.substring(0, lastIndex + 1))

  return envConfig
}

function getDomain(url) {
  const stream = weex.requireModule("stream")

  return new Promise((resolve, reject) => {
    stream.fetch(
      {
        method: "GET",
        url,
        timeout: 5000,
      },
      (r) => {
        if (r.data && r.status == 200) {
          resolve(r.data)
        } else {
          reject("")
        }
      }
    )
  })
}

async function remoteConfig(rcurl1, rcurl2, rcurl3) {
  try {
    const resp1 = await getDomain(rcurl1)
    if (resp1 !== "") {
      return resp1
    } else {
      const resp2 = await getDomain(rcurl2)
      if (resp2 !== "") {
        return resp2
      } else {
        const resp3 = await getDomain(rcurl3)
        return resp3
      }
    }
  } catch (e) {
  }

  return ""
}

const handleConfig = async (m) => {
  const encryptedHex = await remoteConfig(
    m.rcurl1 + "?avoidCache=" + new Date().getTime(),
    m.rcurl2 + "?avoidCache=" + new Date().getTime(),
    m.rcurl3 + "?avoidCache=" + new Date().getTime()
  )


  const rmConf = decodeAES(encryptedHex)

  return rmConf
}

export default handleConfig
