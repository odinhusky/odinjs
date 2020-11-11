<template>
  <div
    class="root error404_root fixed-center text-center"
    :class="rootClassObj"
  >
    <p>
      <img src="../assets/img/sad.svg" style="width: 30vw; max-width: 150px" />
    </p>
    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
    <button color="secondary" style="width: 200px" @click="$router.push('/')">
      Go back
    </button>
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';

export default {
  name: 'Error404',
  mixins: [commonMixinObj],
};
</script>
