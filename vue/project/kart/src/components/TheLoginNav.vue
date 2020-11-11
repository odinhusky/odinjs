<template>
  <div class="root root_login_nav" :class="rootClassObj">
    <nav class="login_nav">
      <router-link
        class="login_nav_logo_link"
        :to="{ name: 'index', params: { lang: this.$route.params.lang } }"
      >
        <img src="../assets/img/v2/nav/logo@2x.png" />
      </router-link>
    </nav>
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';

export default {
  name: 'TheLoginNav',
  mixins: [commonMixinObj],
};
</script>
