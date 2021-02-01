<template>
  <div class="child">
    <slot :user="user" :fruit="fruit" :odin="odin">
      {{ user.lastName }}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Child',
  data() {
    return {
      user: {
        lastName: 'Linda',
        firstName: 'KUO',
        age: 9,
      },
      odin: 'chen',
      fruit: ['apple', 'banana', 'orange'],
    };
  },
};
</script>
