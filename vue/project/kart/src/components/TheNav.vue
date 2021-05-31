<template>
  <div class="root nav_root nav_body" :class="rootClassObj">
    <!-- 中間區塊 -->
    <nav class="nav" :class="{ logined: loginOrNot }">
      <!-- logo -->
      <div class="position-relative logo_box">
        <router-link
          class="logo_link"
          :to="{
            name: 'index',
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
            :class="{ open: navItemsIsShow }"
            @click.prevent="toggleHamburger"
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
              <!-- router-link(學生的帳號才顯示) -->
              <template v-if="loginType === 'student'">
                <li
                  v-for="routerItem in navItems.studentRouterLinks"
                  :key="routerItem.id"
                  class="nav_item"
                  @click.prevent="toggleNav"
                >
                  <router-link
                    class="nav_btn"
                    :to="routerItem.linkTo"
                    :class="routerItem.class"
                  >
                    <!-- 目前不要 icon -->
                    <img
                      :src="routerItem.imgMain"
                      class="nav_img nav_white d-none"
                    />
                    <img
                      :src="routerItem.imgSub"
                      class="nav_img nav_blue d-none"
                    />
                    <span class="nav_btn_text">
                      {{ $t(`${routerItem.spanTextCode}`) }}
                    </span>
                  </router-link>
                </li>
              </template>

              <!-- router-link(學生的帳號才顯示) -->
              <template v-if="loginType === 'teacher'">
                <li
                  v-for="routerItem in navItems.teacherRouterLinks"
                  :key="routerItem.id"
                  class="nav_item"
                  @click.prevent="toggleNav"
                >
                  <router-link
                    class="nav_btn"
                    :to="routerItem.linkTo"
                    :class="routerItem.class"
                  >
                    <!-- 目前不要 icon -->
                    <img
                      :src="routerItem.imgMain"
                      class="nav_img nav_white d-none"
                    />
                    <img
                      :src="routerItem.imgSub"
                      class="nav_img nav_blue d-none"
                    />
                    <span class="nav_btn_text">
                      {{ $t(`${routerItem.spanTextCode}`) }}
                    </span>
                  </router-link>
                </li>
              </template>

              <!-- 一般aTag -->
              <!-- 通知 -->
              <li class="nav_item" v-if="false">
                <a
                  class="nav_btn has_dropdown_btn"
                  :class="navItems.aTag[0].class"
                  @click.prevent=""
                >
                  <img
                    :src="navItems.aTag[0].imgMain"
                    class="nav_img nav_white d-none"
                  />
                  <img
                    :src="navItems.aTag[0].imgSub"
                    class="nav_img nav_blue d-none"
                  />
                  <span class="nav_btn_text">{{
                    $t('navigation.notification')
                  }}</span>
                </a>
                <!-- 訊息通知(暫時隱藏) -->
                <div
                  class="drop_down notification"
                  :class="{ ...navItems.aTag[0].dropDown.dropDownClass }"
                >
                  <h5 class="notification_title">
                    {{ navItems.aTag[0].spanText }}
                  </h5>

                  <div class="notification_group">
                    <template v-if="notifications.length > 0">
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
                    </template>
                    <template v-else>
                      <!-- 單一個通知 -->
                      <div class="notification_divider"></div>

                      <div class="notification_unit p-3">
                        <p class="notification_content text-center">
                          {{ $t('nextcourse.no_notification') }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </li>

              <!-- 個人 -->
              <li class="nav_item">
                <a
                  class="nav_btn"
                  :class="navItems.aTag[1].class"
                  @click.prevent="togglePersonalDropDown"
                >
                  <img
                    :src="navItems.aTag[1].imgMain"
                    class="nav_img nav_white d-none"
                  />
                  <img
                    :src="navItems.aTag[1].imgSub"
                    class="nav_img nav_blue d-none"
                  />
                  <span class="nav_btn_text">{{
                    $t('navigation.personal')
                  }}</span>
                </a>
                <!-- 彈跳出的視窗 -->
                <div
                  class="drop_down personal"
                  :class="{
                    ...navItems.aTag[1].dropDown.dropDownClass,
                    active: isShowPersonalDropdown,
                  }"
                >
                  <h5 class="personal_title">{{ loginUserName }}</h5>
                  <div class="personal_divider"></div>
                  <div class="personal_group">
                    <!-- 聯絡管理員 -->
                    <div class="personal_unit" @click="toggleNav">
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
                    <div class="personal_unit" @click="toggleNav">
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
                    <!-- 帳戶 -->
                    <div class="personal_unit" @click="toggleNav">
                      <router-link
                        :class="
                          navItems.aTag[1].dropDown.personalObj.videoUpload
                            .classname
                        "
                        :to="
                          navItems.aTag[1].dropDown.personalObj.videoUpload
                            .linkTo
                        "
                      >
                        {{
                          navItems.aTag[1].dropDown.personalObj.videoUpload
                            .linkText
                        }}
                      </router-link>
                    </div>
                    <!-- 登出 -->
                    <div class="personal_unit" @click="toggleNav">
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
                    v-model="i18nLanguageData"
                    name="i18n_select nav_item_i18n_select"
                    class="i18n_select nav_item_i18n_select"
                    @change="changeLanguage(i18nLanguageData)"
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
            v-model="i18nLanguageData"
            name="i18n_select"
            class="i18n_select"
            @change="changeLanguage(i18nLanguageData)"
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
import deviceSizeMixinObj from '@/mixins/device-size.js';

// components
// import AppAlert from '@/components/AppAlert.vue';

export default {
  name: 'TheNav',
  components: {
    // AppAlert,
  },
  mixins: [commonMixinObj, deviceSizeMixinObj],
  data() {
    return {
      i18nLanguageData: this.$i18n.locale,
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
      // 行動版的狀態是開啟的還是關閉的
      mobileHamburgerStatus: false,
      // 是否顯示個人的下拉選單
      isShowPersonalDropdown: false,
      window: {
        fullWidth: 0,
        fullHeight: 0,
      },
    };
  },
  computed: {
    notifications() {
      let notificationsArr = this.$store.state.notifications;
      return notificationsArr;
    },
    navItems() {
      return {
        studentRouterLinks: [
          {
            // 直播課程
            id: 'sr0',
            type: 'course',
            linkTo: {
              name: 'course',
              params: { lang: this.$route.params.lang },
            },
            imgMain: require('@/assets/img/nav/icon_video.svg'),
            imgSub: require('@/assets/img/nav/icon_video_blue.svg'),
            spanTextCode: 'navigation.course',
            class: 'course_nav_btn',
          },
          {
            // 錄播課程
            id: 'sr1',
            type: 'videos',
            linkTo: {
              name: 'videos',
              params: { lang: this.$route.params.lang },
            },
            imgMain: require('@/assets/img/nav/icon_video.svg'),
            imgSub: require('@/assets/img/nav/icon_video_blue.svg'),
            spanTextCode: 'navigation.videos',
            class: 'video_nav_btn',
          },
          // {
          //   // 行事曆
          //   id: 'sr2',
          //   type: 'calendar',
          //   linkTo: {
          //     name: 'calendar',
          //     params: { lang: this.$route.params.lang },
          //   },
          //   imgMain: require('@/assets/img/nav/calendar_icon_web@2x.png'),
          //   imgSub: require('@/assets/img/nav/icon_calendar_2x.png'),
          //   spanTextCode: 'navigation.calendar',
          // },
          // {
          //   // 課程瀏覽
          //   id: 'sr3',
          //   type: 'browse',
          //   linkTo: {
          //     name: 'browse',
          //     params: { lang: this.$route.params.lang },
          //   },
          //   imgMain: require('@/assets/img/nav/icon_myclass@2x.png'),
          //   imgSub: require('@/assets/img/nav/icon_myclass_2x.png'),
          //   spanTextCode: 'navigation.mycourse',
          //   class: 'browse_nav_btn',
          // },
          // {
          //   // 課程報名
          //   id: 'sr4',
          //   type: 'enroll',
          //   linkTo: {
          //     name: 'enroll',
          //     params: { lang: this.$route.params.lang },
          //   },
          //   imgMain: require('@/assets/img/v2/nav/heart@2x.png'),
          //   imgSub: require('@/assets/img/v2/nav/purchase_heart@2x.png'),
          //   spanTextCode: 'enroll.title',
          //   class: 'eroll_nav_btn',
          // },
          {
            // 我要報名
            id: 'sr5',
            type: 'browse',
            linkTo: {
              name: 'browse',
              params: { lang: this.$route.params.lang },
            },
            imgMain: require('@/assets/img/nav/icon_video.svg'),
            imgSub: require('@/assets/img/nav/icon_video_blue.svg'),
            spanTextCode: 'navigation.browse',
            class: 'browse_nav_btn',
          },
        ],
        teacherRouterLinks: [
          {
            // 直播課程
            id: 'tr0',
            type: 'course',
            linkTo: {
              name: 'course',
              params: { lang: this.$route.params.lang },
            },
            imgMain: require('@/assets/img/nav/icon_video.svg'),
            imgSub: require('@/assets/img/nav/icon_video_blue.svg'),
            spanTextCode: 'navigation.mycourse_page',
            class: 'course_nav_btn',
          },
        ],
        aTag: [
          {
            // 通知
            id: 'a1',
            type: 'notification',
            imgMain: require('@/assets/img/nav/icon_notice@2x.png'),
            imgSub: require('@/assets/img/nav/icon_notice_2x.png'),
            spanText: this.$t('navigation.notification'),
            class: 'notification_nav_btn',
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
            imgMain: require('@/assets/img/nav/icon_header_login@2x.png'),
            imgSub: require('@/assets/img/nav/icon_personal_2x.png'),
            spanText: this.$t('navigation.personal'),
            eventName: this.handlePerson,
            class: 'personal_nav_btn',
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
                videoUpload: {
                  id: 2,
                  routerLinkOrNot: true,
                  linkTo: {
                    name: 'video-upload',
                    params: { lang: this.$route.params.lang },
                  },
                  linkText: this.$t('navigation.video_upload'),
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
      // console.log('watch window.fullWidth', width);

      if (width > 1202) {
        this.navItemsIsShow = true;
      } else {
        // 修正判斷
        if (this.mobileHamburgerStatus) {
          this.navItemsIsShow = true;
        } else {
          this.navItemsIsShow = false;
        }
      }
    },
  },
  created() {
    // 取得通知資料
    if (this.loginOrNot) {
      this.fetchNotifications();
    }
  },
  methods: {
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
            this.$bus.$emit('notify:message', error.message);
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

    /**
     * @author odin
     * @description 點選漢堡選單時，同時變更狀態的開啟或是收合
     */
    toggleHamburger() {
      this.mobileHamburgerStatus = !this.mobileHamburgerStatus;
      this.navItemsIsShow = !this.navItemsIsShow;
    },

    /**
     * @author odin
     * @description 判斷個人的選單何時展開或收合
     */
    toggleNav() {
      if (this.window.fullWidth < 1200) {
        // 如果 個人的選單 開啟的狀態的話 就要順便關閉整個選單，並且調整狀態
        if (this.isShowPersonalDropdown) {
          this.isShowPersonalDropdown = false;
          this.navItemsIsShow = false;
          this.mobileHamburgerStatus = false;
        }
      } else {
        this.isShowPersonalDropdown = false;
      }
    },

    /**
     * @author odin
     * @description 個人的 dropdown 顯示
     */
    togglePersonalDropDown() {
      this.isShowPersonalDropdown = !this.isShowPersonalDropdown;
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
