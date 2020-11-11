<template>
  <div class="root login_root" :class="rootClassObj">
    <h3 class="login_title">{{ $t('login_form.title1') }}</h3>
    <h5 class="login_sub_title smaller">{{ $t('login_form.title2') }}</h5>

    <div class="input_group">
      <!-- 學生登入 Email -->
      <div class="input_control vselect2" :class="{ error: error.phoneNumber }">
        <img src="../assets/img/v2/login/phone@2x.png" class="input_icon" />
        <vSelect
          v-model="student.countryCode"
          :options="countryCodeList"
          class="form_select countrycode"
          name="countrycode"
        />
        <input
          v-model="student.phoneNumber"
          type="text"
          name="phone"
          class="login_input phone"
          :placeholder="$t('placeholder.phonenumber')"
          @keyup.enter="studentLogin"
        />
      </div>

      <!-- 學生登入 Password -->
      <div class="input_control" :class="{ error: error.password }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="student.password"
          type="password"
          name="password"
          class="login_input password"
          :placeholder="$t('placeholder.password')"
          @keyup.enter="studentLogin"
        />
      </div>

      <div class="flex-line">
        <!-- 記得我 -->
        <div class="checkbox_control mr-auto">
          <input
            id="login_remember_me"
            v-model="student.rememberme"
            type="checkbox"
            class="login_remember_me"
          />
          <label class="label_login_remember_me" for="login_remember_me">{{
            $t('login_form.rememberme')
          }}</label>
        </div>

        <!-- 忘記密碼 -->
        <button
          class="trans-btn forget_btn"
          @click.prevent="verifyPhone('forgetPwd')"
        >
          {{ $t('login_form.forget') }}
        </button>
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 登入 -->
      <button
        class="kart-btn kart-sub full_btn login_btn"
        @click.prevent="studentLogin"
      >
        {{ $t('login_form.login') }}
      </button>

      <!-- 註冊 -->
      <button
        class="kart-btn kart-gray half_btn mr-auto signup_btn"
        @click.prevent="verifyPhone('signup')"
      >
        {{ $t('login_form.register') }}
      </button>

      <!-- 回上頁 -->
      <button
        class="kart-btn kart-gray half_btn back_btn"
        @click.prevent="goToPrevPage"
      >
        {{ $t('login_form.back') }}
      </button>

      <!-- 行政人員登入 -->
      <router-link
        :to="{
          name: 'teacher-login',
          params: { lang: this.$route.params.lang },
        }"
        class="trans-btn teacher_login_btn"
        @click.prevent=""
      >
        {{ $t('login_form.administrator_login') }}
        <span class="right-arrow text_link_symbol"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
// Resources
import { checkCellphone, checkIsEmpty } from '@/plugins/checker.js';
import commonMixinObj from '@/mixins/common.js';

// Component
import vSelect from 'vue-select';

export default {
  name: 'AppLogin',
  components: {
    vSelect,
  },
  mixins: [commonMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      student: {
        countryCode: '+86',
        phoneNumber: '',
        password: '',
        rememberme: false,
      },
      error: {
        phoneNumber: false,
        password: false,
      },
    };
  },
  computed: {
    countryCodeList() {
      return this.$store.state.countryCodeList;
    },
    /**
     * @author odin
     * @description 組合國碼以及電話號碼
     */
    fullCellPhone() {
      return `${this.student.countryCode}${this.student.phoneNumber}`;
    },
  },
  created() {
    // 取得多國國碼
    this.$store
      .dispatch('fetchCountryCodeList')
      .then(() => {
        console.log('fetchCountryCodeList Success');
      })
      .catch(error => {
        console.log('fetchCountryCodeList Fail');
        console.log('fetchCountryCodeList error', error);
      });

    // 清除跟驗證有關的localStorage
    this.clearLoginLocalStorage();

    // bus notifier example
    // this.$bus.$emit('notify:message', 'odin的bus要不要上車啊？');
  },
  methods: {
    /**
     * @author odin
     * @description 回上一頁
     */
    goToPrevPage() {
      this.$router.go(-1);
    },

    /**
     * @author odin
     * @description 清除跟驗證有關的localStorage
     */
    clearLoginLocalStorage() {
      window.localStorage.removeItem('fullCellPhone');
      window.localStorage.removeItem('phoneNumber');
      window.localStorage.removeItem('countryCode');
      window.localStorage.removeItem('verify_code');
      window.localStorage.removeItem('path');
      window.localStorage.removeItem('resetPasswordToken');
    },

    /**
     * @author odin
     * @description 先進行手機的驗證，並且紀錄path到localStorage
     */
    verifyPhone(type) {
      if (type === 'forgetPwd') {
        window.localStorage.setItem('path', 'forget-password');
        this.$router.push({
          name: 'verify-phone-step1',
          params: { lang: this.$route.params.lang },
        });
      } else if (type === 'signup') {
        window.localStorage.setItem('path', 'signup');
        this.$router.push({
          name: 'verify-phone-step1',
          params: { lang: this.$route.params.lang },
        });
      }
    },

    /**
     * @author odin
     * @description 清空學生登入相關的資料
     */
    clearStudentLogin() {
      this.student.password = '';
      this.student.countryCode = '+86';
      this.student.phoneNumber = '';
      this.student.rememberMe = false;
    },

    /**
     * @author odin
     * @description 學生登入驗證
     */
    validationStudentLogin() {
      // 檢查電話
      if (
        checkCellphone(this.student.countryCode, this.student.phoneNumber) &&
        !checkIsEmpty(this.student.countryCode) &&
        !checkIsEmpty(this.student.phoneNumber)
      ) {
        console.log('Validation Pass');
        // 錯誤提示
        this.error.phoneNumber = false;
      } else {
        // 錯誤提示
        this.error.phoneNumber = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.cellphone_format_error'),
        );
        return false;
      }

      // 檢查密碼是否為空
      if (checkIsEmpty(this.student.password)) {
        // 錯誤提示
        this.error.password = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        // 錯誤提示
        this.error.password = false;
      }

      return true;
    },

    /**
     * @author odin
     * @description 學生登入
     */
    studentLogin() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('studentLogin');
      let allPass = this.validationStudentLogin();

      if (allPass) {
        console.log('allPass', allPass);
        this.$store
          .dispatch('studentLogin', {
            rememberMe: this.student.rememberMe,
            data: {
              cellphone: this.fullCellPhone,
              password: this.student.password,
            },
          })
          .then(() => {
            console.log('studentLogin Success');
            // 清空輸入欄位
            this.clearStudentLogin();
            this.$router.push({
              name: 'course',
              params: { lang: this.$route.params.lang },
            });
          })
          .catch(error => {
            console.log('studentLogin Fail');
            console.log('studentLogin error', error);
            if (error.response.data.message) {
              // 燈箱顯示
              this.$bus.$emit('notify:message', error.response.data.message);
            }
          })
          .finally(() => {
            // 關閉 loading
            this.$bus.$emit('loading:off');
          });
      } else {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },
  },
};
</script>
