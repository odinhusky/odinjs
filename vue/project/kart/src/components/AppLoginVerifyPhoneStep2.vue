<template>
  <div class="login_root verify_phone_root verify_step2" :class="rootClassObj">
    <h3 class="login_title">{{ $t('verify_code.enter_verify_code') }}</h3>
    <h5 class="login_sub_title bigger">
      <span>{{ $t('verify_code.verify_code_had_sent', [fullCellPhone]) }}</span>
      <button
        to="verify-phone-step1"
        class="edit_phone_number"
        @click.prevent="goBackToPhoneVerifyStep1"
      >
        {{ $t('verify_code.edit') }}
      </button>
    </h5>

    <div class="input_group">
      <!-- 輸入驗證碼 -->
      <div class="verify_input_control" :class="{ error: error.verifyCode }">
        <input
          v-model.number="verifyCode"
          type="text"
          name="verifycode"
          class="login_input verifycode"
          :placeholder="$t('placeholder.verifycode')"
          maxlength="4"
          @keyup.enter="saveVerifyCode"
        />
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 驗證 -->
      <button
        class="kart-btn kart-sub full_btn verify"
        @click.prevent="saveVerifyCode"
      >
        {{ $t('verify_code.verify') }}
      </button>

      <div class="flex-line verify_links">
        <!-- 重新取得驗證碼 -->
        <a
          class="trans-btn verify_link re_get_verify_code"
          :class="{ disabled: counting > 0 }"
          @click.prevent="fetchVerifyCode"
        >
          {{ $t('verify_code.re_get_verify_code') }}({{ counting }})
        </a>

        <!-- 無法取得驗證碼 -->
        <router-link
          :to="{
            name: 'verify-phone-fail',
            params: { lang: this.$route.params.lang },
          }"
          class="trans-btn verify_link didnt_recieve_code"
        >
          {{ $t('verify_code.didnt_recieve_code') }}
        </router-link>
      </div>
    </div>

    <!-- step progress -->
    <div class="step_progress active2">
      <div class="step step1"></div>
      <div class="step step2"></div>
      <div class="step step3"></div>
    </div>

    <!-- 文字燈箱 -->
    <!-- <AppLightBox v-model="lightbox.openOrNot" :classname="lightbox.classname">
      <template>{{ lightbox.message }}</template>
    </AppLightBox> -->
  </div>
</template>

<script>
// Resources
import { checkIsEmpty } from '@/plugins/checker.js';
import {
  forgetPasswordVerifyCodePath,
  studentSignupVerifyCodePath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';

// Component
// import AppLightBox from '@/components/AppLightBox';

export default {
  name: 'AppLoginVerifyPhoneStep2',
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
      // 倒數180秒
      counting: 180,
      verifyCode: '',
      // lightbox: {
      //   openOrNot: false,
      //   classname: 'verify_phone_lightbox',
      //   message: '',
      // },
      error: {
        verifyCode: false,
      },
      nextPath: '',
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
    console.log('fullCellPhone', this.fullCellPhone);
    console.log('phoneNumber', this.phoneNumber);
    console.log('countryCode', this.countryCode);
    console.log('path', this.path);

    // init
    this.initCheck();
    // 設定接下來要去哪個頁面的路徑
    this.setPath();
  },
  mounted() {
    // 頁面載入都完成後開始倒數
    this.countDown();
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
      if (
        checkIsEmpty(this.fullCellPhone) ||
        checkIsEmpty(this.phoneNumber) ||
        checkIsEmpty(this.path) ||
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
     * @description 刪除手機的相關 localStorage 並回到 step1
     */
    goBackToPhoneVerifyStep1() {
      window.localStorage.removeItem('fullCellPhone');
      window.localStorage.removeItem('phoneNumber');
      window.localStorage.removeItem('countryCode');
      // 導頁
      this.$router.push({
        name: 'verify-phone-step1',
        params: { lang: this.$route.params.lang },
      });
    },

    /**
     * @author odin
     * @description 設定接下來要去哪個頁面的路徑
     */
    setPath() {
      const path = window.localStorage.getItem('path');
      this.nextPath = path ? path : 'verify-phone-step1';
    },

    /**
     * @author odin
     * @description 倒數計時
     */
    countDown() {
      this.timer = setInterval(() => {
        console.log('counting', this.counting);
        console.log('counting', typeof this.counting);

        this.counting -= 1;

        if (this.counting === 0) {
          // 停止 counting
          clearInterval(this.timer);
        }
      }, 1000);
    },

    /**
     * @author odin
     * @description 驗證碼欄位是否為空
     */
    validationVerifyCode() {
      // 檢查驗證碼
      if (!checkIsEmpty(this.verifyCode)) {
        console.log('Validation Pass');
        // 錯誤提示
        this.error.verifyCode = false;
      } else {
        // 錯誤提示
        this.error.verifyCode = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      }

      return true;
    },

    /**
     * @author odin
     * @description 清除驗證碼內容
     */
    clearVerifyCode() {
      this.verifyCode = '';
    },

    /**
     * @author odin
     * @description 確認驗證碼不為空之後，存取到localStorage中
     */
    saveVerifyCode() {
      console.log('saveVerifyCode');
      const allPass = this.validationVerifyCode();

      // 發送登入請求
      if (allPass) {
        // 設定驗證碼
        window.localStorage.setItem('verify_code', this.verifyCode);

        this.clearVerifyCode();

        // 導頁
        this.$router.push({
          name: this.nextPath,
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
      if (this.path === '/forget-password') {
        return forgetPasswordVerifyCodePath;
      } else if (this.path === '/signup') {
        return studentSignupVerifyCodePath;
      }
    },

    /**
     * @author odin
     * @description 送出發出證碼的請求
     */
    async fetchVerifyCode() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('fetchVerifyCode');
      let judgedfetchVerifyCodePath = this.judgedfetchVerifyCodePath();

      if (this.counting <= 0) {
        // 送出發出證碼的請求
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

            // 燈箱顯示
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.success'),
            );

            // 重啟倒數計時
            this.counting = 180;
            this.countDown();
          }
        } catch (err) {
          console.log('fetchVerifyCode', err);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },
  },
  // Router-Setting
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`

    console.log('beforeRouteLeave to', to);
    console.log('beforeRouteLeave from', from);
    console.log('beforeRouteLeave next', next);
    console.log('beforeRouteLeave this', this);

    // 停止 counting
    clearInterval(this.timer);

    // 前往要去的頁面
    next();
  },
};
</script>
