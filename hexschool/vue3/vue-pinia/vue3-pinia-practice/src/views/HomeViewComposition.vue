<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1 :style="{color: 'red'}">{{ user.getUser }}</h1>
    <h1 :style="{color: 'blue'}">另外用ref綁定: {{ username }}</h1>

    <input type="text" v-model="user.name" :style="{color: 'red'}">
    <input type="text" v-model="username"  :style="{color: 'blue'}">

    <button @click.prevent="handleSubmit">送出</button>
    <button @click.prevent="editStore">修改</button>
    <button @click.prevent="resetStore">reset</button>

    <HelloWorld msg="This is Composition API Pinia Component" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import { userStore } from '@/stores/user';
// import { mapState, mapActions } from 'pinia';
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

export default {
  name: 'HomeViewComposition',
  components: {
    HelloWorld,
  },
  setup() {
    // 這裡的 user 會是 reactive 型態的資料，可以直接取值得到內容
    const user = userStore();
    // console.log('user', user);

    // 方法的取用可以直接從 reactive 中解構出來
    const { updateName } = user;

    // 使用 storeToRefs 將 reactive 的資料型態 轉換成 ref(Impl) 的資料型態
    const { name, age, getUser } = storeToRefs(user);

    const username = ref(user.name);

    const handleSubmit = () => {
      console.log('username', username.value)
      updateName(username.value)
    }

    // 可以從該 reactive 的 store 中，使用 $patch 的方式修改 store 中的資料
    // 類似於 React 中的 setState，可以修改多筆資訊
    const editStore = () => {
      user.$patch({
        name: 'Rick',
        age: '37'
      })
      username.value = 'Rick';
    }

    // 可以從該 reactive 的 store 中，使用 $reset 的方式恢復為原本的 initial state
    const resetStore = () => {
      user.$reset()
      username.value = 'odin';
    }


    return {
      user,
      name,
      age,
      getUser,
      updateName,
      username,
      handleSubmit,
      editStore,
      resetStore
    }
  }
};
</script>
