<template>
  <div class="hello">
    <Child v-slot:default="slotProps">
      姓{{ slotProps.user.firstName }}, 年齡{{ slotProps.user.age }} 喜歡水果{{
        slotProps.fruit[0]
      }}
      ////////////////////////////////////////////////////////////////
      {{ slotProps.odin }}
    </Child>
  </div>
</template>

<script>
import Child from './Child.vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  components: {
    Child,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
