import { defineStore } from 'pinia';

export const userStore = defineStore({
  id: 'user',
  state: () => ({
    name: 'odin',
    age: 30
  }),

  getters: {
    getUser: (state) => `${state.name} is ${state.age} years old`,
  },

  actions: {
    updateName(newName) {
      this.name = newName;
    }
  }
});