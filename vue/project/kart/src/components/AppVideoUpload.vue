<template>
  <div
    class="root _root"
    :class="{ 'pb-12rem': category === 'normal' && normalVideoList.length < 5 }"
  >
    <main class="main-10">
      <h2 class="page_title _title">{{ $t('video_upload.title') }}</h2>

      <!-- 分類 btn -->
      <section class="page-category-container center position-relative">
        <button
          class="page-category-btn kart-btn kart-bg-gray"
          :class="{ active: category === 'normal' }"
          @click.prevent="changeCategory('normal')"
        >
          {{ $t('video_upload.primary') }}
        </button>
        ｀
        <button
          class="page-category-btn kart-btn kart-bg-gray mr-0"
          :class="{ active: category === 'college' }"
          @click.prevent="changeCategory('college')"
        >
          {{ $t('video_upload.secondary') }}
        </button>

        <!-- 上傳影片的文字按鈕 -->
        <button
          v-if="category === 'normal' && normalVideoList.length > 0"
          class="trans-btn upload_video_text_btn"
          @click.prevent="uploadVideoLightbox.openOrNot = true"
        >
          {{ $t('video_upload.upload_video') }}
        </button>
      </section>

      <!-- 顯示區域 -->
      <section
        class="sec main-section card-container mt-5 ml-mobile-0 mr-mobile-0"
      >
        <!-- 一般影片上傳顯示 -->
        <template v-if="category === 'normal' && normalVideoList.length > 0">
          <div
            v-for="normal in normalVideoList"
            :key="normal.id"
            class="card card-4 cursor-initial normalvideo_unit"
          >
            <div class="card-content card-shadow card-padding">
              <div class="card-body video_time_detail">
                <span class="d-block">{{
                  $t('video_upload.upload_time')
                }}</span>

                <span class="d-block upload_time">{{
                  normal.created_at | formatDate
                }}</span>
              </div>

              <div class="card-foot btn-group mt-2">
                <!-- 查看 -->
                <button
                  class="kart-btn kart-sub half-btn half-left-btn delete_video_btn"
                  @click.prevent="watchThisVideo(normal.url)"
                >
                  {{ $t('video_upload.check_video') }}
                </button>
                <!-- 刪除 -->
                <button
                  class="kart-btn kart-gray half-btn check_video_btn"
                  @click.prevent="confirmDeleteThisVideo(normal.id)"
                >
                  {{ $t('video_upload.delete_video') }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-if="category === 'college' && collegevideoList.length > 0">
          <div class="card-container college_container w-100">
            <div
              v-for="college in collegevideoList"
              :key="college.id"
              class="card card-3 college_unit cursor-initial"
            >
              <div class="card-content">
                <div class="card-body">
                  <!-- 圖片 -->
                  <div
                    class="card-img course_next_img"
                    :style="{ backgroundImage: `url(${college.teacher.img})` }"
                  ></div>
                </div>

                <div class="card-foot d-flex align-items-center mt-2">
                  <!-- 左手邊的詳細資料 -->
                  <div class="college_detai w-70 pr-3">
                    <h5 class="card-foot-title text-main college_name">
                      {{ college.name }}
                    </h5>
                    <p class="card-foot-text college_teachername">
                      <small>{{ dealTeacherName(college.teacher) }}</small>
                    </p>
                    <p class="card-foot-text college_time">
                      <small>{{ college.start_at | formatDate }}</small>
                    </p>
                  </div>

                  <!-- 右手邊的按鈕 -->
                  <div class="college_btns w-30">
                    <!-- 上傳 -->
                    <button
                      class="kart-btn kart-gray w-100 mb-2 college_upload"
                      @click.prevent="prepareUploadCollegeVideo(college.id)"
                    >
                      {{ $t('video_upload.upload') }}
                    </button>
                    <!-- 評論 -->
                    <button
                      class="kart-btn kart-sub w-100 college_comment"
                      @click.prevent="showCommentLightbox(college)"
                    >
                      {{ $t('video_upload.comment') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>

    <!-- 沒有影片資料的時候 -->
    <AppNoClasses v-if="isNoClassesShow" :no-classes-text="noClassesText">
      <!-- 當分類是一般影片上傳且沒有資料的時候才會有上傳影片的按鈕 -->
      <template v-if="category === 'normal'" slot="btns">
        <button
          class="kart-btn kart-sub mt-3 upload_video"
          @click.prevent="uploadVideoLightbox.openOrNot = true"
        >
          {{ $t('video_upload.upload_video') }}
        </button>
      </template>
    </AppNoClasses>

    <!-- 燈箱 -->
    <!-- 觀看影片的燈箱 -->
    <AppLightBox
      v-model="watchVideoLightbox.openOrNot"
      :classname="watchVideoLightbox.classname"
    >
      <template>
        <div class="watch_video_container">
          <video-player
            class="watch_video_plugin"
            ref="videoPlayer"
            :options="watchVideoLightbox.videoOptions"
          />
        </div>
      </template>
    </AppLightBox>

    <!-- 準備上傳影片的燈箱 -->
    <AppLightBox
      v-model="uploadVideoLightbox.openOrNot"
      :classname="uploadVideoLightbox.classname"
    >
      <template>
        <div class="w-100 upload_video_container">
          <!-- 標題 -->
          <h5 class="fz-24 text-center text-main mb-4 upload_title">
            {{ $t('video_upload.upload_video') }}
          </h5>
          <!-- File Input -->
          <div class="kart-input-control">
            <label
              for="video_file"
              class="d-block w-33 w-mobile360-50 mr-3 video_file_input_label"
            >
              <!-- 實際上的上傳檔案 -->
              <input
                type="file"
                class="d-none video_file_input"
                id="video_file"
                ref="video_file"
                @change="previewFiles"
              />
              <!-- 看到的上傳按鈕 -->
              <button
                class="kart-btn kart-sub w-100 video_upload"
                @click.prevent="$refs.video_file.click()"
              >
                {{ $t('video_upload.choose_file') }}
              </button>
            </label>
            <!-- 上傳的檔案名稱 -->
            <input
              v-model="upload.fileName"
              type="text"
              name="show_file_name_input"
              id="show_file_name_input"
              class="kart-input fz-16 w-70 w-mobile360-50"
              :class="{ error: error.show_file_name_input }"
              :readonly="true"
            />
          </div>

          <!-- Edit File Name Input -->
          <div class="kart-input-control mt-4">
            <label
              for="edit_file_name_inpu"
              class="d-block mr-3 w-40 fz-16 edit_file_name_input_label"
              >{{ $t('video_upload.edit_video_filename') }}</label
            >
            <input
              v-model.trim="upload.editFileName"
              type="text"
              class="kart-input w-60 fz-16 edit_file_name_input"
              id="edit_file_name_inpu"
              :placeholder="$t('video_upload.edit_video_input_placeholder')"
            />
          </div>

          <!-- 確定上傳 -->
          <div class="btn-group justify-content-center mt-4">
            <button
              class="kart-btn kart-sub upload_this_video_btn"
              @click.prevent="prepareUploadVideo"
            >
              {{ $t('video_upload.upload') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 上傳"中"的燈箱 -->
    <AppLightBox
      v-model="uploadingVideoLightbox.openOrNot"
      :classname="uploadingVideoLightbox.classname"
      :is-show-cancel="uploadingVideoLightbox.isShowCancel"
    >
      <template>
        <div class="w-100 uploading_video_container">
          <!-- 標題 -->
          <h5
            class="fz-24 fz-mobile-20 text-center text-main mb-4 upload_title"
          >
            {{ $t('video_upload.uploading') }}
          </h5>

          <!-- 檔案名稱 -->
          <span class="d-block mb-2 fz-16 fz-mobile-14 file_name">{{
            computedFileName
          }}</span>

          <!-- 進度 Bar -->
          <div class="w-100 mb-2 progress">
            <div
              class="progress_bar bg-sub"
              :style="{ width: `${progressWidthPercent}%` }"
            ></div>
          </div>

          <!-- 上傳中詳細資料 -->
          <div class="w-100 d-flex fz-14 mb-4 uploading_detail">
            <span class="file_uploading_size fz-14 mr-auto">{{
              `${uploadedFileSize}MB of ${totalFileSize}MB`
            }}</span>
            <span class="d-block file_uploading_percentage">
              {{ `${$t('video_upload.uploading')}...${progressWidthPercent}%` }}
            </span>
          </div>

          <!-- 取消按鈕 -->
          <div class="btn-group justify-content-center">
            <button
              class="kart-btn kart-gray stop_uploading"
              @click.prevent="stopUploadFile"
            >
              {{ $t('system_message.cancel') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 是否要刪除影片的燈箱 -->
    <AppLightBox
      v-model="isDeleteVideoLightbox.openOrNot"
      :classname="isDeleteVideoLightbox.classname"
    >
      <template>
        <div class="is_delete_video_container">
          <!-- 標題 -->
          <h5
            class="fz-20 fz-mobile-18 font-weight-normal text-center text-main mb-4 upload_title"
          >
            {{ $t('video_upload.check_delete') }}
          </h5>

          <!-- 確定上傳 -->
          <div class="btn-group justify-content-center mt-4">
            <button
              class="kart-btn kart-gray half-btn half-left-btn cancel_delete"
              @click.prevent="cancelDeleteThisVideo"
            >
              {{ $t('system_message.cancel') }}
            </button>

            <button
              class="kart-btn kart-sub half-btn delete_this_video"
              @click.prevent="deleteThisVideo"
            >
              {{ $t('system_message.confirm') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>

    <!-- 老師評論的燈箱 -->
    <AppLightBox
      v-model="commetVideoLightbox.openOrNot"
      :classname="commetVideoLightbox.classname"
      :is-show-cancel="commetVideoLightbox.isShowCancel"
    >
      <template>
        <div class="commet_video_container">
          <!-- 評論日期 -->
          <h5
            class="d-block fz-18 fz-mobile-18 font-weight-normal text-left text-gray700 lh-1 mb-2 comment_at"
          >
            {{ commetVideoLightbox.comment_at | formatDate }}
          </h5>

          <!-- 評論教師名稱 -->
          <h5
            class="d-block fz-18 fz-mobile-18 font-weight-normal text-left text-gray700 lh-1 mb-3 comment_teacher_name"
          >
            {{ dealTeacherName(commetVideoLightbox.comment_teacher_obj) }}
          </h5>

          <!-- 評論的內容 -->
          <p class="d-block w-100 text-gray600 fz-16 mb-4">
            {{ commetVideoLightbox.comment }}
          </p>

          <!-- 關閉的按鈕 -->
          <div class="btn-group justify-content-center">
            <button
              class="kart-btn kart-sub close_commet_lightbox"
              @click.prevent="commetVideoLightbox.openOrNot = false"
            >
              {{ $t('system_message.close') }}
            </button>
          </div>
        </div>
      </template>
    </AppLightBox>
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';
import categoryMixinObj from '@/mixins/category.js';
import {
  fetchNormalVideosListPath,
  fetchCollegeVideosListPath,
  fetchNormalSTSTokenPath,
  fetchCollegeSTSTokenPath,
  deleteSpecificVideoPath,
  requestNormalVideoUploadSuccessPath,
  requestCollegeVideoUploadSuccessPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';

// require styles
import 'video.js/dist/video-js.css';

// Component
import AppLightBox from '@/components/AppLightBox.vue';
import AppNoClasses from '@/components/AppNoClasses.vue';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'AppVideoUpload',
  components: {
    AppLightBox,
    AppNoClasses,
    videoPlayer,
  },
  mixins: [commonMixinObj, categoryMixinObj],
  props: {
    // aaa: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  data() {
    return {
      // 分類( 'normal' => 一般影片上傳 ｜ 'college' => 學院影片上傳 )
      category: '',
      normalVideoList: [
        // {
        //   id: 1,
        //   url:
        //     'https://kart-production.oss-accelerate.aliyuncs.com/videos/%E6%AD%A3%E5%BC%8F%E6%92%AD%E6%94%BE%E5%BD%B1%E7%89%87/20200607_note_10_Elton.mp4',
        //   created_at: '2020-10-13T17:48:51+08:00',
        //   updated_at: '2020-10-13T17:48:51+08:00',
        // },
        // {
        //   id: 2,
        //   url:
        //     'https://kart-production.oss-accelerate.aliyuncs.com/videos/%E6%AD%A3%E5%BC%8F%E6%92%AD%E6%94%BE%E5%BD%B1%E7%89%87/20200607_note_10_Elton.mp4',
        //   created_at: '2020-10-13T17:48:51+08:00',
        //   updated_at: '2020-10-13T17:48:51+08:00',
        // },
        // {
        //   id: 3,
        //   url:
        //     'https://kart-production.oss-accelerate.aliyuncs.com/videos/%E6%AD%A3%E5%BC%8F%E6%92%AD%E6%94%BE%E5%BD%B1%E7%89%87/20200607_note_10_Elton.mp4',
        //   created_at: '2020-10-13T17:48:51+08:00',
        //   updated_at: '2020-10-13T17:48:51+08:00',
        // },
        // {
        //   id: 4,
        //   url:
        //     'https://kart-production.oss-accelerate.aliyuncs.com/videos/%E6%AD%A3%E5%BC%8F%E6%92%AD%E6%94%BE%E5%BD%B1%E7%89%87/20200607_note_10_Elton.mp4',
        //   created_at: '2020-10-13T17:48:51+08:00',
        //   updated_at: '2020-10-13T17:48:51+08:00',
        // },
        // {
        //   id: 5,
        //   url:
        //     'https://kart-production.oss-accelerate.aliyuncs.com/videos/%E6%AD%A3%E5%BC%8F%E6%92%AD%E6%94%BE%E5%BD%B1%E7%89%87/20200607_note_10_Elton.mp4',
        //   created_at: '2020-10-13T17:48:51+08:00',
        //   updated_at: '2020-10-13T17:48:51+08:00',
        // },
      ],
      collegevideoList: [],
      // 觀看影片的燈箱
      watchVideoLightbox: {
        openOrNot: false,
        classname: 'watch_video_lightbox',
        videoOptions: {
          autoplay: false,
          controls: true,
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
      // 準備上傳影片的燈箱
      uploadVideoLightbox: {
        openOrNot: false,
        classname: 'upload_video_lightbox',
      },
      // 上傳"中"的燈箱
      uploadingVideoLightbox: {
        openOrNot: false,
        isShowCancel: false,
        classname: 'uploading_video_lightbox',
      },
      // 詢問是否要刪除這個影片
      isDeleteVideoLightbox: {
        openOrNot: false,
        classname: 'is_delete_video_lightbox',
      },
      // 老師評論的燈箱
      commetVideoLightbox: {
        openOrNot: false,
        classname: 'comment_video_lightbox',
        isShowCancel: false,
        comment:
          '評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論評論',
        comment_at: '2020-10-13T09:48:51.000000Z',
        comment_teacher_obj: {
          name_en: 'odin',
          name: '奥丁',
          name_hant: '奧丁',
        },
      },
      // 上傳影片相關的資料
      upload: {
        // File
        file: {
          size: 1024,
        },
        // File Name
        fileName: '',
        // 要編輯的檔案名稱，空值的話就用上傳的原始檔名
        editFileName: '',
        // 要放置的 folder 名稱
        folder: '',
        // upload progress related data
        progress: {
          // progress checkpoint
          currentCheckpoint: '',
          // 小數點
          progressWithFix: 0,
          // 百分比
          progressPercent: 0,
        },
        // 阿里雲的 client
        client: '',
        // STS Token Related Data
        ossConfig: {
          region: 'oss-accelerate',
          accessKeyId: '',
          accessKeySecret: '',
          stsToken: '',
          bucket: '',
        },
        // 上傳學院影片的時候，需要填入是哪一個學院課程的ID
        collegeId: '',
      },
      error: {
        show_file_name_input: false,
      },
      // 置放要刪除的影片Id
      deleteVideoId: '',
    };
  },
  computed: {
    /**
     * @author odin
     * @description 判斷沒有影片內容該不該出現
     * @return {boolean}}
     */
    isNoClassesShow() {
      let show = false;

      switch (this.category) {
        case 'normal':
          if (this.normalVideoList.length === 0) show = true;
          break;
        case 'college':
          if (this.collegevideoList.length === 0) show = true;
          break;
      }

      return show;
    },

    /**
     * @author odin
     * @description 產生對應的 i18n 結構字串
     * @return {string}
     */
    noClassesText() {
      let text = 'nextcourse.no_videos';

      if (this.loginUserIsAcademy === false && this.category === 'college') {
        text = 'video_upload.college_only';
      }

      return text;
    },

    /**
     * @author odin
     * @description 回傳目前上傳的檔案名稱是哪一個
     * @return {string}
     */
    computedFileName() {
      let fileName = '';

      if (this.upload.editFileName) {
        fileName = this.upload.editFileName;
      } else {
        fileName = this.upload.fileName;
      }

      return fileName;
    },

    /**
     * @author odin
     * @description 已經上傳的檔案大小
     * @return {string}
     */
    uploadedFileSize() {
      const totalSizeMB = this.upload.file.size / 1024 / 1024;
      const progressWithFix = this.upload.progress.progressWithFix;

      return (totalSizeMB * progressWithFix).toFixed(2);
    },

    /**
     * @author odin
     * @description 檔案總共的大小
     * @return {string}
     */
    totalFileSize() {
      return (this.upload.file.size / 1024 / 1024).toFixed(2);
    },

    /**
     * @author odin
     * @description 進度條目前的進度
     * @return {string}
     */
    progressWidthPercent() {
      return this.upload.progress.progressPercent;
    },
  },
  created() {
    // 元件初始化
    this.init();
  },
  watch: {
    'watchVideoLightbox.openOrNot'(value) {
      console.log('觀看影片的燈箱開關有變化', value);
      // 關閉燈箱 移除 src 刪除準備好的影片
      if (value === false) {
        this.watchVideoLightbox.videoOptions.sources[0].src = '';
      }
    },
    'commetVideoLightbox.openOrNot'(value) {
      console.log('學院制觀看老師評論的燈箱開關有變化', value);
      // 關閉燈箱 移除 src 刪除準備好的影片
      if (value === false) {
        this.commetVideoLightbox.comment = '';
        this.commetVideoLightbox.comment_at = '';
        this.commetVideoLightbox.comment_teacher_obj = {
          name_en: '',
          name: '',
          name_hant: '',
        };
      }
    },
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化需要得到的資料
     */
    init() {
      // 取得一般影片上傳的列表
      this.fetchNormalVideosList();

      // 如果是學院學生，取得學院影片上傳列癟
      if (this.loginUserIsAcademy) {
        this.fetchCollegeVideoList();
      }
    },

    /**
     * @author odin
     * @param {object} event 上傳檔案的物件
     * @description 元件初始化需要得到的資料
     */
    previewFiles(event) {
      console.log('event', event);
      console.log('files', event.target.files);
      let fileObj = event.target.files[0];

      // 放入資料
      this.upload.file = fileObj;
      this.upload.fileName = fileObj.name;
    },

    /**
     * @author odin
     * @param {number} collegeId 哪個 college 的 Id
     * @description 開啟燈箱以及紀錄Id
     */
    prepareUploadCollegeVideo(collegeId) {
      this.uploadVideoLightbox.openOrNot = true;
      this.upload.collegeId = collegeId;
    },

    /**
     * @author odin
     * @description 在上傳影片之前的準備動作
     */
    prepareUploadVideo() {
      // 檢查有沒有上傳檔案了
      if (!this.upload.fileName) {
        this.resetUploadFile();
        // 加上錯誤提示
        this.error.show_file_name_input = true;
        return;
      } else {
        // 改掉錯誤提示
        this.error.show_file_name_input = false;
      }

      // 準備上傳影片
      if (this.category === 'normal') {
        this.fetchNormalSTSTokenAndUploadVideoFile();
      } else if (this.category === 'college') {
        this.fetchCollegeSTSTokenAndUploadVideoFile();
      }
    },

    /**
     * @author odin
     * @description 清空跟上傳影片有關的資料
     */
    resetUploadFile() {
      this.upload.file = {};
      this.upload.fileName = '';
      this.upload.editFileName = '';
      this.upload.client = '';
      this.upload.progressPercent = '';
      this.upload.ossConfig = {
        region: 'oss-accelerate',
        accessKeyId: '',
        accessKeySecret: '',
        stsToken: '',
        bucket: '',
        folder: '',
      };
      this.upload.progress.currentCheckpoint = '';
      this.upload.progress.progressWithFix = '';
      this.upload.progress.progressPercent = '';
      this.upload.collegeId = '';

      this.error.show_file_name_input = false;
    },

    /**
     * @author odin
     * @param {object} collegeObj 該學院影片課程的物件
     * @description 判斷是否要打開燈箱，如果是的話就帶入資料並打開燈箱，不是的話就顯示提示
     */
    showCommentLightbox(collegeObj) {
      if (collegeObj.work === null) {
        // 顯示提示並且不打開燈箱
        this.$bus.$emit('notify:message', 'nextcourse.no_comment');
      } else {
        if (collegeObj.work.is_reviewed) {
          // 放入資料
          this.commetVideoLightbox.comment = collegeObj.work.comment;
          this.commetVideoLightbox.comment_at = collegeObj.work.updated_at;
          this.commetVideoLightbox.comment_teacher_obj = collegeObj.teacher;

          // 開啟燈箱
          this.commetVideoLightbox.openOrNot = true;
        }
      }
    },

    /**
     * @author odin
     * @param {string} url 要觀看的影片的連結字串
     * @description 放置url並且開啟燈箱
     */
    watchThisVideo(url) {
      // 放入影片內容
      this.watchVideoLightbox.videoOptions.sources[0].src = url;
      // 開啟燈箱
      this.watchVideoLightbox.openOrNot = true;
    },

    /**
     * @author odin
     * @param {number} videoId 要觀看的影片的連結字串
     * @description 確認是否要刪除該影片
     */
    confirmDeleteThisVideo(videoId) {
      console.log('videoId', videoId);

      // 放置要刪除的影片 Id
      this.deleteVideoId = videoId;

      // 開啟燈箱詢問是否要刪除
      this.isDeleteVideoLightbox.openOrNot = true;
    },

    /**
     * @author odin
     * @description 取消刪除影片
     */
    cancelDeleteThisVideo() {
      this.deleteVideoId = '';
      this.isDeleteVideoLightbox.openOrNot = false;
    },

    /**
     * @author odin
     * @param {number} videoId 要觀看的影片的連結字串
     * @description 確認是否要刪除該影片
     */
    dealProgress(p, checkpoint) {
      console.log('dealProgress p', p);
      console.log('dealProgress checkpoint', checkpoint);

      // 放入進度
      this.upload.progress.currentCheckpoint = checkpoint;
      this.upload.progress.progressWithFix = parseFloat(p);
      this.upload.progress.progressPercent = `${Math.floor(p * 100)}`;
    },

    /**
     * @author odin
     * @description 停止上傳
     */
    stopUploadFile() {
      // 取消上傳
      this.upload.client.cancel();
      // 出現提示
      this.$bus.$emit('notify:message', 'video_upload.cancel_upload');
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 處理 一般影片上傳的資料列表
     */
    handleNormalVideosListData(res) {
      this.normalVideoList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 處理 學院影片上傳的資料列表
     */
    handleCollegeVideosListData(res) {
      this.collegevideoList = res.data.data;
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 處理 STS token 相關的資料
     */
    handleSTSTokenData(res) {
      const data = res.data.data;

      // 放置資料
      this.upload.ossConfig.bucket = data.bucket;
      this.upload.ossConfig.accessKeyId = data.access_key_id;
      this.upload.ossConfig.accessKeySecret = data.access_key_secret;
      this.upload.ossConfig.stsToken = data.security_token;
      this.upload.folder = data.folder;
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 取得 一般影片上傳 的STS Token 並且開始上傳
     */
    async fetchNormalSTSTokenAndUploadVideoFile() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        // 取得 一般影片上傳 的STS Token 的資料
        const res = await this.axios({
          url: fetchNormalSTSTokenPath,
          method: 'post',
          headers: {
            Authorization: this.loginToken,
          },
        });

        // 成功提示
        axiosSuccessHint('stsRes', res);

        if (res !== undefined) {
          this.handleSTSTokenData(res);
          this.uploadFileToAliyun();
        }
      } catch (err) {
        console.log('fetchNormalSTSTokenAndUploadVideoFile err', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 取得 學院影片上傳 的 STS Token 並且開始上傳
     */
    async fetchCollegeSTSTokenAndUploadVideoFile() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        // 取得 學院影片上傳 的STS Token 的資料
        const res = await this.axios({
          url: fetchCollegeSTSTokenPath,
          method: 'post',
          headers: {
            Authorization: this.loginToken,
          },
        });

        // 成功提示
        axiosSuccessHint('stsRes', res);

        if (res !== undefined) {
          this.handleSTSTokenData(res);
          this.uploadFileToAliyun();
        }
      } catch (err) {
        console.log('fetchCollegeSTSTokenAndUploadVideoFile err', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 上傳到阿里雲
     */
    async uploadFileToAliyun() {
      const OSS = require('ali-oss');
      const file = this.upload.file;
      const key = `${this.upload.folder}/${this.computedFileName}`;
      const progress = this.dealProgress;

      const options = {
        progress,
        partSize: 100 * 1024,
        meta: {
          year: 2020,
          people: 'odin',
        },
      };
      let uploadFileClient;

      // 準備 client 的 OSS
      this.upload.client = new OSS(this.upload.ossConfig);

      // 組裝 uploadFileClient
      if (!uploadFileClient || Object.keys(uploadFileClient).length === 0) {
        uploadFileClient = this.client;
      }

      // 關閉目前的燈箱，並且開啟上傳中的燈箱
      this.uploadVideoLightbox.openOrNot = false;
      this.uploadingVideoLightbox.openOrNot = true;

      // 開始上傳
      this.upload.client
        .multipartUpload(key, file, options)
        .then(res => {
          console.log('upload success: %j', res);
          this.currentCheckpoint = null;
          uploadFileClient = null;

          // 成功以後再 call API 告訴後端哪個檔案上傳成功
          if (this.category === 'normal') {
            this.requestNormalVideoUploadSuccess();
          } else if (this.category === 'college') {
            this.requestCollegeVideoUploadSuccess();
          }
        })
        .catch(err => {
          if (uploadFileClient && uploadFileClient.isCancel()) {
            console.log('stop-upload!');
            // 關閉目前燈箱，開啟上傳成功的燈箱
            this.uploadingVideoLightbox.openOrNot = false;
            this.resetUploadFile();
            this.$bus.$emit('notify:message', 'video_upload.upload_fail');
          } else {
            console.error(err);
            // 關閉目前燈箱，開啟上傳成功的燈箱
            this.uploadingVideoLightbox.openOrNot = false;
            this.resetUploadFile();
          }
        });
    },

    /**
     * @author odin
     * @description call API 告訴後端哪個檔案上傳成功
     */
    async requestNormalVideoUploadSuccess() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: requestNormalVideoUploadSuccessPath,
          method: 'post',
          data: {
            object_name: this.computedFileName,
          },
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('requestNormalVideoUploadSuccess', res);

          // 關閉目前燈箱，開啟上傳成功的燈箱
          this.uploadingVideoLightbox.openOrNot = false;
          this.resetUploadFile();
          this.$bus.$emit('notify:message', 'video_upload.upload_success');

          // 一秒後重新整理取得資料
          setTimeout(() => {
            this.reload();
          }, 1000);
        }
      } catch (err) {
        console.log('requestNormalVideoUploadSuccess err', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description call API 告訴後端哪個檔案上傳成功
     */
    async requestCollegeVideoUploadSuccess() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      const collegeId = this.upload.collegeId;

      try {
        const res = await this.axios({
          url: `${requestCollegeVideoUploadSuccessPath}/${collegeId}/work`,
          method: 'post',
          data: {
            object_name: this.computedFileName,
          },
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('requestCollegeVideoUploadSuccess', res);

          // 關閉目前燈箱，開啟上傳成功的燈箱
          this.uploadingVideoLightbox.openOrNot = false;
          this.resetUploadFile();
          this.$bus.$emit('notify:message', 'video_upload.upload_success');

          // 一秒後重新整理取得資料
          setTimeout(() => {
            this.reload();
          }, 1000);
        }
      } catch (err) {
        console.log('requestCollegeVideoUploadSuccess err', err);
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得這個使用者的 一般影片上傳 列表
     */
    async fetchNormalVideosList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: fetchNormalVideosListPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchNormalVideosList', res);

          // 資料處理
          this.handleNormalVideosListData(res);
        }
      } catch (err) {
        const errMessage = err.response.data.message
          ? err.response.message
          : err;

        console.log(
          'fetchNormalVideosList axios error response => ',
          err.response,
        );

        // 修改密碼成功
        if (errMessage) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', errMessage);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得這個使用者的 學院影片上傳 列表
     */
    async fetchCollegeVideoList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: fetchCollegeVideosListPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCollegeVideoList', res);

          // 資料處理
          this.handleCollegeVideosListData(res);
        }
      } catch (err) {
        console.log(
          'fetchCollegeVideoList axios error response => ',
          err.response,
        );
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @param {number} videoId 要刪除的影片的 id
     * @description 刪除特定的影片
     */
    async deleteThisVideo() {
      // 關閉燈箱
      this.isDeleteVideoLightbox.openOrNot = false;

      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: `${deleteSpecificVideoPath}/${this.deleteVideoId}`,
          method: 'delete',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('deleteThisVideo', res);

          // 燈箱顯示(刪除成功)
          this.$bus.$emit('notify:message', 'video_upload.delete_success');

          // 成功一秒重新整理
          setTimeout(() => {
            this.reload();
          }, 1000);
        }
      } catch (err) {
        const errMessage = err.response.data.message
          ? err.response.message
          : err;

        console.log('deleteThisVideo axios error response => ', err.response);

        if (errMessage) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', errMessage);
        } else {
          // 燈箱顯示
          this.$bus.$emit('notify:message', 'video_upload.delete_fail');
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },
  },
};
</script>

<style lang="scss" scoped></style>
