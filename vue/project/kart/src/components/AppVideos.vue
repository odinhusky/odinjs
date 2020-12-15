<template>
  <div class="root _root">
    <main class="main-10">
      <h2 class="page_title _title">{{ $t('videos.video_title') }}</h2>

      <!-- 分類 btn -->
      <section class="page-category-container center">
        <button
          class="page-category-btn kart-btn kart-bg-gray"
          :class="{ active: category === 'monthlyeslite' }"
          @click.prevent="changeCategory('monthlyeslite')"
        >
          {{ $t('videos.monthly_eslite') }}
        </button>
        <button
          class="page-category-btn kart-btn kart-bg-gray"
          :class="{ active: category === 'courserecord' }"
          @click.prevent="changeCategory('courserecord')"
        >
          {{ $t('videos.course_record') }}
        </button>
      </section>

      <section class="sec main-section videos_container">
        <template v-if="showContentOrNot">
          <div class="card-container videos">
            <!-- 單一個卡片的單位 -->
            <div
              v-for="video in showingVideos"
              :key="video.id"
              class="card card-3"
            >
              <div class="card-content">
                <img
                  class="card-img"
                  :style="{ backgroundImage: `url(${video.img})` }"
                />
                <div class="card-foot course_next_body">
                  <h5 class="card-foot-title">
                    {{ video.name }}
                  </h5>
                  <p class="card-foot-text line-height-1">
                    <small class="block-line">{{
                      judgeTeacherName(video.teacher)
                    }}</small>

                    <small
                      class="block-line"
                      v-if="category === 'courserecord'"
                      >{{ video.start_at | formatDate }}</small
                    >
                  </p>
                </div>

                <button
                  type="button"
                  class="kart-btn kart-sub watch_video"
                  @click.prevent="goWatchVideo(video.id)"
                >
                  {{ $t('videos.watch') }}
                </button>
              </div>
            </div>
          </div>

          <ThePagination
            :page-obj="paginationObj"
            @fetchSpecificCoursePage="paginationEvent"
          />
        </template>

        <!-- 沒有課程的話 -->
        <AppNoClasses v-else :no-classes-text="noClassesText">
          <!-- 只有 指定課程(原本的影片回放) 沒有資料的時候才需要顯示按鈕 -->
          <template v-if="category === 'courserecord'" slot="btns">
            <router-link
              :to="{
                name: 'browse',
                params: { lang: this.$route.params.lang },
              }"
              class="kart-btn kart-sub go_to_browse"
            >
              {{ $t('nextcourse.more_movie') }}
            </router-link>
          </template>
        </AppNoClasses>
      </section>
    </main>
    <!-- 提示影片課程為一週後上架的燈箱 -->
    <AppLightBox
      v-model="video_week_lightbox.openOrNot"
      :class="video_week_lightbox.classname"
      :isShowCancel="false"
    >
      <template>
        <h5 class="lightbox_title">{{ $t('course_record.notice.title') }}</h5>

        <div class="lightbox_controll">
          <input
            v-model="video_week_lightbox.dontShowAgain"
            type="checkbox"
            class="video_week_checkbox dont_show_again"
            name="dont_show_again"
            id="dont_show_again"
          />
          <label for="dont_show_again" class="video_week_label">{{
            $t('course_record.notice.skip')
          }}</label>
        </div>

        <div class="btn_group">
          <button
            class="kart-btn kart-gray cancel-btn"
            @click.prevent="checkDontShowAgain"
          >
            {{ $t('system_message.close') }}
          </button>
        </div>
      </template>
    </AppLightBox>
  </div>
</template>

<script>
// Resource
import { axiosSuccessHint } from '@/plugins/utility.js';
import {
  fetchMonthlyEslitePath,
  fetchCourseRecordListPath,
} from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import paginationMixinObj from '@/mixins/pagination.js';
import categoryMixinObj from '@/mixins/category.js';

// Component
import ThePagination from '@/components/ThePagination.vue';
import AppLightBox from '@/components/AppLightBox';
import AppNoClasses from '@/components/AppNoClasses.vue';

export default {
  name: 'AppVideos',
  components: {
    ThePagination,
    AppLightBox,
    AppNoClasses,
  },
  mixins: [commonMixinObj, paginationMixinObj, categoryMixinObj],
  data() {
    return {
      // 分類( 'monthlyeslite' => 每月精選 ｜ 'courserecord' => 指定課程(原本的影片回放) )
      // category: '',
      // 每月精選 的相關資料
      monthlyeslite: {
        // 原始取得的陣列
        list: [],
        // 依照顯示需求新生成的陣列
        reRangeList: [],
        page: 1,
        // 每月精選 的頁碼
        monthlyeslitePageObj: {
          links: {},
          props: {
            current: 1,
            prev: 1,
            next: 1,
            total: 1,
            totalPages: 1,
            perPage: 10,
            path: '',
            limitPage: 5,
          },
        },
      },
      // 指定課程 的相關資料
      courserecord: {
        // 原始取得的陣列
        list: [],
        // 依照顯示需求新生成的陣列
        reRangeList: [],
        page: 1,
        // 指定課程 的頁碼
        courserecordPageObj: {
          links: {},
          props: {
            current: 1,
            prev: 1,
            next: 1,
            total: 1,
            totalPages: 1,
            perPage: 10,
            path: '',
            limitPage: 5,
          },
        },
      },
      /////////// 燈箱 /////////////
      // 提示影片課程為一週後上架 的燈箱
      video_week_lightbox: {
        openOrNot: true,
        classname: 'video_week_lightbox',
        // checkbox
        dontShowAgain: false,
      },
    };
  },
  created() {
    // 初始值設定
    this.init();
    // 確認是否要顯示影片回放一週後上架的燈箱
    this.checkWeekLightboxShow();
  },
  computed: {
    /**
     * @author odin
     * @description 沒有內容的時候判斷要顯示什麼文字
     * @return {string}
     */
    noClassesText() {
      let str = '';

      switch (this.category) {
        case 'monthlyeslite':
          str = 'nextcourse.no_eslite';
          break;
        case 'courserecord':
          str = 'nextcourse.no_courses_reocrd';
          break;
      }

      return str;
    },

    /**
     * @author odin
     * @description 判斷要顯示中間內容還是要顯示沒有內容了
     * @return {boolean}
     */
    showContentOrNot() {
      let boolean = false;

      switch (this.category) {
        case 'monthlyeslite':
          if (this.monthlyeslite.list.length !== 0) {
            boolean = true;
          }
          break;
        case 'courserecord':
          if (this.courserecord.list.length !== 0) {
            boolean = true;
          }
          break;
      }

      return boolean;
    },

    /**
     * @author odin
     * @description 判斷要用哪個 影片的陣列
     * @return {array}
     */
    showingVideos() {
      let showObj = [];

      switch (this.category) {
        case 'monthlyeslite':
          showObj = [...this.monthlyeslite.reRangeList];
          break;
        case 'courserecord':
          showObj = [...this.courserecord.reRangeList];
          break;
      }

      return showObj;
    },

    /**
     * @author odin
     * @description 判斷要用哪個 paginationbObj
     * @return {object}
     */
    paginationObj() {
      let returnPaginationObj = {};

      switch (this.category) {
        case 'monthlyeslite':
          returnPaginationObj = this.monthlyeslite.monthlyeslitePageObj.props;
          break;
        case 'courserecord':
          returnPaginationObj = this.courserecord.courserecordPageObj.props;
          break;
      }

      return returnPaginationObj;
    },

    /**
     * @author odin
     * @description 判斷要用哪個 paginationb 的 事件
     * @return {function}
     */
    paginationEvent() {
      let eventName = {};
      switch (this.category) {
        case 'monthlyeslite':
          eventName = this.fetchMonthlyEslite;
          break;
        case 'courserecord':
          eventName = this.fetchCourseRecord;
          break;
      }

      return eventName;
    },
  },
  watch: {
    category() {
      console.log('category change!!!', this.category);

      if (this.category === 'courserecord') {
        // 判斷是否要顯示
        this.checkWeekLightboxShow();
      }
    },
  },
  methods: {
    /**
     * @author odin
     * @description 初始化的內容
     */
    init() {
      // 取得初始的資料
      this.fetchMonthlyEslite();
      this.fetchCourseRecord();
    },

    /**
     * @author odin
     * @description 確認是否要顯示影片回放一週後上架的燈箱
     */
    checkWeekLightboxShow() {
      const isDontShowString = window.localStorage.getItem(
        'isShowVideoWeekLightbox',
      );

      if (isDontShowString === 'true' || this.category === 'monthlyeslite') {
        this.video_week_lightbox.openOrNot = false;
      } else {
        this.video_week_lightbox.openOrNot = true;
      }
    },

    /**
     * @author odin
     * @description 關閉燈箱的同時確認是否不需要在顯示
     */
    checkDontShowAgain() {
      const isDontShow = this.video_week_lightbox.dontShowAgain;

      // 紀錄是否要顯示燈箱
      window.localStorage.setItem('isShowVideoWeekLightbox', isDontShow);

      this.video_week_lightbox.openOrNot = false;
    },

    /**
     * @author odin
     * @description 判斷當前語系選擇要輸出哪一個老師的名稱
     */
    judgeTeacherName(teacherObj) {
      let teacherName = '';

      switch (this.i18n) {
        case 'tw':
          teacherName = teacherObj.name_hant;
          break;
        case 'cn':
          teacherName = teacherObj.name;
          break;
        case 'en':
          teacherName = teacherObj.name_en;
          break;
      }

      return teacherName;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 每月精選 回傳回來的資料
     */
    handleMonthlyEsliteData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.monthlyeslite.list = data;

      // 生成顯示需要的陣列
      this.reRangeArray('monthlyeslite');

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.monthlyeslite.monthlyeslitePageObj,
        links,
        meta,
      );
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 指定課程 回傳回來的資料
     */
    handleCourseRecordData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courserecord.list = data;

      // 生成顯示需要的陣列
      this.reRangeArray('courserecord');

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courserecord.courserecordPageObj,
        links,
        meta,
      );
    },

    /**
     * @author odin
     * @param {string} tabName monthlyeslite | courserecord, 判別是要處理哪一個種類的資料
     * @description 處理 回傳回來陣列資料變成 畫面 顯示用的陣列
     */
    reRangeArray(tabName) {
      console.log('reRangeArray!!');
      let arr = [];

      if (tabName === 'monthlyeslite') {
        arr = this.monthlyeslite.list.map(item => ({
          id: item.id,
          img: item.img,
          start_at: item.start_at,
          name: item.name,
          video_url: item.video_url,
          teacher: { ...item.teacher },
        }));

        console.log('arrarrarrarrarrarr', arr);

        this.monthlyeslite.reRangeList = arr;
      } else if (tabName === 'courserecord') {
        arr = this.courserecord.list.map(item => ({
          id: item.id,
          img: item.lesson.img,
          start_at: item.start_at,
          name: item.name,
          video_url: item.review_url,
          teacher: { ...item.lesson.teacher },
        }));

        console.log('arrarrarrarrarrarr', arr);

        this.courserecord.reRangeList = arr;
      }
    },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得 每月精選 的資料
     */
    async fetchMonthlyEslite(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchMonthlyEslite page', page);
      try {
        const res = await this.axios({
          url: `${fetchMonthlyEslitePath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchMonthlyEslite', res);

          // 資料處理
          this.handleMonthlyEsliteData(res);
        }
      } catch (err) {
        console.log('fetchMonthlyEslite', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得 指定課程 的資料
     */
    async fetchCourseRecord(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchCourseRecord page', page);
      try {
        const res = await this.axios({
          url: `${fetchCourseRecordListPath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCourseRecord', res);

          // 資料處理
          this.handleCourseRecordData(res);
        }
      } catch (err) {
        console.log('fetchCourseRecord', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {number} objId 傳過來該筆物件的id(可能是 每月精選 或是 指定影片的id)
     * @description 將影片id 以及 是哪一個影片分類(monthlyeslite | courserecord) 儲存到 localStorage 並且轉去影片播放
     */
    goWatchVideo(objId) {
      localStorage.setItem('video_ID', objId);
      localStorage.setItem('video_category', this.category);

      // 導頁
      this.$router.push({
        name: 'video-play',
        params: { lang: this.$route.params.lang },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
