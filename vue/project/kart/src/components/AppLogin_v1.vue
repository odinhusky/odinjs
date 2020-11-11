<template>
  <div class="body">
    <!-- 中間區塊 -->
    <div class="login_container">
      <div class="login">
        <div
          class="login_part login_l"
          :style="{
            backgroundImage: `url(@/assets/img/login/image_login@2x.png)`,
          }"
        >
          <img src="@/assets/img/login/image_login@2x.png" class="left_img" />
        </div>

        <!-- 登入(老師 + 學生) -->
        <AppLoginForm
          v-if="step === 'form'"
          :step="step"
          :active-type="activeType"
          :country-code-list="countryCodeList"
          @goToForm="goToForm"
          @goToForgetPwd="goToForgetPwd"
          @goToSignUp="goToSignUp"
          @goToTeacherLogin="goToTeacherLogin"
          @backToStudentLogin="backToStudentLogin"
        />

        <!-- 忘記密碼(學生) -->
        <AppLoginForgetPwd
          v-if="step === 'forgetPwd'"
          :country-code-list="countryCodeList"
          @backToLoginForm="backToLoginForm"
        />

        <!-- 註冊(學生) -->
        <AppLoginSignup
          v-if="step === 'signup'"
          :country-code-list="countryCodeList"
          @backToLoginForm="backToLoginForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
// resources
import { countryCodeListPath } from '@/store/ajax-path.js';

// components
import AppLoginForm from '@/components/AppLoginForm.vue';
import AppLoginForgetPwd from '@/components/AppLoginForgetPwd.vue';
import AppLoginSignup from '@/components/AppLoginSignup.vue';

export default {
  name: 'AppLogin',
  components: {
    AppLoginForm,
    AppLoginForgetPwd,
    AppLoginSignup,
  },
  data() {
    return {
      step: 'form',
      activeType: 'student',
      countryCodeList: [],
    };
  },
  created() {
    // 取得國碼列表
    this.fetchCountryCodeList();
  },
  methods: {
    /**
     * @author odin
     * @description 回到登入表單頁面
     */
    goToForm() {
      this.step = 'form';
    },
    /**
     * @author odin
     * @description 進到學生忘記密碼頁面
     */
    goToForgetPwd() {
      this.step = 'forgetPwd';
    },
    /**
     * @author odin
     * @description 進到學生註冊頁面
     */
    goToSignUp() {
      this.step = 'signup';
    },
    /**
     * @author odin
     * @description 進到教師登入頁面
     */
    goToTeacherLogin() {
      this.activeType = 'teacher';
    },
    /**
     * @author odin
     * @description 回到登入表單頁面
     */
    backToLoginForm() {
      this.step = 'form';
    },
    /**
     * @author odin
     * @description 回到學生登入頁面
     */
    backToStudentLogin() {
      this.activeType = 'student';
    },
    /**
     * @author odin
     * @description 處理手機驗證
     */
    handlePhoneVerify({ countryCode, cellphone }) {
      console.log(countryCode, cellphone);
    },
    /**
     * @author odin
     * @description 獲得國碼列表
     */
    async fetchCountryCodeList() {
      try {
        const res = await this.axios.get(countryCodeListPath);

        if (res.data.data) {
          console.log('fetchCountryCodeList Success');
          console.log('fetchCountryCodeList res => ', res);

          this.countryCodeList = res.data.data;
        }
      } catch (err) {
        console.log(
          'fetchCountryCodeList axios error response => ',
          err.response,
        );
        console.log(
          'fetchCountryCodeList axios error response message=> ',
          err.response.data.message,
        );
      }
    },
  },
  // router management style
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log('to, from, next', to, from, next);
    document.querySelector('body').classList.add('login-color');
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log('to, from, next', to, from, next);
    document.querySelector('body').removeAttribute('class');
    next();
  },
};
</script>
