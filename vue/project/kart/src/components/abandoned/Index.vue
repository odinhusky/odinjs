<template>
  <div class="index_box">
    <Nav @changeLanguage="changeLanguage" />

    <div class="main-10 index_container">
      <section class="index_section banner">
        <VImg :src="bannerPath" classname="banner_img" />
      </section>

      <section class="index_section teachers_list">
        <h2 class="teachers_list_title">
          {{ $t('teacher_list.title') }}
        </h2>
        <div class="teacher_unit_list">
          <div
            v-for="item in teacherList"
            :key="item.id"
            class="teacher_outer"
            @click="showAlert"
          >
            <div class="teacher_unit">
              <!-- 老師照片 -->
              <div
                class="teacher_img"
                :style="{ backgroundImage: `url(${item.img})` }"
              ></div>

              <div class="detail">
                <!-- 老師姓名 -->
                <h5 class="teacher_name">
                  <div
                    v-if="
                      i18nLanguage === 'zh-Hans' || i18nLanguage === 'zh-Hant'
                    "
                  >
                    <span class="name_main">{{ dealTeacherName(item) }}</span>
                    <br />

                    <small class="name_sub">{{ item.name_en }}</small>
                    <br />
                  </div>

                  <div v-if="i18nLanguage === 'en-US'">
                    <span class="name_main">{{ item.name_en }}</span>
                    <br />
                  </div>
                </h5>
                <!-- introns 介紹 -->
                <div class="intros">
                  <div
                    v-for="intro in item.intros"
                    :key="intro.id"
                    class="intro"
                  >
                    <div
                      v-if="
                        i18nLanguage === 'zh-Hans' || i18nLanguage === 'zh-Hant'
                      "
                    >
                      <span class="intro_main">{{
                        dealTeacherIntro(intro)
                      }}</span>
                      <br />

                      <small class="intro_sub">{{ intro.intro_en }}</small>
                      <br />
                    </div>

                    <div v-if="i18nLanguage === 'en-US'">
                      <span class="intro_main">{{ intro.intro_en }}</span>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- 提示燈箱 -->
    <AppAlert
      :open-or-not="alert.openOrNot"
      :title="$t('system_message.enroll_after_login')"
      classname="index_alert"
      @closeAlert="closeAlert"
    >
      <template slot="content">
        <router-link
          class="go_to_login"
          :to="{ name: 'login', params: { lang: this.$route.params.lang } }"
          >{{ $t('login_form.login_register') }}</router-link
        >
      </template>
    </AppAlert>
  </div>
</template>

<script>
import { getI18nLanguage } from '@/plugins/utility.js';
// import Nav from '@/components/Nav.vue';
// import VImg from '@/components/VImg.vue';
import AppAlert from '@/components/AppAlert.vue';

export default {
  name: 'Index',
  components: {
    // Nav,
    // VImg,
    AppAlert,
  },
  data() {
    return {
      i18nLanguage: getI18nLanguage(),
      alert: {
        openOrNot: false,
      },
      teacherList: [],
      // i18nLanguage: this.$store.state.i18nLanguage,
    };
  },
  computed: {
    bannerPath() {
      return this.$store.state.indexBannerPath;
    },
  },
  created() {
    // banner 初始化
    this.$store.dispatch('updateBannerImgPath', this.i18nLanguage);
    // 教師列表
    this.getTeacherList();
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
     * @description 處理不同語系老師名字的顯示
     * @param {object} item 單一個老師的所有資料
     */
    dealTeacherName(item) {
      if (this.i18nLanguage === 'zh-Hans') {
        return item.name;
      } else if (this.i18nLanguage === 'zh-Hant') {
        return item.name_hant;
      } else {
        return '';
      }
    },
    /**
     * @author odin
     * @description 處理不同語系老師背景介紹的顯示
     * @param {object} intro 單一個老師的所有背景介紹
     */
    dealTeacherIntro(intro) {
      if (this.i18nLanguage === 'zh-Hans') {
        return intro.intro;
      } else if (this.i18nLanguage === 'zh-Hant') {
        return intro.intro_hant;
      } else {
        return '';
      }
    },
    /**
     * @author odin
     * @description 更新 data.i18nLanguage 裡面的內容
     * @param {string} i18nLanguage 切換後的語系
     */
    changeLanguage(i18nLanguage) {
      this.i18nLanguage = i18nLanguage;
    },
    /**
     * @author odin
     * @description 取得師資表
     */
    getTeacherList() {
      const teacherListAPI = '/api/common/teachers';
      this.axios.get(teacherListAPI).then(res => {
        // console.log(res);
        let teacherList = res.data.data;
        this.teacherList = teacherList;
      });
    },
  },
};
</script>
