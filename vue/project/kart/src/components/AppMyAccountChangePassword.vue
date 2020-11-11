<template>
  <div class="show_box change_password" :class="rootClassObj">
    <!-- 新密碼 -->
    <div
      class="password_form_group"
      :class="{ error: changePassword.newPassword.error }"
    >
      <label class="password_label" for="new_password">
        <img
          class="password_label_img"
          src="@/assets/img/myaccount/icon_key.png"
        />
        <span class="password_label_text">{{
          $t('myaccount.password.new_password')
        }}</span>
      </label>
      <div class="change_password_control">
        <input
          id="new_password"
          v-model="changePassword.newPassword.value"
          class="change_password_input new_password"
          type="password"
          :placeholder="$t('myaccount.password.enter_new_password')"
        />
        <img
          class="password_error_img"
          src="@/assets/img/login/icon_err@2x.png"
        />
      </div>
    </div>

    <!-- 確認密碼 -->
    <div
      class="password_form_group"
      :class="{ error: changePassword.confirmPassword.error }"
    >
      <label class="password_label" for="confirm_password">
        <img
          class="password_label_img"
          src="@/assets/img/myaccount/icon_key.png"
        />
        <span class="password_label_text">{{
          $t('myaccount.password.repeat_password')
        }}</span>
      </label>
      <div class="change_password_control">
        <input
          id="confirm_password"
          v-model="changePassword.confirmPassword.value"
          class="change_password_input confirm_password"
          type="password"
          :placeholder="$t('myaccount.password.repeat_password')"
        />
        <img
          class="password_error_img"
          src="@/assets/img/login/icon_err@2x.png"
        />
      </div>
    </div>

    <!-- 儲存 -->
    <div class="flex-center-right change_password_save_box">
      <button
        class="kart-btn kart-sub change_password_save"
        @click.prevent="saveChangePassword"
      >
        {{ $t('myaccount.info.save') }}
      </button>
    </div>
  </div>
</template>

<script>
// Resources
import {
  studentChangePasswordPath,
  teacherChangePasswordPath,
} from '@/store/ajax-path.js';
import { checkIsEmpty } from '@/plugins/checker.js';
import commonMixinObj from '@/mixins/common.js';
import { axiosSuccessHint } from '@/plugins/utility.js';

export default {
  name: 'AppMyAccountChangePassword',
  components: {},
  mixins: [commonMixinObj],
  props: {
    // changePassword: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      changePassword: {
        newPassword: {
          value: '',
          error: false,
        },
        confirmPassword: {
          value: '',
          error: false,
        },
      },
    };
  },
  created() {},
  methods: {
    /**
     * @author odin
     * @description 發出修改密碼的ajax
     */
    validationPassword() {
      let newPassword = this.changePassword.newPassword.value;
      let confirmPassword = this.changePassword.confirmPassword.value;

      if (checkIsEmpty(newPassword)) {
        // 不得為空
        this.changePassword.newPassword.error = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        this.changePassword.newPassword.error = false;
      }

      if (checkIsEmpty(confirmPassword)) {
        // 不得為空
        this.changePassword.confirmPassword.error = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        this.changePassword.confirmPassword.error = false;
      }

      if (newPassword !== confirmPassword) {
        // 兩者不相同
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.password_not_matching'),
        );
        return false;
      }

      // 驗證密碼成功
      return true;
    },
    /**
     * @author odin
     * @description 發出修改密碼的ajax
     */
    async saveChangePassword() {
      const pass = this.validationPassword();
      const path =
        this.loginType === 'student'
          ? studentChangePasswordPath
          : teacherChangePasswordPath;

      // 開啟 燈箱
      this.$bus.$emit('loading:on');

      if (pass) {
        try {
          const res = await this.axios({
            url: path,
            method: 'put',
            data: {
              password: this.changePassword.newPassword.value,
              password_confirmation: this.changePassword.confirmPassword.value,
            },
            headers: {
              Authorization: this.loginToken,
            },
          });

          if (res.data.data || res.data.status) {
            axiosSuccessHint('saveChangePassword', res);

            // 清除密碼的內容
            this.changePassword.newPassword = '';
            this.changePassword.confirmPassword = '';

            // 燈箱顯示
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.change_password_success'),
            );
          }
        } catch (err) {
          const message = err.response.data.message;

          // 修改密碼成功
          if (message) {
            // 燈箱顯示
            this.$bus.$emit('notify:message', message);
          }
        }
      }

      // 關閉 燈箱
      this.$bus.$emit('loading:off');
    },
  },
};
</script>

<style lang="scss" scoped></style>
