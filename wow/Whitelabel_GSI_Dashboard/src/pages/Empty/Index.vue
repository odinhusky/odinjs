<template>
  <div>
    <h1>{{ title }}</h1>
    <Test />
  </div>
</template>

<script lang="ts">
  import { defineComponent, defineAsyncComponent } from "vue"
  import { ref } from "vue"

  export default defineComponent({
    name: "EmptyComponent",
    components: {
      Test: defineAsyncComponent(() => import("./component/empty.vue"))
    },
    setup() {
      const title = ref("empty")
      return {
        title
      }
    },
    mounted() {
      console.log("mounted")
    }
  })
</script>

<style lang="scss" scoped></style>
