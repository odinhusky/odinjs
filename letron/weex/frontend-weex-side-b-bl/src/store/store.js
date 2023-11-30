import util from '../components/util.js'
import require from '../components/__ag__requireModule__.js'
let agstore = require.agstore
const store = {}

store.setStore = (key,data) => {
    let d = util.toString(data)
    if (agstore) {
        agstore.setItem(key,d) 
    }
}

store.getStore = (key) => {
    if (agstore) {
        let val = agstore.getItem(key) 
        if (val) {
            return util.json(val)
        }
        return {}
    }
}

export default store