
const state = {}
const actions = {}
const mutations = {}
const getters = {}
state.user = {}

function user(store){
    Object.assign(store.state, state)
    Object.assign(store.actions, actions)
    Object.assign(store.mutations, mutations)
	Object.assign(store.getters, getters)
}

export default user
