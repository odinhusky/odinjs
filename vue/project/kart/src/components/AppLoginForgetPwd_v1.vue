<template>
  <div class="root login_part login_r">
    <!-- 中間區塊 -->
    <div class="login_title">
      <p class="login_title_p login_title1">忘記密碼</p>
    </div>

    <div class="form-ctrl">
      <!-- 手機驗證 -->
      <AppLoginGetCellphoneVerify
        :country-code-list="countryCodeList"
        @handlePhoneVerify="handlePhoneVerify"
        @emitDataToFatherComponent="emitDataToFatherComponent"
      />

      <!-- 重設密碼 -->
      <form class="input_data_form">
        <!-- 輸入驗證碼 -->
        <AppLoginFormInputGroup
          :icon-path="require('@/assets/img/login/icon3@2x.png')"
          :error-path="require('@/assets/img/login/icon_err@2x.png')"
          :focus-or-not="focus.verify_code"
          :error-or-not="error.verify_code"
        >
          <template slot="input">
            <input
              v-model.trim="forgetPwd.verify_code"
              type="text"
              class="form_input verify_code"
              name="verify_code"
              placeholder="輸入驗證碼"
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
              v-model="forgetPwd.password"
              type="text"
              class="form_input password"
              name="password"
              placeholder="輸入密碼"
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
              v-model="forgetPwd.password_confirmation"
              type="text"
              class="form_input password_confirmation"
              name="password_confirmation"
              placeholder="再次輸入密碼"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </template>
        </AppLoginFormInputGroup>

        <!-- 按扭區 -->
        <div class="w-100">
          <div class="w-100 flex-center mb-3">
            <button
              class="kart-btn kart-main half_btn reset_btn"
              @click.prevent="resetPassword"
            >
              {{ $t('forget_form.reset_password') }}
            </button>
          </div>

          <div class="w-100 flex-center mb-3">
            <button
              class="kart-btn kart-gray half_btn back_btn"
              @click.prevent="backToLoginForm"
            >
              {{ $t('register_form.tologin') }}
            </button>
          </div>
        </div>
      </form>
    </div>
    <!-- 燈箱設定 -->
    <AppAlert
      v-model="alert.openOrNot"
      :title="alert.title"
      :classname="alert.classname"
    ></AppAlert>
  </div>
</template>

<script>
//resources
import { checkIsEmpty } from '@/plugins/checker.js';
import { studentResetPasswordPath } from '@/store/ajax-path.js';

// component
import AppLoginGetCellphoneVerify from '@/components/AppLoginGetCellphoneVerify.vue';
import AppLoginFormInputGroup from '@/components/AppLoginFormInputGroup.vue';
import AppAlert from '@/components/AppAlert.vue';

export default {
  name: 'AppLoginForgetPwd',
  components: {
    AppLoginGetCellphoneVerify,
    AppLoginFormInputGroup,
    AppAlert,
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
        verify_code: false,
        password: false,
        password_confirmation: false,
      },
      error: {
        verify_code: false,
        password: false,
        password_confirmation: false,
      },
      forgetPwd: {
        verify_code: '',
        password: '',
        password_confirmation: '',
        cellphone: '',
        countryCode: '',
        fullCellPhone: '',
        forgetToken: '',
      },
      alert: {
        openOrNot: false,
        title: '',
        classname: 'forget_alert',
      },
    };
  },
  methods: {
    goToForgetPwd() {
      this.$emit('goToForgetPwd');
    },
    backToLoginForm() {
      this.$emit('backToLoginForm');
    },
    handlePhoneVerify({ countryCode, cellphoneNumber }) {
      this.$emit('handlePhoneVerify', { countryCode, cellphoneNumber });
    },
    handleFocus(e) {
      const inputName = e.path[0].name;
      switch (inputName) {
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
     * @description 開啟燈箱
     */
    showAlert() {
      this.alert.openOrNot = true;
    },
    /**
     * @author odin
     * @description 把 AppLoginGetCellphoneVerify 傳出來的資料放在父層
     * @param forgetData
     */
    emitDataToFatherComponent(forgetData) {
      this.forgetPwd.forgetToken = forgetData.forgetToken;
      this.forgetPwd.countryCode = forgetData.countryCode;
      this.forgetPwd.cellphone = forgetData.cellphone;
      this.forgetPwd.fullCellPhone = forgetData.fullCellPhone;
    },
    /**
     * @author odin
     * @description 驗證各個input
     */
    validationResetPassword() {
      // 驗證驗證碼
      if (!checkIsEmpty(this.forgetPwd.verify_code)) {
        // error標示拿掉
        this.error.verify_code = false;
      } else {
        // 錯誤相關顯示
        this.error.verify_code = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.not_allow_empty');
        this.showAlert();
        return false;
      }

      // 驗證"密碼"不可為空
      if (!checkIsEmpty(this.forgetPwd.password)) {
        // error標示拿掉
        this.error.password = false;
      } else {
        // 錯誤相關顯示
        this.error.password = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.not_allow_empty');
        this.showAlert();
        return false;
      }

      // 驗證"再次輸入密碼"不可為空且與密碼相同
      if (
        !checkIsEmpty(this.forgetPwd.password) &&
        this.forgetPwd.password === this.forgetPwd.password_confirmation
      ) {
        // error標示拿掉
        this.error.password_confirmation = false;
      } else {
        if (checkIsEmpty(this.forgetPwd.password)) {
          // 錯誤相關顯示
          this.error.password_confirmation = true;
          // 燈箱顯示
          this.alert.title = this.$t('system_message.not_allow_empty');
          this.showAlert();
          return false;
        } else if (
          this.forgetPwd.password === this.forgetPwd.password_confirmation
        ) {
          // 錯誤相關顯示
          this.error.password_confirmation = true;
          // 燈箱顯示
          this.alert.title = this.$t('system_message.password_not_matching');
          this.showAlert();
          return false;
        }
      }

      return true;
    },
    /**
     * @author odin
     * @description 清除相關的欄位內容
     */
    clearResetPassword() {
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
     * @description 送出重設密碼的ajax要求
     */
    async resetPassword() {
      let allPass = this.validationResetPassword();

      // 發送重設密碼請求
      if (allPass === true) {
        try {
          const res = await this.axios({
            url: studentResetPasswordPath,
            method: 'post',
            data: {
              token: this.forgetPwd.forgetToken,
              cellphone: this.forgetPwd.fullCellPhone,
              password: this.forgetPwd.password,
              password_confirmation: this.forgetPwd.password_confirmation,
              verify_code: this.forgetPwd.verify_code,
            },
          });

          if (res.data.data) {
            console.log('resetPassword Success');
            console.log('resetPassword res => ', res);

            // 清空輸入欄位
            this.clearResetPassword();

            // 轉址(成功導向登入頁面)
            this.$emit('backToLoginForm');
          }
        } catch (err) {
          console.log('resetPassword axios error response => ', err.response);
          console.log(
            'resetPassword axios error response message=> ',
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
