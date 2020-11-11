<template>
  <div class="root show_box mysetting_root" :class="rootClassObj">
    <!-- 手機號碼 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.cellphone') }}：</h5>
      <div class="mysetting_content">
        <span class="mysetting_text">{{ loginUserFullCellphone }}</span>
      </div>
    </div>

    <!-- 姓名 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.name') }}：</h5>
      <div class="mysetting_content">
        <input
          v-model="myAccountSetting.value.name"
          type="text"
          class="mysetting_input name_setting"
          :class="{ error: myAccountSetting.error.name }"
        />
      </div>
    </div>

    <!-- 等級 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.level') }}：</h5>
      <div class="mysetting_content">
        <span class="mysetting_text">{{ loginUserLevel }}</span>
      </div>
    </div>

    <!-- Email -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.email') }}：</h5>
      <div class="mysetting_content">
        <input
          v-model="myAccountSetting.value.email"
          type="text"
          class="mysetting_input email_setting"
          :class="{ error: myAccountSetting.error.email }"
          :placeholder="$t('placeholder.email')"
        />
      </div>
    </div>

    <!-- 生日 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.birthday') }}：</h5>
      <div class="mysetting_content">
        <input
          v-model="myAccountSetting.value.birthday"
          type="text"
          class="mysetting_input birthday_setting"
          :class="{ error: myAccountSetting.error.birthday }"
          :placeholder="$t('placeholder.birthday')"
        />
      </div>
    </div>

    <!-- 性別 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.gender') }}：</h5>
      <div class="mysetting_content gender_radius_control">
        <!-- 男 -->
        <div class="form-group">
          <input
            v-model="myAccountSetting.value.gender"
            type="radio"
            name="gender"
            class="gender_radio gender_male"
            value="male"
            id="gender_male"
          />
          <label for="gender_male" class="gender_radio_label">{{
            $t('gender.male')
          }}</label>
        </div>

        <!-- 女 -->
        <div class="form-group">
          <input
            v-model="myAccountSetting.value.gender"
            type="radio"
            name="gender"
            class="gender_radio gender_female"
            value="female"
            id="gender_female"
          />
          <label for="gender_female" class="gender_radio_label">{{
            $t('gender.female')
          }}</label>
        </div>

        <!-- 其他 -->
        <div class="form-group">
          <input
            v-model="myAccountSetting.value.gender"
            type="radio"
            name="gender"
            class="gender_radio gender_other"
            value="other"
            id="gender_other"
          />
          <label for="gender_other" class="gender_radio_label">{{
            $t('gender.other')
          }}</label>
        </div>
      </div>
    </div>

    <!-- 微信號 -->
    <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('agent.wechat') }}：</h5>
      <div class="mysetting_content">
        <input
          v-model="myAccountSetting.value.wechat"
          type="text"
          class="mysetting_input wechat_setting"
          :class="{ error: myAccountSetting.error.wechat }"
          :placeholder="$t('placeholder.wechat')"
        />
      </div>
    </div>

    <!-- 代理商代碼 -->
    <!-- <div class="mysetting_form_group">
      <h5 class="mysetting_title">{{ $t('myaccount.info.agent_code') }}：</h5>
      <div class="mysetting_content">
        <input
          v-model="myAccountSetting.agentCode"
          type="text"
          class="mysetting_input agent_code_setting"
        />
      </div>
    </div> -->

    <!-- 下方訊息列 -->
    <div class="flex-center-left mysetting_save_box">
      <!-- 餘課數 -->
      <div class="remaining_course_box">
        <!-- 一般餘課數 -->
        <span class="remaining_line">
          {{ $t('purchase.normal_point', [remainingCourse.points]) }}
        </span>
        <!-- 評論餘課數 -->
        <span class="remaining_line">
          {{
            $t('purchase.reviewable_point', [remainingCourse.reviewable_points])
          }}
        </span>
      </div>

      <!-- 儲存 -->
      <button
        class="kart-btn kart-sub mysetting_save"
        @click.prevent="saveMyAccountSetting"
      >
        {{ $t('myaccount.info.save') }}
      </button>
    </div>
  </div>
</template>

<script>
// Resources
import {
  checkIsEmpty,
  checkEmail,
  checkDateFormat,
} from '@/plugins/checker.js';
import { studentChangeSettingPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import { axiosSuccessHint } from '@/plugins/utility.js';

export default {
  name: 'AppMyAccountSetting',
  components: {},
  mixins: [commonMixinObj],
  props: {
    // myAccount: {
    //   type: Object,
    //   required: true,
    // },
    remainingCourse: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      myAccountSetting: {
        value: {
          name: '',
          cellphone: '',
          email: '',
          level: '',
          birthday: '',
          gender: '',
          wechat: '',
          agentCode: '',
        },
        studentAccountDetail: {},
        error: {
          name: false,
          email: false,
          birthday: false,
        },
      },
    };
  },
  created() {
    // 元件初始化
    this.init();
  },
  computed: {
    /**
     * @author odin
     * @description 使用者(學生) 的身份是否為 VVIP
     * @return {boolean}
     */
    loginUserIsVVIP() {
      return this.$store.state.user.detail[this.loginType].is_vvip;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 VIP 物件
     * @return {boolean}
     */
    loginUserVipObj() {
      return this.$store.state.user.detail[this.loginType].vip;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 生日
     * @return {boolean}
     */
    loginUserBirthday() {
      return this.$store.state.user.detail[this.loginType].birthday;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 性別
     * @return {boolean}
     */
    loginUserGender() {
      return this.$store.state.user.detail[this.loginType].gender;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 性別(處理過後)
     * @return {boolean}
     */
    myAccountGender() {
      let gender = '';

      if (checkIsEmpty(this.loginUserGender)) {
        gender = 'male';
      } else {
        if (this.loginUserGender === 'none') {
          gender = 'other';
        } else {
          gender = this.loginUserGender;
        }
      }

      return gender;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 微信號
     * @return {boolean}
     */
    loginUserWechat() {
      return this.$store.state.user.detail[this.loginType].wechat;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 agent_code
     * @return {boolean}
     */
    loginUserAgentCode() {
      return this.$store.state.user.detail[this.loginType].agent_code;
    },

    /**
     * @author odin
     * @description 使用者(學生) 的 會員等級
     * @return {string} 一般會員 | VIP(期限) | VIP
     */
    loginUserLevel() {
      let levelStr = '';
      let startTime = '';
      let endTime = '';

      if (this.loginUserIsVVIP) {
        // 是 VVIP
        console.log(
          '================================是 VVIP================================',
        );
        levelStr = this.$t('role.vip');
      } else {
        if (this.loginUserVipObj === null) {
          console.log(
            '================================是 一般會員================================',
          );
          levelStr = this.$t('role.standard');
        } else {
          // 是有期限的 VIP
          console.log(
            '================================是 有期限的VIP================================',
          );
          startTime = this.formatDateWithSlash(this.loginUserVipObj.start_at);
          endTime = this.formatDateWithSlash(this.loginUserVipObj.expired_at);

          levelStr = `${this.$t('role.vip')}(${this.$t(
            'mycourse.expired',
          )}${startTime}${endTime})`;
        }
      }

      return levelStr;
    },
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化
     */
    init() {
      // 放置對應的資料
      this.myAccountSetting.value.cellphone = this.loginUserFullCellphone;
      this.myAccountSetting.value.name = this.loginUserName;
      this.myAccountSetting.value.level = this.loginUserLevel;
      this.myAccountSetting.value.email = this.loginUserEmail;
      this.myAccountSetting.value.birthday = this.loginUserBirthday;
      this.myAccountSetting.value.gender = this.myAccountGender;
      this.myAccountSetting.value.wechat = this.loginUserWechat;
      this.myAccountSetting.value.agentCode = this.loginUserAgentCode;
    },

    /**
     * @author odin
     * @description 轉換要送的 gender 資料型態
     */
    genderCompile() {
      if (this.myAccountSetting.value.gender === 'other') {
        return 'none';
      } else {
        return this.myAccountSetting.value.gender;
      }
    },

    /**
     * @author odin
     * @description 發出修改密碼的ajax
     */
    validationSetting() {
      let name = this.myAccountSetting.value.name;
      let email = this.myAccountSetting.value.email;
      let birthday = this.myAccountSetting.value.birthday;

      // 檢查姓名
      if (checkIsEmpty(name)) {
        // 不得為空
        this.myAccountSetting.error.name = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        console.log('Name Validation Pass');
        this.myAccountSetting.error.name = false;
      }

      // 檢查 Email格式
      if (checkIsEmpty(email)) {
        // 不得為空
        this.myAccountSetting.error.email = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        console.log('Email Validation Pass');
        this.myAccountSetting.error.email = false;
      }

      if (!checkEmail(email)) {
        // email 格式錯誤
        this.myAccountSetting.email.error = true;
        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.email_format_error'),
        );
        return false;
      } else {
        this.myAccountSetting.error.email = false;
      }

      // 檢查 生日
      if (!checkDateFormat(birthday)) {
        // 錯誤提示
        this.myAccountSetting.error.birthday = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.birthday_format_error'),
        );
        return false;
      } else if (checkIsEmpty(birthday)) {
        // 錯誤提示
        this.myAccountSetting.error.birthday = true;

        // 燈箱顯示
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.not_allow_empty'),
        );
        return false;
      } else {
        console.log('Birthday Validation Pass');
        // 錯誤提示
        this.myAccountSetting.error.birthday = false;
      }

      // 通過檢查
      return true;
    },

    /**
     * @author odin
     * @description 處理學生個人設定的儲存
     */
    async saveMyAccountSetting() {
      const pass = this.validationSetting();

      // 開啟 燈箱
      this.$bus.$emit('loading:on');

      if (pass) {
        let agent_code = this.myAccountSetting.value.agentCode,
          cellphone = this.myAccountSetting.value.cellphone,
          cellphone_info = {
            country_code: this.loginUserCountryCode,
            phone_number: this.loginUserPhoneNumber,
          },
          email = this.myAccountSetting.value.email,
          name = this.myAccountSetting.value.name,
          birthday = this.myAccountSetting.value.birthday,
          wechat = this.myAccountSetting.value.wechat,
          gender = this.genderCompile(this.myAccountSetting.value.gender);

        try {
          const res = await this.axios({
            url: studentChangeSettingPath,
            method: 'put',
            data: {
              agent_code,
              cellphone,
              cellphone_info,
              email,
              name,
              gender,
              birthday,
              wechat,
            },
            headers: {
              Authorization: this.loginToken,
            },
          });

          if (res.data.data || res.data.status) {
            axiosSuccessHint('saveMyAccountSetting', res);

            // 儲存個人資料 成功\
            // 燈箱顯示
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.change_info_success'),
            );
          }
        } catch (err) {
          const message = err.response.data.message;

          // 儲存個人資料 失敗
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
