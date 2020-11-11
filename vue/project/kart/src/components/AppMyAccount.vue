<template>
  <div class="root myaccount_root" :class="rootClassObj">
    <main class="main-10">
      <div class="my_account_title_box">
        <img
          src="@/assets/img/v2/myaccount/myid@2x.png"
          class="my_account_title_img"
        />
        <p class="my_account_title">{{ $t('myaccount.title') }}</p>
      </div>

      <section class="account_setting">
        <div class="account_tabs">
          <button
            v-for="btn in tabs[loginType]"
            :key="btn.id"
            :class="{ ...btn.classname, active: category === btn.tabName }"
            @click.prevent="changeCategory(btn.tabName)"
          >
            {{ $t(`${btn.btnText}`) }}
          </button>
        </div>

        <!-- 顯示內容的部分 -->
        <section class="account_content">
          <!-- 個人設定 -->
          <AppMyAccountSetting
            v-if="category === 'mysetting'"
            :remaining-course="remainingCourse"
          />

          <!-- 修改密碼 -->
          <AppMyAccountChangePassword v-if="category === 'change_password'" />

          <!-- 剩餘課數 -->
          <AppMyAccountOrderList
            v-if="category === 'order_list'"
            :remaining-course="remainingCourse"
          />
        </section>
      </section>
    </main>
  </div>
</template>

<script>
// Resources
import { studentRemainingPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import categoryMixinObj from '@/mixins/category.js';
import { axiosSuccessHint } from '@/plugins/utility.js';

// Component
import AppMyAccountOrderList from '@/components/AppMyAccountOrderList.vue';
import AppMyAccountChangePassword from '@/components/AppMyAccountChangePassword.vue';
import AppMyAccountSetting from '@/components/AppMyAccountSetting.vue';

export default {
  name: 'AppMyAccount',
  components: {
    // AppAlert,
    AppMyAccountOrderList,
    AppMyAccountChangePassword,
    AppMyAccountSetting,
  },
  mixins: [commonMixinObj, categoryMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      category: '',
      // 根據不同的登入身份有不同的tab
      tabs: {
        student: [
          {
            id: 1,
            tabName: 'mysetting',
            classname: {
              account_btn: true,
              tab_btn: true,
              mysetting: true,
            },
            btnText: 'myaccount.info.mysetting',
          },
          {
            id: 2,
            tabName: 'change_password',
            classname: {
              account_btn: true,
              tab_btn: true,
              change_password: true,
            },
            btnText: 'myaccount.password.change_password',
          },
          {
            id: 3,
            tabName: 'order_list',
            classname: {
              account_btn: true,
              tab_btn: true,
              order_list: true,
            },
            btnText: 'myaccount.order.order_list',
          },
        ],
        teacher: [
          {
            id: 1,
            tabName: 'change_password',
            classname: {
              account_btn: true,
              tab_btn: true,
              change_password: true,
            },
            btnText: 'myaccount.password.change_password',
          },
        ],
      },
      remainingCourse: {
        points: 0,
        reviewable_points: 0,
      },
    };
  },
  created() {
    if (this.loginType === 'student') {
      // 個人帳戶資料
      // this.fetchStudentAccountDetail();

      // 剩餘課堂
      this.fetchRemainingCourse();
    }

    // 如果是老師登入的話就只有 修改密碼的功能
    if (this.loginType === 'teacher') {
      this.changeCategory('change_password');
    }
  },
  methods: {
    /**
     * @author odin
     * @description 取得這個使用者的剩餘課程
     * @param {string} token 登入的token
     */
    async fetchRemainingCourse() {
      try {
        const res = await this.axios({
          url: studentRemainingPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchRemainingCourse', res);

          // 資料處理
          this.remainingCourse.points = res.data.data.points;
          this.remainingCourse.reviewable_points =
            res.data.data.reviewable_points;
        }
      } catch (err) {
        const message = err.response.data.message;

        // 修改密碼成功
        if (message) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', message);
        }
      }
    },
  },
};
</script>
