<template>
  <div
    class="root nav_root nav_body"
    :class="{ tw : i18n === 'tw', cn : i18n === 'cn' , en : i18n === 'en' }"
  >
    <!-- 中間區塊 -->
    <nav class="nav" :class="{ logined: loginOrNot }">
      <!-- logo -->
      <div class="position-relative logo_box">
        <router-link
          class="logo_link"
          :to="{
            name: this.loginOrNot ? 'course' : 'index',
            params: { lang: this.$route.params.lang },
          }"
        >
          <img src="@/assets/img/v2/nav/keilogo@2x.png" class="logo_link_img" />
        </router-link>
        <a class="logo_link" @click.prevent="goToIndexJudge"> </a>
      </div>

      <!-- 右方區塊 -->
      <div class="nav_right">
        <!-- 導覽按鈕內容 -->
        <div v-if="loginOrNot === true" class="nav_btns">
          <!-- 收合漢堡按鈕 -->
          <button
            class="hamburger_btn"
            @click.prevent="navItemsIsShow = !navItemsIsShow"
          >
            <div class="line_box">
              <span class="hamburger_line line1"></span>
              <span class="hamburger_line line2"></span>
              <span class="hamburger_line line3"></span>
            </div>
          </button>

          <!-- 動畫顯現/隱藏的部分 -->
          <transition name="slide">
            <ul v-if="navItemsIsShow" class="btn_list">
              <!-- router-link -->
              <li
                v-for="routerItem in navItems.routerLinks"
                :key="routerItem.id"
                class="nav_item"
              >
                <router-link class="nav_btn" :to="routerItem.linkTo">
                  <img :src="routerItem.imgWhite" class="nav_img nav_white" />
                  <img :src="routerItem.imgBlue" class="nav_img nav_blue" />
                  <span class="nav_btn_text">
                    {{ $t(`${routerItem.spanTextCode}`) }}
                  </span>
                </router-link>
              </li>

              <!-- 一般aTag -->
              <!-- 通知 -->
              <li class="nav_item">
                <a href="javascript:void(0)" class="nav_btn has_dropdown_btn">
                  <img
                    :src="navItems.aTag[0].imgWhite"
                    class="nav_img nav_white"
                  />
                  <img
                    :src="navItems.aTag[0].imgBlue"
                    class="nav_img nav_blue"
                  />
                  <span class="nav_btn_text">{{
                    $t('navigation.notification')
                  }}</span>
                </a>
                <!-- 訊息通知 -->
                <div
                  class="drop_down notification"
                  :class="{ ...navItems.aTag[0].dropDown.dropDownClass }"
                >
                  <h5 class="notification_title">
                    {{ navItems.aTag[0].spanText }}
                  </h5>

                  <div class="notification_group">
                    <!-- 單一個通知 -->
                    <div
                      v-for="item in notifications"
                      :key="item.id"
                      class="notification_unit"
                    >
                      <div class="notification_divider"></div>
                      <p class="notification_content">{{ item.content }}</p>
                      <span class="notification_time">{{
                        item.created_at | formatDate
                      }}</span>
                    </div>
                  </div>
                </div>
              </li>

              <!-- 個人 -->
              <li class="nav_item">
                <a href="javascript:void(0)" class="nav_btn has_dropdown_btn">
                  <img
                    :src="navItems.aTag[1].imgWhite"
                    class="nav_img nav_white"
                  />
                  <img
                    :src="navItems.aTag[1].imgBlue"
                    class="nav_img nav_blue"
                  />
                  <span class="nav_btn_text">{{
                    $t('navigation.personal')
                  }}</span>
                </a>
                <!-- 彈跳出的視窗 -->
                <div
                  class="drop_down personal"
                  :class="{ ...navItems.aTag[1].dropDown.dropDownClass }"
                >
                  <h5 class="personal_title">{{ loginUserName }}</h5>
                  <div class="personal_divider"></div>
                  <div class="personal_group">
                    <!-- 聯絡管理員 -->
                    <div class="personal_unit">
                      <a
                        :href="
                          navItems.aTag[1].dropDown.personalObj.contact.linkTo
                        "
                        :class="
                          navItems.aTag[1].dropDown.personalObj.contact
                            .classname
                        "
                      >
                        {{
                          navItems.aTag[1].dropDown.personalObj.contact.linkText
                        }}
                      </a>
                    </div>
                    <!-- 帳戶 -->
                    <div class="personal_unit">
                      <router-link
                        :class="
                          navItems.aTag[1].dropDown.personalObj.account
                            .classname
                        "
                        :to="
                          navItems.aTag[1].dropDown.personalObj.account.linkTo
                        "
                      >
                        {{
                          navItems.aTag[1].dropDown.personalObj.account.linkText
                        }}
                      </router-link>
                    </div>
                    <!-- 登出 -->
                    <div class="personal_unit">
                      <a
                        :href="
                          navItems.aTag[1].dropDown.personalObj.logout.linkTo
                        "
                        :class="
                          navItems.aTag[1].dropDown.personalObj.logout.classname
                        "
                        @click.prevent="logout"
                      >
                        {{
                          navItems.aTag[1].dropDown.personalObj.logout.linkText
                        }}
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              <!-- 語系選擇 -->
              <li class="nav_item show_in_mobile">
                <div class="nav_padding_box_for_i18n_select">
                  <select
                    v-model="i18nLanguage"
                    name="i18n_select nav_item_i18n_select"
                    class="i18n_select nav_item_i18n_select"
                    @change="changeLanguage"
                  >
                    <option
                      v-for="item in langOption"
                      :key="item.key"
                      :value="item.value"
                    >
                      {{ item.text }}
                    </option>
                  </select>
                </div>
              </li>
            </ul>
          </transition>
        </div>

        <!-- 登入 -->
        <div v-if="loginOrNot === false" class="position-relative">
          <router-link
            :to="{ name: 'login', params: { lang: this.$route.params.lang } }"
            class="logout_link"
          >
            <img
              src="@/assets/img/nav/login_icon@3x.png"
              class="logout_link_img"
            />
          </router-link>
        </div>

        <!-- 語系切換 -->
        <div class="i18n_container">
          <select
            v-model="i18nLanguage"
            name="i18n_select"
            class="i18n_select"
            @change="changeLanguage"
          >
            <option
              v-for="item in langOption"
              :key="item.key"
              :value="item.value"
            >
              {{ item.text }}
            </option>
          </select>
        </div>
      </div>
    </nav>
    <!-- 提示燈箱 -->
    <AppAlert
      v-model="alert.openOrNot"
      :title="alert.title"
      class="nav_alert"
    ></AppAlert>
  </div>
</template>

<script>
// Resources
// import  getLoginToken,
// getLoginUserData,
// getLoginUserType,
// getLoginUserName,
// getNotifications,
// '@/plugins/utility.js';
// import { checkIsLogin } from '@/plugins/checker.js';
import commonMixinObj from '@/mixins/common.js';

// components
import AppAlert from '@/components/AppAlert.vue';

export default {
  name: 'TheNav',
  components: {
    AppAlert,
  },
  mixins: [commonMixinObj],
  data() {
    return {
      i18nLanguage: this.$i18n.locale,
      window: {
        fullWidth: 0,
        fullHeight: 0,
      },
      alert: {
        openOrNot: false,
        title: '',
      },
      langOption: [
        {
          value: 'zh-Hans',
          text: '簡中',
          key: 0,
        },
        {
          value: 'zh-Hant',
          text: '繁中',
          key: 1,
        },
        {
          value: 'en-US',
          text: 'EN',
          key: 2,
        },
      ],
      navItemsIsShow: false,
    };
  },
  computed: {
    loginOrNot() {
      let result = this.$store.state.user.detail.app_id ? true : false;
      return result;
    },
    loginToken() {
      return this.$store.state.user.loginToken;
    },
    loginType() {
      return this.$store.state.user.type;
    },
    loginUserName() {
      let loginDetail = this.$store.state.user.detail;
      return loginDetail[this.loginType].name;
    },
    notifications() {
      let notificationsArr = this.$store.state.notifications;
      return notificationsArr;
    },
    navItems() {
      return {
        routerLinks: [
          {
            // 影片重播
            id: 'r1',
            type: 'video',
            linkTo: {
              name: 'course-record',
              params: { lang: this.$route.params.lang },
            },
            imgWhite: require('@/assets/img/nav/icon_video.svg'),
            imgBlue: require('@/assets/img/nav/icon_video_blue.svg'),
            spanTextCode: 'navigation.video_record',
          },
          {
            // 行事曆
            id: 'r2',
            type: 'calendar',
            linkTo: {
              name: 'calendar',
              params: { lang: this.$route.params.lang },
            },
            imgWhite: require('@/assets/img/nav/calendar_icon_web@2x.png'),
            imgBlue: require('@/assets/img/nav/icon_calendar_2x.png'),
            spanTextCode: 'navigation.calendar',
          },
          {
            // 報名
            id: 'r3',
            type: 'browse',
            linkTo: {
              name: 'browse',
              params: { lang: this.$route.params.lang },
            },
            imgWhite: require('@/assets/img/nav/icon_myclass@2x.png'),
            imgBlue: require('@/assets/img/nav/icon_myclass_2x.png'),
            spanTextCode: 'navigation.mycourse',
          },
        ],
        aTag: [
          {
            // 通知
            id: 'a1',
            type: 'notification',
            imgWhite: require('@/assets/img/nav/icon_notice@2x.png'),
            imgBlue: require('@/assets/img/nav/icon_notice_2x.png'),
            spanText: this.$t('navigation.notification'),
            dropDown: {
              dropDownClass: {
                drop_alarm: true,
              },
            },
          },
          {
            // 個人
            id: 'a2',
            type: 'person',
            imgWhite: require('@/assets/img/nav/icon_header_login@2x.png'),
            imgBlue: require('@/assets/img/nav/icon_personal_2x.png'),
            spanText: this.$t('navigation.personal'),
            eventName: this.handlePerson,
            dropDown: {
              dropDownClass: {
                drop_person: true,
              },
              personalObj: {
                contact: {
                  id: 1,
                  routerLinkOrNot: false,
                  linkTo: 'mailto:admin@mail.com',
                  linkText: this.$t('navigation.contact_admin'),
                  classname: 'personal_btn contact_admin_btn',
                },
                account: {
                  id: 2,
                  routerLinkOrNot: true,
                  linkTo: {
                    name: 'my-account',
                    params: { lang: this.$route.params.lang },
                  },
                  linkText: this.$t('navigation.account'),
                  classname: 'personal_btn personal_account_btn',
                },
                logout: {
                  id: 3,
                  routerLinkOrNot: false,
                  linkTo: '#',
                  linkText: this.$t('navigation.logout'),
                  classname: 'personal_btn logout_btn',
                },
              },
            },
          },
        ],
      };
    },
  },
  watch: {
    'window.fullWidth'(width) {
      if (width > 1202) {
        this.navItemsIsShow = true;
      } else {
        this.navItemsIsShow = false;
      }
    },
  },
  created() {
    // 取得通知資料
    if (this.loginOrNot) {
      this.fetchNotifications();
    }
  },
  mounted() {
    this.window.fullWidth = window.innerWidth;
    this.window.fullHeight = window.innerHeight;
    // 取得裝置寬高
    window.onresize = () => {
      this.window.fullWidth = window.innerWidth;
      this.window.fullHeight = window.innerHeight;
    };
  },
  methods: {
    /**
     * @author odin
     * @description 開啟燈箱
     */
    showAlert() {
      this.alert.openOrNot = true;
    },

    /**
     * @author odin
     * @description 轉換語系 - 1. 更改localStorage的值 2. 更改Vuex中的state 3. 傳送當前語系給父層component
     */
    changeLanguage() {
      const langMap = {
        'zh-Hans': null,
        'zh-Hant': 'tw',
        'en-US': 'en',
      };
      const lang = langMap[this.i18nLanguage];
      this.$router.push({
        name: this.$route.name,
        params: { lang: lang },
      });
    },

    /**
     * @author odin
     * @description 取得通知資料並放在data的欄位中
     */
    fetchNotifications() {
      this.$store
        .dispatch('fetchNotifications')
        .then(() => {
          console.log('fetchNotifications Success');
        })
        .catch(error => {
          console.log('fetchNotifications Fail');
          console.log('fetchNotifications error', error);
          if (error.message) {
            // 燈箱顯示
            this.alert.title = error.message;
            this.showAlert();
          }
        });
    },

    /**
     * @author odin
     * @description 處理登出的功能
     */
    logout() {
      console.log('logout');

      this.$store
        .dispatch('logout')
        .then(() => {
          console.log('logout Success');
          // 轉回首頁
          this.$router.push({
            name: 'index',
            params: { lang: this.$route.params.lang },
          });
        })
        .catch(error => {
          console.log('logout Fail');
          console.log('logout error', error);
          if (error.message) {
            // 燈箱顯示
            this.alert.title = error.message;
            this.showAlert();
          }
        });
    },

    /**
     * @author odin
     * @description 處理點選 logo 回到的頁面
     */
    goToIndexJudge() {
      if (this.loginOrNot) {
        this.$router.push({
          name: 'course',
          params: { lang: this.$route.params.lang },
        });
      } else {
        this.$router.push({
          name: 'index',
          params: { lang: this.$route.params.lang },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 240px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
