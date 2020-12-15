<template>
  <div class="root login_root verify_phone_fail_root" :class="rootClassObj">
    <h3 class="login_title">{{ $t('verify_code.fill_up_form') }}</h3>
    <h5 class="login_sub_title bigger"></h5>

    <div class="input_group">
      <!-- 姓名 -->
      <div class="input_control" :class="{ error: error.name }">
        <img src="../assets/img/v2/login/person@2x.png" class="input_icon" />
        <input
          v-model.trim="fail.name"
          type="text"
          name="name"
          class="login_input name"
          :placeholder="$t('placeholder.name')"
        />
      </div>

      <!-- 電子郵件 -->
      <div class="input_control" :class="{ error: error.email }">
        <img src="../assets/img/v2/login/mail@2x.png" class="input_icon" />
        <input
          v-model.trim="fail.email"
          type="text"
          name="mail"
          class="login_input mail"
          :placeholder="$t('placeholder.email')"
        />
      </div>

      <!-- 帶入具有國碼的電話 -->
      <div class="input_control disabled">
        <img src="../assets/img/v2/login/phone@2x.png" class="input_icon" />
        <input
          v-model="fail.fullCellPhone"
          type="text"
          name="phone"
          class="login_input phone"
          :placeholder="$t('placeholder.phonenumber')"
        />
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 修改密碼 -->
      <button
        class="kart-btn kart-sub w-100 send_fail_btn"
        @click.prevent="requestVerifyFail"
      >
        {{ $t('register_form.send') }}
      </button>
    </div>

    <!-- 文字燈箱 -->
    <!-- <AppLightBox v-model="lightbox.openOrNot" :classname="lightbox.classname">
      <template>{{ lightbox.message }}</template>
    </AppLightBox> -->
  </div>
</template>

<script>
// Resources
import { checkEmail, checkIsEmpty } from '@/plugins/checker.js';
import { verifyPhoneFailPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';

// Component
// import AppLightBox from '@/components/AppLightBox';

export default {
  name: 'AppLoginVerifyPhoneFail',
  components: {
    // AppLightBox,
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
      fail: {
        name: '',
        email: '',
        fullCellPhone: '',
      },
      error: {
        name: false,
        email: false,
      },
      // lightbox: {
      //   openOrNot: false,
      //   classname: 'verify_fail_lightbox',
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
  },
  created() {
    console.log('fullCellPhone', this.fullCellPhone);
    console.log('phoneNumber', this.phoneNumber);
    console.log('countryCode', this.countryCode);
    // init
    this.fail.fullCellPhone = this.fullCellPhone;
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
        checkIsEmpty(this.countryCode)
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
     * @description 驗證相關的input內容
     */
    validationVerifyFail() {
      // 檢查 姓名
      if (!checkIsEmpty(this.fail.name)) {
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
      if (checkEmail(this.fail.email) && !checkIsEmpty(this.fail.email)) {
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
    },

    /**
     * @author odin
     * @description 清除相關的input內容
     */
    clearVerifyFail() {
      this.fail.name = '';
      this.fail.email = '';
    },

    /**
     * @author odin
     * @description 發出失敗的請求讓管理者知道
     */
    async requestVerifyFail() {
      console.log('fetchVerifyCode');
      const allPass = this.validationVerifyFail();

      // 發送登入請求
      if (allPass) {
        try {
          const res = await this.axios({
            url: verifyPhoneFailPath,
            method: 'post',
            data: {
              name: this.fail.name,
              email: this.fail.email,
              cellphone_info: {
                country_code: this.countryCode,
                phone_number: this.phoneNumber,
              },
            },
          });

          if (res.data.data.status) {
            console.log('requestVerifyFail Success');
            console.log('requestVerifyFail res => ', res);

            // 燈箱顯示
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.success'),
            );

            // 1.5秒之後導頁
            setTimeout(() => {
              // 清空輸入欄位
              this.clearVerifyFail();

              this.$router.push({
                name: 'login',
                params: { lang: this.$route.params.lang },
              });
            }, 1500);
          }
        } catch (err) {
          console.log(
            'requestVerifyFail axios error response => ',
            err.response,
          );
          console.log(
            'requestVerifyFail axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.$bus.$emit('notify:message', err.response.data.message || err);
        }
      }
    },
  },
};
</script>
