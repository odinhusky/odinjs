<template>
  <div class="login_part login_r">
    <!-- 中間區塊 -->
    <div class="login_title">
      <p class="login_title_p login_title1">登入你的學習帳戶</p>
      <p class="login_title_p login_title2">準備好開始上課了嗎？</p>
    </div>

    <!-- 選擇登入身份 -->
    <ChooseType
      v-show="step === 'choose'"
      :active-type="activeType"
      :img-path="chooseImgPath"
      @triggerChooseType="triggerChooseType"
      @goToForm="goToForm"
    />

    <!-- 登入 & 註冊表單 -->
    <LoginForm
      v-show="step === 'form'"
      :active-type="activeType"
      :img-path="formImgPath"
      @backToChoose="backToChoose"
      @goToForgetPwd="goToForgetPwd"
    />
  </div>
</template>

<script>
import ChooseType from '@/components/ChooseType.vue';
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'LoginView',
  components: {
    ChooseType,
    LoginForm,
  },
  props: {
    activeType: {
      type: String,
      required: true,
    },
    chooseImgPath: {
      type: Object,
      required: true,
    },
    formImgPath: {
      type: Object,
      required: true,
    },
    step: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data: 1,
    };
  },
  methods: {
    triggerChooseType(who) {
      this.$emit('triggerChooseType', who);
    },
    goToForm() {
      this.$emit('goToForm');
    },
    goToForgetPwd() {
      this.$emit('goToForgetPwd');
    },
    backToChoose() {
      this.$emit('backToChoose');
    },
  },
};
</script>

<style lang="scss" scoped></style>
