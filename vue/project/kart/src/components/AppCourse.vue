<template>
  <div>
    <div class="root course_root course_container_body" :class="rootClassObj">
      <main class="main-10 course_main">
        <section class="course_title">
          <img
            src="../assets/img/course/icon_list@2x.png"
            class="course_title_img"
          />
          <p class="title_text">
            <span class="title_name">{{ loginUserName }}</span>
            <span class="title_welcome">{{ $t('welcome') }}</span>
          </p>
        </section>

        <section class="course_group">
          <!-- 學生的切換列表 -->
          <div v-if="loginType === 'student'" class="tabs_list">
            <button
              class="course_tab"
              :class="{ active: category === 'course' }"
              @click.prevent="changeCategory('course')"
            >
              {{ $t('mycourse.course') }}
            </button>

            <button
              class="course_tab"
              :class="{ active: category === 'public' }"
              @click.prevent="changeCategory('public')"
            >
              {{ $t('mycourse.public') }}
            </button>
          </div>

          <!-- 老師的切換列表 -->
          <div v-if="loginType === 'teacher'" class="tabs_list">
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

          <div class="course_content">
            <div class="course_content_box course_box">
              <div
                v-for="item in courseData[loginType][category].courses"
                :key="item.id"
                class="course_next_container"
              >
                <div class="course_next">
                  <p class="coursenext_time">
                    {{ item.times[0].start_at | formatDate }}
                  </p>
                  <div
                    class="course_next_img"
                    :style="{ backgroundImage: `url(${item.img})` }"
                  ></div>
                  <div class="course_next_body">
                    <h5 class="course_next_title">{{ item.name }}</h5>
                    <p class="course_next_teacher_name">
                      <small>{{ judgeTeacherName(item.teacher) }}</small>
                    </p>
                  </div>
                </div>
              </div>
              <AppCourseWithoutCourse
                v-if="courseData[loginType][category].courses.length === 0"
              />
            </div>
          </div>

          <!-- 四種狀況的頁碼 -->
          <ThePagination
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
  fetchNormalCoursesPath,
  fetchPublicCoursesPath,
  fetchTeacherCoursePath,
} from '@/store/ajax-path.js';
// import { checkIsLogin } from '@/plugins/checker.js';
import commonMixinObj from '@/mixins/common.js';
import paginationMixinObj from '@/mixins/pagination.js';
import categoryMixinObj from '@/mixins/category.js';

// Component
import AppAlert from '@/components/AppAlert.vue';
import AppCourseWithoutCourse from '@/components/AppCourseWithoutCourse.vue';
import ThePagination from '@/components/ThePagination.vue';

export default {
  name: 'AppCourse',
  components: {
    AppAlert,
    AppCourseWithoutCourse,
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
      // 分類( 'course' => 一般課程 ｜ 'public' => 公益課程 | 'teacher' => 老師主講課程 ｜ 'assistant' => 老師作為助教的課程 )
      category: '',
      alert: {
        openOrNot: false,
        title: '',
        classname: 'course_alert',
      },
      courseData: {
        student: {
          course: {
            id: '1',
            api: '/api/test/lessons/recent',
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
            courses: [],
          },
          public: {
            id: '2',
            api: '/api/students/current/publics',
            // 一般課程的頁碼
            publicPageObj: {
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
    };
  },
  computed: {
    /**
     * @author odin
     * @description 判斷是否為超級學生
     */
    isSuperStudent() {
      return this.loginType === 'student' &&
        this.$store.state.user.detail.is_test === true
        ? true
        : false;
    },
    /**
     * @author odin
     * @description 判斷要用哪個 paginationbObj
     */
    paginationObj() {
      let returnPaginationObj = {};
      switch (this.category) {
        case 'course':
          returnPaginationObj = this.courseData.student.course.coursePageObj
            .props;
          break;
        case 'public':
          returnPaginationObj = this.courseData.student.public.publicPageObj
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
     * @description 判斷要用哪個 paginationb 的 事件
     */
    paginationEvent() {
      let eventName = {};
      switch (this.category) {
        case 'course':
          eventName = this.fetchNormalCourses;
          break;
        case 'public':
          eventName = this.fetchPublicCourses;
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
     * @description 開啟燈箱
     */
    showAlert() {
      this.alert.openOrNot = true;
    },

    /**
     * @author odin
     * @description 初始化的內容
     */
    init() {
      // 判斷分類
      this.judgeCategory();

      // 是否為超級學生
      if (this.isSuperStudent) {
        // 抓取 一般/公益 課程清單
        this.fetchNormalCourses();
        this.fetchPublicCourses();
      }

      // 是否為老師
      if (this.loginType === 'teacher') {
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
        this.category = 'course';
      } else if (this.loginType === 'teacher') {
        this.category = 'teacher';
      }
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
     * @description 處理 一般課程 回傳回來的資料
     */
    handleNormalCoursesData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courseData.student.course.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseData.student.course.coursePageObj,
        links,
        meta,
      );

      // 回到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的成功 response
     * @description 處理 公益課程 回傳回來的資料
     */
    handlePublicCoursesData(res) {
      const data = res.data.data;
      const meta = res.data.meta;
      const links = res.data.links;

      // 放入課程內容
      this.courseData.student.public.courses = data;

      // 處理頁碼
      this.vMixhandlePaginationData(
        this.courseData.student.public.publicPageObj,
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
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 判斷當前語系選擇要輸出哪一個老師的名稱
     */
    async fetchNormalCourses(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchNormalCourses page', page);
      try {
        const res = await this.axios({
          url: `${fetchNormalCoursesPath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchNormalCourses', res);

          // 資料處理
          this.handleNormalCoursesData(res);
        }
      } catch (err) {
        console.log('fetchNormalCourses', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {number} page 要取得第幾頁，沒填的話預設是第一頁
     * @description 判斷當前語系選擇要輸出哪一個老師的名稱
     */
    async fetchPublicCourses(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchPublicCourses page', page);
      try {
        const res = await this.axios({
          url: `${fetchPublicCoursesPath}?page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchPublicCourses', res);

          // 資料處理
          this.handlePublicCoursesData(res);
        }
      } catch (err) {
        console.log('fetchPublicCourses', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

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
};
</script>
