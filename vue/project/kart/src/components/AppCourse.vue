<template>
  <div>
    <div class="root course_root course_container_body" :class="rootClassObj">
      <main class="main-10 course_main">
        <section class="course_title">
          <img
            src="../assets/img/v2/course/icon_list@2x.png"
            class="course_title_img"
          />
          <p class="title_text">
            <span class="title_name text-main">{{ loginUserName }}</span>
            <span class="title_welcome text-main">{{ $t('welcome') }}</span>
          </p>
        </section>

        <section class="live_group">
          <!-- 學生的切換列表 -->
          <div v-show="loginType === 'student'" class="tabs_list">
            <button
              class="kart-btn kart-sub course_tab"
              :class="{ active: category === 'live' }"
              @click.prevent="changeCategory('live')"
            >
              {{ $t('mycourse.live') }}
            </button>

            <button
              class="kart-btn kart-sub course_tab"
              :class="{ active: category === 'onetoone' }"
              @click.prevent="changeCategory('onetoone')"
            >
              {{ $t('mycourse.onetoone') }}
            </button>
          </div>

          <!-- 老師的切換列表 -->
          <div v-show="loginType === 'teacher'" class="tabs_list">
            <button
              class="course_tab"
              :class="{ active: category === 'teacher' }"
              @click.prevent="changeCategory('teacher')"
            >
              {{ $t('course_item.teacher') }}
            </button>

            <button
              class="course_tab"
              :class="{ active: category === 'assistant' }"
              @click.prevent="changeCategory('assistant')"
            >
              {{ $t('teacher_list.assistant') }}
            </button>
          </div>

          <div class="course_content mt-5">
            <div class="card-container course_content_box course_box">
              <div
                v-for="item in viewData"
                :key="item.id"
                class="card card-3 course_next_container"
                @click="judgeCardBeClicked(item)"
              >
                <div class="card-content course_next">
                  <p class="card-header-text coursenext_time">
                    {{ item.times[0].start_at | formatDate }}
                  </p>
                  <div
                    class="card-img course_next_img"
                    :style="{ backgroundImage: `url(${item.img})` }"
                  ></div>
                  <div class="card-foot course_next_body">
                    <h5 class="card-foot-title course_next_title">
                      {{ item.name }}
                    </h5>
                    <p class="card-foot-text course_next_teacher_name">
                      <small>{{ dealTeacherName(item.teacher) }}</small>
                    </p>
                  </div>
                </div>
              </div>

              <!-- 沒有資料的時候 -->
              <AppNoClasses
                v-if="viewData.length === 0"
                :no-classes-text="noClassesText"
              >
                <template v-if="category === 'live'" slot="btns">
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
            </div>
          </div>

          <!-- 四種狀況的頁碼 -->
          <ThePagination
            v-if="viewData.length !== 0"
            :page-obj="paginationObj"
            @fetchSpecificCoursePage="paginationEvent"
          />
        </section>
      </main>
    </div>

    <!-- 提示燈箱 -->
    <AppAlert
      v-model="alert.openOrNot"
      :title="alert.title"
      :class="`index_alert ${alert.classname}`"
    >
      <template slot="content"></template>
    </AppAlert>
  </div>
</template>

<script>
// Resource
import { axiosSuccessHint } from '@/plugins/utility.js';
import {
  fetchPublicCoursesPath,
  fetchLiveCoursePath,
  fetchOneToOneCoursePath,
  fetchTeacherCoursePath,
} from '@/store/ajax-path.js';
import { isEmptyObject } from '@/plugins/checker.js';
import commonMixinObj from '@/mixins/common.js';
import paginationMixinObj from '@/mixins/pagination.js';
import categoryMixinObj from '@/mixins/category.js';

// Component
import AppAlert from '@/components/AppAlert.vue';
import AppNoClasses from '@/components/AppNoClasses.vue';
import ThePagination from '@/components/ThePagination.vue';

export default {
  name: 'AppCourse',
  components: {
    AppAlert,
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
      // 分類( 'live' => 直撥課程 ｜ 'onetoone' => 一對一課程 | 'teacher' => 老師主講課程 ｜ 'assistant' => 老師作為助教的課程 )
      category: '',
      alert: {
        openOrNot: false,
        title: '',
        classname: 'course_alert',
      },
      courseData: {
        student: {
          live: {
            id: '1',
            // 直撥課程的頁碼
            livePageObj: {
              pageOrderArr: [],
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
            // 兩個混合的陣列課程(公益課程在前面)
            courses: [],
            liveCourses: [],
            publicCourses: [],
          },
          onetoone: {
            id: '2',
            // 一對一課程的頁碼
            onetoonePageObj: {
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
            courses: [],
          },
        },
        teacher: {
          teacher: {
            id: '3',
            api: '/api/common/lessons/recent',
            // 一般課程的頁碼
            teacherPageObj: {
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
            courses: [],
          },
          assistant: {
            id: '4',
            api: '/api/common/lessons/recent?assistant=true&',
            // 一般課程的頁碼
            assistantPageObj: {
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
            courses: [],
          },
        },
      },
      // 卡片被點擊的時候，該卡片相關的資料物件
      cardBeClickedItem: {},
    };
  },
  computed: {
    /**
     * @author odin
     * @description 判斷是否為超級學生
     * @return {boolean}
     */
    isSuperStudent() {
      return this.loginType === 'student' &&
        this.$store.state.user.detail.is_test === true
        ? true
        : false;
    },

    /**
     * @author odin
     * @description 判斷沒有內容的時候要顯示的文字
     * @return {boolean}
     */
    noClassesText() {
      let str = '';
      switch (this.category) {
        case 'live':
          str = 'nextcourse.no_live';
          break;
        case 'onetoone':
          str = 'nextcourse.no_onetoone';
          break;
        case 'teacher':
          str = 'nextcourse.no_teacher_courses';
          break;
        case 'assistant':
          str = 'nextcourse.no_assistant_courses';
          break;
      }

      return str;
    },

    /**
     * @author odin
     * @description
     * @return {array}
     */
    viewData() {
      return this.courseData[this.loginType][this.category]['courses'];
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
          returnPaginationObj = this.courseData.student.live.livePageObj.props;
          break;
        case 'onetoone':
          returnPaginationObj = this.courseData.student.onetoone.onetoonePageObj
            .props;
          break;
        case 'teacher':
          returnPaginationObj = this.courseData.teacher.teacher.teacherPageObj
            .props;
          break;
        case 'assistant':
          returnPaginationObj = this.courseData.teacher.assistant
            .assistantPageObj.props;
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
          eventName = this.goSpecifiLivePage;
          break;
        case 'onetoone':
          eventName = this.goSpecificOneToOnePage;
          break;
        case 'teacher':
          eventName = this.fetchTeacherCourse;
          break;
        case 'assistant':
          eventName = this.fetchAssistantCourse;
          break;
      }

      return eventName;
    },
  },
  created() {
    // 初始值設定
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 初始化的內容
     */
    init() {
      // 判斷分類
      this.judgeCategory();

      if (this.loginType === 'student') {
        // 是否為學生
        // 抓取 一般/公益 課程清單
        this.fetchLiveAndPublicCourse();
        this.fetchOneToOneCourse();
      } else if (this.loginType === 'teacher') {
        // 是否為老師
        this.fetchTeacherCourse();
        this.fetchAssistantCourse();
      }
    },

    /**
     * @author odin
     * @description 判斷當前的 category 是哪一種
     */
    judgeCategory() {
      if (this.loginType === 'student') {
        this.category = 'live';
      } else if (this.loginType === 'teacher') {
        this.category = 'teacher';
      }
    },

    /**
     * @author odin
     * @param {object} item 該單一卡片相關的資料
     * @description 判斷當前的 category 是哪一種
     */
    judgeCardBeClicked(item) {
      let isLessonTimeStart = false;
      // 先預設 isTest = false，如果是學生 is_test 又是 true 才讓他為 true，會影響要打什麼API path
      let isTest = this.isTest;

      // 先存放資料
      this.cardBeClickedItem = item;

      console.log('cardBeClickedItem', this.cardBeClickedItem);

      // 判斷是要做哪一件事
      if (this.loginType === 'student') {
        console.log('Student Card is clicked');
      } else if (this.loginType === 'teacher') {
        console.log('Teacher Card is clicked');
      }

      // 確認課程是否開始
      isLessonTimeStart = this.isTimeStart();

      if (isLessonTimeStart) {
        // 當課程已經開始就去取得他的 RTC Token
        this.prepareToFetchRTCToken(isTest);
      }

      console.log('isLessonTimeStart', isLessonTimeStart);
    },

    /**
     * @author odin
     * @description 判斷當前的 category 是哪一種
     * @return {boolean} 課程是否開始
     */
    isTimeStart() {
      let result = false;
      const lessonStartTimeStamp = this.getTimeStamp(
        this.cardBeClickedItem.times[0].start_at,
      );
      const nowTimeStamp = new Date().getTime();

      if (nowTimeStamp > lessonStartTimeStamp) {
        // 課程開始了
        console.log('課程開始了');
        result = true;
      } else {
        // 課程尚未開始
        console.log('課程尚未開始');
        this.$bus.$emit('notify:message', 'nextcourse.course_start_not_yet');
        result = false;
      }

      return result;
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 一般課程 回傳回來的資料
     */
    // handleNormalCoursesData(res) {
    //   const data = res.data.data;
    //   const meta = res.data.meta;
    //   const links = res.data.links;

    //   // 放入課程內容
    //   this.courseData.student.course.courses = data;

    //   // 處理頁碼
    //   this.vMixhandlePaginationData(
    //     this.courseData.student.course.coursePageObj,
    //     links,
    //     meta,
    //   );

    //   // 回到最上方
    //   this.backToTop();
    // },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 公益課程 回傳回來的資料
     */
    // handlePublicCoursesData(res) {
    //   const data = res.data.data;
    //   const meta = res.data.meta;
    //   const links = res.data.links;

    //   // 放入課程內容
    //   this.courseData.student.public.courses = data;

    //   // 處理頁碼
    //   this.vMixhandlePaginationData(
    //     this.courseData.student.public.publicPageObj,
    //     links,
    //     meta,
    //   );

    //   // 回到最上方
    //   this.backToTop();
    // },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 一對一課程 回傳回來的資料
     */
    handleOneToOneCoursesData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courseData.student.onetoone.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseData.student.onetoone.onetoonePageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 該老師的主講課程 回傳回來的資料
     */
    handleFetchTeacherCourseData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courseData.teacher.teacher.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseData.teacher.teacher.teacherPageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 該老師的主講課程 回傳回來的資料
     */
    handleFetchAssistantCourseData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courseData.teacher.assistant.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseData.teacher.assistant.assistantPageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} liveCourseRes axios 回傳的成功 response (直播課程)
     * @param {object} publicCourseRes axios 回傳的成功 response (公益課程)
     * @description 處理 該老師的主講課程 回傳回來的資料
     */
    handleLiveAndPublicCourseData(liveCourseRes, publicCourseRes) {
      const livesCoursesArr = liveCourseRes.data.data;
      const publicCourseArr = publicCourseRes.data.data;
      const livesMixArr = [...publicCourseArr, ...livesCoursesArr];
      const pageOrderArr = this.sliceArrayForPagination(livesMixArr);

      this.courseData.student.live.courses = livesMixArr;
      this.courseData.student.live.liveCourses = livesCoursesArr;
      this.courseData.student.live.publicCourses = publicCourseArr;
      this.courseData.student.live.livePageObj.pageOrderArr = pageOrderArr;

      // 處理 Lives Pagination 的問題
      this.handleMixArrayPagination(livesMixArr);
    },

    /**
     * @author odin
     * @param {array} mixArr 組合好的 Array
     * @description 處理 組合的陣列 要以 Pagination 的方式呈現的 Pagination Array 以及把資料放進對應的 PageObj 中
     */
    handleMixArrayPagination(mixArr) {
      const pageOrderArr = this.sliceArrayForPagination(mixArr);
      const totalPages = pageOrderArr.length;
      const totalItems = mixArr.length;

      // 放置分頁好的陣列
      this.courseData.student.live.livePageObj.pageOrderArr = pageOrderArr;
      // 放入第一頁分頁的內容
      this.courseData.student.live.courses = isEmptyObject(pageOrderArr)
        ? []
        : pageOrderArr[0];

      // 放置頁碼相關資料
      this.courseData.student.live.livePageObj.props.current = 1;
      this.courseData.student.live.livePageObj.props.prev = 1;
      this.courseData.student.live.livePageObj.props.next = 2;
      this.courseData.student.live.livePageObj.props.total = totalItems;
      this.courseData.student.live.courses.props.totalPages = totalPages;
    },

    /**
     * @author odin
     * @param {array} arr 要被分割的陣列
     * @param {number} sepNumber 用多少
     * @description 處理 該老師的主講課程 回傳回來的資料
     */
    sliceArrayForPagination(arr, sepNumber = 10) {
      const sliceNumber = Math.ceil(arr.length / sepNumber);
      let paginationArray = [];
      for (let i = 0; i < sliceNumber; i++) {
        paginationArray.push(arr.slice(i * sepNumber, (i + 1) * sepNumber));
      }

      return paginationArray;
    },

    /**
     * @author odin
     * @param {number} page 到哪一頁
     * @description 處理 直播課程 換頁
     */
    goSpecifiLivePage(page = 1) {
      const pageOrderArr = this.courseData.student.live.livePageObj
        .pageOrderArr;
      const totalPages = this.courseData.student.live.livePageObj.props
        .totalPages;

      // 改變要顯示的資料
      this.courseData.student.live.courses = pageOrderArr[page];

      // 放置頁碼相關資料
      this.courseData.student.live.livePageObj.props.current = page;
      this.courseData.student.live.livePageObj.props.prev =
        page === 1 ? 1 : page - 1;
      this.courseData.student.live.livePageObj.props.next =
        page === totalPages ? totalPages : page + 1;
    },

    /**
     * @author odin
     * @param {number} page 到哪一頁
     * @description 處理 一對一課程 換頁
     */
    goSpecificOneToOnePage(page = 1) {
      const pageOrderArr = this.courseData.student.onetoone.onetoonePageObj
        .pageOrderArr;
      const totalPages = this.courseData.student.onetoone.onetoonePageObj.props
        .totalPages;

      // 改變要顯示的資料
      this.courseData.student.live.courses = pageOrderArr[page];

      // 放置頁碼相關資料
      this.courseData.student.onetoone.onetoonePageObj.props.current = page;
      this.courseData.student.onetoone.onetoonePageObj.props.prev =
        page === 1 ? 1 : page - 1;
      this.courseData.student.onetoone.onetoonePageObj.props.next =
        page === totalPages ? totalPages : page + 1;
    },

    /**
     * @author odin
     * @description 取得 公益課程 的課程資料
     */
    fetchLiveCourse() {
      return this.axios({
        url: fetchLiveCoursePath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得 公益課程 的課程資料
     */
    fetchPublicCourse() {
      return this.axios({
        url: `${fetchPublicCoursesPath}`,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得 直撥課程 以及 公益課程 的資料
     */
    async fetchLiveAndPublicCourse() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const liveCourseRes = await this.fetchLiveCourse();
        const publicCourseRes = await this.fetchPublicCourse();

        // 成功提示
        axiosSuccessHint('fetchLiveCourse', liveCourseRes);
        axiosSuccessHint('fetchPublicCourse', publicCourseRes);

        if (liveCourseRes !== undefined && publicCourseRes !== undefined) {
          // 資料處理(順序一定要這樣)
          this.handleLiveAndPublicCourseData(liveCourseRes, publicCourseRes);
        }
      } catch (err) {
        console.log('fetchLiveAndPublicCourse err', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 取得 一對一課程 的資料
     */
    async fetchOneToOneCourse(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchOneToOneCoursePath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchOneToOneCourse', res);

          // 資料處理
          this.handleOneToOneCoursesData(res);
        }
      } catch (err) {
        console.log('fetchOneToOneCourse', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {boolean} isTest -- 是否為學生的測試帳號 根據此會有不同的 apiPath
     * @description 透過 dispatch 的方式去取得 RTC Token 的資料
     */
    prepareToFetchRTCToken(isTest) {
      const lessonid = this.cardBeClickedItem.id;
      const courseIsLive = this.cardBeClickedItem.is_live;
      const timeid = this.cardBeClickedItem.times[0].id;

      // 放置資料到對應的 state 中
      this.$store.dispatch('updateLiveCourseData', {
        lessonid,
        courseIsLive,
        timeid,
      });

      // 取得RTC token 並且放置到 state 中
      this.$store
        .dispatch('fetchRTCToken', isTest)
        .then(() => {
          console.log('成功取得token');

          // 成功的話就導頁
          // 轉跳到 live 頁面
          this.$router.push({
            name: 'live',
            params: { lang: this.$route.params.lang },
          });
        })
        .catch(err => {
          console.log('取得token 失敗');

          // 清除該直播課程的相關資料
          this.$store.dispatch('clearLiveCourseData');
          this.$store.dispatch('clearRTCTokenData');

          // 有錯誤訊息的話就顯示
          if (err.message) {
            this.$bus.$emit('notify:message', err.message);
          }
        });
    },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得 一般課程 的資料
     */
    // async fetchNormalCourses(page = 1) {
    //   // 開啟 loading
    //   this.$bus.$emit('loading:on');

    //   console.log('fetchNormalCourses page', page);
    //   try {
    //     const res = await this.axios({
    //       url: `${fetchNormalCoursesPath}?page=${page}`,
    //       method: 'get',
    //       headers: {
    //         Authorization: this.loginToken,
    //       },
    //     });

    //     if (res.data.data || res.data.status) {
    //       axiosSuccessHint('fetchNormalCourses', res);

    //       // 資料處理
    //       this.handleNormalCoursesData(res);
    //     }
    //   } catch (err) {
    //     console.log('fetchNormalCourses', err);
    //   }

    //   // 關閉 loading
    //   this.$bus.$emit('loading:off');
    // },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得 公益課程 的資料
     */
    // async fetchPublicCourses(page = 1) {
    //   // 開啟 loading
    //   this.$bus.$emit('loading:on');

    //   console.log('fetchPublicCourses page', page);
    //   try {
    //     const res = await this.axios({
    //       url: `${fetchPublicCoursesPath}?page=${page}`,
    //       method: 'get',
    //       headers: {
    //         Authorization: this.loginToken,
    //       },
    //     });

    //     if (res.data.data || res.data.status) {
    //       axiosSuccessHint('fetchPublicCourses', res);

    //       // 資料處理
    //       this.handlePublicCoursesData(res);
    //     }
    //   } catch (err) {
    //     console.log('fetchPublicCourses', err);
    //   }

    //   // 關閉 loading
    //   this.$bus.$emit('loading:off');
    // },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得老師這位老師的主講課程
     */
    async fetchTeacherCourse(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchTeacherCourse page', page);
      try {
        const res = await this.axios({
          url: `${fetchTeacherCoursePath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchTeacherCourse', res);

          // 資料處理
          this.handleFetchTeacherCourseData(res);
        }
      } catch (err) {
        console.log('fetchTeacherCourse', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 取得老師這位老師的主講課程
     */
    async fetchAssistantCourse(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchAssistantCourse page', page);
      try {
        const res = await this.axios({
          url: `${fetchTeacherCoursePath}?assistant=true&page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchAssistantCourse', res);

          // 資料處理
          this.handleFetchAssistantCourseData(res);
        }
      } catch (err) {
        console.log('fetchAssistantCourse', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log('AppLive => to, from, next', to, from, next);

    if (from.name === 'live') {
      window.location.reload();
    }

    next();
  },
};
</script>
