<template>
  <button
    class="kart-btn kart-main pl-2 pr-5"
    type="button"
    @click.prevent="triggerClick"
  >
    <template slot="content">{{ $t('system_message.close') }}</template>
  </button>
</template>

<script>
export default {
  name: 'AppAlertCloseAlertBtn',
  methods: {
    triggerClick() {
      this.$emit('close');
      this.$emit('refresh');
    },
  },
};
</script>

<style lang="scss" scoped></style>
