const bc = {}
bc.postMessage = function(name,data) {
    const Steve = new BroadcastChannel(name)
    Steve.postMessage(data)
}

bc.onmessage = function(name,method) {
    const Steve = new BroadcastChannel(name)
    Steve.onmessage = function (event) {
        method(event)
    }
}

export default bc