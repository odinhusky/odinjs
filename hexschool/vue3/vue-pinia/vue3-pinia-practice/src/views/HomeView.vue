<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1 :style="{color: 'red'}">{{ getUser }}</h1>

    <input type="text" v-model="username">
    <button @click.prevent="handleSubmit">送出</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import { userStore } from '@/stores/user';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'HomeView',
  data() {
    return {
      username: 'odin'
    }
  },
  created() {
    this.username = this.name;
  },
  components: {
    HelloWorld,
  },
  computed: {
    // 透過 mapState 取得特定 store 中的 state 以及 getter
    ...mapState(userStore, ['name', 'age', 'getUser']),
  },
  methods: {
    // 透過 mapActions 取得特定 store 中的 actions
    ...mapActions(userStore, ['updateName']),
    handleSubmit() {
      const nowName = this.username;
      this.updateName(nowName)
    }
  }
};
</script>
