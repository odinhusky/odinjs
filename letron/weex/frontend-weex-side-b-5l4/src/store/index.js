import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
Vue.use(Vuex)

const state = {}
const getters = {}
const actions = {}
const mutations = {}
const store = {
	state,
	getters,
	actions,
	mutations
}
user(store)
export default new Vuex.Store(store)
