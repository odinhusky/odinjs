<template>
  <div class="root login_root forgetpwd_root" :class="rootClassObj">
    <h3 class="login_title">{{ $t('login_form.forget') }}</h3>
    <h5 class="login_sub_title smaller"></h5>

    <div class="input_group">
      <!-- 重設密碼 -->
      <div class="input_control" :class="{ error: error.password }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="reset.password"
          type="password"
          name="password"
          class="login_input password"
          :placeholder="$t('placeholder.password')"
          @keyup.enter="requestResetPassword"
        />
      </div>

      <!-- 重設密碼 再輸入一次 -->
      <div class="input_control" :class="{ error: error.password_confirm }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="reset.password_confirm"
          type="password"
          name="password_confirm"
          class="login_input password_confirm"
          :placeholder="$t('placeholder.passwordconfirm')"
          @keyup.enter="requestResetPassword"
        />
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 修改密碼 -->
      <button
        class="kart-btn kart-sub w-100 change_password"
        @click.prevent="requestResetPassword"
      >
        {{ $t('myaccount.password.change_password') }}
      </button>
    </div>

    <!-- 文字燈箱 -->
    <AppLightBox v-model="lightbox.openOrNot" :classname="lightbox.classname">
      <template>{{ lightbox.message }}</template>
    </AppLightBox>
  </div>
</template>

<script>
// Resources
import { checkIsEmpty } from '@/plugins/checker.js';
import { studentResetPasswordPath } from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';

// Component
// import AppLightBox from '@/components/AppLightBox';

export default {
  name: 'AppLoginForgetPwd',
  components: {
    // AppLightBox
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
      reset: {
        password: '',
        password_confirm: '',
      },
      error: {
        password: '',
        password_confirm: '',
      },
      // lightbox: {
      //   openOrNot: false,
      //   classname: 'forget_password_lightbox',
      //   message: '',
      // },
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
    resetPasswordToken() {
      const resetPasswordToken = window.localStorage.getItem(
        'resetPasswordToken',
      );
      return resetPasswordToken ? resetPasswordToken : '';
    },
  },
  created() {
    console.log('fullCellPhone', this.fullCellPhone);
    console.log('phoneNumber', this.phoneNumber);
    console.log('countryCode', this.countryCode);
    console.log('verifyCode', this.verifyCode);
    console.log('resetPasswordToken', this.resetPasswordToken);

    // init
    this.initCheck();
  },
  methods: {
    /**
     * @author odin
     * @description 開啟燈箱
     */
    // showAlert() {
    //   this.lightbox.openOrNot = true;
    // },

    /**
     * @author odin
     * @description 確認是否有這些參數，否則就倒回登入頁面按照流程重新跑一次
     */
    initCheck() {
      if (
        checkIsEmpty(this.fullCellPhone) ||
        checkIsEmpty(this.phoneNumber) ||
        checkIsEmpty(this.countryCode) ||
        checkIsEmpty(this.verifyCode) ||
        checkIsEmpty(this.resetPasswordToken)
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
    validationResetPassword() {
      // 檢查 密碼
      if (checkIsEmpty(this.reset.password)) {
        // 錯誤提示
        this.error.password = true;
        this.error.password_confirm = false;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else if (checkIsEmpty(this.reset.password_confirm)) {
        // 錯誤提示
        this.error.password = false;
        this.error.password_confirm = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else if (this.reset.password !== this.reset.password_confirm) {
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
     * @description 驗證欄位是否正確
     */
    clearResetPassword() {
      this.reset.password = '';
      this.reset.password_confirm = '';
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
      window.localStorage.removeItem('resetPasswordToken');
    },

    /**
     * @author odin
     * @description 送出註冊
     */
    async requestResetPassword() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('requestResetPassword');

      const allPass = this.validationResetPassword();

      console.log('allPass', allPass);

      if (allPass) {
        try {
          const res = await this.axios({
            url: studentResetPasswordPath,
            method: 'post',
            data: {
              cellphone: this.fullCellPhone,
              password: this.reset.password,
              password_confirmation: this.reset.password_confirm,
              verify_code: this.verifyCode,
              token: this.resetPasswordToken,
            },
          });

          if (res.data.data || res.data.status) {
            axiosSuccessHint('requestResetPassword', res);

            // 清空輸入欄位
            this.clearResetPassword();

            // 清除localStorage的資料
            this.clearLoginLocalStorage();

            // 燈箱顯示
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.reset_password_success'),
            );

            // 1.5秒之後導頁
            setTimeout(() => {
              this.$router.push({
                name: 'login',
                params: { lang: this.$route.params.lang },
              });
            }, 1500);
          }
        } catch (err) {
          console.log('requestResetPassword err', err);
        } finally {
          // 關閉 loading
          this.$bus.$emit('loading:off');
        }
      } else {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },
  },
};
</script>
