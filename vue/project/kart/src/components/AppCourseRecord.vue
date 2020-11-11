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

    <!-- 回放課程列表 -->
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
            v-for="courseRecord in courseRecordList"
            :key="courseRecord.id"
            class="list-group-item classgroup__cardbodyitem"
            @click="checkRemainSecond(courseRecord)"
          >
            <img
              class="classgroup__cardbodyitemimg img-fluid"
              src="@/assets/img/v2/course_record/icon_playarrow@2x.png"
            />
            <div class="classgroup__cardbodyitemname">
              <span
                class="break-warp classgroup__main classgroup__cardbodyitemlesson"
                >{{ courseRecord.lesson.name }}</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemteacher"
                >{{ dealTeacherName(courseRecord.lesson.teacher) }}</span
              >
              <span
                class="break-warp classgroup__sub classgroup__cardbodyitemdate"
                >{{ courseRecord.start_at | formatDate }}</span
              >
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
    <!-- 點選課程後，提示還有幾分鐘的燈箱 -->
    <AppLightBox
      v-model="video_record_lightbox.openOrNot"
      :class="video_record_lightbox.classname"
    >
      <template>
        <span class="lightbox_msg">{{ video_record_lightbox.msg }}</span>

        <div class="btn_group">
          <button
            class="kart-btn kart-gray cancel-btn"
            @click.prevent="cancelReview"
          >
            {{ $t('system_message.close') }}
          </button>

          <button
            class="kart-btn kart-sub confirm-btn"
            @click.prevent="requestReview"
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
import { fetchCourseRecordListPath } from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
// require styles
import 'video.js/dist/video-js.css';

// Component
import AppLightBox from '@/components/AppLightBox';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'AppCourseRecord',
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
      // 回放影片列表
      courseRecordList: [],
      // 取得回放影片之後的資料
      currentReview: {},
      // 回放影片剩餘時間的計算
      reviewcounter: 0,
      intervalArray: [],
      // video 相關的資料
      video: {
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
      // 點選課程後，提示還有幾分鐘 的燈箱
      video_record_lightbox: {
        openOrNot: false,
        classname: 'video_record_lightbox',
        msg: '',
      },
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
    // 元件初始化
    this.init();
    // 確認是否要顯示影片回放一週後上架的燈箱
    this.checkWeekLightboxShow();
  },
  mounted() {
    // 因為按下ESC退出全螢幕時要變換 icon
    this.keyupEscEscapeFullScreenToChangeIcon();
  },
  computed: {
    /**
     * @author odin
     * @description 播放器的實體
     */
    player() {
      return this.$refs.videoPlayer.player;
    },
    /**
     * @author odin
     * @description 播放按鈕的class切換
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

    videoFormatCurrentTime() {
      let formatCurrentTime = '';

      if (this.video.playerCtrl.times.formatCurrentTime === '') {
        formatCurrentTime = '0:00';
      } else {
        formatCurrentTime = this.video.playerCtrl.times.formatCurrentTime;
      }

      return formatCurrentTime;
    },

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
      // 抓取回放課程列表
      this.fetchCourseRecordList();
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
     * @param {object} teacherObj 回傳過來老師的名字
     * @description 根據語系顯示不同老師的名字
     */
    dealTeacherName(teacherObj) {
      let teacherName = '';
      switch (this.i18n) {
        case 'tw':
          teacherName = teacherObj.name_hant;
          break;
        case 'cn':
          teacherName = teacherObj.name;
          break;
        case 'en':
          teacherName = teacherObj.name;
          break;
      }

      return teacherName;
    },

    /**
     * @author odin
     * @param {object} courseRecord 單一個課程的詳細內容物件
     * @description 確認時間限制
     */
    checkRemainSecond(courseRecord) {
      let remainSeconds = courseRecord.review_remain_seconds;
      let limitMinutes = courseRecord.review_limit_minutes;

      if (remainSeconds > 0) {
        // 放入 id
        this.video.requestCourseID = courseRecord.id;

        if (remainSeconds / 60 === limitMinutes) {
          let msg = `${this.$t(
            'system_message.video_record_remain',
          )} ${limitMinutes} ${this.$t('system_message.video_record_confirm')}`;

          this.video_record_lightbox.msg = msg;

          // 開啟燈箱
          this.video_record_lightbox.openOrNot = true;
        } else {
          let msg = `${this.$t('system_message.video_record_range_2var', [
            this.formatDate(courseRecord.review_start_at),
            this.formatDate(courseRecord.review_end_at),
          ])}`;

          this.video_record_lightbox.msg = msg;

          // 開啟燈箱
          this.video_record_lightbox.openOrNot = true;
        }
      } else {
        this.$bus.$emit(
          'notify:message',
          this.$t('system_message.video_record_end'),
        );
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
     * @description 確認是否要顯示影片回放一週後上架的燈箱
     */
    checkWeekLightboxShow() {
      const isWeekLightboxShow = window.localStorage.getItem(
        'isShowVideoWeekLightbox',
      );

      if (isWeekLightboxShow === 'true') {
        this.video_week_lightbox.openOrNot = false;
      }
    },

    /**
     * @author odin
     * @description 取消觀看影片
     */
    cancelReview() {
      this.video_record_lightbox.openOrNot = false;
      this.video_record_lightbox.msg = '';
      this.video.requestCourseID = '';
    },

    /**
     * @author odin
     * @param {object} res ajax 成功回傳的物件結果
     * @description 處理公開課程的資料列表
     */
    handleFetchCourseRecordListData(res) {
      this.courseRecordList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res ajax 成功回傳的物件結果
     * @description 處理選定要播放的課程資料
     */
    handleRequestReviewData(res) {
      this.currentReview = res.data.data;

      // 處理影片的播放
      this.handleVideoSrc();
      // 處裡剩餘時間的計算
      this.handleRemainingTimeCalculation();
      // 回卷到最上方
      this.backToTop();
    },

    /**
     * @author odin
     * @description 處理影片的播放
     */
    handleVideoSrc() {
      this.video.playerCtrl.videoStatus = 'play';
      this.video.videoOptions.sources[0].src = this.currentReview.review_url;
    },

    /**
     * @author odin
     * @description 處裡剩餘時間的計算
     */
    handleRemainingTimeCalculation() {
      let remainSeconds = this.currentReview.review_remain_seconds;

      this.reviewcounter = window.setInterval(
        this.stopReview,
        remainSeconds * 1000,
      );
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
     * @description 取得公開課程的資料列表
     */
    async fetchCourseRecordList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchCourseRecordListPath}?type=open`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCourseRecordList', res);
          // 處理公開課程的資料列表
          this.handleFetchCourseRecordListData(res);
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
     * @description 取得要回放的影片資料
     */
    async requestReview() {
      // 關閉燈箱
      this.video_record_lightbox.openOrNot = false;
      this.video_record_lightbox.msg = '';

      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${fetchCourseRecordListPath}/${this.video.requestCourseID}/review`,
          method: 'post',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('requestReview', res);
          // 處理公開課程的資料列表
          this.handleRequestReviewData(res);
        }
      } catch (err) {
        // 燈箱顯示
        this.$bus.$emit('notify:message', err.response.data.message || err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');

        // 用完就刪除ID
        this.video.requestCourseID = '';
      }
    },

    //////////////////////////////////////// Video manipulate ////////////////////////////////////

    /**
     * @author odin
     * @description 控制影片的播放與暫停
     */
    resetVideo() {
      this.video.isVideoReady = false;
      this.videoOptions.sources[0].src = '';

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
};
</script>

<style lang="scss" scoped></style>
