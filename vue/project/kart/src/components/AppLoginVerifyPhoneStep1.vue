<template>
  <div class="login_root verify_phone_root verify_step1" :class="rootClassObj">
    <h3 class="login_title">{{ $t('login_form.validate_phone') }}</h3>
    <h5 class="login_sub_title bigger">
      {{ $t('login_form.get_verify_code') }}
    </h5>

    <div class="input_group">
      <!-- 輸入手機 -->
      <div class="verify_input_control" :class="{ error: error.phoneNumber }">
        <vSelect
          v-model="phone.countryCode"
          :options="countryCodeList"
          class="phonenumber_countrycode"
          name="phonenumber_countrycode"
        />

        <input
          v-model="phone.phoneNumber"
          type="text"
          name="phonenumber"
          class="login_input phonenumber"
          :placeholder="$t('placeholder.phonenumber')"
          maxlength="15"
          @keyup.enter="fetchVerifyCode"
        />
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 下一步 -->
      <button
        class="kart-btn kart-sub w-100 next_step_btn"
        @click.prevent="fetchVerifyCode"
      >
        {{ $t('type_form.next') }}
      </button>
    </div>

    <!-- step progress -->
    <div class="step_progress active1">
      <div class="step step1"></div>
      <div class="step step2"></div>
      <div class="step step3"></div>
    </div>
  </div>
</template>

<script>
// Resources
import {
  studentSignupVerifyCodePath,
  forgetPasswordVerifyCodePath,
} from '@/store/ajax-path.js';
import { checkCellphone, checkIsEmpty } from '@/plugins/checker.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';

// Component
import vSelect from 'vue-select';

export default {
  name: 'AppLoginVerifyPhoneStep1',
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
      phone: {
        countryCode: '+86',
        phoneNumber: '',
      },
      error: {
        phoneNumber: false,
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
      return `${this.phone.countryCode}${this.phone.phoneNumber}`;
    },

    /**
     * @author odin
     * @description 第二步驟之後要導頁到哪裡去的路徑
     */
    path() {
      const path = window.localStorage.getItem('path');
      return path ? path : '';
    },
  },
  created() {
    // 取得多國國碼
    this.$store.dispatch('fetchCountryCodeList');

    // init
    this.initCheck();
  },
  methods: {
    /**
     * @author odin
     * @description 開啟燈箱
     */
    showAlert() {
      this.lightbox.openOrNot = true;
    },

    /**
     * @author odin
     * @description 確認是否有這些參數，否則就倒回登入頁面按照流程重新跑一次
     */
    initCheck() {
      if (checkIsEmpty(this.path)) {
        // 導頁
        this.$router.push({
          name: 'login',
          params: { lang: this.$route.params.lang },
        });
      }
    },

    /**
     * @author odin
     * @description 判斷要使用哪一個API(學生註冊/忘記密碼)的手機驗證
     */
    judgedfetchVerifyCodePath() {
      console.log('path', this.path);
      if (this.path === 'forget-password') {
        return forgetPasswordVerifyCodePath;
      } else if (this.path === 'signup') {
        return studentSignupVerifyCodePath;
      }
    },

    /**
     * @author odin
     * @description 手機驗證
     */
    validationFetchVerifyCode() {
      // 檢查電話
      // 台灣或大陸地區，依照電話檢查的規則走
      if (
        this.phone.countryCode === '+86' ||
        this.phone.countryCode === '+886'
      ) {
        if (
          checkCellphone(this.phone.countryCode, this.phone.phoneNumber) &&
          !checkIsEmpty(this.phone.countryCode) &&
          !checkIsEmpty(this.phone.phoneNumber)
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
      } else {
        // 非台灣或大陸地區，其電話號碼不得超過15碼
        if (
          !checkIsEmpty(this.phone.countryCode) &&
          !checkIsEmpty(this.phone.phoneNumber) &&
          this.phone.phoneNumber.length <= 15
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
      }

      return true;
    },

    /**
     * @author odin
     * @description 清除相關的input資料
     */
    clearFetchVerifyCode() {
      this.phone.countryCode = '+86';
      this.phone.phoneNumber = '';
    },

    /**
     * @author odin
     * @description 送出發出證碼的請求
     */
    async fetchVerifyCode() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('fetchVerifyCode');

      const allPass = this.validationFetchVerifyCode();

      let judgedfetchVerifyCodePath = this.judgedfetchVerifyCodePath();

      // 發送登入請求
      if (allPass) {
        try {
          const res = await this.axios({
            url: judgedfetchVerifyCodePath,
            method: 'post',
            data: {
              cellphone: this.fullCellPhone,
            },
          });

          if (res.data.data || res.data.status) {
            axiosSuccessHint('fetchVerifyCode', res);

            // 設定要驗證的手機資訊
            window.localStorage.setItem('fullCellPhone', this.fullCellPhone);
            window.localStorage.setItem('phoneNumber', this.phone.phoneNumber);
            window.localStorage.setItem('countryCode', this.phone.countryCode);
            window.localStorage.setItem(
              'resetPasswordToken',
              res.data.data.token,
            );

            // 清空輸入欄位
            this.clearFetchVerifyCode();

            // 導頁
            this.$router.push({
              name: 'verify-phone-step2',
              params: { lang: this.$route.params.lang },
            });
          }
        } catch (err) {
          console.log('fetchVerifyCode err', err);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },
  },
};
</script>
