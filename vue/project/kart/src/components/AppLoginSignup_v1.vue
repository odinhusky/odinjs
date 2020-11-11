<template>
  <div class="login_part login_r">
    <!-- 中間區塊 -->
    <div class="login_title">
      <p class="login_title_p login_title1">{{ $t('login_form.title1') }}</p>
      <p class="login_title_p login_title2">{{ $t('login_form.title2') }}</p>
    </div>

    <div class="form-ctrl">
      <!-- 姓名 -->
      <AppLoginFormInputGroup
        :icon-path="require('@/assets/img/login/icon_login@2x.png')"
        :error-path="require('@/assets/img/login/icon_err@2x.png')"
        :focus-or-not="focus.name"
        :error-or-not="error.name"
      >
        <template slot="input">
          <input
            v-model.trim="signup.name"
            type="text"
            class="form_input name"
            name="name"
            :placeholder="$t('placeholder.name')"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </template>
      </AppLoginFormInputGroup>

      <!-- Email -->
      <AppLoginFormInputGroup
        :icon-path="require('@/assets/img/login/icon_login@2x.png')"
        :error-path="require('@/assets/img/login/icon_err@2x.png')"
        :focus-or-not="focus.email"
        :error-or-not="error.email"
      >
        <template slot="input">
          <input
            v-model.trim="signup.email"
            type="text"
            class="form_input email"
            name="email"
            :placeholder="$t('placeholder.email')"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </template>
      </AppLoginFormInputGroup>

      <!-- 手機驗證 -->
      <AppLoginGetCellphoneVerify
        :country-code-list="countryCodeList"
        @handlePhoneVerify="handlePhoneVerify"
        @emitDataToFatherComponent="emitDataToFatherComponent"
      />

      <!-- 輸入驗證碼 -->
      <AppLoginFormInputGroup
        :icon-path="require('@/assets/img/login/icon3@2x.png')"
        :error-path="require('@/assets/img/login/icon_err@2x.png')"
        :focus-or-not="focus.verify_code"
        :error-or-not="error.verify_code"
      >
        <template slot="input">
          <input
            v-model.trim="signup.verify_code"
            type="text"
            class="form_input verify_code"
            name="verify_code"
            :placeholder="$t('placeholder.verifycode')"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </template>
      </AppLoginFormInputGroup>

      <!-- 輸入密碼 -->
      <AppLoginFormInputGroup
        :icon-path="require('@/assets/img/login/icon_key@2x.png')"
        :error-path="require('@/assets/img/login/icon_err@2x.png')"
        :focus-or-not="focus.password"
        :error-or-not="error.password"
      >
        <template slot="input">
          <input
            v-model="signup.password"
            type="text"
            class="form_input password"
            name="password"
            :placeholder="$t('placeholder.password')"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </template>
      </AppLoginFormInputGroup>

      <!-- 再次輸入密碼 -->
      <AppLoginFormInputGroup
        :icon-path="require('@/assets/img/login/icon_key@2x.png')"
        :error-path="require('@/assets/img/login/icon_err@2x.png')"
        :focus-or-not="focus.password_confirmation"
        :error-or-not="error.password_confirmation"
      >
        <template slot="input">
          <input
            v-model="signup.password_confirmation"
            type="text"
            class="form_input password_confirmation"
            name="password_confirmation"
            :placeholder="$t('placeholder.passwordconfirm')"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </template>
      </AppLoginFormInputGroup>

      <!-- 按扭區 -->
      <div class="btn_gp">
        <div class="center_btn_sec">
          <button class="main_btn half_btn signup_btn" @click.prevent="signUp">
            {{ $t('register_form.register') }}
          </button>
        </div>

        <div class="center_btn_sec">
          <button
            class="gray_btn half_btn back_btn"
            @click.prevent="backToLoginForm"
          >
            {{ $t('register_form.tologin') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Resources
import { checkIsEmpty, checkEmail } from '@/plugins/checker.js';
import { studentSignUpPath } from '@/store/ajax-path.js';

// Component
import AppLoginGetCellphoneVerify from '@/components/AppLoginGetCellphoneVerify.vue';
import AppLoginFormInputGroup from '@/components/AppLoginFormInputGroup.vue';

export default {
  name: 'AppLoginSignup',
  components: {
    AppLoginFormInputGroup,
    AppLoginGetCellphoneVerify,
  },
  props: {
    countryCodeList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      focus: {
        name: false,
        email: false,
        verify_code: false,
        password: false,
        password_confirmation: false,
      },
      error: {
        name: false,
        email: false,
        verify_code: false,
        password: false,
        password_confirmation: false,
      },
      signup: {
        name: '',
        email: '',
        fullCellPhone: '',
        cellphone_info: {
          country_code: '',
          phone_number: '',
        },
        verify_code: '',
        password: '',
        password_confirmation: '',
      },
    };
  },
  methods: {
    backToLoginForm() {
      this.$emit('backToLoginForm');
    },
    handlePhoneVerify({ countryCode, cellphoneNumber }) {
      this.$emit('handlePhoneVerify', { countryCode, cellphoneNumber });
    },
    handleFocus(e) {
      const inputName = e.path[0].name;
      switch (inputName) {
        case 'name':
          this.focus.name = true;
          break;
        case 'email':
          this.focus.email = true;
          break;
        case 'verify_code':
          this.focus.verify_code = true;
          break;
        case 'password':
          this.focus.password = true;
          break;
        case 'password_confirmation':
          this.focus.password_confirmation = true;
          break;
      }
    },
    handleBlur(e) {
      const inputName = e.path[0].name;
      switch (inputName) {
        case 'name':
          this.focus.name = false;
          break;
        case 'email':
          this.focus.email = false;
          break;
        case 'verify_code':
          this.focus.verify_code = false;
          break;
        case 'password':
          this.focus.password = false;
          break;
        case 'password_confirmation':
          this.focus.password_confirmation = false;
          break;
      }
    },
    /**
     * @author odin
     * @description 從AppLoginGetCellphoneVerify傳送回來的資料寫入到data中
     * @param forgetToken
     */
    emitDataToFatherComponent(signUpData) {
      this.signup.signUptToken = signUpData.token;
      this.signup.cellphone_info.countryCode = signUpData.countryCode;
      this.signup.cellphone_info.cellphone = signUpData.cellphone;
      this.signup.fullCellPhone = signUpData.fullCellPhone;
    },
    /**
     * @author odin
     * @description 清空忘記密碼input以及select
     * @param forgetToken
     */
    clearForgetPwd() {
      this.forgetPwd.countryCode = '+86';
      this.forgetPwd.cellphone = '';
      this.forgetPwd.fullCellPhone = '';
      this.forgetPwd.password = '';
      this.forgetPwd.password_confirmation = '';
      this.forgetPwd.forgetToken = '';
      this.forgetPwd.verify_code = '';
    },
    /**
     * @author odin
     * @description 從AppLoginGetCellphoneVerify傳送回來的資料寫入到data中
     * @param forgetToken
     */
    validationSignUp() {
      let allPass = true;

      // 驗證姓名不為空
      if (!checkIsEmpty(this.signup.name)) {
        // error標示拿掉
        this.error.name = false;
      } else {
        // 錯誤相關顯示
        allPass = false;
        this.error.name = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.not_allow_empty');
        this.showAlert();
        return allPass;
      }

      // 驗證email格式且不為空
      if (checkEmail(this.signup.email) && !checkIsEmpty(this.signup.email)) {
        // error標示拿掉
        this.error.email = false;
      } else {
        // 錯誤相關顯示
        allPass = false;
        this.error.email = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.email_format_error');
        this.showAlert();
        return allPass;
      }

      // 驗證"密碼"不可為空
      if (!checkIsEmpty(this.signup.password)) {
        // error標示拿掉
        this.error.password = false;
      } else {
        // 錯誤相關顯示
        allPass = false;
        this.error.password = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.not_allow_empty');
        this.showAlert();
        return allPass;
      }

      // 驗證"再次輸入密碼"不可為空且與密碼相同
      if (
        !checkIsEmpty(this.signup.password) &&
        this.signup.password === this.signup.password_confirmation
      ) {
        // error標示拿掉
        this.error.password_confirmation = false;
      } else {
        if (checkIsEmpty(this.signup.password)) {
          // 錯誤相關顯示
          allPass = false;
          this.error.password_confirmation = true;
          // 燈箱顯示
          this.alert.title = this.$t('system_message.not_allow_empty');
          this.showAlert();
          return allPass;
        } else if (this.signup.password === this.signup.password_confirmation) {
          // 錯誤相關顯示
          allPass = false;
          this.error.password_confirmation = true;
          // 燈箱顯示
          this.alert.title = this.$t('system_message.password_not_matching');
          this.showAlert();
          return allPass;
        }
      }

      return allPass;
    },
    async signUp() {
      const allPass = this.validationSignUp();

      if (allPass) {
        try {
          const res = await this.axios({
            url: studentSignUpPath,
            method: 'post',
            data: {
              name: this.signup.name,
              email: this.signup.email,
              cellphone: this.signup.fullCellPhone,
              cellphone_info: {
                country_code: this.signup.cellphone_info.country_code,
                phone_number: this.signup.cellphone_info.phone_number,
              },
              password: this.signup.password,
              password_confirmation: this.signup.password_confirmation,
              verify_code: this.signup.verify_code,
            },
          });

          if (res.data.data) {
            console.log('signUp Success');
            console.log('signUp res => ', res);

            // 清空輸入欄位
            this.clearForgetPwd();

            // 轉址(成功導向登入頁面)
            this.$emit('backToLoginForm');
          }
        } catch (err) {
          console.log('signUp axios error response => ', err.response);
          console.log(
            'signUp axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.alert.title = err.response.data.message || err;
          this.showAlert();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
