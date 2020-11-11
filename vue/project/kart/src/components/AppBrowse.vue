<template>
  <div class="root browse_root" :class="rootClassObj">
    <main class="main-10">
      <h2 class="page_title browse_title">{{ $t('mycourse.title') }}</h2>

      <section class="browse_btn_group">
        <button
          class="kart-btn kart-bg-gray page-category-btn course"
          :class="{ active: category === 'course' }"
          @click.prevent="changeCategory('course')"
        >
          {{ $t('mycourse.course') }}
        </button>
        <button
          class="kart-btn kart-bg-gray page-category-btn product"
          :class="{ active: category === 'set' }"
          @click.prevent="changeCategory('set')"
        >
          {{ $t('mycourse.product') }}
        </button>
      </section>

      <section class="browse_courses margin-outer">
        <div
          v-for="item in courseJudge"
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
                <div v-if="category === 'course'" class="text_set">
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
                        {{ dealTeacherName(item) }}
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

                <div
                  v-if="category === 'course'"
                  class="text_set_seperator"
                ></div>

                <!-- 經歷 -->
                <div v-if="category === 'course'" class="text_set">
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

                <div
                  v-if="category === 'course'"
                  class="text_set_seperator"
                ></div>

                <!-- 時間 -->
                <div class="text_set">
                  <span class="text_set_title">{{
                    $t('course_item.time')
                  }}</span>
                  <span class="text_set_divider">|</span>
                  <!-- 根據不同語系顯示不同內容 -->
                  <div class="text_set_container">
                    <div
                      v-for="time in item.times"
                      :key="time.id"
                      class="text_set_content flex-align-items-center"
                      :data-id="time.id"
                    >
                      <span class="text_set_time">
                        {{ time.start_at | formatDate }}
                      </span>
                      <div v-if="category === 'course'" class="text_set_status">
                        <button
                          v-if="!isThisCourseHadApplied(time.id)"
                          class="add_wish_btn"
                          :class="{ selected: isThisCourseInCart(time.id) }"
                          @click.prevent="toggleCart(time.id)"
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
                        <span
                          v-if="isThisCourseHadApplied(time.id)"
                          class="kart-gray had_signed_up"
                          >{{ $t('enroll.enrolled') }}
                        </span>
                      </div>
                    </div>
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
      </section>

      <section class="fix_btns">
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
        :page-obj="coursePageObj.props"
        @fetchSpecificCoursePage="fetchSpecificCoursePage"
      />
    </main>

    <!-- 銷售方案燈箱 -->
    <AppAlert
      v-model="saleAdAlert.openOrNot"
      :title="saleAdAlert.title"
      :classname="saleAdAlert.classname"
      :is-show-icon="saleAdAlert.isShowIcon"
      :is-show-cancel="saleAdAlert.isShowCancel"
    >
      <template slot="content">
        <div class="sale_ad_box">
          <img :src="saleAdImgSrc" class="sale_ad_img" />
        </div>
      </template>
    </AppAlert>
    <!-- 一般課程詳細燈箱的內容 -->
    <AppAlert
      v-model="courseAlert.openOrNot"
      :title="courseAlert.title"
      :classname="courseAlert.classname"
      :is-show-icon="courseAlert.isShowIcon"
      :is-show-cancel="courseAlert.isShowCancel"
    >
      <template slot="content">
        <div class="course_alert_cotent">
          <!-- 標題 -->
          <h5 class="course_alert_title">{{ $t('course_info.info_title') }}</h5>
          <div class="course_alert_seperator"></div>

          <!-- 內容 -->
          <div class="course_alert_detail">
            <!-- 課程名稱 -->
            <div class="course_alert_detail_unit">
              <h6 class="course_alert_detail_unit_title">
                {{ $t('course_info.name') }}
              </h6>
              <span class="course_alert_detail_unit_divider">|</span>
              <div class="course_alert_detail_unit_content">
                {{ courseAlert.courseObj.name }}
              </div>
            </div>

            <!-- 授課老師 -->
            <div class="course_alert_detail_unit">
              <h6 class="course_alert_detail_unit_title">
                {{ $t('teacher_list.teacher') }}
              </h6>
              <span class="course_alert_detail_unit_divider">|</span>
              <div class="course_alert_detail_unit_content">
                <!-- 根據不同語系顯示不同內容 -->
                <div
                  v-if="i18n === 'cn' || i18n === 'tw'"
                  class="course_alert_detail_unit_container"
                >
                  <div class="unit_box">
                    <span class="unit_main">
                      {{ dealTeacherName(courseAlert.courseObj) }}
                    </span>
                    <br />

                    <small class="text_set_sub">
                      {{ courseAlert.courseObj.teacher.name_en }}
                    </small>
                  </div>
                </div>
                <div
                  v-if="i18n === 'en'"
                  class="course_alert_detail_unit_container"
                >
                  <div class="unit_box">
                    <span class="unit_main">{{
                      courseAlert.courseObj.teacher.name_en
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 課程介紹 -->
            <div class="course_alert_detail_unit">
              <h6 class="course_alert_detail_unit_title">
                {{ $t('course_info.intro_title') }}
              </h6>
              <span class="course_alert_detail_unit_divider">|</span>
              <div class="course_alert_detail_unit_content">
                {{ courseAlert.courseObj.introduction }}
              </div>
            </div>

            <!-- 課程時間 -->
            <div class="course_alert_detail_unit">
              <h6 class="course_alert_detail_unit_title">
                {{ $t('course_info.time') }}
              </h6>
              <span class="course_alert_detail_unit_divider">|</span>
              <div class="course_alert_detail_unit_content">
                <span
                  v-for="time in courseAlert.courseObj.times"
                  :key="time.id"
                  class="course_alert_detail_unit_time"
                >
                  {{ time.start_at | formatDate }}
                </span>
              </div>
            </div>

            <!-- 老師經歷 -->
            <div class="course_alert_detail_unit">
              <h6 class="course_alert_detail_unit_title">
                {{ $t('course_info.intro_teacher') }}
              </h6>
              <span class="course_alert_detail_unit_divider">|</span>
              <div class="course_alert_detail_unit_content">
                <!-- 根據不同語系顯示不同內容 -->
                <div
                  v-for="intro in courseAlert.courseObj.teacher.intros"
                  :key="intro.id"
                  class="course_alert_detail_unit_outer"
                >
                  <div
                    v-if="i18n === 'cn' || i18n === 'tw'"
                    class="course_alert_detail_unit_container"
                  >
                    <div class="unit_box">
                      <span class="text_set_main">
                        {{ dealTeacherIntros(intro) }}
                      </span>
                      <br />

                      <small class="text_set_sub">{{ intro.intro_en }}</small>
                      <br />
                    </div>
                  </div>
                  <div
                    v-if="i18n === 'en'"
                    class="course_alert_detail_unit_container"
                  >
                    <div class="unit_box">
                      <span class="text_set_main">
                        {{ intro.intro_en }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 關閉按鈕 -->
          <div class="course_alert_btn_container">
            <button
              class="main_btn course_alert_close"
              @click.prevent="courseAlert.openOrNot = false"
            >
              {{ $t('system_message.close') }}
            </button>
          </div>
        </div>
      </template>
    </AppAlert>

    <!-- 套裝課程詳細燈箱的內容 -->
    <AppAlert
      v-model="setCourseAlert.openOrNot"
      :title="setCourseAlert.title"
      :classname="setCourseAlert.classname"
      :is-show-icon="setCourseAlert.isShowIcon"
      :is-show-cancel="setCourseAlert.isShowCancel"
    >
      <template slot="content">
        <div class="course_alert_cotent">
          <!-- 標題 -->
          <h5 class="course_alert_title">{{ $t('course_info.info_title') }}</h5>
          <div class="course_alert_seperator"></div>

          <!-- 內容 -->
          <div class="course_alert_detail">
            <!-- 課程單位 -->
            <div
              v-for="item in setCourseAlert.lessionsInAlert"
              :key="item.lesson.id"
              class="lessions_unit"
            >
              <!-- 課程名稱 -->
              <div class="course_alert_detail_unit">
                <h6 class="course_alert_detail_unit_title">
                  {{ $t('course_info.name') }}
                </h6>
                <span class="course_alert_detail_unit_divider">|</span>
                <div class="course_alert_detail_unit_content">
                  {{ item.lesson.name }}
                </div>
              </div>

              <!-- 授課老師 -->
              <div class="course_alert_detail_unit">
                <h6 class="course_alert_detail_unit_title">
                  {{ $t('teacher_list.teacher') }}
                </h6>
                <span class="course_alert_detail_unit_divider">|</span>
                <div class="course_alert_detail_unit_content">
                  <!-- 根據不同語系顯示不同內容 -->
                  <div
                    v-if="i18n === 'cn' || i18n === 'tw'"
                    class="course_alert_detail_unit_container"
                  >
                    <div class="unit_box">
                      <span class="unit_main">
                        {{ dealTeacherName(item.lesson) }}
                      </span>
                      <br />

                      <small class="text_set_sub">
                        {{ item.lesson.teacher.name_en }}
                      </small>
                    </div>
                    <div
                      v-if="i18n === 'en'"
                      class="course_alert_detail_unit_container"
                    >
                      <div class="unit_box">
                        <span class="unit_main">{{
                          item.lesson.teacher.name_en
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 課程介紹 -->
              <div class="course_alert_detail_unit">
                <h6 class="course_alert_detail_unit_title">
                  {{ $t('course_info.intro_title') }}
                </h6>
                <span class="course_alert_detail_unit_divider">|</span>
                <div class="course_alert_detail_unit_content">
                  {{ item.lesson.introduction }}
                </div>
              </div>

              <!-- 課程時間 -->
              <div class="course_alert_detail_unit">
                <h6 class="course_alert_detail_unit_title">
                  {{ $t('course_info.time') }}
                </h6>
                <span class="course_alert_detail_unit_divider">|</span>
                <div class="course_alert_detail_unit_content">
                  <span
                    v-for="time in item.times"
                    :key="time.id"
                    class="course_alert_detail_unit_time"
                  >
                    {{ time.start_at | formatDate }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 關閉按鈕 -->
          <div class="course_alert_btn_container">
            <button
              class="main_btn course_alert_close"
              @click.prevent="setCourseAlert.openOrNot = false"
            >
              {{ $t('system_message.close') }}
            </button>
          </div>
        </div>
      </template>
    </AppAlert>
  </div>
</template>

<script>
// resources
import {
  courseListPath,
  setCourseListPath,
  cartItemPath,
  enrolledListPath,
  cartPath,
  saleAdvertisementImgSrcPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import { checkObjectIsEmpty } from '@/plugins/checker.js';
import paginationMixinObj from '@/mixins/pagination.js';
import commonMixinObj from '@/mixins/common.js';
import categoryMixinObj from '@/mixins/category.js';

// component
import AppAlert from '@/components/AppAlert.vue';
import ThePagination from '@/components/ThePagination.vue';

export default {
  name: 'AppBrowse',
  components: {
    AppAlert,
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
      // 分類( 'course' => 一般課程 ｜ 'public' => 套裝課程)
      category: '',
      // 銷售方案燈箱
      saleAdImgSrc: '',
      courses: {
        // 一般課程
        course: [],
        // 套裝課程
        set: [],
      },
      // 可加入購物車清單
      courseCartList: [],
      // 課程詳細燈箱的內容
      courseAlert: {
        openOrNot: false,
        classname: 'course_detail_alert',
        title: '',
        subtitle: '',
        isShowIcon: false,
        isShowCancel: false,
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
          times: [{ start_at: '2020-06-09T16:00:00+00:00', id: 1 }],
        },
      },
      // 套裝課程的燈箱內容
      setCourseAlert: {
        openOrNot: false,
        classname: 'course_detail_alert set_course_detail_alert',
        title: '',
        subtitle: '',
        isShowIcon: false,
        isShowCancel: false,
        // 給予最低的結構不讓程式執行錯誤
        setCourseObj: {},
        lessionsInAlert: [
          {
            lesson: {
              id: 1,
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
            },
            times: [{ start_at: '2020-06-09T16:00:00+00:00', id: 1 }],
          },
        ],
      },
      // 銷售方案的燈箱內容
      saleAdAlert: {
        openOrNot: false,
        classname: 'sale_ad_alert',
        title: '',
        subtitle: '',
        isShowIcon: false,
        isShowCancel: true,
      },
      // 一般課程的頁碼
      coursePageObj: {
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
      // 套裝課程的頁碼
      setCoursePageObj: {
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
    loginToken() {
      return this.$store.state.user.loginToken;
    },

    /**
     * @author odin
     * @description 開啟特定課程的詳細內容
     * @return {array} 判斷要用哪一個陣列
     */
    courseJudge() {
      let arr = [];
      if (this.category === 'course') {
        arr = [...this.courses.course];
      } else if (this.category === 'set') {
        arr = [...this.courses.set];
      }
      return arr;
    },
  },
  created() {
    // 取得資料的初始化
    this.initAxioses();
  },
  methods: {
    /**
     * @author odin
     * @description 開啟特定課程的詳細內容
     * @param {object} course 單一個課程的所有內容
     */
    showCourseDetailAlert(course) {
      const category = this.category;
      console.log('category', category);
      console.log('course', course);

      if (category === 'course') {
        // 把特定內容給放到對應的位置
        this.courseAlert.courseObj = { ...course };
        // 開啟燈箱
        this.courseAlert.openOrNot = true;
      } else if (category === 'set') {
        // 把特定內容給放到對應的位置
        this.setCourseAlert.setCourseObj = { ...course };
        // 處理燈箱要顯示的課程資訊
        this.dealSetCourseDataForAlert();
        // 開啟燈箱
        this.setCourseAlert.openOrNot = true;
      }
    },

    /**
     * @author odin
     * @description 處理套裝課程所要產生的資料
     * @return {array}
     */
    dealSetCourseDataForAlert() {
      console.log(
        'this.setCourseAlert.setCourseObj',
        typeof this.setCourseAlert.setCourseObj,
        this.setCourseAlert.setCourseObj,
      );
      const setCourseObj = this.setCourseAlert.setCourseObj;
      const thisSetCourseTimesArray = [...setCourseObj.times];

      let resultData = {};

      thisSetCourseTimesArray.forEach(item => {
        let lessonId = item.lesson.id;
        if (!resultData[lessonId]) {
          resultData[lessonId] = [];
        }
        resultData[lessonId].push(item);
      });

      let lessonIds = Object.keys(resultData);
      let lessons = lessonIds.map(lessonId => ({
        lesson: resultData[lessonId][0].lesson,
        times: resultData[lessonId],
      }));

      console.log('lessons', lessons);

      this.setCourseAlert.lessionsInAlert = lessons;
    },

    /**
     * @author odin
     * @description 處理不同語系的老師名稱
     * @param {object} item 單一個課程的所有介紹
     */
    dealTeacherName(item) {
      if (this.i18n === 'cn') {
        return item.teacher.name;
      } else if (this.i18n === 'tw') {
        return item.teacher.name_hant;
      } else {
        return '';
      }
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
      const targetArray = [...this.courses.course];
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
    prepareCartItems(cartItemArray) {
      console.log('cartItemArray', cartItemArray);
      if (checkObjectIsEmpty(cartItemArray)) return;

      // 找出回傳的 ajax 陣列中，有的物件 id 比對，找到的話就將 courseCartList 中的那個 id 的 isInCart 改為 true
      [...cartItemArray].forEach(courseInCartObj => {
        [...this.courseCartList].forEach((lession, lessionIndex) => {
          if (lession.id === courseInCartObj.lesson_time_id) {
            this.courseCartList[lessionIndex].isInCart = true;
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
     * @description 處理一般課程回傳的值
     * @param {object} intro 老師介紹的第一筆內容
     */
    handleCourseData(courseRes) {
      const data = courseRes.data.data;
      const meta = courseRes.data.meta;
      const links = courseRes.data.links;

      // 放入課程內容
      this.courses.course = data;

      // 處理頁碼
      this.vMixhandlePaginationData(this.coursePageObj, links, meta);

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @description 處理套裝課程回傳的值
     * @param {object} intro 老師介紹的第一筆內容
     */
    handleSetCourseData(courseRes) {
      const data = courseRes.data.data;
      const meta = courseRes.data.meta;
      const links = courseRes.data.links;

      // 放入課程內容
      this.courses.set = data;

      // 處理頁碼
      this.vMixhandlePaginationData(this.setCoursePageObj, links, meta);

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @description 處理套裝課程回傳的值
     * @param {object} targetPageObj data對應的頁碼物件
     * @param {object} links ajax 傳過來的 links 物件
     * @param {object} meta ajax 傳過來的 meta 物件
     */
    // move to plugins/vue-handle.js
    // handlePaginationData(targetPageObj, links, meta) {
    //   // 放入連結
    //   targetPageObj.links = links;

    //   // 放入頁碼相關資訊
    //   targetPageObj.props.current = meta.current_page;
    //   targetPageObj.props.prev = meta.from;
    //   targetPageObj.props.next =
    //     meta.current_page === meta.last_page
    //       ? meta.last_page
    //       : meta.current_page + 1;
    //   targetPageObj.props.total = meta.total;
    //   targetPageObj.props.totalPages = meta.last_page;
    //   targetPageObj.props.perPage = meta.per_page;
    //   targetPageObj.props.path = meta.path;
    //   targetPageObj.props.limitPage = 5;
    // },

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

      return thisObj.isInCart;
    },

    /**
     * @author odin
     * @description 確認特定id的內容是否已經報名了
     * @param {string} id 特定時間的課程id
     */
    isThisCourseHadApplied(id) {
      // 還沒讀到資料之前
      if (checkObjectIsEmpty(this.courseCartList)) {
        return;
      }

      const thisObj = [...this.courseCartList].find(item => id === item.id);

      return thisObj.hadApplied;
    },

    /**
     * @author odin
     * @description 取得一般課程列表(不含套裝課程)
     */
    fetchCourse() {
      return this.axios({
        url: `${courseListPath}?page=1`,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得套裝課程列表
     */
    fetchSetCourse() {
      return this.axios({
        url: `${setCourseListPath}?page=1`,
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
    fetchCartItems() {
      return this.axios({
        url: cartItemPath,
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
    fetchEnrolledList() {
      return this.axios({
        url: enrolledListPath,
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
    fetchSaleAdvertisement() {
      return this.axios({
        url: saleAdvertisementImgSrcPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 一開始的時候一併送出 axios 的請求
     */
    async initAxioses() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const courseRes = await this.fetchCourse();

        const setCourseRes = await this.fetchSetCourse();

        const cartRes = await this.fetchCartItems();

        const enrollRes = await this.fetchEnrolledList();

        const saleAdRes = await this.fetchSaleAdvertisement();

        // 成功提示
        axiosSuccessHint('fetchCourse', courseRes);
        axiosSuccessHint('fetchSetCourse', setCourseRes);
        axiosSuccessHint('fetchCartItems', cartRes);
        axiosSuccessHint('enrollRes', enrollRes);
        axiosSuccessHint('saleAdRes', saleAdRes);

        if (
          courseRes !== undefined &&
          setCourseRes !== undefined &&
          cartRes !== undefined &&
          enrollRes !== undefined &&
          saleAdRes !== undefined
        ) {
          // 資料處理(順序一定要這樣)
          this.handleCourseData(courseRes);
          this.handleSetCourseData(setCourseRes);
          this.prepareCourseCartList();
          this.prepareCartItems(cartRes.data.data);
          this.handleCourseHadApplied(enrollRes.data.data);
          this.saleAdImgSrc = saleAdRes.data.data.img;
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
        console.log('initAxioses err', err);
      }
    },

    /**
     * @author odin
     * @description 打加入購物車的API，並傳入 lessonTimeId
     */
    async fetchSpecificCoursePage(page = 1) {
      console.log('fetchSpecificCoursePage page', page);
      try {
        const res = await this.axios({
          url: `${courseListPath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          console.log('addToCart Success');
          console.log('fetchSpecificCoursePage res => ', res);
          this.handleCourseData(res);
        }
      } catch (err) {
        console.log('addToCart', err);
      }
    },

    /**
     * @author odin
     * @description 打加入購物車的API，並傳入 lessonTimeId
     */
    async addToCart(lessonTimeId) {
      try {
        const res = await this.axios({
          url: cartPath,
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
          url: `${cartPath}/${lessonTimeId}`,
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
