<template>
  <div class="login_part login_r">
    <!-- 中間區塊 -->
    <div class="login_title">
      <p class="login_title_p login_title1">{{ $t('login_form.title1') }}</p>
      <p class="login_title_p login_title2">{{ $t('login_form.title2') }}</p>
    </div>

    <div class="form-ctrl">
      <form class="input_data_form">
        <!-- 老師登入:email欄位 -->
        <AppLoginFormInputGroup
          v-if="activeType === 'teacher'"
          :icon-path="require('../assets/img/login/icon1@2x.png')"
          :error-path="require('../assets/img/login/icon_err@2x.png')"
          :focus-or-not="focus.email"
          :error-or-not="error.email"
          :classname="{ mail_icon: true }"
        >
          <template slot="input">
            <input
              v-model="user.email"
              type="text"
              class="form_input login_email"
              name="login_email"
              placeholder="輸入email"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </template>
        </AppLoginFormInputGroup>
        <!-- 學生登入:輸入手機號碼 -->
        <div
          v-if="activeType === 'student'"
          class="input_gp gp_cellphone"
          :class="{ focused: focus.cellphone, error: error.cellphone }"
        >
          <div class="icon_body icon_phone icon_left">
            <img src="@/assets/img/login/icon2@2x.png" class="icon_phone_img" />
          </div>

          <div class="form_unit form_countrycode">
            <vSelect
              v-model="user.countryCode"
              :options="countryCodeList"
              class="form_select login_countrycode"
              name="login_countrycode"
            />
            <!-- <select
              v-model="user.countryCode"
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
              id="login_cellphone"
              v-model="user.cellphone"
              type="text"
              class="form_input login_cellphone"
              name="login_cellphone"
              :placeholder="$t('placeholder.phonenumber')"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>

          <div class="icon_body icon_error">
            <img
              src="@/assets/img/login/icon_err@2x.png"
              class="icon_error_img"
            />
          </div>
        </div>
        <!-- 輸入手機號碼 -->
        <!-- 輸入密碼 -->
        <AppLoginFormInputGroup
          :icon-path="require('../assets/img/login/icon_key@2x.png')"
          :error-path="require('../assets/img/login/icon_err@2x.png')"
          :focus-or-not="focus.password"
          :error-or-not="error.password"
        >
          <template slot="input">
            <input
              v-model="user.password"
              type="password"
              class="form_input login_password"
              name="login_password"
              :placeholder="$t('placeholder.password')"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </template>
        </AppLoginFormInputGroup>
        <!-- 輸入密碼 -->
        <!-- 記得我 + 忘記密碼 -->
        <div class="login_detail">
          <div class="form_unit_detail">
            <input
              id="login_remember_me"
              v-model="user.rememberMe"
              type="checkbox"
              class="login_remember_me"
            />
            <label for="login_remember_me">{{
              $t('login_form.rememberme')
            }}</label>
          </div>

          <div v-if="activeType === 'student'" class="form_unit_detail">
            <a
              id="login_forget_link"
              class="login_forget_link"
              @click.prevent="goToForgetPwd"
              >{{ $t('login_form.forget') }}</a
            >
          </div>
        </div>
        <!--  記得我 + 忘記密碼 -->
        <!-- 按扭區 -->
        <div class="w-100">
          <div class="w-100 mb-3 login_sec">
            <button
              class="kart-btn kart-main login_btn"
              @click.prevent="loginJudge"
            >
              {{ $t('login_form.login') }}
            </button>
          </div>

          <div class="other_sec">
            <button
              v-if="activeType === 'student'"
              class="kart-btn kart-gray other_btn signin_btn"
              @click.prevent="goToSignUp"
            >
              {{ $t('login_form.register') }}
            </button>

            <button
              v-if="activeType === 'student'"
              class="kart-btn kart-gray back_btn"
              :class="{ other_btn: activeType === 'student' }"
              @click.prevent="backToPreviousPage"
            >
              {{ $t('login_form.back') }}
            </button>

            <button
              v-if="activeType === 'teacher'"
              class="kart-btn kart-gray back_btn"
              :class="{ login_btn: activeType === 'teacher' }"
              @click.prevent="backToStudentLogin"
            >
              {{ $t('login_form.back') }}
            </button>
          </div>
          <div v-if="activeType === 'student'" class="w-100 mb-3 teacher_login">
            <div class="atag_center">
              <a href="#" @click.prevent="goToTeacherLogin">
                <span class="text_link_text">{{
                  $t('login_form.administrator_login')
                }}</span>
                <span class="right-arrow text_link_symbol"></span>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
    <AppAlert
      v-model="alert.openOrNot"
      :title="alert.title"
      :classname="alert.classname"
    ></AppAlert>
  </div>
</template>

<script>
import { checkCellphone, checkEmail, checkIsEmpty } from '@/plugins/checker.js';
import AppLoginFormInputGroup from '@/components/AppLoginFormInputGroup.vue';
import AppAlert from '@/components/AppAlert.vue';
import vSelect from 'vue-select';

export default {
  name: 'AppLoginForm',
  components: {
    AppLoginFormInputGroup,
    AppAlert,
    vSelect,
  },
  props: {
    activeType: {
      type: String,
      required: true,
    },
    step: {
      type: String,
      required: true,
    },
    countryCodeList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // options: [
      //   {
      //     value: '+86',
      //     text: '+86',
      //   },
      //   {
      //     value: '+886',
      //     text: '+886',
      //   },
      // ],
      // select2Options: [
      //   {
      //     label: '+86',
      //     code: '+86',
      //   },
      //   {
      //     label: '+886',
      //     code: '+886',
      //   },
      // ],
      user: {
        countryCode: '+86',
        cellphone: '',
        fullCellPhone: '',
        password: '',
        email: '',
        rememberMe: false,
      },
      focus: {
        email: false,
        cellphone: false,
        password: false,
      },
      error: {
        email: false,
        cellphone: false,
        password: false,
      },
      alert: {
        openOrNot: false,
        title: '',
        classname: 'login_error_alert',
      },
    };
  },
  methods: {
    goToForgetPwd() {
      this.$emit('goToForgetPwd');
    },
    goToSignUp() {
      this.$emit('goToSignUp');
    },
    goToTeacherLogin() {
      this.$emit('goToTeacherLogin');
    },
    backToStudentLogin() {
      this.$emit('backToStudentLogin');
    },
    backToPreviousPage() {
      this.$router.go(-1);
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
     * @description 處理input focus的特效
     */
    handleFocus(e) {
      const inputName = e.path[0].name;
      if (inputName === 'login_cellphone') {
        this.focus.cellphone = true;
      } else if (inputName === 'login_password') {
        this.focus.password = true;
      } else if (inputName === 'login_email') {
        this.focus.email = true;
      }
    },
    /**
     * @author odin
     * @description 處理input blur的特效
     */
    handleBlur(e) {
      const inputName = e.path[0].name;
      if (inputName === 'login_cellphone') {
        this.focus.cellphone = false;
      } else if (inputName === 'login_password') {
        this.focus.password = false;
      } else if (inputName === 'login_email') {
        this.focus.email = false;
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
     * @description 判斷login要用哪一個方法
     */
    loginJudge() {
      const activeType = this.activeType;

      if (activeType === 'student') {
        this.studentLogin();
      } else if (activeType === 'teacher') {
        this.teacherLogin();
      }
    },
    /**
     * @author odin
     * @description 學生登入驗證
     */
    validationStudentLogin() {
      // 檢查電話
      if (
        checkCellphone(this.user.countryCode, this.user.cellphone) &&
        !checkIsEmpty(this.user.countryCode) &&
        !checkIsEmpty(this.user.cellphone)
      ) {
        // 都沒錯的話就把組合好的電話格式放到data中
        this.user.fullCellPhone = this.handleCellphone(
          this.user.countryCode,
          this.user.cellphone,
        );
        // error標示拿掉
        this.error.cellphone = false;
      } else {
        // 錯誤相關顯示
        this.error.cellphone = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.cellphone_format_error');
        this.showAlert();
        return false;
      }

      // 檢查密碼是否為空
      if (!checkIsEmpty(this.user.password)) {
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

      return true;
    },
    /**
     * @author odin
     * @description 老師登入驗證
     */
    validationTeacherLogin() {
      // 檢查email格式是否正確以及是否為空
      if (checkEmail(this.user.email) && !checkIsEmpty(this.user.email)) {
        // error標示拿掉
        this.error.email = false;
      } else {
        // 錯誤相關顯示
        this.error.email = true;
        // 燈箱顯示
        this.alert.title = this.$t('system_message.email_format_error');
        this.showAlert();
        return false;
      }

      // 檢查密碼是否為空
      if (!checkIsEmpty(this.user.password)) {
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

      return true;
    },
    /**
     * @author odin
     * @description 清空學生登入相關的資料
     */
    clearStudentLogin() {
      this.user.fullCellPhone = '';
      this.user.password = '';
      this.user.countryCode = '+86';
      this.user.cellphone = '';
      this.user.rememberMe = false;
    },
    /**
     * @author odin
     * @description 清空老師登入相關的資料
     */
    clearTeacherLogin() {
      this.user.email = '';
      this.user.password = '';
      this.user.rememberMe = false;
    },
    /**
     * @author odin
     * @description 學生登入
     */
    studentLogin() {
      console.log('teacherLogin');
      const allPass = this.validationStudentLogin();

      // 發送登入請求
      if (allPass) {
        this.$store
          .dispatch('studentLogin', {
            rememberMe: this.user.rememberMe,
            data: {
              cellphone: this.user.fullCellPhone,
              password: this.user.password,
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
            if (error.message) {
              // 燈箱顯示
              this.alert.title = error.message;
              this.showAlert();
            }
          });
      }
    },
    /**
     * @author odin
     * @description 老師登入
     */
    teacherLogin() {
      console.log('teacherLogin');
      const allPass = this.validationTeacherLogin();

      // 發送登入請求
      if (allPass) {
        this.$store
          .dispatch('teacherLogin', {
            rememberMe: this.user.rememberMe,
            data: {
              email: this.user.email,
              password: this.user.password,
            },
          })
          .then(() => {
            console.log('teacherLogin Success');
            // 清空輸入欄位
            this.clearTeacherLogin();
          })
          .catch(error => {
            console.log('teacherLogin Fail');
            console.log('teacherLogin error', error);
            if (error.message) {
              // 燈箱顯示
              this.alert.title = error.message;
              this.showAlert();
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
