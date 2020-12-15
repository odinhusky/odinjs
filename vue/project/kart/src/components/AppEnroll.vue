<template>
  <div class="root enroll_root" :class="rootClassObj">
    <main class="main-10">
      <h2 class="page_title browse_title">{{ $t('enroll.title') }}</h2>

      <!-- category btns -->
      <section class="page-category-container center">
        <!-- 未報名 -->
        <button
          class="page-category-btn kart-btn kart-bg-gray"
          :class="{ active: category === 'cart' }"
          @click.prevent="changeCategory('cart')"
        >
          {{ $t('enroll.unenrolled') }}
        </button>
        <!-- 已報名 -->
        <button
          class="page-category-btn kart-btn kart-bg-gray"
          :class="{ active: category === 'enrolled' }"
          @click.prevent="changeCategory('enrolled')"
        >
          {{ $t('enroll.enrolled') }}
        </button>
      </section>

      <!-- 未報名內容頁 -->
      <section
        v-show="category === 'cart'"
        class="sec main_section unenroll_seciton"
      >
        <!-- 課程內容 -->
        <div
          v-if="cartLesstion.list.length > 0"
          class="enroll_courses_content unenroll_courses"
        >
          <!-- 未報名(購物車內)頁的課程以及課堂 -->
          <div
            v-for="course in cartLesstion.list"
            :key="course.id"
            class="enroll_course_unit unenroll_course_unit"
          >
            <h4 class="unenroll_course_title unenroll_course_title">
              {{ course.name }}
            </h4>

            <span
              class="enroll_course_teacher_name unenroll_course_teacher_name"
              >{{ dealTeacherName(course) }}</span
            >

            <div
              class="seperator enroll_course_seperator unenroll_course_seperator"
            ></div>

            <div class="enroll_course_lessions unenroll_course_lessions">
              <!-- 該課程不同時段的課堂 -->
              <div
                v-for="lession in course.times"
                :key="lession.id"
                class="enroll_course_lession_unit unenroll_course_lession_unit"
              >
                <!-- 左邊的時間以及名稱 -->
                <div class="detail_part">
                  <span
                    class="detail_span enroll_course_lession_name unenroll_course_lession_name"
                    >{{ lession.name }}</span
                  >
                  <span
                    class="detail_span enroll_course_lession_name unenroll_course_lession_time"
                    >{{ lession.start_at | formatDate }}</span
                  >
                </div>

                <!-- 移除的按鈕 -->
                <button
                  class="remove_cart_btn"
                  @click.prevent="removeThisLession(lession.id)"
                >
                  <img
                    src="../assets/img/v2/enroll/trashcan@2x.png"
                    class="remove_cart_img"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 沒有課程的時候顯示 -->
        <AppNoClasses
          v-if="cartLesstion.list.length === 0"
          :no-classes-text="noClassesText"
        />
      </section>

      <!-- 已報名內容頁 -->
      <section
        v-show="category === 'enrolled'"
        class="sec main_section enrolled_seciton"
      >
        <!-- 課程內容 -->
        <div
          v-if="enrolledLesstion.list.normal.length > 0"
          class="enroll_courses_content enrolled_courses"
        >
          <!-- 已報名頁的課程以及課堂(一般課程) -->
          <template v-if="enrolledLesstion.list.normal.length > 0">
            <div
              v-for="course in enrolledLesstion.list.normal"
              :key="course.id"
              class="enroll_course_unit enrolled_course_unit"
            >
              <h4 class="enroll_course_title enrolled_course_title">
                {{ course.name }}
              </h4>

              <span
                class="enroll_course_teacher_name enrolled_course_teacher_name"
                >{{ dealTeacherName(course) }}</span
              >

              <div
                class="seperator enroll_course_seperator enrolled_course_seperator"
              ></div>

              <div class="enroll_course_lessions enrolled_course_lessions">
                <!-- 該課程不同時段的課堂 -->
                <div
                  v-for="lession in course.times"
                  :key="lession.id"
                  class="enroll_course_lession_unit enrolled_course_lession_unit"
                >
                  <!-- 左邊的時間以及名稱 -->
                  <div class="detail_part">
                    <span
                      class="detail_span enroll_course_lession_name enrolled_course_lession_name"
                      >{{ lession.name }}</span
                    >
                    <span
                      class="detail_span enroll_course_lession_name enrolled_course_lession_time"
                      >{{ lession.start_at | formatDate }}</span
                    >
                  </div>

                  <!-- 取消報名的按鈕 -->
                  <button
                    v-if="!lession.is_end"
                    class="kart-btn kart-sub cancel_enrolled"
                    @click.prevent="
                      checkIfRemoveThisEnrolledLession(lession.id)
                    "
                  >
                    {{ $t('enroll.cancel_enroll') }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 沒有課程的時候顯示 -->
        <AppNoClasses
          v-if="enrolledLesstion.list.normal.length === 0"
          :no-classes-text="noClassesText"
        />
      </section>

      <!-- 剩餘課數等詳細資料 -->
      <section class="sec remaining_section">
        <div class="detail_container">
          <!-- 選擇數量：{0}堂  -->
          <div v-if="category === 'cart'" class="detail_line">
            {{ $t('enroll.selected_point', [totalLessionNumber]) }}
          </div>

          <!-- 一般餘課數量：{0}堂  -->
          <div class="detail_line">
            {{ $t('enroll.normal_point', [remaining.points]) }}
          </div>

          <!-- 評論餘課數量：{0}堂  -->
          <div class="detail_line">
            {{ $t('enroll.reviewable_point', [remaining.reviewable_points]) }}
          </div>

          <!-- 確認報名  -->
          <button
            v-if="category === 'cart' && cartLesstion.list != 0"
            class="kart-btn kart-sub confirm_to_enroll"
            @click.prevent="validatePointsAreEnoughOrNot"
          >
            {{ $t('enroll.confirm_enroll') }}
          </button>
        </div>
      </section>
    </main>

    <!-- 按下報名後 要扣點的燈箱 -->
    <AppLightBox
      v-model="enroll_confrim.openOrNot"
      :classname="lightbox.classname"
    >
      <template>
        <div class="enroll_confrim_content">
          <!-- 扣除 一般課程數 -->
          <h6 class="enroll_confrim_text minus_points_h6 selected_normal_point">
            {{
              $t('enroll.selected_normal_point', [
                this.cartLesstion.lessionsPoints.points,
              ])
            }}
          </h6>

          <!-- 扣除 點評課程數 -->
          <h6
            v-if="this.cartLesstion.lessionsPoints.reviewable_points > 0"
            class="enroll_confrim_text minus_points_h6 selected_reviewable_point"
          >
            {{
              $t('enroll.selected_reviewable_point', [
                this.cartLesstion.lessionsPoints.reviewable_points,
              ])
            }}
          </h6>

          <!-- ，確認報名? -->
          <h6 class="enroll_confrim_text enroll_seleted_fix minus_points_h6">
            {{ $t('enroll.seleted_fix') }}
          </h6>

          <!-- 按鈕區 -->
          <div class="enroll_confrim_btn_group">
            <!-- 取消 -->
            <button
              class="kart-btn kart-gray cancel_enroll"
              @click.prevent="enroll_confrim.openOrNot = false"
            >
              {{ $t('system_message.cancel') }}
            </button>

            <!-- 確認報名 -->
            <button
              class="kart-btn kart-sub enroll_cart_lessions"
              @click.prevent="enrollAllCartLesstions"
            >
              {{ $t('enroll.confirm_enroll') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 確認是否取消已報名課堂的燈箱 -->
    <AppLightBox
      v-model="enrolled_cancel.openOrNot"
      :classname="lightbox.classname"
    >
      <template>
        <div class="enroll_confrim_content">
          <!-- 確認是否取消 -->
          <h6 class="enroll_confrim_text selected_normal_point">
            {{ $t('enroll.enrolled_cancel_confirm') }}
          </h6>

          <!-- 按鈕區 -->
          <div class="enroll_confrim_btn_group">
            <!-- 取消 -->
            <button
              class="kart-btn kart-gray cancel_enroll"
              @click.prevent="enrolled_cancel.openOrNot = false"
            >
              {{ $t('system_message.cancel') }}
            </button>

            <!-- 確認取消該已報名的課程 -->
            <button
              class="kart-btn kart-sub enroll_cart_lessions"
              @click.prevent="removeThisEnrolledLession"
            >
              {{ $t('enroll.enrolled_cancel') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 儲值的燈箱 -->
    <AppLightBox
      v-model="storage_points.openOrNot"
      :classname="lightbox.classname"
    >
      <template>
        <div class="enroll_confrim_content">
          <!-- 扣除 一般課程數 -->
          <h6 class="enroll_confrim_text selected_normal_point">
            {{ storage_points.message.message1 }}
            <br v-if="storage_points.message.message2" />
            {{ storage_points.message.message2 }}
          </h6>

          <!-- 按鈕區 -->
          <div class="enroll_confrim_btn_group">
            <!-- 取消 -->
            <button
              class="kart-btn kart-gray cancel_enroll"
              @click.prevent="storage_points.openOrNot = false"
            >
              {{ $t('system_message.cancel') }}
            </button>

            <!-- 前往儲值 -->
            <router-link
              :to="{
                name: 'purchase',
                params: { lang: this.$route.params.lang },
              }"
              class="kart-btn kart-sub enroll_cart_lessions go_to_purchase"
            >
              {{ $t('enroll.buy_lession') }}
            </router-link>
          </div>
        </div>
      </template>
    </AppLightBox>
  </div>
</template>

<script>
// Resource
import {
  fetchRemainingCoursePath,
  fetchCartLessionsPath,
  fetchEnrolledLessionsPath,
  removeCartLessionsPath,
  enrollCartLessionPath,
  fetchEnrolledSetLessionsPath,
  removeEnrolledLessionPathPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';
import categoryMixinObj from '@/mixins/category.js';

// Component
import AppLightBox from '@/components/AppLightBox';
// import ThePagination from '@/components/ThePagination.vue';
import AppNoClasses from '@/components/AppNoClasses.vue';

export default {
  name: 'AppEnroll',
  components: {
    AppLightBox,
    // ThePagination,
    AppNoClasses,
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
      // 分類( 'cart' => 未報名 ｜ 'enrolled' => 已報名)
      category: '',
      // 剩餘課程
      totalLessionNumber: 0,
      remaining: {
        points: 0,
        reviewable_points: 0,
        individual_points: 0,
      },
      // 報名確定要扣幾堂課點數的燈箱
      enroll_confrim: {
        openOrNot: false,
        classname: 'enroll_confrim_lightbox',
      },
      // 要取消已報名的課程的燈箱
      enrolled_cancel: {
        openOrNot: false,
        classname: 'enrolled_cancel_lightbox',
      },
      // 儲值的燈箱
      storage_points: {
        openOrNot: false,
        classname: 'storage_points_lightbox',
        message: {
          message1: '',
          message2: '',
        },
      },
      // 購物車中的課程
      cartLesstion: {
        list: [],
        // 購物車中的課程點數合計
        lessionsPoints: {
          points: 0,
          reviewable_points: 0,
        },
        // 所有在購物車中的課堂id(lession id)
        ids: [],
      },
      // 已報名的課程
      enrolledLesstion: {
        list: {
          normal: [],
          // sets: [],
        },
        cancelEnrolledLesstionId: '',
      },
    };
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
  },
  created() {
    // 資料初始化
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 開啟燈箱
     */
    showAlert() {
      this.lightbox.openOrNot = true;
    },

    /**
     * @author odin
     * @description enroll 資料初始化
     */
    init() {
      // 初始化的 ajax
      this.initAxioses();
      // 取得剩餘課數
      // this.fetchRemainingCourse();
      // 取得加入購物車的課堂(包含點評課程)
      // this.fetchCartLessions();
      // 取得已報名的課堂
      // this.fetchEnrolledLessions();
    },

    /**
     * @author odin
     * @description 一開始的時候一併送出 axios 的請求
     */
    async initAxioses() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        // 取得餘課數
        const fetchRemainingCourseRes = await this.fetchRemainingCourse();

        // 取得未報名(購物車清單)
        const fetchCartLessionsRes = await this.fetchCartLessions();

        // 取得已報名非套裝的課程
        const fetchEnrolledLessionsRes = await this.fetchEnrolledLessions();

        // 取得已報名非套裝的課程
        // const fetchEnrolledSetLessionsRes = await this.fetchEnrolledSetLessions();

        // 成功提示
        axiosSuccessHint('fetchRemainingCourse', fetchRemainingCourseRes);
        axiosSuccessHint('fetchCartLessions', fetchCartLessionsRes);
        axiosSuccessHint('fetchEnrolledLessions', fetchEnrolledLessionsRes);
        // axiosSuccessHint(
        //   'fetchEnrolledSetLessions',
        //   fetchEnrolledSetLessionsRes,
        // );

        if (
          fetchRemainingCourseRes !== undefined &&
          fetchCartLessionsRes !== undefined &&
          fetchEnrolledLessionsRes !== undefined
          // fetchEnrolledSetLessionsRes !== undefined
        ) {
          // 資料處理
          this.handleFetchRemainingCourseData(fetchRemainingCourseRes);
          this.handleFetchCartLessionsData(fetchCartLessionsRes);
          this.handleFetchEnrolledLessionsData(fetchEnrolledLessionsRes);
          // this.handleFetchEnrolledSetLessionsData(fetchEnrolledSetLessionsRes);
        }
      } catch (err) {
        console.log('initAxioses', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 處理 老師的中文姓名
     * @param {object} course 該課程的所以有內容物件
     * @return {string} 符合當前語系的老師姓名
     */
    dealTeacherName(course) {
      if (this.i18n === 'cn') {
        return course.teacher.name;
      } else if (this.i18n === 'tw') {
        return course.teacher.name_hant;
      } else {
        return course.teacher.name_en;
      }
    },

    /**
     * @author odin
     * @description 處理 剩餘課程數 的資料
     * @param {object} res ajax 成功的 response
     */
    handleFetchRemainingCourseData(res) {
      const data = res.data.data;
      this.remaining.points = data.points;
      this.remaining.reviewable_points = data.reviewable_points;
      this.remaining.individual_points = data.individual_points;
    },

    /**
     * @author odin
     * @description 處理 加入到購物車的課堂 的資料
     * @param {object} res ajax 成功的 response
     */
    handleFetchCartLessionsData(res) {
      const data = res.data.data;
      this.cartLesstion.list = data;

      // 計算總共有幾堂課
      this.handleTotalLession();
      // 計算課程點數
      this.handleLessionsPoints();
      // 取出購物車中所有課堂的id
      this.handleLessionAllIds();
    },

    /**
     * @author odin
     * @description 計算總共有幾堂課
     */
    handleTotalLession() {
      let count = 0;
      [...this.cartLesstion.list].forEach(course => {
        [...course.times].forEach(() => {
          count++;
        });
      });

      console.log('count', count);

      this.totalLessionNumber = count;
    },

    /**
     * @author odin
     * @description 計算課程點數有多少，以利購買的時候比較
     */
    handleLessionsPoints() {
      let normal_point = 0;
      let review_point = 0;

      [...this.cartLesstion.list].forEach(course => {
        const isReview = course.is_reviewable;
        [...course.times].forEach(() => {
          if (isReview) {
            review_point++;
          } else {
            normal_point++;
          }
        });
      });

      this.cartLesstion.lessionsPoints.points = normal_point;
      this.cartLesstion.lessionsPoints.reviewable_points = review_point;
    },

    /**
     * @author odin
     * @description 取出購物車中所有課堂的id
     */
    handleLessionAllIds() {
      let ids = [];

      [...this.cartLesstion.list].forEach(course => {
        [...course.times].forEach(lession => {
          ids.push(lession.id);
        });
      });

      this.cartLesstion.ids = ids;
    },

    /**
     * @author odin
     * @description 處理 已報名的課堂(非套裝) 的資料
     * @param {object} res ajax 成功的 response
     */
    handleFetchEnrolledLessionsData(res) {
      this.enrolledLesstion.list.normal = res.data.data;
    },

    /**
     * @author odin
     * @description 處理 已報名的課堂(套裝課程) 的資料
     * @param {object} res ajax 成功的 response
     */
    // handleFetchEnrolledSetLessionsData(res) {
    //   this.enrolledLesstion.list.sets = res.data.data;
    // },

    /**
     * @author odin
     * @description 判斷剩餘點數是否足夠支付目前購物車內的課程點數
     * @retunr {boolean} 是否足夠
     */
    validatePointsAreEnoughOrNot() {
      if (
        this.remaining.points < this.cartLesstion.lessionsPoints.points &&
        this.cartLesstion.lessionsPoints.points > 0
      ) {
        console.log('一般課程餘課數不足');
        // 開啟對應的燈箱
        this.storage_points.message.message1 = this.$t(
          'enroll.normal_point_not_enough',
        );
        this.storage_points.openOrNot = true;
      } else if (
        this.remaining.reviewable_points <
          this.cartLesstion.lessionsPoints.reviewable_points &&
        this.cartLesstion.lessionsPoints.reviewable_points > 0
      ) {
        console.log('點評課程餘課數不足');
        // 開啟對應的燈箱
        this.storage_points.message.message1 = this.$t(
          'enroll.normal_point_not_enough',
        );
        this.storage_points.openOrNot = true;
      } else if (
        this.remaining.points >= this.cartLesstion.lessionsPoints.points &&
        this.cartLesstion.lessionsPoints.points >= 0 &&
        this.remaining.reviewable_points >=
          this.cartLesstion.lessionsPoints.reviewable_points &&
        this.cartLesstion.lessionsPoints.reviewable_points >= 0
      ) {
        console.log('點數都足夠');
        // 確認要扣點嗎 的燈箱
        this.enroll_confrim.openOrNot = true;
      }
    },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)
     */
    fetchRemainingCourse() {
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
     * @description 取得未報名但已點選愛心的課堂
     */
    fetchCartLessions() {
      return this.axios({
        url: fetchCartLessionsPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得已報名的課程內容(非套裝)
     */
    fetchEnrolledLessions() {
      return this.axios({
        url: fetchEnrolledLessionsPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得已報名的課程內容(套裝課程)
     */
    fetchEnrolledSetLessions() {
      return this.axios({
        url: fetchEnrolledSetLessionsPath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 從 whishList 中移除該筆課堂
     */
    async removeThisLession(lessionId) {
      try {
        const res = await this.axios({
          url: `${removeCartLessionsPath}/${lessionId}`,
          method: 'delete',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          // 成功提示
          axiosSuccessHint('removeThisLession', res);

          // 再重新抓取一次資料
          this.reload();
        }
      } catch (err) {
        console.log('removeThisLession', err);
      }
    },

    /**
     * @author odin
     * @description 開啟確認是否刪除燈箱，並記錄該比課堂的id
     */
    checkIfRemoveThisEnrolledLession(lessionId) {
      this.enrolled_cancel.openOrNot = true;
      this.enrolledLesstion.cancelEnrolledLesstionId = lessionId;
    },

    /**
     * @author odin
     * @description 從 已報名名單 中移除該筆課堂
     */
    async removeThisEnrolledLession() {
      const lessionId = this.enrolledLesstion.cancelEnrolledLesstionId;

      try {
        const res = await this.axios({
          url: `${removeEnrolledLessionPathPath}/${lessionId}`,
          method: 'delete',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          // 成功提示
          axiosSuccessHint('removeThisEnrolledLession', res);

          // 重新整理
          this.reload();
        }
      } catch (err) {
        console.log('removeThisEnrolledLession', err);
      }
    },

    /**
     * @author odin
     * @description 報名購物車內所有的課程
     */
    async enrollAllCartLesstions() {
      try {
        const res = await this.axios({
          url: enrollCartLessionPath,
          method: 'post',
          data: {
            lesson_time_ids: [...this.cartLesstion.ids],
          },
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          // 成功提示
          axiosSuccessHint('enrollAllCartLesstions', res);

          // 重新整理
          this.reload();
        }
      } catch (err) {
        console.log('enrollAllCartLesstions', err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
