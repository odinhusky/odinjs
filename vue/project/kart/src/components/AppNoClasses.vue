<template>
  <div class="sec no_classes_section">
    <div class="no_classses_box">
      <img
        src="../assets/img/v2/common/noclass@2x.png"
        class="no_classses_img"
      />
      <span class="no_classes_text">{{
        $t(`${noClassesText}`) || $t('purchase.no_classes')
      }}</span>

      <!-- 按鈕區 -->
      <div class="w-100 flex-center mb-3">
        <slot name="btns"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNoClasses',
  props: {
    noClassesText: {
      type: String,
      required: true,
    },
  },
};
</script>
