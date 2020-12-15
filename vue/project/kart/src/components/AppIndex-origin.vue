<template>
  <div class="root index_root" :class="rootClassObj">
    <div class="main-10 index_container">
      <!-- Banner -->
      <section class="index_section banner">
        <img :src="bannerPath" class="banner_img" alt />
      </section>

      <!-- 師資列表 -->
      <section class="index_section teachers_list">
        <h2 class="teachers_list_title">{{ $t('teacher_list.title') }}</h2>
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
                  <div v-if="i18n === 'cn' || i18n === 'tw'">
                    <span class="name_main">{{ dealTeacherName(item) }}</span>
                    <br />

                    <small class="name_sub">{{ item.name_en }}</small>
                    <br />
                  </div>

                  <div v-if="i18n === 'en'">
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
                    <div v-if="i18n === 'cn' || i18n === 'tw'">
                      <span class="intro_main">
                        {{ dealTeacherIntro(intro) }}
                      </span>
                      <br />

                      <small class="intro_sub">{{ intro.intro_en }}</small>
                      <br />
                    </div>

                    <div v-if="i18n === 'en'">
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
      v-model="alert.openOrNot"
      :title="alert.title"
      :classname="alert.classname"
    >
      <template slot="content">
        <router-link
          class="go_to_login"
          :to="{ name: 'login', params: { lang: this.$route.params.lang } }"
        >
          {{ $t('login_form.login_register') }}
        </router-link>
      </template>
    </AppAlert>
  </div>
</template>

<script>
// Resources
import { teacherListAPI } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';

// Component
import AppAlert from '@/components/AppAlert.vue';

export default {
  name: 'Index',
  components: {
    AppAlert,
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
      alert: {
        openOrNot: false,
        title: this.$t('system_message.enroll_after_login'),
        classname: 'index_alert',
      },
      teacherList: [],
    };
  },
  computed: {
    bannerPath() {
      return this.$store.state.indexBannerPath;
    },
  },
  created() {
    // banner 初始化
    this.$store
      .dispatch('fetchBannerImgPath')
      .then(() => {
        console.log('fetchBannerImgPath Success');
      })
      .catch(error => {
        console.log('fetchBannerImgPath Fail');
        console.log('fetchBannerImgPath error', error);
      });

    // 教師列表
    this.fetchTeacherList();
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
      if (this.i18n === 'cn') {
        return item.name;
      } else if (this.i18n === 'tw') {
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
      if (this.i18n === 'cn') {
        return intro.intro;
      } else if (this.i18n === 'tw') {
        return intro.intro_hant;
      } else {
        return '';
      }
    },
    /**
     * @author odin
     * @description 取得師資表
     */
    async fetchTeacherList() {
      try {
        const res = await this.axios.get(teacherListAPI);

        if (res.data.data || res.data.status) {
          console.log('fetchStudentAccountDetail Success');
          console.log('fetchStudentAccountDetail res => ', res);

          this.teacherList = res.data.data;
        }
      } catch (err) {
        console.log(
          'fetchStudentAccountDetail axios error response => ',
          err.response,
        );
        console.log(
          'fetchStudentAccountDetail axios error response message=> ',
          err.response.data.message,
        );
      }
    },
  },
};
</script>
