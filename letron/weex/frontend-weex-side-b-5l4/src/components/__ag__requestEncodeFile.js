import util from "./util.js"
let stream = undefined
function AgRequestEncodeFile(url, data = {}, header = {}) {
  if (!stream) {
    stream = weex.requireModule("stream")
  }
  if (!header["content-type"]) {
    header["content-type"] =
      "multipart/form-data; boundary=----WebKitFormBoundarySX3SciE84x6MEWAC"
  }

  this.state = 0
  let t = this
  // let s =`file=${data.file}`
  let s =
    "------WebKitFormBoundarySX3SciE84x6MEWAC" +
    "\r\n" +
    'Content-Disposition:form-data;name="file";filename="' +
    data.filename +
    '"' +
    "\r\n" +
    // "Content-Type:image/jpeg" +
    // "\r\n" +
    // 'Content-Disposition: form-data; name="file"\r\n'+
    "Content-Type: text/plain\r\n" +
    // "Content-Type: text/binary\r\n" +
    "\r\n" +
    "\r\n" +
    data.file +
    "\r\n" +
    "------WebKitFormBoundarySX3SciE84x6MEWAC--"


  let token = util.getItem("token")
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
    header.token = token
    stream.fetch(
      {
        method: "POST",
        type: "json",
        url,
        headers: header,
        body: s,
        timeout: 30000,
      },
      (r) => {



        if (
          r.data &&
          (r.data.message == "该账号已在别的设备登录" ||
            r.data.message == "该账号已冻结")
        ) {
          util.message(r.data.message)
          util.clearUsers()
          reject(r.data)
          return
        }
        if (r.data && r.data.success) {
          t.state = 1
          resolve(r.data)
        } else {
          t.state = 2
          reject(r.data)
        }
      }
    )
  })
}

export default AgRequestEncodeFile
