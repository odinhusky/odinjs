<template>
  <!-- 中間區塊 -->
  <div v-if="true" class="form-ctrl">
    <span class="choose_hint"> 請點選身份 </span>

    <form
      id="type_choose_gp"
      class="type_choose_gp"
      :class="{ teacher: activeType === 'teacher' }"
    >
      <LoginTypeBtn
        type="teacher"
        :active-type="activeType"
        :active-path="imgPath.teacherActive"
        :non-active-path="imgPath.teacherNonActive"
        btn-text="授課老師"
        @triggerChooseType="triggerChooseType"
      />
      <LoginTypeBtn
        type="student"
        :active-type="activeType"
        :active-path="imgPath.studentActive"
        :non-active-path="imgPath.studentNonActive"
        btn-text="上課學生"
        @triggerChooseType="triggerChooseType"
      />
    </form>

    <div class="flex-center">
      <button class="ka_btn login_next_btn" @click="goToForm">下一步</button>
    </div>
  </div>
</template>

<script>
// import Img from "@/components/Img.vue";
import LoginTypeBtn from '@/components/LoginTypeBtn.vue';

export default {
  name: 'ChooseType',
  components: {
    LoginTypeBtn,
  },
  props: {
    activeType: {
      type: String,
      required: true,
    },
    imgPath: {
      type: Object,
      required: true,
    },
  },
  methods: {
    triggerChooseType(who) {
      this.$emit('triggerChooseType', who);
    },
    goToForm() {
      this.$emit('goToForm');
    },
  },
};
</script>
