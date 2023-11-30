let stream = undefined
function DomainRequest(url) {
  if (!stream) {
    stream = weex.requireModule("stream")
  }
  
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
    stream.fetch(
      {
        method: "GET",
        url,
        timeout: 5000,
      },
      (r) => {
        if (r.data && r.status == 200) {
          console.log('@@ r', r)
          resolve(r.data)
        } else {
          reject('')
        }
      }
    )
  })
}

export default DomainRequest
