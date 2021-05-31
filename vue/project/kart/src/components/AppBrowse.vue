<template>
  <div class="root browse_root" :class="rootClassObj">
    <main class="main-10">
      <h2 class="page_title browse_title">{{ $t('navigation.mycourse') }}</h2>

      <section class="page-category-container center browse_btn_group">
        <button
          class="page-category-btn kart-btn kart-bg-gray live"
          :class="{ active: category === 'live' }"
          @click.prevent="changeCategory('live')"
        >
          {{ $t('mycourse.live') }}
        </button>
        <button
          class="page-category-btn kart-btn kart-bg-gray record"
          :class="{ active: category === 'record' }"
          @click.prevent="changeCategory('record')"
        >
          {{ $t('mycourse.record') }}
        </button>
      </section>

      <section class="browse_courses margin-outer">
        <!-- 沒有資料的時候 -->
        <AppNoClasses
          v-if="viewData.length === 0"
          :no-classes-text="noClassesText"
        />

        <!-- 課程內容 -->
        <template v-else>
          <div
            v-for="item in viewData"
            :key="item.id"
            class="browse_course_outer"
          >
            <div class="browse_course browse_course_unit">
              <!-- 圖片 -->
              <div
                class="course_next_img"
                :style="{ backgroundImage: `url(${item.img})` }"
              ></div>

              <!-- 內容 -->
              <div class="course_detail">
                <!-- 課程名稱 -->
                <h5 class="course_detail_title">{{ item.name }}</h5>

                <div class="course_detail_text">
                  <!-- 老師 -->
                  <div class="text_set">
                    <span class="text_set_title">{{
                      $t('course_item.teacher')
                    }}</span>
                    <span class="text_set_divider">|</span>
                    <!-- 根據不同語系顯示不同內容 -->
                    <div
                      v-if="i18n === 'cn' || i18n === 'tw'"
                      class="text_set_container"
                    >
                      <div class="text_set_content">
                        <span class="text_set_main">
                          {{ dealTeacherName(item.teacher) }}
                        </span>
                        <br />

                        <small class="text_set_sub">{{
                          item.teacher.name_en
                        }}</small>
                        <br />
                      </div>
                    </div>
                    <div v-if="i18n === 'en'" class="text_set_content">
                      <span class="text_set_main">{{
                        item.teacher.name_en
                      }}</span>
                      <br />
                    </div>
                  </div>

                  <div class="text_set_seperator"></div>

                  <!-- 經歷 -->
                  <div class="text_set">
                    <span class="text_set_title">{{
                      $t('course_item.teacher_intro')
                    }}</span>
                    <span class="text_set_divider">|</span>
                    <!-- 根據不同語系顯示不同內容 -->
                    <div
                      v-if="i18n === 'cn' || i18n === 'tw'"
                      class="text_set_container"
                    >
                      <div class="text_set_content">
                        <span class="text_set_main">
                          {{ dealTeacherIntros(item.teacher.intros[0]) }}
                        </span>
                        <br />

                        <small class="text_set_sub">{{
                          item.teacher.intros[0].intro_en
                        }}</small>
                        <br />
                      </div>
                    </div>
                    <div v-if="i18n === 'en'" class="text_set_content">
                      <span class="text_set_main">{{
                        item.teacher.intros[0].intro_en
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 課程詳情按鈕 -->
              <button
                class="course_detail_btn"
                @click.prevent="showCourseDetailAlert(item)"
              >
                {{ $t('course_item.enroll') }}
              </button>
            </div>
          </div>
        </template>
      </section>

      <!-- 右下方固定的按鈕(目前是隱藏的) -->
      <section class="fix_btns" v-if="false">
        <!-- 線上報名課程 -->
        <!-- <button class="fix_btn btnenroll">
          <img src="" alt="" />
        </button> -->

        <!-- 套餐購買 -->
        <router-link
          :to="{ name: 'purchase', params: { lang: this.$route.params.lang } }"
          class="fix_btn go_to_purchase"
        >
          <img
            v-if="i18n === 'cn'"
            src="../assets/img/v2/browse/purchase_cn@2x.png"
          />
          <img
            v-if="i18n === 'tw'"
            src="../assets/img/v2/browse/purchase_tw@2x.png"
          />
          <img
            v-if="i18n === 'en'"
            src="../assets/img/v2/browse/purchase_en@2x.png"
          />
        </router-link>

        <!-- 銷售方案 -->
        <button
          class="fix_btn btnsale"
          @click.prevent="saleAdAlert.openOrNot = true"
        >
          <img
            v-if="i18n === 'cn'"
            src="../assets/img/v2/browse/salesplan_cn@2x.png"
          />
          <img
            v-if="i18n === 'tw'"
            src="../assets/img/v2/browse/salesplan_tw@2x.png"
          />
          <img
            v-if="i18n === 'en'"
            src="../assets/img/v2/browse/salesplan_en@2x.png"
          />
        </button>
      </section>

      <!-- 頁碼 -->
      <ThePagination
        v-if="viewData.length !== 0"
        :page-obj="paginationObj"
        @fetchSpecificCoursePage="paginationEvent"
      />
    </main>

    <!-- 燈箱 -->
    <!-- 點選課程後，提示還有幾分鐘的燈箱 -->
    <AppLightBox
      v-model="video_record_lightbox.openOrNot"
      :class="video_record_lightbox.classname"
      :is-show-cancel="video_record_lightbox.isShowCancel"
    >
      <template>
        <span class="lightbox_msg">{{ video_record_lightbox.msg }}</span>

        <div class="btn_group">
          <button
            class="kart-btn kart-gray kart-basic-w cancel-btn"
            @click.prevent="cancelWatchVideo"
          >
            {{ $t('system_message.close') }}
          </button>

          <button
            class="kart-btn kart-sub confirm-btn"
            @click.prevent="goToPlayReviewVideo"
          >
            {{ $t('system_message.ok') }}
          </button>
        </div>
      </template>
    </AppLightBox>

    <!-- 點選課程後，提示多少期間的燈箱 -->
    <AppLightBox
      v-model="video_period_lightbox.openOrNot"
      :class="video_period_lightbox.classname"
      :is-show-cancel="video_period_lightbox.isShowCancel"
    >
      <template>
        <span class="lightbox_msg">{{ video_period_lightbox.msg }}</span>

        <div class="btn_group">
          <button
            class="kart-btn kart-gray kart-basic-w cancel-btn"
            @click.prevent="cancelWatchPeriodVideo"
          >
            {{ $t('system_message.close') }}
          </button>

          <button
            class="kart-btn kart-sub confirm-btn"
            @click.prevent="goToPlayReviewVideo"
          >
            {{ $t('system_message.ok') }}
          </button>
        </div>
      </template>
    </AppLightBox>

    <!-- 銷售方案燈箱 -->
    <AppLightBox
      v-model="saleAdAlert.openOrNot"
      :classname="saleAdAlert.classname"
    >
      <template>
        <div class="sale_ad_box">
          <img :src="saleAdImgSrc" class="sale_ad_img" />
        </div>
      </template>
    </AppLightBox>

    <!-- 確認是否要報名課堂的燈箱 -->
    <AppLightBox
      v-model="checkEnrollWillingLightbox.openOrNot"
      :classname="checkEnrollWillingLightbox.classname"
      :is-show-cancel="checkEnrollWillingLightbox.isShowCancel"
    >
      <template>
        <h5
          class="d-block text-gray700 fz-1_25rem w-100 text-center font-weight-normal"
        >
          {{ $t('enroll.make_sure_enroll') }}
        </h5>
        <h5
          class="d-block text-gray700 fz-1_25rem w-100 text-center font-weight-normal"
        >
          {{ $t('enroll.minus_remaing_one_point', ['1']) }}
        </h5>

        <div class="btn-group mt-3">
          <!-- 取消 -->
          <button
            class="kart-btn kart-gray close_check_enroll_willing_lightbox half-btn half-left-btn"
            @click.prevent="checkEnrollWillingLightbox.openOrNot = false"
          >
            {{ $t('system_message.cancel') }}
          </button>

          <!-- 確認報名 -->
          <button
            class="kart-btn kart-sub close_check_enroll_willing_lightbox half-btn"
            @click.prevent="enrollNow"
          >
            {{ $t('enroll.confirm_enroll') }}
          </button>
        </div>
      </template>
    </AppLightBox>

    <!-- 課堂報名成功，連去 course 的燈箱 -->
    <AppLightBox
      v-model="goCoursePageLightbox.openOrNot"
      :classname="goCoursePageLightbox.classname"
    >
      <template>
        <div class="sale_ad_box w-100">
          <!-- 報名成功的提示 -->
          <h5
            class="w-100 fz-1_25rem font-weight-normal text-center text-gray700 mb-3"
          >
            {{ $t('system_message.enroll_single_lesson_success') }}
          </h5>

          <!-- 按鈕們 -->
          <div class="btn-group w-100">
            <button
              class="kart-btn kart-gray half-btn half-left-btn"
              @click.prevent="goCoursePageLightbox.openOrNot = false"
            >
              {{ $t('enroll.stop_here') }}
            </button>

            <button
              type="button"
              class="kart-btn kart-sub half-btn"
              @click.prevent="goCoursePage"
            >
              {{ $t('enroll.go_course') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 課堂報名成功，確認是否立即觀看的燈箱 -->
    <AppLightBox
      v-model="watchNowOrNotLightbox.openOrNot"
      :classname="watchNowOrNotLightbox.classname"
    >
      <template>
        <div class="sale_ad_box w-100">
          <!-- 報名成功的提示 -->
          <h5
            class="w-100 fz-1_25rem font-weight-normal text-center text-gray700 mb-3"
          >
            {{ $t('system_message.enroll_single_lesson_success') }}
          </h5>

          <!-- 按鈕們 -->
          <div class="btn-group w-100">
            <button
              class="kart-btn kart-gray half-btn half-left-btn"
              @click.prevent="watchNowOrNotLightbox.openOrNot = false"
            >
              {{ $t('system_message.cancel') }}
            </button>

            <button
              class="kart-btn kart-sub half-btn"
              @click.prevent="checkThisCourseExpired(watchNowLessonId)"
            >
              {{ $t('enroll.watch_now') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 課程詳細燈箱的內容 -->
    <AppLightBox
      v-model="courseAlert.openOrNot"
      :is-show-cancel="courseAlert.isShowCancel"
      :classname="courseAlert.classname"
    >
      <template>
        <div class="course_alert_cotent">
          <!-- 課程名稱 -->
          <h5 class="course_detail_title course_name">
            {{ viewLightBoxData.name }}
          </h5>
          <!-- 教師名稱 -->
          <span class="text_set_main teacher_name border-none">{{
            dealTeacherName(viewLightBoxData.teacher)
          }}</span>
          <!-- 教師經歷(根據不同語系顯示不同內容) -->
          <template>
            <div
              v-if="i18n === 'cn' || i18n === 'tw'"
              class="text_set_container"
            >
              <div class="text_set_content">
                <span class="text_set_main">
                  {{ dealTeacherIntros(viewLightBoxData.teacher.intros[0]) }}
                </span>
                <br />

                <small class="text_set_sub">{{
                  viewLightBoxData.teacher.intros[0].intro_en
                }}</small>
                <br />
              </div>
            </div>

            <div v-if="i18n === 'en'" class="text_set_content">
              <span class="text_set_main">{{
                viewLightBoxData.teacher.intros[0].intro_en
              }}</span>
            </div>
          </template>

          <!-- 課程時間 -->
          <div class="course_time_container">
            <!-- 標題 -->
            <h5 class="course_detail_title course_name">
              {{ $t('course_info.time') }}
            </h5>

            <!-- 課堂 -->
            <div class="lessons_container">
              <div
                v-for="lesson in viewLightBoxData.times"
                :key="lesson.id"
                class="lesson_unit"
              >
                <!-- 課堂開始時間以及課堂名稱 -->
                <div
                  class="lesson_detail"
                  :class="{ 'w-100': isShowLessionStatus === false }"
                >
                  <span class="text_set_sub d-block fz-70 lesson_name">{{
                    lesson.name
                  }}</span>
                  <span class="text_set_sub d-block fz-70 lesson_time">{{
                    lesson.start_at | formatDate
                  }}</span>
                </div>

                <!-- 課堂狀態 -->
                <!-- 當分類是直播課程，且為訂閱制學生，就都不顯示課堂狀態 -->
                <div v-if="isShowLessionStatus" class="lesson_status">
                  <!-- 當分類是直播課程，但非訂閱制學生時，只顯示愛心或是已報名的字樣 -->
                  <template
                    v-if="
                      category === 'live' && loginUserIsSubscribed === false
                    "
                  >
                    <!-- 是訂閱制 -->
                    <template v-if="loginUserIsSubscribed">
                      <span class="kart-gray had_signed_up"
                        >{{ $t('subscribe.suscribed') }}
                      </span>
                    </template>

                    <!-- 非訂閱制 -->
                    <template v-else>
                      <!-- 已報名 -->
                      <span
                        v-if="isThisCourseHadEnrolled(lesson.id)"
                        class="kart-gray had_signed_up"
                        >{{ $t('enroll.enrolled') }}
                      </span>

                      <!-- 立即報名(還未報名的話，就顯示立即報名) -->
                      <button
                        type="button"
                        class="kart-btn kart-sub enroll_now"
                        v-if="!isThisCourseHadEnrolled(lesson.id)"
                        @click.prevent="enrollNowInit(lesson.id)"
                      >
                        {{ $t('enroll.enroll_now') }}
                      </button>

                      <!-- 立即報名 和 愛心 -->
                      <!-- <template v-else> -->
                      <!-- 立即報名(還未報名的話，就顯示立即報名) -->
                      <!-- <button
                          type="button"
                          class="kart-btn kart-sub enroll_now"
                          v-if="!isThisCourseHadApplied(lesson.id)"
                          @click.prevent="checkRemaingCourse(lesson.id)"
                        >
                          {{ $t('enroll.enroll_now') }}
                        </button> -->

                      <!-- 愛心 -->
                      <!-- <button
                        v-if="!isThisCourseHadApplied(lesson.id)"
                        class="add_wish_btn"
                        :class="{ selected: isThisCourseInCart(lesson.id) }"
                        @click.prevent="toggleCart(lesson.id)"
                      >
                        <img
                          class="add_wish_img add"
                          src="@/assets/img/v2/browse/purchase_empty_heart@2x.png"
                        />
                        <img
                          class="add_wish_img remove"
                          src="@/assets/img/v2/browse/purchase_heart@2x.png"
                        />
                      </button> -->
                      <!-- </template> -->
                    </template>
                  </template>

                  <!-- 當分類是回放視頻，課堂狀態就只顯示立即觀看，如果有報名過該課堂，就直接連去影片觀看區，如果沒有，就檢查餘課數，不夠就跳不夠的燈箱，夠的話就直接報名課程，成功的話就跳成功報名，失敗的話跳報名失敗 -->
                  <template v-if="category === 'record'">
                    <!-- 立即觀看的按鈕 -->
                    <button
                      class="kart-btn kart-sub mr-0 watch_now"
                      @click.prevent="judgeEnrolledOrNot(lesson.id)"
                    >
                      {{ $t('enroll.watch_now') }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 關閉按鈕 -->
          <button
            class="w-100 kart-btn kart-sub mb-mobile480-3 close_course_alert"
            @click.prevent="courseAlert.openOrNot = false"
          >
            {{ $t('system_message.close') }}
          </button>
        </div>
      </template>
    </AppLightBox>
  </div>
</template>

<script>
// resources
import {
  fetchBrowseLiveCoursePath,
  fetchBrowseRecordCoursePath,
  fetchcartItemPath,
  fetchenrolledListPath,
  operateCartPath,
  fetchSaleAdvertisementImgSrcPath,
  fetchRemainingCoursePath,
  enrollNowPath,
  checkThisCourseExpiredListPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import { checkObjectIsEmpty } from '@/plugins/checker.js';
import paginationMixinObj from '@/mixins/pagination.js';
import commonMixinObj from '@/mixins/common.js';
import categoryMixinObj from '@/mixins/category.js';

// component
// import AppAlert from '@/components/AppAlert.vue';
import AppLightBox from '@/components/AppLightBox.vue';
import AppNoClasses from '@/components/AppNoClasses.vue';
import ThePagination from '@/components/ThePagination.vue';

export default {
  name: 'AppBrowse',
  components: {
    // AppAlert,
    AppLightBox,
    AppNoClasses,
    ThePagination,
  },
  mixins: [commonMixinObj, paginationMixinObj, categoryMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      // 分類( 'live' => 直播課程 ｜ 'record' => 回播課程)
      category: '',
      // 銷售方案燈箱
      saleAdImgSrc: '',
      // 立即觀看的課程Id
      watchNowLessonId: 0,
      // 購物車內有哪些課堂
      cartLessions: [],
      // 已報名的課堂
      enrolledLessions: [],
      // 已報名課堂的 timesId
      enrolledLessonIds: [],
      // 所有的課堂(包含直播以及回播)
      courseCartList: [],
      // 餘課數
      remaining: {
        points: 0,
        reviewable_points: 0,
        individual_points: 0,
      },
      courseObj: {
        // 直播課程
        live: {
          courses: [],
          // 直播課程 的頁碼
          livePageObj: {
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
        // 套裝課程
        record: {
          courses: [],
          // 直播課程 的頁碼
          recordPageObj: {
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
      },

      /////////// 燈箱 /////////////
      // 點選課程後，提示還有幾分鐘的燈箱
      video_record_lightbox: {
        openOrNot: false,
        classname: 'video_record_lightbox',
        isShowCancel: false,
        msg: '',
      },
      // 點選課程後，提示還有幾分鐘的燈箱
      video_period_lightbox: {
        openOrNot: false,
        classname: 'video_record_lightbox video_period_lightbox',
        isShowCancel: false,
        msg: '',
      },
      // 課程詳細燈箱的內容
      courseAlert: {
        openOrNot: false,
        isShowCancel: false,
        classname: 'course_detail_alert align-items-start',
        // 給予最低的結構不讓程式執行錯誤
        courseObj: {
          name: '',
          teacher: {
            name_en: '',
            name_hant: '',
            name: '',
            intros: [
              {
                id: 1,
                intro: '',
                intro_en: '',
                intro_hant: '',
              },
            ],
          },
          times: [
            { start_at: '2020-06-09T16:00:00+00:00', id: 1, name: '123' },
          ],
        },
      },
      // 銷售方案的燈箱內容
      saleAdAlert: {
        openOrNot: false,
        classname: 'sale_ad_alert',
      },
      //課堂報名成功，確認是否立即觀看的燈箱
      watchNowOrNotLightbox: {
        openOrNot: false,
        classname: 'watch_now_lightbox',
        isShowCancel: false,
      },

      //課堂報名成功，連去 course 的燈箱
      goCoursePageLightbox: {
        openOrNot: false,
        classname: 'go_course_lightbox',
        isShowCancel: false,
      },
      // 確認是否要報名該課堂的燈箱
      checkEnrollWillingLightbox: {
        openOrNot: false,
        classname: 'check_enroll_willing_lightbox d-block',
        isShowCancel: false,
      },
    };
  },
  watch: {
    // watch computed 的 i18n
    i18n(i18n) {
      console.log('Computed i18n', i18n);
      // 根據不同語系取得不同的銷售計畫圖片
      this.fetchSaleAdRes();
    },
  },
  computed: {
    /**
     * @author odin
     * @description 判斷沒有內容的時候要顯示的文字
     * @return {boolean}
     */
    noClassesText() {
      return 'nextcourse.nodata';
    },

    /**
     * @author odin
     * @description 開啟特定課程的詳細內容
     * @return {array} 判斷要用哪一個陣列
     */
    viewData() {
      let arr = [];
      switch (this.category) {
        case 'live':
          arr = [...this.courseObj.live.courses];
          break;
        case 'record':
          arr = [...this.courseObj.record.courses];
          break;
      }

      return arr;
    },

    /**
     * @author odin
     * @description 指引燈箱的內容要用哪一個資料來源
     * @return {object}}
     */
    viewLightBoxData() {
      return this.courseAlert.courseObj;
    },

    /**
     * @author odin
     * @description 判斷要用哪個 paginationbObj
     * @return {object}
     */
    paginationObj() {
      let returnPaginationObj = {};

      switch (this.category) {
        case 'live':
          returnPaginationObj = this.courseObj.live.livePageObj.props;
          break;
        case 'record':
          returnPaginationObj = this.courseObj.record.recordPageObj.props;
          break;
      }

      return returnPaginationObj;
    },

    /**
     * @author odin
     * @description 判斷要用哪個 paginationn 的事件
     * @return {function}
     */
    paginationEvent() {
      let eventName = {};

      switch (this.category) {
        case 'live':
          eventName = this.fetchLiveCourse;
          break;
        case 'record':
          eventName = this.fetchRecordCourse;
          break;
      }

      return eventName;
    },

    /**
     * @author odin
     * @description 判斷課程狀態是否要打開
     * @return {boolean}
     */
    isShowLessionStatus() {
      let showOrNot = false;

      // 分頁在直播課程，且為訂閱制學生時，不顯示課程狀態
      if (this.category === 'live' && this.loginUserIsSubscribed) {
        showOrNot = false;
      } else {
        showOrNot = true;
      }

      return showOrNot;
    },
  },
  created() {
    // 回到最上方
    this.backToTop();

    // 元件初始化
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化
     */
    init() {
      // 取得其他初始化資料
      this.initAxioses();
    },

    /**
     * @author odin
     * @description 關閉所有的燈箱
     */
    closeAllLightboxes() {
      this.video_record_lightbox.openOrNot = false;
      this.video_period_lightbox.openOrNot = false;
      this.courseAlert.openOrNot = false;
      this.saleAdAlert.openOrNot = false;
      this.watchNowOrNotLightbox.openOrNot = false;
      this.checkEnrollWillingLightbox.openOrNot = false;
      this.$bus.$emit('notify:off');
    },

    /**
     * @author odin
     * @description 開啟特定課程的詳細內容
     * @param {object} course 單一個課程的所有內容
     */
    showCourseDetailAlert(course) {
      switch (this.category) {
        case 'live':
          // 把特定內容給放到對應的位置
          this.courseAlert.courseObj = { ...course };
          // 開啟燈箱
          this.courseAlert.openOrNot = true;
          break;
        case 'record':
          // 把特定內容給放到對應的位置
          this.courseAlert.courseObj = { ...course };
          // 開啟燈箱
          this.courseAlert.openOrNot = true;
          break;
      }

      // 開啟燈箱
      // this.courseAlert.openOrNot = true;
    },

    /**
     * @author odin
     * @description 直接報名成功後導去 course頁面
     */
    goCoursePage() {
      // 導頁
      this.$router.push({
        name: 'course',
        params: { lang: this.$route.params.lang },
      });
    },

    /**
     * @author odin
     * @description 處理不同語系的老師介紹
     * @param {object} intro 老師介紹的第一筆內容
     */
    dealTeacherIntros(introItem) {
      if (this.i18n === 'cn') {
        return introItem.intro;
      } else if (this.i18n === 'tw') {
        return introItem.intro_hant;
      } else {
        return '';
      }
    },

    /**
     * @author odin
     * @description 產生可加入購物車的列表
     * @return {array} 含有所有課程可以加入購物清單(愛心)的陣列
     */
    prepareCourseCartList() {
      const targetArray = [
        ...this.courseObj.live.courses,
        ...this.courseObj.record.courses,
      ];
      let courseCartList = [];

      targetArray.forEach(item => {
        const timesArray = [...item.times];
        timesArray.forEach(timeItem => {
          courseCartList.push({
            id: timeItem.id,
            isInCart: false,
            hadApplied: false,
          });
        });
      });

      this.courseCartList = courseCartList;
    },

    /**
     * @author odin
     * @description 確認是否有回傳內容，有的話就將 courseCartList 中對應 lesson_time_id 的 物件的 isInCart 改為 true
     * @param {array} cartItemArray -- ajax 傳回來的結果陣列
     */
    prepareCartItems() {
      const enrolledLessions = this.enrolledLessions;
      if (checkObjectIsEmpty(enrolledLessions)) return;

      [...enrolledLessions].forEach(enrolled => {
        [...this.courseCartList].forEach((lesson, lessonIndex) => {
          // 同時找出已報名的 課程 timesId 並記錄在 data 中
          // this.enrolledLessonIds.push(lesson.id);

          // 找出回傳的 ajax 陣列中，有的物件 id 比對，找到的話就將 courseCartList 中的那個 id 的 isInCart 改為 true
          if (lesson.id === enrolled.lesson_time_id) {
            this.courseCartList[lessonIndex].isInCart = true;
          }
        });
      });
    },

    /**
     * @author odin
     * @description 將以報名的 lesson_time_id 傳入資料陣列中
     */
    prepareEnrollLessonId() {
      this.enrolledLessions.forEach(item => {
        item.times.forEach(lesson => {
          this.enrolledLessonIds.push(lesson.id);
        });
      });
    },

    /**
     * @author odin
     * @param {number} lessionId 該課程的 lessionTimeId
     * @description 判斷點選立即觀看的這個課程是不是已經報名了
     */
    judgeEnrolledOrNot(lessionId) {
      const isEnrolled = this.enrolledLessonIds.some(enrolledId => {
        return enrolledId === lessionId;
      });

      console.log('isEnrolled', isEnrolled);

      // 紀錄lessionId
      this.watchNowLessonId = lessionId;

      if (isEnrolled) {
        // 確定課程是否有過期
        this.checkThisCourseExpired();
      } else {
        this.courseAlert.openOrNot = false;
        // 還沒報名過的課堂，先檢查餘課數是否足夠
        this.checkRemaingCourse();
      }

      console.log('judgeEnrolledOrNot isEnrolled', isEnrolled);
    },

    /**
     * @author odin
     * @description 關閉剩餘多少分鐘的燈箱
     */
    cancelWatchVideo() {
      this.video_record_lightbox.openOrNot = false;
      this.video_record_lightbox.msg = '';
    },

    /**
     * @author odin
     * @description 關閉觀看期間的燈箱
     */
    cancelWatchPeriodVideo() {
      this.video_period_lightbox.openOrNot = false;
      this.video_period_lightbox.msg = '';
    },

    /**
     * @author odin
     * @description 將拿到已報名的資料比對可以加入購物車的課程時間，如果有出現在已報名的名單中，則修改 courseCartList 屬性 hadAppied 為true，同時連動html中的愛心位置，改為已報名的文字
     * @param {array} appliedItemArray -- 已報名課程(非套裝 => 一般課程)清單
     */
    handleCourseHadApplied(appliedItemArray) {
      console.log('appliedItemArray', appliedItemArray);
      console.log(
        '!checkObjectIsEmpty(appliedItemArray)',
        !checkObjectIsEmpty(appliedItemArray),
      );

      // 拿掉這裡(測試用)
      // appliedItemArray = [{ times: [{ id: 66 }] }];

      if (!checkObjectIsEmpty(appliedItemArray)) {
        [...appliedItemArray].forEach(item => {
          [...item.times].forEach(time => {
            [...this.courseCartList].forEach((courseItem, courseIndex) => {
              if (courseItem.id === time.id) {
                this.courseCartList[courseIndex].hadApplied = true;
              }
            });
          });
        });
      }
    },

    /**
     * @author odin
     * @param {object} liveRes ajax 回傳成功的內容
     * @description 處理 直播課程 回傳的值
     */
    handleLiveCourseData(liveRes) {
      const data = liveRes.data.data;
      const meta = liveRes.data.meta;
      const links = liveRes.data.links;

      // 放入課程內容
      this.courseObj.live.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseObj.live.livePageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} recordRes ajax 回傳成功的內容
     * @description 處理 回播課程 回傳的值
     */
    handleRecordCourseData(recordRes) {
      const data = recordRes.data.data;
      const meta = recordRes.data.meta;
      const links = recordRes.data.links;

      // 放入課程內容
      this.courseObj.record.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseObj.record.recordPageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} cartRes ajax 回傳成功的內容
     * @description 處理 購物車內的課堂 的物件
     */
    handleCartItems(cartRes) {
      this.lessonsInCart = cartRes.data.data;
    },

    /**
     * @author odin
     * @param {object} enrollRes ajax 回傳成功的內容
     * @description 處理 已報名課堂 的物件
     */
    handleEnrollItems(enrollRes) {
      this.enrolledLessions = enrollRes.data.data;
    },

    /**
     * @author odin
     * @param {object} saleAdRes ajax 回傳成功的內容
     * @description 處理 購物車內的課程物件
     */
    handleSaleAdvertisementImg(saleAdRes) {
      this.saleAdImgSrc = saleAdRes.data.data.img;
    },

    /**
     * @author odin
     * @param {object} remainingRes ajax 回傳成功的內容
     * @description 處理 購物車內的課程物件
     */
    handleRemainingCoursesData(remainingRes) {
      console.log('remainingRes', remainingRes);
      this.remaining = remainingRes.data.data;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 單筆指定課程 回傳回來的資料
     */
    handleCheckThisCourseExpiredData(res) {
      const videoDetail = res.data.data;
      const remainMinutes =
        videoDetail.review_remain_seconds > 0
          ? videoDetail.review_remain_seconds / 60
          : 0;
      const totalMinutes = videoDetail.review_limit_minutes;
      const startDateStr = this.formatDate(videoDetail.review_start_at);
      // const startTmesStamp = this.getTimeStamp(videoDetail.review_start_at);
      const endDateStr = this.formatDate(videoDetail.review_end_at);
      const endTmesStamp = this.getTimeStamp(videoDetail.review_end_at);
      const nowTimeStamp = new Date().getTime();
      console.log('videoDetail', videoDetail);
      console.log('endTmesStamp', endTmesStamp);
      console.log('nowTimeStamp', nowTimeStamp);

      // 關閉課程詳情燈箱
      this.courseAlert.openOrNot = false;

      // 判斷要出現哪種燈箱
      if (totalMinutes === remainMinutes && remainMinutes !== 0) {
        // 還沒觀看過，跳燈箱告知還有多少秒
        let msg = `${this.$t(
          'system_message.video_record_remain',
        )} ${remainMinutes} ${this.$t('system_message.video_record_confirm')}`;

        // 組裝文字
        this.video_record_lightbox.msg = msg;

        // 開啟燈箱
        this.video_record_lightbox.openOrNot = true;
      } else if (totalMinutes !== remainMinutes || remainMinutes === 0) {
        if (nowTimeStamp > endTmesStamp || remainMinutes === 0) {
          // 已經超過觀看期限，告知影片已經過期
          this.$bus.$emit('notify:message', 'system_message.video_timeout');
        } else {
          // 已經觀看過，告知觀看區間
          let msg = this.$t('system_message.video_record_range_2var', {
            0: startDateStr,
            1: endDateStr,
          });

          // 組裝文字
          this.video_period_lightbox.msg = msg;

          // 開啟燈箱
          this.video_period_lightbox.openOrNot = true;
        }
      }
    },

    /**
     * @author odin
     * @description 確認特定id的內容是否有在購物車內
     * @param {string} id 特定時間的課程id
     */
    isThisCourseInCart(id) {
      // 還沒讀到資料之前
      if (checkObjectIsEmpty(this.courseCartList)) {
        return;
      }

      const thisObj = [...this.courseCartList].find(item => id === item.id);

      return thisObj !== undefined ? thisObj.isInCart : false;
    },

    /**
     * @author odin
     * @description 確認特定id的內容是否已經報名了
     * @param {string} id 特定時間的課程id
     */
    isThisCourseHadApplied(id) {
      // 還沒讀到資料之前
      if (checkObjectIsEmpty(this.cartLessions)) {
        return;
      }

      const thisObj = [...this.cartLessions].find(item => id === item.id);

      return thisObj.hadApplied;
    },

    /**
     * @author odin
     * @description 確認特定id的內容是否已經報名了
     * @param {string} id 特定時間的課程id
     */
    isThisCourseHadEnrolled(id) {
      // console.log('isThisCourseHadEnrolled id => ', id);

      // 還沒讀到資料之前
      if (checkObjectIsEmpty(this.enrolledLessonIds)) {
        return;
      }

      const result = [...this.enrolledLessonIds].find(item => id === item);

      // console.log('isThisCourseHadEnrolled result => ', result);

      return result ? true : false;
    },

    /**
     * @author odin
     * @description 確認該使用者的餘課數是否還足夠
     */
    checkRemaingCourse() {
      if (this.remaining.points >= 1) {
        // 關閉目前課程資訊的燈箱
        this.courseAlert.openOrNot = false;
        // 開燈箱提示要扣點是否要報名
        this.checkEnrollWillingLightbox.openOrNot = true;
      } else {
        // 關閉燈箱並且顯示點數不夠
        this.courseAlert.openOrNot = false;
        // 清空要報名的課堂 Id
        this.watchNowLessonId = 0;
        this.$bus.$emit('notify:message', 'enroll.normal_point_not_enough');
      }
    },

    /**
     * @author odin
     * @param {numbner} lessionId -- 該課堂的Id
     * @description 儲存課堂的 Id 並且確認是否有剩餘的點數
     */
    enrollNowInit(lessonId) {
      // 存取課堂 Id
      this.watchNowLessonId = lessonId;

      // 確認點數是否足夠
      this.checkRemaingCourse();
    },

    /**
     * @author odin
     * @return {Axios Obj} 回傳 直播課程的 axios 物件
     */
    returnLiveCourseAxios() {
      return this.axios({
        url: `${fetchBrowseLiveCoursePath}?page=1`,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @return {Axios Obj} 回傳 直播課程的 axios 物件
     */
    returnRecordCourseAxios() {
      return this.axios({
        url: `${fetchBrowseRecordCoursePath}?page=1`,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得購物車內的資料
     */
    returnCartItemsAxios() {
      return this.axios({
        url: fetchcartItemPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得 已報名(非套裝) 的課程時間
     */
    returnEnrolledListAxios() {
      return this.axios({
        url: fetchenrolledListPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得 銷售方案 的img:src
     */
    returnSaleAdvertisementAxios() {
      return this.axios({
        url: fetchSaleAdvertisementImgSrcPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)(餘課數)
     */
    returnRemainingCourseAxios() {
      return this.axios({
        url: fetchRemainingCoursePath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得 直播課程 的資料
     */
    async fetchLiveCourse(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchBrowseLiveCoursePath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchLiveCourse', res);

          // 處理 直播課程 回傳的值
          this.handleLiveCourseData(res);
        }
      } catch (err) {
        console.log('fetchLiveCourse', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得 直播課程 的資料
     */
    async fetchRecordCourse(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchBrowseRecordCoursePath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchRecordCourse', res);

          // 處理 直播課程 回傳的值
          this.handleRecordCourseData(res);
        }
      } catch (err) {
        console.log('fetchRecordCourse', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得不同語系的銷售計劃圖片
     */
    async fetchSaleAdRes() {
      try {
        const saleAdRes = await this.fetchSaleAdvertisement();

        // 成功提示
        axiosSuccessHint('saleAdRes', saleAdRes);

        if (saleAdRes !== undefined) {
          // 資料處理
          this.saleAdImgSrc = saleAdRes.data.data.img;
        }
      } catch (err) {
        console.log('fetchSaleAdRes err', err);
      }
    },

    /**
     * @author odin
     * @description 一開始的時候一併送出 axios 的請求
     */
    async initAxioses() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        // 取得 直播課程 的資料
        const liveRes = await this.returnLiveCourseAxios();

        // 取得 課程回播(影片回放) 的資料
        const recordRes = await this.returnRecordCourseAxios();

        // 取得在購物車中的列表
        const cartRes = await this.returnCartItemsAxios();

        // 取得已報名課堂列表
        const enrollRes = await this.returnEnrolledListAxios();

        // 取得銷售廣告的圖片路徑
        const saleAdRes = await this.returnSaleAdvertisementAxios();

        // 取得餘課數
        const remainingRes = await this.returnRemainingCourseAxios();

        // 成功提示
        axiosSuccessHint('liveRes', liveRes);
        axiosSuccessHint('recordRes', recordRes);
        axiosSuccessHint('cartRes', cartRes);
        axiosSuccessHint('enrollRes', enrollRes);
        axiosSuccessHint('saleAdRes', saleAdRes);
        axiosSuccessHint('remainingRes', remainingRes);

        if (
          liveRes !== undefined &&
          recordRes !== undefined &&
          cartRes !== undefined &&
          enrollRes !== undefined &&
          saleAdRes !== undefined &&
          remainingRes !== undefined
        ) {
          // 資料處理
          this.handleLiveCourseData(liveRes);
          this.handleRecordCourseData(recordRes);
          this.handleCartItems(cartRes);
          this.handleEnrollItems(enrollRes);
          this.handleSaleAdvertisementImg(saleAdRes);
          this.handleRemainingCoursesData(remainingRes);

          // 處理課堂相關的資料，並且比對是否有報名該課程
          this.prepareCourseCartList();
          this.prepareCartItems();
          this.prepareEnrollLessonId();
        }
      } catch (err) {
        console.log('initAxioses err', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 打立即報名的API，並傳入 lessonTimeId
     */
    async enrollNow() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      // 關閉所有燈箱
      this.closeAllLightboxes();

      const lessionId = this.watchNowLessonId;

      // 判斷是否有存取到課堂的 Id
      if (!lessionId) {
        console.log('存取課堂id錯誤');
        this.$bus.$emit('loading:off');
        return;
      }

      try {
        const res = await this.axios({
          url: enrollNowPath,
          method: 'post',
          data: {
            lesson_time_id: lessionId,
          },
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('enrollNow', res);

          // 關閉目前的燈箱
          this.courseAlert.openOrNot = false;
          // 顯示報名成功的燈箱
          this.goCoursePageLightbox.openOrNot = true;
        }
      } catch (err) {
        console.log('enrollNow', err);
        // 關閉目前的燈箱
        this.courseAlert.openOrNot = false;
        // 顯示報名失敗的燈箱
        this.$bus.$emit(
          'notify:message',
          'system_message.enroll_single_lesson_fail',
        );
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {number} videoId courserecord 指定課程的影片 id
     * @description 取得單筆指定課程的影片資料，並且判斷是否可以播放
     */
    async checkThisCourseExpired(videoId) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      // 關閉所有的燈箱
      this.closeAllLightboxes();

      // 如果沒有給 videoId 就自己抓
      if (!videoId) {
        videoId = this.watchNowLessonId;
      }

      try {
        const res = await this.axios({
          url: `${checkThisCourseExpiredListPath}/${videoId}/detail`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('checkThisCourseExpired', res);

          // 資料處理
          this.handleCheckThisCourseExpiredData(res);
        }
      } catch (err) {
        console.log('checkThisCourseExpired', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 打加入購物車的API，並傳入 lessonTimeId
     */
    async addToCart(lessonTimeId) {
      try {
        const res = await this.axios({
          url: operateCartPath,
          method: 'post',
          data: {
            lesson_time_id: lessonTimeId,
          },
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          console.log('addToCart Success');
          console.log('addToCart res => ', res);
        }
      } catch (err) {
        console.log('addToCart', err);
      }
    },

    /**
     * @author odin
     * @description 一開始的時候一併送出 axios 的請求
     */
    async removeFromCart(lessonTimeId) {
      console.log('lessonTimeId', lessonTimeId);
      try {
        const res = await this.axios({
          url: `${operateCartPath}/${lessonTimeId}`,
          method: 'delete',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          console.log('addToCart Success');
          console.log('addToCart res => ', res);
        }
      } catch (err) {
        console.log('removeFromCart', err);
      }
    },

    /**
     * @author odin
     * @param {string} lessonTimeId 該時段課程的id
     * @description 依據該id判斷該時段的課程是否為 加入購物車 | 從購物車中移除
     */
    toggleCart(lessonTimeId) {
      const courseCartList = [...this.courseCartList];

      console.log('courseCartList', courseCartList);

      if (this.isThisCourseInCart(lessonTimeId)) {
        // 從購物車中移除
        try {
          courseCartList.forEach((item, index) => {
            if (item.id === lessonTimeId) {
              this.courseCartList[index].isInCart = false;
              this.removeFromCart(lessonTimeId);

              throw new Error('終止forEach');
            }
          });
        } catch (err) {
          console.log('終止forEach');
        }
      } else {
        // 加入購物車
        try {
          courseCartList.forEach((item, index) => {
            if (item.id === lessonTimeId) {
              this.courseCartList[index].isInCart = true;
              this.addToCart(lessonTimeId);
              throw new Error('終止forEach');
            }
          });
        } catch (err) {
          console.log('終止forEach');
        }
      }
    },

    /**
     * @author odin
     * @param {number} objId 傳過來該筆物件的id(可能是 每月精選 或是 指定影片的id)
     * @description 將影片id 以及 是哪一個影片分類(monthlyeslite | courserecord) 儲存到 localStorage 並且轉去影片播放
     */
    recordIdAndCategoryThenGoPlayVideo(objId) {
      localStorage.setItem('video_ID', objId);
      localStorage.setItem('video_category', 'courserecord');

      // 導頁
      this.$router.push({
        name: 'video-play',
        params: { lang: this.$route.params.lang },
      });
    },

    /**
     * @author odin
     * @description 導頁去影片播放頁面
     */
    goToPlayReviewVideo() {
      this.recordIdAndCategoryThenGoPlayVideo(this.watchNowLessonId);
    },
  },
};
</script>

<style lang="scss" scoped></style>
