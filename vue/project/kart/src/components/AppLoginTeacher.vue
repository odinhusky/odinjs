<template>
  <div class="root login_root teacher_login_root" :class="rootClassObj">
    <h3 class="login_title">{{ $t('login_form.title1') }}</h3>
    <h5 class="login_sub_title smaller">{{ $t('login_form.title2') }}</h5>

    <div class="input_group">
      <!-- 老師登入 Email -->
      <div class="input_control" :class="{ error: error.email }">
        <img src="../assets/img/v2/login/mail@2x.png" class="input_icon" />
        <input
          v-model="teacher.email"
          type="text"
          name="email"
          class="login_input email"
          :placeholder="$t('placeholder.email')"
          @keyup.enter="teacherLogin"
        />
      </div>

      <!-- 老師登入 Password -->
      <div class="input_control" :class="{ error: error.password }">
        <img src="../assets/img/v2/login/key@2x.png" class="input_icon" />
        <input
          v-model="teacher.password"
          type="password"
          name="password"
          class="login_input password"
          :placeholder="$t('placeholder.password')"
          @keyup.enter="teacherLogin"
        />
      </div>

      <div class="flex-line">
        <!-- 記得我 -->
        <div class="checkbox_control mr-auto">
          <input
            id="login_remember_me"
            v-model="teacher.rememberme"
            type="checkbox"
            class="login_remember_me"
          />
          <label for="login_remember_me">{{
            $t('login_form.rememberme')
          }}</label>
        </div>
      </div>
    </div>

    <!-- 按鈕區 -->
    <div class="btn_group">
      <!-- 登入 -->
      <button
        class="kart-btn kart-sub w-100 login_btn"
        @click.prevent="teacherLogin"
      >
        {{ $t('login_form.login') }}
      </button>
      <!-- 回上頁 -->
      <router-link
        :to="{ name: 'login', params: { lang: this.$route.params.lang } }"
        class="kart-btn kart-gray w-100 back_btn"
      >
        {{ $t('login_form.back') }}
      </router-link>
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
import commonMixinObj from '@/mixins/common.js';

// Component
// import AppLightBox from '@/components/AppLightBox';

export default {
  name: 'AppLoginTeacher',
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
      // lightbox: {
      //   openOrNot: false,
      //   classname: 'teacher_login_lightbox',
      //   message: '',
      // },
      teacher: {
        email: '',
        password: '',
        rememberme: '',
      },
      error: {
        email: '',
        password: '',
      },
    };
  },
  computed: {},
  created() {},
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
     * @description 清空老師登入相關的資料
     */
    clearTeacherLogin() {
      this.teacher.email = '';
      this.teacher.password = '';
      this.teacher.rememberMe = false;
    },

    /**
     * @author odin
     * @description 老師登入驗證
     */
    validationTeacherLogin() {
      // 檢查email格式是否正確以及是否為空
      if (checkEmail(this.teacher.email) && !checkIsEmpty(this.teacher.email)) {
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

      // 檢查密碼是否為空
      if (!checkIsEmpty(this.teacher.password)) {
        console.log('Password Validation Pass');
        // 錯誤提示
        this.error.password = false;
      } else {
        // 錯誤提示
        this.error.password = true;

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
     * @description 老師登入
     */
    teacherLogin() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('teacherLogin');

      let allPass = this.validationTeacherLogin();

      // 發送登入請求
      if (allPass) {
        this.$store
          .dispatch('teacherLogin', {
            rememberMe: this.teacher.rememberMe,
            data: {
              email: this.teacher.email,
              password: this.teacher.password,
            },
          })
          .then(() => {
            console.log('teacherLogin Success');
            // 清空輸入欄位
            this.clearTeacherLogin();

            // 導頁到AppCourse
            this.$router.push({
              name: 'course',
              params: { lang: this.$route.params.lang },
            });
          })
          .catch(error => {
            console.log('teacherLogin Fail');
            console.log('teacherLogin error', error);
            if (error.message) {
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
