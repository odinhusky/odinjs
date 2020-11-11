<template>
  <div class="login_btn_gp">
    <button
      class="login_type_btn login_type_student"
      :class="{ active: activeType === type }"
      @click.prevent="triggerChooseType"
    >
      <VImg
        v-if="activeType === type"
        :src="activePath"
        classname="login_type_img active_path"
      />

      <VImg
        v-else
        :src="nonActivePath"
        classname="login_type_img non_active_path"
      />

      <span class="login_type_text">{{ btnText }}</span>
    </button>
  </div>
</template>

<script>
import VImg from '@/components/VImg.vue';

export default {
  name: 'LoginTypeBtn',
  components: {
    VImg,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    activeType: {
      type: String,
      required: true,
    },
    activePath: {
      type: String,
      required: true,
    },
    nonActivePath: {
      type: String,
      required: true,
    },
    btnText: {
      type: String,
      required: true,
    },
  },
  methods: {
    triggerChooseType() {
      this.$emit('triggerChooseType', this.type);
    },
  },
};
</script>
