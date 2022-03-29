<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ name }}</div>
    <div>{{ age }}</div>
    <div>{{ getUser }}</div>
  </div>
</template>

<script>
import { userStore } from '@/stores/user';
import { mapState } from 'pinia';
export default {
  name: 'AboutView',
  computed: {
    ...mapState(userStore, ['getUser'])
  }
};
</script>
