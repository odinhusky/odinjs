<template>
  <div class="index_box">
    <router-view :i18n-language="i18nLanguage" />

    <TheFooter />
  </div>
</template>

<script>
import { getI18nLanguage } from '@/plugins/utility.js';
import TheFooter from '@/components/TheFooter.vue';

export default {
  name: 'Layout',
  components: {
    TheFooter,
  },
  data() {
    return {
      i18nLanguage: getI18nLanguage(),
    };
  },
  methods: {
    /**
     * @author odin
     * @description 更新 data.i18nLanguage 裡面的內容
     * @param {string} i18nLanguage 切換後的語系
     */
    changeLanguage(i18nLanguage) {
      this.i18nLanguage = i18nLanguage;
    },
  },
};
</script>
