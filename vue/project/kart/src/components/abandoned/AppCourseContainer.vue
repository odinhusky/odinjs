<template>
  <div class="course_container_body">
    <main class="main-10 course_main">
      <section class="course_title">
        <img
          src="@/assets/img/course/icon_list@2x.png"
          class="course_title_img"
        />
        <p class="title_text">
          <span class="title_name">{{ loginDetail.name }}</span>
          <span class="title_welcome">{{ $t('welcome') }}</span>
        </p>
      </section>

      <section class="course_group">
        <div class="tabs_list">
          <button
            :class="{ course_tab: true, active: category === 'course' }"
            @click.prevent="category = 'course'"
          >
            {{ $t('mycourse.course') }}
          </button>

          <button
            :class="{ course_tab: true, active: category === 'public' }"
            @click.prevent="category = 'public'"
          >
            {{ $t('mycourse.public') }}
          </button>
        </div>

        <div class="course_content">
          <div class="course_content_box course_box">
            <div
              v-for="item in courseData[loginDetail.loginType][category]
                .courses"
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
            <WithoutCourse
              v-if="
                courseData[loginDetail.loginType][category].courses.length === 0
              "
            />
          </div>
        </div>
      </section>
    </main>
    <!-- 提示燈箱 -->
    <AppAlert
      :open-or-not="alert.openOrNot"
      :title="alert.title"
      class="index_alert"
      @closeAlert="closeAlert"
    >
      <template slot="content"></template>
    </AppAlert>
  </div>
</template>

<script>
import { getLoginToken, getLoginUserData } from '@/plugins/utility.js';
import { checkIsLogin } from '@/plugins/checker.js';

import AppAlert from '@/components/AppAlert.vue';
import WithoutCourse from '@/components/WithoutCourse.vue';

export default {
  name: 'CourseContainer',
  components: {
    AppAlert,
    WithoutCourse,
  },
  props: {
    i18nLanguage: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // category: course => 一般課程
      // category: public => 公益課程
      category: 'course',
      loginOrNot: false,
      loginDetail: {
        name: '',
        token: '',
        loginType: 'student',
      },
      alert: {
        openOrNot: false,
        title: '',
        classname: 'course_container_alert',
      },
      courseData: {
        student: {
          course: {
            id: '1',
            api: '/api/test/lessons/recent',
            tabBtns: {
              tabBtnText: this.$t('mycourse.course'),
              classname: '',
            },
            courses: [
              {
                id: 36,
                name: '\u958b\u767c\u6e2c\u8a66\u4e00\u5c0d\u4e00',
                is_live: false,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/33656d/33656d5d58cef5c6c7c2da054ec78402.png',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 1,
                times: [
                  {
                    id: 73,
                    lesson_id: 36,
                    start_at: '2020-07-24T08:00:00+00:00',
                    start_timestamp: 1595577600,
                    end_at: '2020-11-29T16:07:00+00:00',
                    end_timestamp: 1606666020,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson36',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 60,
                name: '\u6885\u7235\u6578\u4f4dDemo',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/737a11/737a117946b2d7110bed12df913fd1a0.png',
                teacher: {
                  id: 26,
                  email: 'mejordemo@mejor.com.tw',
                  cellphone: '+8860987655555',
                  cellphone_info: {
                    country_code: '+886',
                    phone_number: '0987655555',
                  },
                  name: '\u6885\u7235\u6578\u4f4dDemo\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u6570\u4f4dDemo\u8001\u5e08',
                  name_en: 'Mejor Demo Teacher',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '\u4ecb\u7d39',
                class_num: 5,
                times: [
                  {
                    id: 200,
                    lesson_id: 60,
                    start_at: '2020-08-03T06:00:00+00:00',
                    start_timestamp: 1596434400,
                    end_at: '2020-12-30T16:00:00+00:00',
                    end_timestamp: 1609344000,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson60',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 38,
                name: '\u9ede\u8a55\u8ab2\u7a0b',
                is_live: false,
                is_public: false,
                is_reviewable: true,
                img: 'https://stage.course.mejor-test.com.tw',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 4,
                times: [
                  {
                    id: 150,
                    lesson_id: 38,
                    start_at: '2020-08-23T16:00:00+00:00',
                    start_timestamp: 1598198400,
                    end_at: '2020-08-23T21:00:00+00:00',
                    end_timestamp: 1598216400,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson38',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 50,
                name: '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/7b34e9/7b34e91405d4d662b45b745b901d5e88.jpg',
                teacher: {
                  id: 14,
                  email: 'weidanwen100@163.com',
                  cellphone: '8860912345675',
                  cellphone_info: {
                    country_code: '886',
                    phone_number: '0912345675',
                  },
                  name: '\u7c21\u97cb\u4e39\u6587 \u6559\u6388',
                  name_hant: '\u97cb\u4e39\u6587 \u6559\u6388',
                  name_en: 'Prof. Dan Wen Wei',
                  img:
                    'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/9ceb38/9ceb3873aac48feb0324688409ccf565.png',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction:
                  '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d',
                class_num: 7,
                times: [
                  {
                    id: 209,
                    lesson_id: 50,
                    start_at: '2020-08-25T16:00:00+00:00',
                    start_timestamp: 1598371200,
                    end_at: '2020-08-26T16:00:00+00:00',
                    end_timestamp: 1598457600,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                  {
                    id: 208,
                    lesson_id: 50,
                    start_at: '2020-09-06T18:00:00+00:00',
                    start_timestamp: 1599415200,
                    end_at: '2020-09-06T23:00:00+00:00',
                    end_timestamp: 1599433200,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson50',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
            ],
          },
          public: {
            id: '2',
            api: '/api/students/current/publics',
            tabBtns: {
              tabBtnText: this.$t('mycourse.public'),
              classname: '',
            },
            courses: [
              {
                id: 36,
                name: '\u958b\u767c\u6e2c\u8a66\u4e00\u5c0d\u4e00',
                is_live: false,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/33656d/33656d5d58cef5c6c7c2da054ec78402.png',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 1,
                times: [
                  {
                    id: 73,
                    lesson_id: 36,
                    start_at: '2020-07-24T08:00:00+00:00',
                    start_timestamp: 1595577600,
                    end_at: '2020-11-29T16:07:00+00:00',
                    end_timestamp: 1606666020,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson36',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 60,
                name: '\u6885\u7235\u6578\u4f4dDemo',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/737a11/737a117946b2d7110bed12df913fd1a0.png',
                teacher: {
                  id: 26,
                  email: 'mejordemo@mejor.com.tw',
                  cellphone: '+8860987655555',
                  cellphone_info: {
                    country_code: '+886',
                    phone_number: '0987655555',
                  },
                  name: '\u6885\u7235\u6578\u4f4dDemo\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u6570\u4f4dDemo\u8001\u5e08',
                  name_en: 'Mejor Demo Teacher',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '\u4ecb\u7d39',
                class_num: 5,
                times: [
                  {
                    id: 200,
                    lesson_id: 60,
                    start_at: '2020-08-03T06:00:00+00:00',
                    start_timestamp: 1596434400,
                    end_at: '2020-12-30T16:00:00+00:00',
                    end_timestamp: 1609344000,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson60',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 38,
                name: '\u9ede\u8a55\u8ab2\u7a0b',
                is_live: false,
                is_public: false,
                is_reviewable: true,
                img: 'https://stage.course.mejor-test.com.tw',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 4,
                times: [
                  {
                    id: 150,
                    lesson_id: 38,
                    start_at: '2020-08-23T16:00:00+00:00',
                    start_timestamp: 1598198400,
                    end_at: '2020-08-23T21:00:00+00:00',
                    end_timestamp: 1598216400,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson38',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 50,
                name: '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/7b34e9/7b34e91405d4d662b45b745b901d5e88.jpg',
                teacher: {
                  id: 14,
                  email: 'weidanwen100@163.com',
                  cellphone: '8860912345675',
                  cellphone_info: {
                    country_code: '886',
                    phone_number: '0912345675',
                  },
                  name: '\u7c21\u97cb\u4e39\u6587 \u6559\u6388',
                  name_hant: '\u97cb\u4e39\u6587 \u6559\u6388',
                  name_en: 'Prof. Dan Wen Wei',
                  img:
                    'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/9ceb38/9ceb3873aac48feb0324688409ccf565.png',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction:
                  '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d',
                class_num: 7,
                times: [
                  {
                    id: 209,
                    lesson_id: 50,
                    start_at: '2020-08-25T16:00:00+00:00',
                    start_timestamp: 1598371200,
                    end_at: '2020-08-26T16:00:00+00:00',
                    end_timestamp: 1598457600,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                  {
                    id: 208,
                    lesson_id: 50,
                    start_at: '2020-09-06T18:00:00+00:00',
                    start_timestamp: 1599415200,
                    end_at: '2020-09-06T23:00:00+00:00',
                    end_timestamp: 1599433200,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson50',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 36,
                name: '\u958b\u767c\u6e2c\u8a66\u4e00\u5c0d\u4e00',
                is_live: false,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/33656d/33656d5d58cef5c6c7c2da054ec78402.png',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 1,
                times: [
                  {
                    id: 73,
                    lesson_id: 36,
                    start_at: '2020-07-24T08:00:00+00:00',
                    start_timestamp: 1595577600,
                    end_at: '2020-11-29T16:07:00+00:00',
                    end_timestamp: 1606666020,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson36',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 60,
                name: '\u6885\u7235\u6578\u4f4dDemo',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/737a11/737a117946b2d7110bed12df913fd1a0.png',
                teacher: {
                  id: 26,
                  email: 'mejordemo@mejor.com.tw',
                  cellphone: '+8860987655555',
                  cellphone_info: {
                    country_code: '+886',
                    phone_number: '0987655555',
                  },
                  name: '\u6885\u7235\u6578\u4f4dDemo\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u6570\u4f4dDemo\u8001\u5e08',
                  name_en: 'Mejor Demo Teacher',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '\u4ecb\u7d39',
                class_num: 5,
                times: [
                  {
                    id: 200,
                    lesson_id: 60,
                    start_at: '2020-08-03T06:00:00+00:00',
                    start_timestamp: 1596434400,
                    end_at: '2020-12-30T16:00:00+00:00',
                    end_timestamp: 1609344000,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson60',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 38,
                name: '\u9ede\u8a55\u8ab2\u7a0b',
                is_live: false,
                is_public: false,
                is_reviewable: true,
                img: 'https://stage.course.mejor-test.com.tw',
                teacher: {
                  id: 15,
                  email: 'teachermejor@gmail.com',
                  cellphone: '',
                  cellphone_info: { country_code: '', phone_number: '' },
                  name: '\u7c21\u6885\u7235\u8001\u5e2b',
                  name_hant: '\u6885\u7235\u8001\u5e2b',
                  name_en: 'teachermejor',
                  img: '',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction: '',
                class_num: 4,
                times: [
                  {
                    id: 150,
                    lesson_id: 38,
                    start_at: '2020-08-23T16:00:00+00:00',
                    start_timestamp: 1598198400,
                    end_at: '2020-08-23T21:00:00+00:00',
                    end_timestamp: 1598216400,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson38',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
              {
                id: 50,
                name: '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)',
                is_live: true,
                is_public: false,
                is_reviewable: false,
                img:
                  'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/7b34e9/7b34e91405d4d662b45b745b901d5e88.jpg',
                teacher: {
                  id: 14,
                  email: 'weidanwen100@163.com',
                  cellphone: '8860912345675',
                  cellphone_info: {
                    country_code: '886',
                    phone_number: '0912345675',
                  },
                  name: '\u7c21\u97cb\u4e39\u6587 \u6559\u6388',
                  name_hant: '\u97cb\u4e39\u6587 \u6559\u6388',
                  name_en: 'Prof. Dan Wen Wei',
                  img:
                    'https://mejor-course-agora-stage.oss-us-west-1.aliyuncs.com/uploads/images/9ceb38/9ceb3873aac48feb0324688409ccf565.png',
                  note: '',
                  ip_address: '',
                  is_default_password: false,
                },
                introduction:
                  '\u97cb\u6559\u6388\u5957\u88dd\u8ab2\u7a0b(\u7e41)\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d\r\n\u856d\u90a6/f\u5c0f\u8abf\u5e7b\u60f3\u66f2 \u4f5c\u54c1\u56db\u5341\u4e5d',
                class_num: 7,
                times: [
                  {
                    id: 209,
                    lesson_id: 50,
                    start_at: '2020-08-25T16:00:00+00:00',
                    start_timestamp: 1598371200,
                    end_at: '2020-08-26T16:00:00+00:00',
                    end_timestamp: 1598457600,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                  {
                    id: 208,
                    lesson_id: 50,
                    start_at: '2020-09-06T18:00:00+00:00',
                    start_timestamp: 1599415200,
                    end_at: '2020-09-06T23:00:00+00:00',
                    end_timestamp: 1599433200,
                    is_end: false,
                    is_missed: false,
                    show_num: 0,
                    review: {},
                    review_url: '',
                    review_limit_minutes: 0,
                    stream_url: '',
                  },
                ],
                channel: 'lesson50',
                event: 'ChatBroadcast',
                join_event: 'JoinBroadcast',
              },
            ],
          },
        },
        teacher: {},
      },
    };
  },
  computed: {
    dealCourseName() {
      return [];
    },
  },

  created() {
    const isLogin = checkIsLogin();
    const token = getLoginToken();
    const loginData = getLoginUserData();
    const loginType = loginData.data.login_type;
    const name =
      loginType === 'student'
        ? loginData.data.student.name
        : loginData.data.teacher.name;

    // 寫入
    this.loginDetail.token = token;
    this.loginDetail.name = name;
    this.loginDetail.loginType = loginType;

    // 判斷是否登入
    this.loginOrNot = isLogin;

    // 判斷初始值
    loginType === 'student'
      ? (this.category = 'course')
      : (this.category = 'teacher');
  },
  mounted() {
    // console.log("loginType", this.loginDetail.loginType);
    // console.log("category", this.category);
    // console.log(
    //   "course",
    //   this.courseData[this.loginDetail.loginType][this.category].courses
    // );
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
     * @description 判斷當前語系選擇要輸出哪一個老師的名稱
     */
    judgeTeacherName(teacherObj) {
      let teacherName = '';

      switch (this.i18nLanguage) {
        case 'zh-Hant':
          teacherName = teacherObj.name_hant;
          break;
        case 'zh-Hans':
          teacherName = teacherObj.name;
          break;
        case 'en-US':
          teacherName = teacherObj.name_en;
          break;
      }

      return teacherName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
