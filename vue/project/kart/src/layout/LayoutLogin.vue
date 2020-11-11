<template>
  <div
    class="root_layout_login"
    :style="{ backgroundImage: `url(${bgImg})` }"
    :class="rootClassObj"
  >
    <TheLoginNav />

    <div class="layout_login_content">
      <div class="layout_login_limit">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// Resources
// import { getI18nLanguage } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';
import deviceSizeMixinObj from '@/mixins/device-size.js';

// Component
import TheLoginNav from '@/components/TheLoginNav.vue';

export default {
  name: 'LayoutLogin',
  components: {
    TheLoginNav,
  },
  mixins: [commonMixinObj, deviceSizeMixinObj],
  data() {
    return {
      bgImg: require('../assets/img/v2/layout/layout_bg@2x.jpg'),
      isNeedAdjustHeight: false,
    };
  },
  watch: {
    'window.fullHeight'(height) {
      if (height > 940) {
        this.isNeedAdjustHeight = false;
      } else {
        this.isNeedAdjustHeight = true;
      }
    },
  },
  methods: {},
};
</script>
