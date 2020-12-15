<template>
  <div class="cellphone_validation_box">
    <form class="cellphone_validation">
      <div
        class="input_gp gp_vali_cellphone"
        :class="{ focused: focus.vali_cellphone, error: error.vali_cellphone }"
      >
        <div class="icon_body icon_phone icon_left">
          <img src="@/assets/img/login/icon2@2x.png" class="icon_phone_img" />
        </div>

        <div class="form_unit form_countrycode">
          <vSelect
            v-model="validation.countryCode"
            :options="countryCodeList"
            class="form_select login_countrycode"
            name="login_countrycode"
          />
          <!-- <select
            v-model="validation.countryCode"
            class="form_select login_countrycode"
            name="login_countrycode"
          >
            <option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :selected="item.selected"
            >
              {{ item.text }}
            </option>
          </select> -->
        </div>

        <div class="form_unit form_cellphone_number">
          <input
            v-model="validation.cellphone"
            type="text"
            class="form_input vali_cellphone"
            name="vali_cellphone"
            placeholder="輸入手機號碼"
            maxlength="11"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </div>

        <div class="vali_btn_container">
          <button
            class="kart-btn kart-sub vali_send_btn"
            @click.prevent="fetchVerifyCode"
          >
            {{ $t('register_form.send') }}
          </button>
        </div>

        <div class="icon_body icon_error verify_error">
          <VImg
            src="@/assets/img/login/icon_err@2x.png"
            class="icon_error_img"
          />
        </div>
      </div>
    </form>
    <AppAlert
      v-model="alert.openOrNot"
      :title="alert.title"
      :classname="alert.classname"
    ></AppAlert>
  </div>
</template>

<script>
// resources
import { fetchVerifyCodePath } from '@/store/ajax-path.js';
import { checkCellphone, checkIsEmpty } from '@/plugins/checker.js';

// component
import AppAlert from '@/components/AppAlert.vue';
import vSelect from 'vue-select';

export default {
  name: 'AppLoginGetCellphoneVerify',
  components: {
    AppAlert,
    vSelect,
  },
  props: {
    countryCodeList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      alert: {
        openOrNot: false,
        title: '',
        classname: 'forget_alert',
      },
      options: [
        {
          value: '+86',
          text: '+86',
        },
        {
          value: '+886',
          text: '+886',
        },
      ],
      validation: {
        countryCode: '+86',
        cellphone: '',
        fullCellPhone: '',
      },
      focus: {
        vali_cellphone: false,
      },
      error: {
        vali_cellphone: false,
      },
    };
  },
  methods: {
    handleFocus(e) {
      const inputName = e.path[0].name;
      if (inputName === 'vali_cellphone') {
        this.focus.vali_cellphone = true;
      }
    },
    handleBlur(e) {
      const inputName = e.path[0].name;
      if (inputName === 'vali_cellphone') {
        this.focus.vali_cellphone = false;
      }
    },

    /**
     * @author odin
     * @description 把國碼跟電話號碼組合
     */
    handleCellphone(countryCode, cellphone) {
      return `${countryCode}${cellphone}`;
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
     * @description 檢查電話格式
     */
    validationFetchVerifyCode() {
      // 檢查電話
      if (
        checkCellphone(
          this.validation.countryCode,
          this.validation.cellphone,
        ) &&
        !checkIsEmpty(this.validation.countryCode) &&
        !checkIsEmpty(this.validation.cellphone)
      ) {
        // 都沒錯的話就把組合好的電話格式放到data中
        this.validation.fullCellPhone = this.handleCellphone(
          this.validation.countryCode,
          this.validation.cellphone,
        );
        // error標示拿掉
        this.error.vali_cellphone = false;
      } else {
        // 錯誤相關顯示
        this.error.vali_cellphone = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.cellphone_format_error');
        this.showAlert();
        return false;
      }

      return true;
    },
    /**
     * @author odin
     * @description 清除相關的input資料
     */
    clearFetchVerifyCode() {
      this.validation.countryCode = '+86';
      this.validation.cellphone = '';
      this.validation.fullCellPhone = '';
    },

    /**
     * @author odin
     * @description 送出發出證碼的請求
     */
    async fetchVerifyCode() {
      console.log('fetchVerifyCode');
      const allPass = this.validationFetchVerifyCode();

      // 發送登入請求
      if (allPass) {
        try {
          const res = await this.axios({
            url: fetchVerifyCodePath,
            method: 'post',
            data: {
              cellphone: this.validation.fullCellPhone,
            },
          });

          if (res.data.data) {
            console.log('fetchVerifyCode Success');
            console.log('fetchVerifyCode res => ', res);

            // 把資料送到父層component
            this.$emit('emitDataToFatherComponent', {
              token: res.data.data.token,
              countryCode: this.validation.countryCode,
              cellphone: this.validation.cellphone,
              fullCellPhone: this.validation.fullCellPhone,
            });

            // 清空輸入欄位
            this.clearFetchVerifyCode();
          }
        } catch (err) {
          console.log('fetchVerifyCode axios error response => ', err.response);
          console.log(
            'fetchVerifyCode axios error response message=> ',
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

<style lang="scss" scoped>
.verify_error {
  right: 3.5rem;
}
</style>
