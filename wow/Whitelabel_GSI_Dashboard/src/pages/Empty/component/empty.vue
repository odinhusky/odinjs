<template>
  <div class="test">{{ title }}</div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import { ref } from "vue"

  export default defineComponent({
    name: "TestComponent",
    setup() {
      const title = ref("test")
      return {
        title
      }
    },
    mounted() {
      console.log("mounted test")
    }
  })
</script>

<style lang="scss" scoped>
  .test {
    width: 100px;
    height: 100px;
    background-color: red;
    color: #fff;
  }
</style>
