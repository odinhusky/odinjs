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
                <div v-if="isShowLessionStatus" class="lesson_status">
                  <!-- 已報名 -->
                  <span
                    v-if="isThisCourseHadApplied(lesson.id)"
                    class="kart-gray had_signed_up"
                    >{{ $t('enroll.enrolled') }}
                  </span>

                  <!-- 立即報名 和 愛心 -->
                  <template v-else>
                    <!-- 立即報名 -->
                    <button
                      class="kart-btn kart-sub enroll_now"
                      @click.prevent="checkRemaingCourse(lesson.id)"
                    >
                      {{ $t('enroll.enroll_now') }}
                    </button>

                    <!-- 愛心 -->
                    <button
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
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 關閉按鈕 -->
          <button
            class="w-100 kart-btn kart-sub close_course_alert"
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
      // 購物車內有哪些課堂
      cartLessions: [],
      // 已報名的課堂
      enrolledLessions: [],
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
      // 課程詳細燈箱的內容
      courseAlert: {
        openOrNot: false,
        isShowCancel: false,
        classname: 'course_detail_alert',
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

      // 分頁在直撥課程，且為訂閱制學生時，不顯示課程狀態
      if (this.category === 'live' && this.loginUserIsSubscribed) {
        showOrNot = false;
      } else {
        showOrNot = true;
      }

      return showOrNot;
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
      // 取得其他初始化資料
      this.initAxioses();
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
      this.courseAlert.openOrNot = true;
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

      // 找出回傳的 ajax 陣列中，有的物件 id 比對，找到的話就將 courseCartList 中的那個 id 的 isInCart 改為 true
      [...enrolledLessions].forEach(enrolled => {
        [...this.courseCartList].forEach((lesson, lessonIndex) => {
          if (lesson.id === enrolled.lesson_time_id) {
            this.courseCartList[lessonIndex].isInCart = true;
          }
        });
      });
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
     * @description 處理套裝課程回傳的值
     * @param {object} intro 老師介紹的第一筆內容
     */
    // handleSetCourseData(courseRes) {
    //   const data = courseRes.data.data;
    //   const meta = courseRes.data.meta;
    //   const links = courseRes.data.links;

    //   // 放入課程內容
    //   this.courses.set = data;

    //   // 處理頁碼
    //   this.vMixhandlePaginationData(this.setCoursePageObj, links, meta);

    //   // 回到最上方
    //   this.backToTop();
    // },

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
     * @description 確認該使用者的餘課數是否還足夠
     * @param {string} lessionId 想要報名該課堂的ID
     */
    checkRemaingCourse(lessionId) {
      if (this.remaining.points >= 1) {
        // 點數足夠，打API告知報名該課堂
        this.enrollNow(lessionId);
      } else {
        // 關閉燈箱並且顯示點數不夠
        this.courseAlert.openOrNot = false;
        this.$bus.$emit('notify:message', 'enroll.normal_point_not_enough');
      }
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
     * @param {string} lessionId 課堂 id
     * @description 打立即報名的API，並傳入 lessonTimeId
     */
    async enrollNow(lessionId) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

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
          this.$bus.$emit(
            'notify:message',
            'system_message.enroll_single_lesson_success',
          );

          // 重整
          this.reload();
        }
      } catch (err) {
        console.log('enrollNow', err);
        // 關閉目前的燈箱
        this.courseAlert.openOrNot = false;
        // 顯示報名成功的燈箱
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
     * @description 打加入購物車的API，並傳入 lessonTimeId
     */
    // async fetchSpecificCoursePage(page = 1) {
    //   console.log('fetchSpecificCoursePage page', page);
    //   try {
    //     const res = await this.axios({
    //       url: `${courseListPath}?page=${page}`,
    //       method: 'get',
    //       headers: {
    //         Authorization: this.loginToken,
    //       },
    //     });

    //     if (res.data.data || res.data.status) {
    //       console.log('addToCart Success');
    //       console.log('fetchSpecificCoursePage res => ', res);
    //       this.handleCourseData(res);
    //     }
    //   } catch (err) {
    //     console.log('addToCart', err);
    //   }
    // },

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
  },
};
</script>

<style lang="scss" scoped></style>
