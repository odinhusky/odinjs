<template>
  <div class="root index_root" :class="rootClassObj">
    <!-- Nav -->
    <!-- 還沒登入 -->
    <template v-if="loginOrNot === false">
      <section class="sec loginbar_container">
        <router-link
          :to="{
            name: 'index',
            params: { lang: this.$route.params.lang },
          }"
          class="loginbar_logo"
        >
          <img
            class="img-fluid loginbar_logo_img"
            src="../assets/img/v2/index/keilogo@2x.png"
          />
        </router-link>

        <!-- 收合按鈕 -->
        <button class="loginbar_hamburger_btn" @click.prevent="toggleHamburger">
          <div class="loginbar_hamburger_btn_line"></div>
          <div class="loginbar_hamburger_btn_line"></div>
          <div class="loginbar_hamburger_btn_line"></div>
        </button>

        <!-- 動畫顯現/隱藏的部分 -->
        <transition name="slide">
          <!-- 要收合的內容 -->
          <div v-if="navItemsIsShow" class="loginbar_hamburger">
            <ul class="loginbar_hamburger_list">
              <!-- 還沒登入要顯示的 -->
              <li
                class="loginbar_hamburger_item unsigne_item"
                id="unsigne_items_container"
              >
                <ul
                  class="loginbar_hamburger_inside_ul uunsigne_list"
                  id="unsigne_list"
                >
                  <!-- 登入／註冊 -->
                  <li class="loginbar_hamburger_inside_li unsigne_item">
                    <router-link
                      :to="{
                        name: 'login',
                        params: { lang: this.$route.params.lang },
                      }"
                      class="kart-nav-btn kart-btn-outline signup_signin_btn"
                    >
                      {{ $t('login_form.login_register') }}
                    </router-link>
                  </li>
                </ul>
              </li>

              <!-- 登入了要顯示的 -->
              <li class="loginbar_hamburger_item hadsigned_items_container">
                <ul
                  class="loginbar_hamburger_inside_ul hadsigned_list"
                  id="hadsigned_list"
                >
                  <!-- 註冊 -->
                  <!-- <li class="loginbar_hamburger_inside_li hadsigned_item">
                                    <a href="login.html" class="kei_btn kei_btn_outline nav_btn signup_btn">註冊</a>
                                </li> -->
                </ul>
              </li>

              <!-- 語系選擇 -->
              <li class="loginbar_hamburger_item">
                <div class="i18n_container">
                  <select
                    v-model="i18nLanguageData"
                    class="i18n_btn_select"
                    @change="changeLanguage(i18nLanguageData)"
                  >
                    <option value="zh-Hans">简中</option>
                    <option value="zh-Hant">繁中</option>
                    <option value="en-US">EN</option>
                  </select>
                </div>
              </li>
            </ul>

            <!-- X 關閉按鈕 -->
            <button class="close_btn" @click="closeNavContent">
              <div class="close_line one"></div>
              <div class="close_line two"></div>
            </button>
          </div>
        </transition>
      </section>
    </template>
    <!-- 登入了 -->
    <template v-if="loginOrNot === true">
      <TheNav @changeLanguage="changeLanguage" />
    </template>

    <!-- Banner 輪播 -->
    <div class="sec banner_carousel">
      <Carousel
        :perPage="1"
        :paginationEnabled="false"
        :navigationEnabled="true"
        :navigationNextLabel="bannerNextContent"
        :navigationPrevLabel="bannerPrevContent"
      >
        <Slide v-for="slide in slideViewData" :key="slide.id">
          <div class="banner_slide">
            <!-- 768以上看到的 -->
            <img
              class="banner_img hide-768"
              :src="
                slide.img
                  ? slide.img
                  : `https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/bf7c60/bf7c6061643e11c7eb2e96b064c123c6.jpg`
              "
            />

            <!-- 768以下看到的(包含) -->
            <img
              class="banner_img show-768"
              :src="slide.mobile_img ? slide.mobile_img : bannerMobileTestImg"
            />

            <div class="banner_text">
              <h2 class="banner_slide_title">{{ slide.title }}</h2>

              <p class="banner_description">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </Slide>
      </Carousel>
    </div>

    <!-- Three Introductions -->
    <section
      class="sec introductions"
      :style="{
        backgroundImage: `url(${introductionBg})`,
      }"
    >
      <div class="introduction_unit introduction_unit1">
        <img
          src="../assets/img/v2/index/master@2x.png"
          class="introduction_icon_img"
        />

        <h4 class="introduction_unit_title introduction_unit_title1">
          {{ $t('index.introduction_unit_title1') }}
        </h4>

        <p class="introduction_unit_detail" id="introduction_unit_detail1">
          {{ $t('index.introduction_unit_detail1') }}
        </p>
      </div>

      <div class="introduction_unit introduction_unit2">
        <img
          src="../assets/img/v2/index/world@2x.png"
          class="introduction_icon_img"
        />

        <h4 class="introduction_unit_title introduction_unit_title2">
          {{ $t('index.introduction_unit_title2') }}
        </h4>

        <p class="introduction_unit_detail introduction_unit_detail2">
          {{ $t('index.introduction_unit_detail2') }}
        </p>
      </div>

      <div class="introduction_unit introduction_unit3">
        <img
          src="../assets/img/v2/index/online@2x.png"
          class="introduction_icon_img"
        />

        <h4 class="introduction_unit_title introduction_unit_title3">
          {{ $t('index.introduction_unit_title3') }}
        </h4>

        <p class="introduction_unit_detail introduction_unit_detail3">
          {{ $t('index.introduction_unit_detail3') }}
        </p>
      </div>
    </section>

    <!-- Video Course -->
    <section class="sec video_section">
      <div class="video_section_detail">
        <h4 class="video_section_detail_title">
          {{ $t('index.video_section_detail_title') }}
        </h4>
        <div class="video_section_detail_text">
          <p
            class="video_section_detail_line"
            v-html="$t('index.video_section_detail_line')"
          >
            <!-- {{ $t('index.video_section_detail_title') }} -->
          </p>
        </div>
      </div>
      <!-- 學院課程的 video -->
      <video-player
        :class="videoCtrl[0].class"
        ref="videoPlayer0"
        :options="videoOptions[0]"
        @play="onCourseVideoPlayerPlay(player0)"
        @pause="onCourseVideoPlayerPause(player0)"
        @ended="onCourseVideoPlayerEnded(player0)"
        @timeupdate="onCourseVideoPlayerTimeupdate(player0)"
        @statechanged="onCourseVideoPlayerStateChanged(player0)"
        @ready="onCourseVideoPlayerReadied(player0)"
      />
    </section>

    <!-- Learn from the Masters -->
    <section class="sec master_section">
      <h2 id="master_section_title" class="master_section_title">
        {{ $t('index.master_section_title') }}
      </h2>

      <div class="master_profile_container">
        <div
          v-for="teacher in teacherList"
          :key="teacher.id"
          class="master_profile_unit"
          v-animate-css.hover="'fadeInUp'"
        >
          <img :src="teacher.img" class="master_img" />
          <div class="master_detai">
            <h5 class="master_name">{{ dealTeacherName(teacher) }}</h5>
            <p class="master_intro">
              {{
                teacher.intros.length > 0
                  ? dealTeacherIntro(teacher.intros[0])
                  : ''
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Phone Course -->
    <section
      class="sec phonecourse_section"
      :style="{
        backgroundImage: `url(${phonecourseBg})`,
      }"
    >
      <div class="phonecourse_unit left_text">
        <div class="text_part">
          <h4 id="phonecourse_title1" class="phonecourse_title">
            {{ $t('index.phonecourse_title1') }}
          </h4>

          <p id="phonecourse_detail1" class="phonecourse_detail">
            {{ $t('index.phonecourse_detail1') }}
          </p>

          <router-link
            :to="{
              name: loginOrNot ? 'browse' : 'login',
              params: { lang: this.$route.params.lang },
            }"
            class="index_enroll_now hover_slide"
          >
            {{ $t('index.enroll_now') }}
          </router-link>
        </div>
        <div class="phone_part">
          <img
            src="../assets/img/v2/index/phone_frame@2x.png"
            class="phonecourse_frame_img"
          />
          <!-- <video id="video_2" class="phonecourse_course_img" webkit-playsinline playsinline>
                    <source src="./videos/video2.mp4" type="video/mp4">
                </video> -->
          <!-- 學院課程的 video -->
          <video-player
            :class="videoCtrl[1].class"
            ref="videoPlayer1"
            :options="videoOptions[1]"
          />
          <div class="phone_play_pause">
            <input id="player2" type="checkbox" name="video_trigger" />
            <label for="player2" @click.self="togglePlayAndPauseVideo1"></label>
          </div>
        </div>
      </div>

      <div class="phonecourse_unit left_phone">
        <div class="text_part">
          <h4 class="phonecourse_title">
            {{ $t('index.phonecourse_title2') }}
          </h4>

          <p class="phonecourse_detail">
            {{ $t('index.phonecourse_detail2') }}
          </p>

          <router-link
            :to="{
              name: loginOrNot ? 'browse' : 'login',
              params: { lang: this.$route.params.lang },
            }"
            class="index_enroll_now hover_slide"
          >
            {{ $t('index.enroll_now') }}
          </router-link>
        </div>
        <div class="phone_part">
          <img
            src="../assets/img/v2/index/phone_frame@2x.png"
            class="phonecourse_frame_img"
          />
          <!-- <video class="phonecourse_course_img" webkit-playsinline playsinline>
                    <source src="./videos/video3.mp4" type="video/mp4">
                </video> -->
          <!-- 學院課程的 video -->
          <video-player
            :class="videoCtrl[2].class"
            ref="videoPlayer2"
            :options="videoOptions[2]"
          />
          <div class="phone_play_pause">
            <input id="player3" type="checkbox" name="video_trigger" />
            <label for="player3" @click.self="togglePlayAndPauseVideo2"></label>
          </div>
        </div>
      </div>
    </section>

    <!-- Preview Videos -->
    <section
      class="sec preview_videos_section"
      v-if="previewVideoList.length > 0"
    >
      <div
        class="preview_video_container"
        v-for="(previewVideo, index) in previewVideoList"
        :key="previewVideo.id"
      >
        <video-player
          class="preview_video"
          :class="[`preview_video${index}`]"
          :ref="`previewVideo${index}`"
          :options="previewVideoOptions[index]"
        />
      </div>
    </section>

    <!-- 課程瀏覽的入口 -->
    <section class="sec w-100 bg-main flex-center p-5 browse_entry_section">
      <router-link
        :to="{
          name: this.loginOrNot ? 'browse' : 'login',
          params: { lang: this.$route.params.lang },
        }"
        class="index_enroll_now hover_slide mt-0 w-mobile480-100"
      >
        {{ $t('system_message.check_more') }}
      </router-link>
    </section>

    <!-- HOW TO ENROLL -->
    <section class="sec howto_enroll_section">
      <div class="howto_enroll">
        <div class="howto_enroll_container">
          <h2 class="howto_enroll_title">
            {{ $t('index.howto_enroll_title') }}
          </h2>

          <button
            class="extend_content_btn"
            :class="[
              { down: !isShowHowToEnrollContent },
              { up: isShowHowToEnrollContent },
              { closed: isShowHowToEnrollContent },
            ]"
            @click.prevent="toggleHowToEnrollContent"
          >
            <img
              src="../assets/img/v2/index/icon_up@2x.png"
              class="extend_content_img up_img"
            />
            <img
              src="../assets/img/v2/index/icon_down@2x.png"
              class="extend_content_img down_img"
            />
          </button>

          <!-- 動畫顯現/隱藏的部分 -->
          <transition name="slide">
            <div
              v-if="isShowHowToEnrollContent"
              class="howto_enroll_toggle_content"
            >
              <div
                v-for="(item, index) in howToEnrollData"
                :key="item.id"
                :class="['howto_enroll_step', `step${index}`]"
              >
                <h3 class="howto_enroll_step_title">
                  {{ $t(`${item.title}`) }}
                </h3>
                <p
                  class="howto_enroll_step_detail"
                  v-html="$t(`${item.content}`)"
                >
                  <!-- {{ $t(`${item.content}`) }} -->
                </p>
              </div>
              <router-link
                :to="{
                  name: 'download',
                  params: { lang: this.$route.params.lang },
                }"
                class="enroll_now_btn hover_slide howto_enroll_now_btn"
              >
                {{ $t('index.enroll_now') }}
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </section>

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
import { axiosSuccessHint } from '@/plugins/utility.js';
import {
  fetchBannerImgPath,
  teacherListAPI,
  fetchPreviewVideoPath,
} from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import deviceSizeMixinObj from '@/mixins/device-size.js';
// require styles
import 'video.js/dist/video-js.css';

// Imgs
import bannerNextImg from '@/assets/img/v2/index/banner-next@2x.png';
import bannerPrevImg from '@/assets/img/v2/index/banner-prev@2x.png';
import bannerMobileTestImg from '@/assets/img/v2/index/mobile_banner_img.png';
import introductionBg from '../assets/img/v2/index/introductions_bg.png';
import phonecourseBg from '../assets/img/v2/index/phonecourse_bg.jpg';

// Component
import AppAlert from '@/components/AppAlert.vue';
import { Carousel, Slide } from 'vue-carousel';
import { videoPlayer } from 'vue-video-player';
import TheNav from '@/components/TheNav.vue';

export default {
  name: 'Index',
  components: {
    AppAlert,
    Carousel,
    Slide,
    videoPlayer,
    TheNav,
  },
  mixins: [commonMixinObj, deviceSizeMixinObj],
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
      // 語系
      i18nLanguageData: this.$i18n.locale,
      // Banner 輪播列表
      bannerList: [],
      // 教師列表
      teacherList: [],
      // 試閱影片列表
      previewVideoList: [],
      // preview 的 options
      previewVideoOptions: [],
      // 登入以及改變語系的按鈕要出現
      navItemsIsShow: true,
      // 行動版的狀態是開啟的還是關閉的
      mobileHamburgerStatus: false,
      window: {
        fullWidth: 0,
        fullHeight: 0,
      },
      isShowHowToEnrollContent: false,
      // How To Enroll Data
      howToEnrollData: [
        {
          id: 1,
          title: 'index.howto_enroll_toggle_content[0].title',
          content: 'index.howto_enroll_toggle_content[0].content',
        },
        {
          id: 2,
          title: 'index.howto_enroll_toggle_content[1].title',
          content: 'index.howto_enroll_toggle_content[1].content',
        },
        {
          id: 3,
          title: 'index.howto_enroll_toggle_content[2].title',
          content: 'index.howto_enroll_toggle_content[2].content',
        },
        {
          id: 4,
          title: 'index.howto_enroll_toggle_content[3].title',
          content: 'index.howto_enroll_toggle_content[3].content',
        },
      ],
      // 管理各個不同的video
      videoOptions: [
        {
          autoplay: false,
          controls: true,
          muted: false,
          fluid: true,
          sources: [
            {
              // 要播放的影片src
              src: '/videos/video1.mp4',
              type: 'video/mp4',
            },
          ],
        },
        {
          autoplay: false,
          controls: false,
          muted: false,
          fluid: true,
          sources: [
            {
              // 要播放的影片src
              src: '/videos/video2.mp4',
              type: 'video/mp4',
            },
          ],
        },
        {
          autoplay: false,
          controls: false,
          muted: false,
          fluid: true,
          sources: [
            {
              // 要播放的影片src
              src: '/videos/video3.mp4',
              type: 'video/mp4',
            },
          ],
        },
      ],
      videoCtrl: [
        {
          class: 'course_video',
          isPlaying: false,
        },
        {
          class: 'phone_video phone_video1',
          isPlaying: false,
        },
        {
          class: 'phone_video phone_video2',
          isPlaying: false,
        },
      ],
    };
  },
  watch: {
    'window.fullWidth'(width) {
      console.log('watch window.fullWidth', width);

      if (width > 768) {
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
  computed: {
    /**
     * @author odin
     * @description 組成 banner carousel 下一頁的按鈕
     * @return {string}
     */
    bannerNextContent() {
      return `<img src="${bannerNextImg}" class="banner_btn_img">`;
    },

    /**
     * @author odin
     * @description 組成 banner carousel 上一頁的按鈕
     * @return {string}
     */
    bannerPrevContent() {
      return `<img src="${bannerPrevImg}" class="banner_btn_img">`;
    },

    /**
     * @author odin
     * @description 回傳要顯示的slide資料
     * @return {array}
     */
    slideViewData() {
      return this.bannerList;
    },

    /**
     * @author odin
     * @description 回傳 測試用的背景圖片路徑
     * @return {string}
     */
    bannerMobileTestImg() {
      return bannerMobileTestImg;
    },

    /**
     * @author odin
     * @description 回傳 第二區塊視差滾動的背景圖
     * @return {string}
     */
    introductionBg() {
      return introductionBg;
    },

    /**
     * @author odin
     * @description 回傳 第四區塊視差滾動的背景圖
     * @return {string}
     */
    phonecourseBg() {
      return phonecourseBg;
    },

    refs() {
      return this.$refs;
    },

    /**
     * @author odin
     * @description 播放器的實體(學院課程的影片)
     * @return {object}
     */
    player0() {
      return this.$refs.videoPlayer0.player;
    },

    /**
     * @author odin
     * @description 播放器的實體( 絕無僅有與大師面對面上課 )
     * @return {object}
     */
    player1() {
      return this.$refs.videoPlayer1.player;
    },

    /**
     * @author odin
     * @description 播放器的實體( 最精彩的國際大師講座直播課 )
     * @return {object}
     */
    player2() {
      return this.$refs.videoPlayer2.player;
    },
  },
  created() {
    // 元件初始化
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化
     */
    init() {
      // 取得 Banner 輪播列表
      this.fetchBannerList();
      // 取得教師列表
      this.fetchTeacherList();
      // 取得 試閱影片 列表
      this.fetchPreviewVideoList();
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
     * @description 開啟或關閉 How To Enroll 的區塊
     */
    toggleHowToEnrollContent() {
      console.log('toggleHowToEnrollContent');
      this.isShowHowToEnrollContent = !this.isShowHowToEnrollContent;
    },

    /**
     * @author odin
     * @description 開啟或關閉下拉提示
     */
    toggleHamburger() {
      console.log('有執行 toggleHamburger！');
      this.mobileHamburgerStatus = !this.mobileHamburgerStatus;
      this.navItemsIsShow = !this.navItemsIsShow;
    },

    /**
     * @author odin
     * @description 關閉下拉提示
     */
    closeNavContent() {
      this.navItemsIsShow = false;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 老師列表 回傳回來的資料
     */
    handleTeacherListData(res) {
      this.teacherList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 Banner 輪播 列表 回傳回來的資料
     */
    handleBannerListData(res) {
      this.bannerList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 試閱影片列表 回傳回來的資料
     */
    handlePreviewVideoListData(res) {
      // 取得資料
      const previewVideoList = res.data.data;

      // 放置資料
      this.previewVideoList = previewVideoList;

      // 新增 videoOptions
      previewVideoList.forEach(preview => {
        this.previewVideoOptions.push({
          autoplay: false,
          controls: true,
          muted: false,
          fluid: true,
          sources: [
            {
              // 要播放的影片src
              src: preview.url,
              type: 'video/mp4',
            },
          ],
        });
      });
    },

    /**
     * @author odin
     * @description 取得 Banner 輪播 列表
     */
    async fetchBannerList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios.get(fetchBannerImgPath);

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchBannerList', res);

          // 資料處理
          this.handleBannerListData(res);
        }
      } catch (err) {
        console.log('fetchBannerList', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 取得師資表
     */
    async fetchTeacherList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios.get(teacherListAPI);

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchTeacherList', res);

          // 資料處理
          this.handleTeacherListData(res);
        }
      } catch (err) {
        console.log('fetchTeacherList', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 取得師資表
     */
    async fetchPreviewVideoList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios.get(fetchPreviewVideoPath);

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchPreviewVideoList', res);

          // 資料處理
          this.handlePreviewVideoListData(res);
        }
      } catch (err) {
        console.log('fetchPreviewVideoList', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    ///////////////// 學院課程的影片 Course Video //////////////////////

    onCourseVideoPlayerPlay(player) {
      console.log('onCourseVideoPlayerPlay', player);
    },
    onCourseVideoPlayerPause(player) {
      console.log('onCourseVideoPlayerPause', player);
    },
    onCourseVideoPlayerEnded(player) {
      console.log('onCourseVideoPlayerEnded', player);
    },
    onCourseVideoPlayerTimeupdate(player) {
      console.log('onCourseVideoPlayerTimeupdate', player);
    },
    onCourseVideoPlayerStateChanged(player) {
      console.log('onCourseVideoPlayerStateChanged', player);
    },
    onCourseVideoPlayerReadied(player) {
      console.log('onCourseVideoPlayerReadied', player);
    },

    /**
     * @author odin
     * @description phoneVideo1 的影片播放/暫停條整
     */
    togglePlayAndPauseVideo1() {
      let judge = this.videoCtrl[1].isPlaying;

      if (judge) {
        this.player1.pause();
        this.videoCtrl[1].isPlaying = false;
      } else {
        this.player1.play();
        this.videoCtrl[1].isPlaying = true;
      }
    },

    /**
     * @author odin
     * @description phoneVideo2 的影片播放/暫停條整
     */
    togglePlayAndPauseVideo2() {
      let judge = this.videoCtrl[2].isPlaying;

      if (judge) {
        this.player2.pause();
        this.videoCtrl[2].isPlaying = false;
      } else {
        this.player2.play();
        this.videoCtrl[2].isPlaying = true;
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
