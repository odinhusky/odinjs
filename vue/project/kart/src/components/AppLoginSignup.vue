<template>
  <div class="root login_root signup_root" :class="rootClassObj">
    <h3 class="login_title">{{ $t('register_form.title1') }}</h3>
    <h5 class="login_sub_title smaller">{{ $t('register_form.title2') }}</h5>

    <div class="input_group">
      <!-- 姓名 -->
      <div class="input_control" :class="{ error: error.name }">
        <img src="../assets/img/v2/login/person@2x.png" class="input_icon" />
        <input
          v-model.trim="signup.name"
          type="text"
          name="name"
          class="login_input name"
          :placeholder="$t('placeholder.name')"
          @keyup.enter="requestSignup"
        />
      </div>

      <!-- Email -->
      <div class="input_control" :class="{ error: error.email }">
        <img src="../assets/img/v2/login/mail@2x.png" class="input_icon" />
        <input
          v-model.trim="signup.email"
          type="text"
          name="email"
          class="login_input email"
          :placeholder="$t('placeholder.email')"
          @keyup.enter="requestSignup"
        />
      </div>

      <!-- 生日 -->
      <div class="input_control" :class="{ error: error.birthday }">
        <img src="../assets/img/v2/login/cake@2x.png" class="input_icon" />
        <input
          v-model.trim="signup.birthday"
          type="text"
          name="birthday"
          class="login_input birthday"
          :placeholder="$t('placeholder.birthday')"
          @keyup.enter="requestSignup"
        />
      </div>

      <!-- 性別 -->
      <div class="input_control" :class="{ error: error.gender }">
        <img src="../assets/img/v2/login/gender@2x.png" class="input_icon" />
        <select
          v-model="signup.gender"
          name="gerder"
          class="login_select gender"
          :class="{
            en_gender_select: i18n === 'en',
            other_gender_selec: signup.gender === 'none',
          }"
        >
          <option
            v-for="option in genderOption"
            :key="option.id"
            :value="option.value"
          >
            {{ $t(option.text) }}
          </option>
        </select>
      </div>

      <!-- 輸入密碼 -->
      <div class="input_control" :class="{ error: error.password }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="signup.password"
          type="password"
          name="password"
          class="login_input password"
          :placeholder="$t('placeholder.password')"
          @keyup.enter="requestSignup"
        />
      </div>

      <!-- 密碼 再輸入一次 -->
      <div class="input_control" :class="{ error: error.password_confirm }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="signup.password_confirm"
          type="password"
          name="password_confirm"
          class="login_input password_confirm"
          :placeholder="$t('placeholder.passwordconfirm')"
          @keyup.enter="requestSignup"
        />
      </div>

      <!-- 微信號 -->
      <div class="input_control">
        <img src="../assets/img/v2/login/wechat@2x.png" class="input_icon" />
        <input
          v-model="signup.wechat"
          type="text"
          name="wechat"
          class="login_input wechat"
          :placeholder="$t('placeholder.wechat')"
          @keyup.enter="requestSignup"
        />
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 完成註冊 -->
      <button
        class="kart-btn kart-sub w-100 register"
        @click.prevent="requestSignup"
      >
        {{ $t('register_form.register') }}
      </button>

      <!-- 返回登入頁 -->
      <router-link
        :to="{ name: 'login', params: { lang: this.$route.params.lang } }"
        class="kart-btn kart-gray w-100 tologin"
      >
        {{ $t('register_form.tologin') }}
      </router-link>
    </div>
  </div>
</template>

<script>
// Resources
import {
  checkEmail,
  checkIsEmpty,
  checkDateFormat,
} from '@/plugins/checker.js';
import { studentSignUpPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';

// Component
// import AppLightBox from '@/components/AppLightBox';

export default {
  name: 'AppLoginSignup',
  components: {},
  mixins: [commonMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      signup: {
        name: '',
        email: '',
        birthday: '',
        gender: 'male',
        password: '',
        password_confirm: '',
        wechat: '',
      },
      error: {
        name: false,
        email: false,
        birthday: false,
        gender: false,
        password: false,
        password_confirm: false,
      },
      genderOption: [
        // 男
        {
          id: 0,
          value: 'male',
          text: 'gender.male',
        },
        // 女
        {
          id: 1,
          value: 'female',
          text: 'gender.female',
        },
        // 其他
        {
          id: 2,
          value: 'none',
          text: 'gender.other',
        },
      ],
    };
  },
  computed: {
    fullCellPhone() {
      const fullCellPhone = window.localStorage.getItem('fullCellPhone');
      return fullCellPhone ? fullCellPhone : '';
    },
    phoneNumber() {
      const phoneNumber = window.localStorage.getItem('phoneNumber');
      return phoneNumber ? phoneNumber : '';
    },
    countryCode() {
      const countryCode = window.localStorage.getItem('countryCode');
      return countryCode ? countryCode : '';
    },
    verifyCode() {
      const verify_code = window.localStorage.getItem('verify_code');
      return verify_code ? verify_code : '';
    },
    i18n() {
      return this.$route.params.lang;
    },
  },
  created() {
    console.log('fullCellPhone', this.fullCellPhone);
    console.log('phoneNumber', this.phoneNumber);
    console.log('countryCode', this.countryCode);
    console.log('verifyCode', this.verifyCode);
    // init
    this.initCheck();
  },
  methods: {
    /**
     * @author odin
     * @description 確認是否有這些參數，否則就倒回登入頁面按照流程重新跑一次
     */
    initCheck() {
      if (
        checkIsEmpty(this.fullCellPhone) ||
        checkIsEmpty(this.phoneNumber) ||
        checkIsEmpty(this.countryCode) ||
        checkIsEmpty(this.verifyCode)
      ) {
        // 導頁
        this.$router.push({
          name: 'login',
          params: { lang: this.$route.params.lang },
        });
      }
    },

    /**
     * @author odin
     * @description 驗證欄位是否正確
     */
    validationSignup() {
      // 檢查 姓名
      if (!checkIsEmpty(this.signup.name)) {
        console.log('Name Validation Pass');
        // 錯誤提示
        this.error.name = false;
      } else {
        // 錯誤提示
        this.error.name = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      }

      // 檢查 email
      if (checkEmail(this.signup.email) && !checkIsEmpty(this.signup.email)) {
        console.log('Email Validation Pass');
        // 錯誤提示
        this.error.email = false;
      } else {
        // 錯誤提示
        this.error.email = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.email_format_error'),
        );
        return false;
      }

      // 檢查 生日
      if (!checkDateFormat(this.signup.birthday)) {
        // 錯誤提示
        this.error.birthday = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.birthday_format_error'),
        );
        return false;
      } else if (checkIsEmpty(this.signup.birthday)) {
        // 錯誤提示
        this.error.birthday = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        console.log('Birthday Validation Pass');

        // 錯誤提示
        this.error.birthday = false;
      }

      // 檢查 密碼
      if (checkIsEmpty(this.signup.password)) {
        // 錯誤提示
        this.error.password = true;
        this.error.password_confirm = false;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else if (checkIsEmpty(this.signup.password_confirm)) {
        // 錯誤提示
        this.error.password = false;
        this.error.password_confirm = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else if (this.signup.password !== this.signup.password_confirm) {
        // 錯誤提示
        this.error.password = true;
        this.error.password_confirm = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.password_not_matching'),
        );
        return false;
      } else {
        console.log('Password/Password-Confirm Validation Pass');
        // 錯誤提示
        this.error.password = false;
        this.error.password_confirm = false;
      }

      return true;
    },

    /**
     * @author odin
     * @description 清空輸入欄位
     */
    clearSignup() {
      this.signup.name = '';
      this.signup.email = '';
      this.signup.birthday = '';
      this.signup.gender = '1';
      this.signup.password = '';
      this.signup.password_confirm = '';
      this.signup.wechat = '';
    },

    /**
     * @author odin
     * @description 清除跟驗證有關的localStorage
     */
    clearLoginLocalStorage() {
      window.localStorage.removeItem('fullCellPhone');
      window.localStorage.removeItem('phoneNumber');
      window.localStorage.removeItem('countryCode');
      window.localStorage.removeItem('verifyCode');
      window.localStorage.removeItem('path');
    },

    /**
     * @author odin
     * @description 送出註冊
     */
    async requestSignup() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('requestSignup');

      const allPass = this.validationSignup();

      if (allPass) {
        try {
          const res = await this.axios({
            url: studentSignUpPath,
            method: 'post',
            data: {
              name: this.signup.name,
              email: this.signup.email,
              cellphone: this.fullCellPhone,
              cellphone_info: {
                country_code: this.countryCode,
                phone_number: this.phoneNumber,
              },
              password: this.signup.password,
              password_confirmation: this.signup.password_confirm,
              wechat: this.signup.wechat,
              gender: this.signup.gender,
              verify_code: this.verifyCode,
            },
          });

          if (res.data.data || res.data.status) {
            console.log('requestSignup Success');
            console.log('requestSignup res => ', res);

            // 註冊完之後直接登入
            this.afterSignupLogin();
          }
        } catch (err) {
          console.log('requestSignup axios error response => ', err.response);
          console.log(
            'requestSignup axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.$bus.$emit('notify:message', err.response.data.message || err);
        } finally {
          // 關閉 loading
          this.$bus.$emit('loading:off');
        }
      } else {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 學生註冊完立刻登入
     */
    afterSignupLogin() {
      this.$store
        .dispatch('studentLogin', {
          rememberMe: false,
          data: {
            cellphone: this.fullCellPhone,
            password: this.signup.password,
          },
        })
        .then(() => {
          console.log('studentLogin Success');

          // 清空輸入欄位
          this.clearSignup();

          // 清除localStorage的資料
          this.clearLoginLocalStorage();

          // 導頁
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
        });
    },
  },
};
</script>
