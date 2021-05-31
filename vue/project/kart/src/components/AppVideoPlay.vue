<template>
  <div class="root root_course_record">
    <!-- 影片回放區域 -->
    <section class="sec course_record_section" id="course_record_section">
      <div class="videogroup" :class="{ fullscreen: video.isZoom }">
        <!-- 影片播放的地方 -->
        <div class="videogroup__remote">
          <video-player
            v-show="video.isVideoReady"
            class="videogroup__videorecord"
            ref="videoPlayer"
            :options="video.videoOptions"
            @play="onPlayerPlay(player)"
            @pause="onPlayerPause(player)"
            @ended="onPlayerEnded(player)"
            @timeupdate="onPlayerTimeupdate(player)"
            @statechanged="playerStateChanged(player)"
            @ready="playerReadied(player)"
          />
        </div>

        <!-- 影片進度控制bar -->
        <div class="videogroup__player">
          <div
            class="progress videogroup__progressbarcontainer"
            id="videogroup__progressbarcontainer"
            @mousedown="videoMouseDown"
            @mousemove="videoMouseMove"
            @mouseup="videoMouseUp"
          >
            <div
              class="progress-bar videogroup__progressbar"
              role="progressbar"
              style="width: 0"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
              :style="{
                width: video.playerCtrl.times.videoProgressPercent + '%',
              }"
            ></div>
          </div>
          <div class="videogroup__playercontainer1">
            <button
              class="video_control_btn videogroup__playbtn"
              :class="playOrPauseClass"
              @click.prevent="toggleVideoPlayAndPause"
            >
              <img
                class="img-fluid videogroup__playbtnimg play_video_img"
                src="@/assets/img/v2/course_record/btn_play.svg"
              />

              <img
                class="img-fluid videogroup__playbtnimg pause_video_img"
                src="@/assets/img/v2/course_record/btn_stop.svg"
              />
            </button>
            <!-- 開啟聲音 / 靜音 按鈕 -->
            <button
              class="video_control_btn videogroup__volumemutebtn"
              :class="{ muted: video.playerCtrl.muted.mutedOrNot }"
              @click.prevent="toggleMuted"
            >
              <img
                class="img-fluid videogroup__volumemutebtnimg not__muted__img"
                src="@/assets/img/v2/course_record/btn_voice.svg"
              />

              <img
                class="img-fluid videogroup__volumemutebtnimg muted__img"
                src="@/assets/img/v2/course_record/btn_mute.svg"
              />
            </button>
            <!-- 音量拉條 -->
            <div
              class="progress videogroup__volumebar"
              id="videogroup__volumebar"
              @mousedown="volumeMouseDown"
              @mousemove="volumeMouseMove"
              @mouseup="volumeMouseUp"
            >
              <div
                class="progress-bar videogroup__volumebarprogressbar"
                role="progressbar"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{
                  width: video.playerCtrl.volume.nowVolumePercenttage + '%',
                }"
              ></div>
            </div>
            <span class="videogroup__durationtext"
              >{{ videoFormatCurrentTime }} / {{ videoFormatTotalTime }}</span
            >
          </div>
          <div class="videogroup__playercontainer2">
            <button
              class="video_control_btn videogroup__remotefullscreenbtn"
              :class="{ zoom: video.isZoom }"
              @click.prevent="toggleFullScreen"
            >
              <img
                class="img-fluid videogroup__remotefullscreenbtn_img zoom__img"
                src="@/assets/img/v2/course_record/btn_zoom.svg"
              />

              <img
                class="img-fluid videogroup__remotefullscreenbtn_img zoomout__img"
                src="@/assets/img/v2/course_record/btn_zoomout.svg"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 影片課程列表 -->
    <section class="sec course_record_list_section">
      <div class="classgroup__title">
        <p class="classgroup__titletext">課程內容</p>
      </div>
      <div class="classgroup__name">
        <p class="classgroup__namep"></p>
      </div>
      <div class="classgroup__content">
        <ul class="list-group classgroup__listgroup">
          <li
            v-for="videoObj in video.videoList"
            :key="videoObj.id"
            class="list-group-item classgroup__cardbodyitem"
            @click="judgePlayWhichVideo(videoObj)"
          >
            <img
              class="classgroup__cardbodyitemimg img-fluid"
              src="@/assets/img/v2/course_record/icon_playarrow@2x.png"
            />
            <div class="classgroup__cardbodyitemname">
              <!-- 每月精選只顯示課堂名稱跟老師名稱 -->
              <template v-if="video.category === 'monthlyeslite'">
                <span
                  class="break-warp classgroup__main classgroup__cardbodyitemlesson"
                  >{{ videoObj.name }}</span
                >

                <span
                  class="break-warp classgroup__sub classgroup__cardbodyitemteacher"
                  >{{ dealTeacherName(videoObj.teacher) }}</span
                >
              </template>

              <!-- 指定課程(影片回播) 要顯示課程名稱 老師姓名 以及 開始日期 -->
              <template v-if="video.category === 'courserecord'">
                <span
                  class="break-warp classgroup__main classgroup__cardbodyitemlesson"
                  >{{ videoObj.lesson.name }}</span
                >
                <span
                  class="break-warp classgroup__sub classgroup__cardbodyitemteacher"
                  >{{ dealTeacherName(videoObj.lesson.teacher) }}</span
                >
                <span
                  class="break-warp classgroup__sub classgroup__cardbodyitemdate"
                  >{{ videoObj.start_at | formatDate }}</span
                >
              </template>
            </div>
          </li>
          <!-- <li class="list-group-item classgroup__cardbodyitem">
            <img
              class="classgroup__cardbodyitemimg img-fluid"
              src="@/assets/img/v2/course_record/icon_playarrow@2x.png"
            />
            <div class="classgroup__cardbodyitemname">
              <span
                class="break-warp classgroup__main classgroup__cardbodyitemlesson"
                >課程 fffffffffffffffffff lesson</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemteacher"
                >老師 fffffffffffffffffff teacher</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemdate"
                >2020 FEB 02 08:00</span
              >
            </div>
          </li>
          <li class="list-group-item classgroup__cardbodyitem">
            <img
              class="classgroup__cardbodyitemimg img-fluid"
              src="@/assets/img/v2/course_record/icon_playarrow@2x.png"
            />
            <div class="classgroup__cardbodyitemname">
              <span
                class="break-warp classgroup__main classgroup__cardbodyitemlesson"
                >課程 fffffffffffffffffff lesson</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemteacher"
                >老師 fffffffffffffffffff teacher</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemdate"
                >2020 FEB 13 08:00</span
              >
            </div>
          </li> -->
        </ul>
      </div>
    </section>
    <!-- //////////////////////////////////////// 燈箱 //////////////////////////////////////// -->
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

    <!-- 點選課程後，提示還有幾分鐘的燈箱 -->
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
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';
import screenfull from 'screenfull';
import {
  fetchMonthlyEslitePath,
  fetchCourseRecordListPath,
  checkThisCourseExpiredListPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
// require styles
import 'video.js/dist/video-js.css';

// Component
import AppLightBox from '@/components/AppLightBox';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'AppVideoPlay',
  components: {
    AppLightBox,
    videoPlayer,
  },
  props: {
    // aaa: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  mixins: [commonMixinObj],
  data() {
    return {
      // 全螢幕套件要用的data
      fullscreen: false,
      // 回放影片剩餘時間的計算
      reviewcounter: 0,
      intervalArray: [],
      // video 相關的資料
      video: {
        // 目前的分類
        category: '',
        // 目前要播放的影片ID
        Id: '',
        // 取得的影片列表
        videoList: [],
        // 取得回放影片之後的資料
        currentView: {},
        // 要回放的課程id
        requestCourseID: '',
        // 是否為全螢幕模式
        isZoom: false,
        // 影片是否準備好
        isVideoReady: false,
        playerCtrl: {
          // 影片的狀態(play: 一開始播放 | playing: 正在播放 | pause: 暫停了 | end: 影片結束)
          videoStatus: 'play',
          times: {
            currentTime: 0,
            formatCurrentTime: '',
            totalTime: 0,
            formatTotalTime: '',
            videobardrag: false,
            videoProgressPercent: 0,
          },
          volume: {
            volumebardrag: false,
            nowVolume: 0.5,
            nowVolumePercenttage: 50,
          },
          muted: {
            mutedOrNot: false,
            beforeMutedNowVolume: 0,
            beforeMutedNowVolumePercenttage: 0,
          },
        },
        // videojs套件 -- 影片的相關設定
        videoOptions: {
          autoplay: true,
          controls: false,
          muted: false,
          sources: [
            {
              // 要播放的影片src
              src: '',
              type: 'video/mp4',
            },
          ],
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
    };
  },
  created() {
    // 元件初始化
    this.init();
    //
    this.$bus.$emit('notify:off');
  },
  mounted() {
    // 因為按下ESC退出全螢幕時要變換 icon
    this.keyupEscEscapeFullScreenToChangeIcon();
  },
  computed: {
    /**
     * @author odin
     * @description 播放器的實體
     * @return {object}
     */
    player() {
      return this.$refs.videoPlayer.player;
    },

    /**
     * @author odin
     * @description 播放按鈕的class切換
     * @return {object} class 的物件
     */
    playOrPauseClass() {
      return {
        play:
          this.video.playerCtrl.videoStatus === 'pause' ||
          this.video.playerCtrl.videoStatus === 'play' ||
          this.video.playerCtrl.videoStatus === 'end' ||
          this.video.playerCtrl.videoStatus === '',

        pause: this.video.playerCtrl.videoStatus === 'playing',
      };
    },

    /**
     * @author odin
     * @description 播放器上目前的時間顯示
     * @return {string}
     */
    videoFormatCurrentTime() {
      let formatCurrentTime = '';

      if (this.video.playerCtrl.times.formatCurrentTime === '') {
        formatCurrentTime = '0:00';
      } else {
        formatCurrentTime = this.video.playerCtrl.times.formatCurrentTime;
      }

      return formatCurrentTime;
    },

    /**
     * @author odin
     * @description 播放器上影片總長的時間顯示
     * @return {string}
     */
    videoFormatTotalTime() {
      let formatTotalTime = '';

      if (this.video.playerCtrl.times.formatTotalTime === '') {
        formatTotalTime = '0:00';
      } else {
        formatTotalTime = this.video.playerCtrl.times.formatTotalTime;
      }

      return formatTotalTime;
    },
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化需要得到的資料
     */
    init() {
      // 取得傳進來的資料
      this.getVideoCategoryAndID();
      // 抓取特定課程的列表
      this.judgeFetchWhichVideoList();
    },

    /**
     * @author odin
     * @description 取得影片類型以及現在要播放的影片id，沒抓到就導頁回到影片區
     */
    getVideoCategoryAndID() {
      const videoCategory = localStorage.getItem('video_category');
      const videoID = parseInt(localStorage.getItem('video_ID'));

      if (
        videoCategory &&
        videoCategory !== null &&
        videoID &&
        videoID !== null
      ) {
        this.video.category = videoCategory;
        this.video.Id = videoID;
      } else {
        // 導頁
        this.$router.push({
          name: 'videos',
          params: { lang: this.$route.params.lang },
        });
      }
    },

    /**
     * @author odin
     * @description 取得影片類型以及現在要播放的影片id
     */
    judgeFetchWhichVideoList() {
      switch (this.video.category) {
        case 'monthlyeslite':
          this.fetchMonthlyEsliteList();
          break;
        case 'courserecord':
          this.fetchCourseRecordList();
          break;
      }
    },

    /**
     * @author odin
     * @description 偵測是否在 進入/退出 全螢幕的環境的狀況
     */
    keyupEscEscapeFullScreenToChangeIcon() {
      document.addEventListener('fullscreenchange', () => {
        console.log('fullscreenchange');
        // 判斷退出的時候要將isZoom設為false
        this.setZoomFalse();
      });

      document.addEventListener('mozfullscreenchange', () => {
        console.log('mozfullscreenchange');
        // 判斷退出的時候要將isZoom設為false
        this.setZoomFalse();
      });

      document.addEventListener('webkitfullscreenchange', () => {
        console.log('webkitfullscreenchange');
        // 判斷退出的時候要將isZoom設為false
        this.setZoomFalse();
      });

      document.addEventListener('msfullscreenchange', () => {
        console.log('msfullscreenchange');
        // 判斷退出的時候要將isZoom設為false
        this.setZoomFalse();
      });
    },

    /**
     * @author odin
     * @description 是否全螢幕
     */
    checkFull() {
      let isFull = false;

      if (
        (document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled) &&
        window.innerWidth == screen.width &&
        window.innerHeight == screen.height
      ) {
        isFull = true;
      }
      return isFull;
    },

    /**
     * @author odin
     * @description 因為因為按下ESC退出全螢幕時，將 isZoom 改為 false 來變換icon
     */
    setZoomFalse() {
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        console.log('ESC退出全螢幕了!');
        this.video.isZoom = false;
      }
    },

    /**
     * @author odin
     * @description toggle 影片區域全螢幕顯示
     */
    toggleFullScreen() {
      this.video.isZoom = !this.video.isZoom;
      // 使用 screenfull 的套件
      screenfull.toggle(document.getElementById('course_record_section'));
    },

    /**
     * @author odin
     * @description 一進來播放特定的影片
     */
    playInitVideo() {
      console.log('playInitVideo this.video.videoList', this.video.videoList);
      // 根據傳來的影片找出對應的影片物件
      this.findVideoObj();
    },

    /**
     * @author odin
     * @description 根據傳來的影片找出對應的影片物件
     */
    findVideoObj() {
      console.log('this.video.Id', this.video.Id);
      // 判斷要使用哪種方式處理資料
      if (this.video.category === 'monthlyeslite') {
        const thisVideoObj = [...this.video.videoList].find(
          item => item.id === this.video.Id,
        );

        this.video.currentView = thisVideoObj;

        // 準備影片的初始化
        this.prepareInitVideo();
      } else if (this.video.category === 'courserecord') {
        // 取得 指定課程 播放的影片物件
        this.fetchCourseRecordReviewDetail();
      }
    },

    /**
     * @author odin
     * @param {object} videoObj 傳過來影片的物件
     * @description 準備要播放傳過來的影片
     */
    prepareInitVideo(videoObj) {
      if (videoObj) {
        // 如果有傳物件的話, 先儲存到 data
        this.video.Id = videoObj.id;
        this.video.currentView = { ...videoObj };
      } else {
        // 沒有的話代表，是一開始的播放呼叫的，將已經找出特定的 currentView 帶入
        videoObj = { ...this.video.currentView };
      }

      // 影片初始化
      this.initVideo();
    },

    /**
     * @author odin
     * @description 影片初始化 => 課程的影片(根據 id 找出對應的資料並且放入url，播放影片)
     */
    initVideo() {
      // 處理影片的播放
      this.handleVideoSrc();
      // 回卷到最上方
      this.backToTop();

      if (this.video.category === 'courserecord') {
        // 計算剩餘時間
        this.handleRemainingTimeCalculation();
      }
    },

    /**
     * @author odin
     * @param {object} videoObj - 點選列表傳過來的影片物件
     * @description 點選要播放的影片
     */
    judgePlayWhichVideo(videoObj) {
      console.log('videoObj', videoObj);
      if (this.video.category === 'monthlyeslite') {
        // 每月精選(訂閱至才能看到的影片)
        this.video.currentView = videoObj;
        this.initVideo();
      } else if (this.video.category === 'courserecord') {
        // 紀錄 video id
        this.video.Id = videoObj.id;

        // 確認這隻影片是否過期了
        this.checkThisCourseExpired(videoObj.id);
      }
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
     * @description 確認觀看影片並關閉燈箱
     */
    checkPlayVideo() {
      this.video_record_lightbox.openOrNot = false;

      // 開始播放影片
      this.initVideo();
    },

    /**
     * @author odin
     * @description 播放該回播影片
     */
    goToPlayReviewVideo() {
      console.log('goToPlayReviewVideo!!!!!!!!!!!!!!!!!!!!');
      // 關閉燈箱
      this.video_record_lightbox.openOrNot = false;
      this.video_period_lightbox.openOrNot = false;

      // 取得那支影片的 詳細播放內容
      this.fetchCourseRecordReviewDetail();
    },

    /**
     * @author odin
     * @description 處理影片的播放
     */
    handleVideoSrc() {
      this.video.playerCtrl.videoStatus = 'play';

      switch (this.video.category) {
        case 'monthlyeslite':
          this.video.videoOptions.sources[0].src = this.video.currentView.video_url;
          break;
        case 'courserecord':
          this.video.videoOptions.sources[0].src = this.video.currentView.review_url;
          break;
      }
    },

    /**
     * @author odin
     * @param {object} res ajax 成功回傳的物件結果
     * @description 處理公開課程的資料列表
     */
    handleVideoListData(res) {
      this.video.videoList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res ajax 成功回傳的物件結果
     * @description 處理 指定課程(回播) 的詳細資料
     */
    handleFetchCourseRecordReviewDetailData(res) {
      const data = res.data.data;

      this.video.currentView = data;
    },

    /**
     * @author odin
     * @description 處裡剩餘時間的計算
     */
    handleRemainingTimeCalculation() {
      let remainSeconds = this.video.currentView.review_remain_seconds;

      console.log('remainSeconds', remainSeconds);

      // 防止 remainSeconds 為 0 或是 undefined
      if (remainSeconds) {
        this.reviewcounter = window.setInterval(
          this.stopReview,
          remainSeconds * 1000,
        );
      }
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

      if (totalMinutes === remainMinutes) {
        // 還沒觀看過，跳燈箱告知還有多少秒
        let msg = `${this.$t(
          'system_message.video_record_remain',
        )} ${remainMinutes} ${this.$t('system_message.video_record_confirm')}`;

        // 組裝文字
        this.video_record_lightbox.msg = msg;

        // 開啟燈箱
        this.video_record_lightbox.openOrNot = true;
      } else if (totalMinutes !== remainMinutes) {
        if (nowTimeStamp > endTmesStamp) {
          // 已經超過觀看期限，告知影片已經過期並且重新整理
          this.$bus.$emit('notify:message', 'system_message.video_record_end');

          // 重新整理
          setTimeout(() => {
            this.reload();
          }, 500);
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
     * @description 停止回放影片播放
     */
    stopReview() {
      // 顯示提示
      this.$bus.$emit(
        'notify:message',
        this.$t('system_message.video_record_end'),
      );

      // 移除影片相關的資料
      this.resetVideo();
    },

    /**
     * @author odin
     * @description 取得 每月精選 的資料列表
     */
    async fetchMonthlyEsliteList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: fetchMonthlyEslitePath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchMonthlyEsliteList', res);
          // 處理 每月精選 的資料列表
          this.handleVideoListData(res);
          // 播放 傳來的 影片
          this.playInitVideo();
        }
      } catch (err) {
        // 燈箱顯示
        this.$bus.$emit('notify:message', err.response.data.message || err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 取得 指定課程(影片回顧) 的資料列表 | limit=999 目前後端是使用 limit 的方式在控制，沒有帶的話就最多只給 10 筆
     */
    async fetchCourseRecordList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchCourseRecordListPath}?type=open&limit=999`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCourseRecordList', res);
          // 處理 指定課程(影片回顧) 的資料列表
          this.handleVideoListData(res);
          // 播放 傳來的 影片
          this.playInitVideo();
        }
      } catch (err) {
        // 燈箱顯示
        this.$bus.$emit('notify:message', err.response.data.message || err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @param {number} videoId courserecord 指定課程的影片 id
     * @description 取得單筆指定課程的影片資料，並且判斷是否可以播放
     */
    async checkThisCourseExpired(videoId) {
      // 開啟 loading
      this.$bus.$emit('loading:on');

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
     * @description 取得 指定課程(影片回顧) 的單筆資料
     */
    async fetchCourseRecordReviewDetail() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      console.log('fetchCourseRecordReviewDetail');

      const videoId = this.video.Id;

      try {
        const res = await this.axios({
          url: `${fetchCourseRecordListPath}/${videoId}/review`,
          method: 'post',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCourseRecordReviewDetail', res);
          // 處理 指定課程(影片回顧) 的單筆資料
          this.handleFetchCourseRecordReviewDetailData(res);
          // 準備影片的初始化
          this.prepareInitVideo();
        }
      } catch (err) {
        // 燈箱顯示
        this.$bus.$emit('notify:message', err.response.data.message || err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    //////////////////////////////////////// Video manipulate ////////////////////////////////////

    /**
     * @author odin
     * @description 控制影片的播放與暫停
     */
    resetVideo() {
      this.video.isVideoReady = false;
      this.video.videoOptions.sources[0].src = '';

      // status
      this.video.playerCtrl.videoStatus = 'play';

      // times
      this.video.playerCtrl.times.currentTime = 0;
      this.video.playerCtrl.times.formatCurrentTime = '';
      this.video.playerCtrl.times.totalTime = 0;
      this.video.playerCtrl.times.formatTotalTime = '';
      this.video.playerCtrl.times.videobardrag = false;
      this.video.playerCtrl.times.videoProgressPercent = 0;

      // volume
      this.video.playerCtrl.volume.volumebardrag = false;
      this.video.playerCtrl.volume.nowVolume = 0.5;
      this.video.playerCtrl.volume.nowVolumePercenttage = 50;

      // muted
      this.video.playerCtrl.muted.mutedOrNot = false;
      this.video.playerCtrl.muted.beforeMutedNowVolume = 0;
      this.video.playerCtrl.muted.beforeMutedNowVolumePercenttage = 0;
    },

    /**
     * @author odin
     * @description 控制影片的播放與暫停
     */
    toggleVideoPlayAndPause() {
      if (this.video.isVideoReady) {
        if (
          this.video.playerCtrl.videoStatus === 'play' ||
          this.video.playerCtrl.videoStatus === 'pause'
        ) {
          // 播放影片
          this.playVideo();
        } else if (this.video.playerCtrl.videoStatus === 'playing') {
          // 暫停放影片
          this.pauseVideo();
        }
      }
    },

    /**
     * @author odin
     * @description 控制影片靜音
     */
    toggleMuted() {
      // 檢查是否有影片了
      if (this.video.isVideoReady) {
        let mutedOrNot = this.video.playerCtrl.muted.mutedOrNot;

        if (mutedOrNot) {
          this.deMuted();
        } else {
          this.muted();
        }

        this.video.playerCtrl.muted.mutedOrNot = !mutedOrNot;
      }
    },

    /**
     * @author odin
     * @description 靜音影片
     */
    muted() {
      // 調整靜音的狀態
      this.video.playerCtrl.muted.mutedOrNot = true;

      // 保存原本的音量
      this.video.playerCtrl.muted.beforeMutedNowVolume = this.video.playerCtrl.volume.nowVolume;
      this.video.playerCtrl.muted.beforeMutedNowVolumePercenttage = this.video.playerCtrl.volume.nowVolumePercenttage;

      // 替換成靜音的資料
      this.video.playerCtrl.volume.nowVolume = 0;
      this.video.playerCtrl.volume.nowVolumePercenttage = 0;

      // 實際上靜音videojs
      this.player.volume(0);
    },

    /**
     * @author odin
     * @description 開啟影片聲音
     */
    deMuted() {
      // 調整靜音的狀態
      this.video.playerCtrl.muted.mutedOrNot = false;

      // 替換成靜音的資料
      this.video.playerCtrl.volume.nowVolume = this.video.playerCtrl.muted.beforeMutedNowVolume;
      this.video.playerCtrl.volume.nowVolumePercenttage = this.video.playerCtrl.muted.beforeMutedNowVolumePercenttage;

      // reset 紀錄音量的data
      this.video.playerCtrl.muted.beforeMutedNowVolume = 0;
      this.video.playerCtrl.muted.beforeMutedNowVolumePercenttage = 0;

      // 實際上開啟靜音videojs
      this.player.volume(this.video.playerCtrl.volume.nowVolume);
    },

    /**
     * @author odin
     * @description 播放影片
     */
    playVideo() {
      this.player.play();
    },

    /**
     * @author odin
     * @description 暫停影片
     */
    pauseVideo() {
      this.player.pause();
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    volumeMouseDown(ev) {
      // console.log('volumeMouseDown ev', ev);
      // 打開可以設定 bar 的控制
      // 設定位置
      if (this.video.isVideoReady) {
        this.video.playerCtrl.volume.volumebardrag = true;
        this.updateVolumeBar(ev, ev.clientX);
      }
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    volumeMouseMove(ev) {
      // console.log('volumeMouseMove ev', ev);
      // 設定位置(判斷是否有src以及是否可以)
      if (this.video.playerCtrl.volume.volumebardrag) {
        this.updateVolumeBar(ev, ev.clientX);
      }
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    volumeMouseUp() {
      // 關閉可以設定 bar 的控制
      this.video.playerCtrl.volume.volumebardrag = false;
    },

    /**
     * @author odin
     * @param {obj} ev 點擊或滑動 element 的詳細資訊
     * @param {number} x 點擊的位置到瀏覽器邊緣的左邊距離有多少
     * @param {number} vol 0~1之間的數值 代表音量的區域(選填)
     * @description 更新 音量bar 的樣式以及 videojs 的音量設定
     */
    updateVolumeBar(ev, x, vol) {
      let percentage;
      let totalWidth = document.getElementById('videogroup__volumebar')
        .clientWidth;
      let volumeWidth = ev.offsetX;

      if (vol) {
        percentage = vol * 100;
      } else {
        percentage = (volumeWidth / totalWidth) * 100;
      }

      if (percentage > 100) {
        percentage = 100;
      }

      if (percentage < 0) {
        percentage = 0;
      }

      // 設定相關的數字
      this.video.playerCtrl.volume.nowVolume = (percentage / 100).toFixed(2);
      this.video.playerCtrl.volume.nowVolumePercenttage = percentage;

      // 設定目前影片的音效
      this.player.volume(this.video.playerCtrl.volume.nowVolume);
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    videoMouseDown(ev) {
      console.log('videoMouseDown ev', ev);
      // 打開可以設定 bar 的控制
      // 設定位置(判斷是否有src)
      if (this.video.isVideoReady) {
        this.video.playerCtrl.times.videobardrag = true;
        this.updateVideoBar(ev, ev.clientX);
      }
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    videoMouseMove(ev) {
      // console.log('videoMouseMove ev', ev);
      // 設定位置(判斷是否有src以及是否可以)
      if (this.video.playerCtrl.times.videobardrag) {
        this.updateVideoBar(ev, ev.clientX);
      }
    },

    /**
     * @author odin
     * @description 音量bar的
     */
    videoMouseUp(ev) {
      console.log('videoMouseUp ev', ev);
      // 關閉可以設定 bar 的控制
      this.video.playerCtrl.times.videobardrag = false;
    },

    /**
     * @author odin
     * @param {obj} ev 點擊或滑動 element 的詳細資訊
     * @param {number} x 點擊的位置到瀏覽器邊緣的左邊距離有多少
     * @param {number} vid 0.01~10 之間的數值，代表進度的百分比
     * @description 更新 影片時間 bar 的樣式以及 videojs 的影片時間設定
     */
    updateVideoBar(ev, x, vid) {
      let percentage, currentTime;
      let totalWidth = document.getElementById(
        'videogroup__progressbarcontainer',
      ).clientWidth;
      let videoWidth = ev.offsetX;

      if (vid) {
        percentage = vid * 100;
      } else {
        percentage = (videoWidth / totalWidth) * 100;
      }

      if (percentage > 100) {
        percentage = 100;
      }

      if (percentage < 0) {
        percentage = 0;
      }

      // 依照比例乘以總時間得到目前應該定位在影片的幾秒
      currentTime = (this.video.playerCtrl.times.totalTime * percentage) / 100;

      // 設定相關的數字
      this.video.playerCtrl.times.currentTime = currentTime;
      this.video.playerCtrl.times.formatCurrentTime = this.formatSeconds(
        currentTime,
      );
      this.video.playerCtrl.times.videoProgressPercent = percentage;

      // console.log('============updateVideoBar currentTime', currentTime);
      // console.log('============updateVideoBar percentage', percentage);
      // console.log(
      //   '============updateVideoBar totalTime',
      //   this.video.playerCtrl.times.totalTime,
      // );

      // 設定目前影片的影片時間
      this.player.currentTime(currentTime);
    },

    /**
     * @author odin
     * @description 更新 影片播放時間於狀態列上 以及 設定影片時間 以及計算變動的時間的比例
     */
    updateVideoCurrentTime() {
      let currentTime = this.player.currentTime();
      let formatCurrentTime = this.formatSeconds(currentTime);
      let totalTime = this.player.duration();
      let percentage = (currentTime / totalTime) * 100;

      this.video.playerCtrl.times.currentTime = currentTime;
      this.video.playerCtrl.times.formatCurrentTime = formatCurrentTime;
      this.video.playerCtrl.times.videoProgressPercent = percentage;
    },

    /**
     * @author odin
     * @description 更新 影片總時間於狀態列上
     */
    updateVideoTotalTime() {
      let totalTime = this.player.duration();
      let formatTotalTime = this.formatSeconds(totalTime);

      this.video.playerCtrl.times.totalTime = totalTime;
      this.video.playerCtrl.times.formatTotalTime = formatTotalTime;
    },

    //////////////////////////////////////// VideoJs Hooks ////////////////////////////////////
    /**
     * @author odin
     * @type videoJs Hook
     * @description 當播放影片觸發
     */
    onPlayerPlay(player) {
      console.log('player play!', player);
      // 更改影片狀態為 播放中
      this.video.playerCtrl.videoStatus = 'playing';
    },

    /**
     * @author odin
     * @type videoJs Hook
     * @description 當暫停播放影片觸發
     */
    onPlayerPause(player) {
      console.log('player pause!', player);
      // 更改影片狀態為 暫停
      this.video.playerCtrl.videoStatus = 'pause';
    },

    /**
     * @author odin
     * @type videoJs Hook
     * @description 當暫停播結束後觸發
     */
    onPlayerEnded(player) {
      console.log('player pause!', player);
      // 更改影片狀態為 暫停
      this.video.playerCtrl.videoStatus = 'end';
    },

    /**
     * @author odin
     * @type videoJs Hook
     * @description 當播放影片時間不斷更新時觸發
     */
    onPlayerTimeupdate() {
      // 不斷的更新影片時間
      this.updateVideoCurrentTime();
      this.updateVideoTotalTime();
    },

    /**
     * @author odin
     * @type videoJs Hook
     * @description 當狀態改變時觸發
     */
    playerStateChanged() {
      // console.log('player current update state', player);
    },

    /**
     * @author odin
     * @type videoJs Hook
     * @description 當影片載入完全時
     */
    playerReadied(player) {
      console.log('the player is readied', player);
      // 告知影片準備好了
      this.video.isVideoReady = true;
      // volume 初始化
      player.volume(this.video.playerCtrl.volume.nowVolume);
    },
  },
  // Router-Setting
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`

    console.log('beforeRouteLeave to', to);
    console.log('beforeRouteLeave from', from);
    console.log('beforeRouteLeave next', next);
    console.log('beforeRouteLeave this', this);

    // 停止 counting
    clearInterval(this.reviewcounter);

    // 前往要去的頁面
    next();
  },
};
</script>

<style lang="scss" scoped></style>
