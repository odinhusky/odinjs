<template>
  <div class="root_layout_login" :style="{ backgroundImage: `url(${bgImg})` }">
    <TheLoginNav />

    <div class="layout_login_content">
      <div class="layout_login_limit">
        <router-view :i18n-language="i18nLanguage" />
      </div>
    </div>
  </div>
</template>

<script>
// Resources
import { getI18nLanguage } from '@/plugins/utility.js';

// Component
import TheLoginNav from '@/components/TheLoginNav.vue';

export default {
  name: 'LayoutLogin',
  components: {
    TheLoginNav,
  },
  data() {
    return {
      i18nLanguage: getI18nLanguage(),
      bgImg: require('../assets/img/v2/layout/layout_bg@3x.png'),
    };
  },
  methods: {},
};
</script>
