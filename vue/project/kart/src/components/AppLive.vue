<template>
  <div
    class="root live_root"
    :class="[{ 'overflow-hidden': device.isChatroomClosed }]"
  >
    <main
      class="main-full-nav-v-footer-x"
      :class="[
        { linemode: liveMode === 'line' },
        { blockmode: liveMode === 'block' },
        hostClass,
      ]"
    >
      <!-- 上方影片選項 -->
      <section class="live_control">
        <!-- 超過兩個講師的話，第二個加入的講師要先放入在這裡 -->
        <div v-show="liveMode === 'line'" class="live_box">
          <!-- 講師的live小窗格 -->

          <div
            v-for="uid in rtc.lineModeStreams"
            :id="`video-${liveMode}-${uid}`"
            :key="`${uid}-${liveMode}-${makeNumberString(8)}`"
            class="live_unit"
          ></div>

          <!-- 1st -->
          <!-- <div class="live_unit" v-if="true">
            <img
              class="live_unit_img"
              src="../assets/img/v2/live/live_test.png"
              alt="test"
            />
          </div> -->

          <!-- 2nd -->
          <!-- <div class="live_unit" v-if="true">
            <img
              class="live_unit_img"
              src="../assets/img/v2/live/live_test.png"
              alt="test"
            />
          </div> -->

          <!-- 3rd -->
          <!-- <div class="live_unit" v-if="true">
            <img
              class="live_unit_img"
              src="../assets/img/v2/live/live_test.png"
              alt="test"
            />
          </div> -->

          <!-- 4th -->
          <!-- <div class="live_unit" v-if="true">
            <img
              class="live_unit_img"
              src="../assets/img/v2/live/live_test.png"
              alt="test"
            />
          </div> -->

          <!-- 5th -->
          <!-- <div class="live_unit" v-if="true">
            <img
              class="live_unit_img"
              src="../assets/img/v2/live/live_test.png"
              alt="test"
            />
          </div> -->
        </div>

        <!-- 改變模式的按鈕 -->
        <div class="live_ctrl_btn_group">
          <button
            class="live_ctrl_btn switch_live_mode_btn"
            @click="toggleLiveMode"
          >
            <img
              v-show="liveMode === 'block'"
              src="../assets/img/v2/live/icon_shrink@2x.png"
              class="switch_live_mode_btn_img line_mode"
              alt="The button which switch live mode to line mode"
            />
            <img
              v-show="liveMode === 'line'"
              src="../assets/img/v2/live/icon_expand@2x.png"
              alt="The button which switch live mode to block mode"
            />
          </button>
        </div>
      </section>

      <!--下方的內容 -->
      <section class="live_content">
        <!-- 左方的畫面 -->
        <div class="live_show_container">
          <!-- 直播畫面的框架 -->
          <div class="live_frame">
            <!-- 代表一個直播畫面: 這一個是只有 line Mode 的時候才出現 -->
            <div
              v-show="liveMode === 'line'"
              :id="firstLineModeVideoId"
              class="live_show_unit"
            >
              <!-- <img
                class="live_show_unit_img"
                src="../assets/img/v2/live/live_test.png"
                alt="test"
              /> -->
            </div>

            <!-- 當模式轉換成 block 的時候才會顯示 -->
            <template v-show="liveMode === 'block'">
              <div
                v-for="uid in rtc.blockModeStreams"
                :id="`video-${liveMode}-${uid}`"
                :key="`${uid}-${liveMode}-${makeNumberString(8)}`"
                class="live_show_unit"
              ></div>

              <!-- 1st -->
              <!-- <div class="live_show_unit" v-if="true">
                <img
                  class="live_show_unit_img"
                  src="../assets/img/v2/live/live_test.png"
                  alt="test"
                />
              </div> -->

              <!-- 2nd -->
              <!-- <div class="live_show_unit" v-if="true">
                <img
                  class="live_show_unit_img"
                  src="../assets/img/v2/live/live_test.png"
                  alt="test"
                />
              </div> -->

              <!-- 3rd -->
              <!-- <div class="live_show_unit" v-if="true">
                <img
                  class="live_show_unit_img"
                  src="../assets/img/v2/live/live_test.png"
                  alt="test"
                />
              </div> -->

              <!-- 4th -->
              <!-- <div class="live_show_unit" v-if="true">
                <img
                  class="live_show_unit_img"
                  src="../assets/img/v2/live/live_test.png"
                  alt="test"
                />
              </div> -->

              <!-- 5th -->
              <!-- <div class="live_show_unit" v-if="true">
                <img
                  class="live_show_unit_img"
                  src="../assets/img/v2/live/live_test.png"
                  alt="test"
                />
              </div> -->
            </template>

            <!-- 最下方的漸層 -->
            <div class="live_frame_gradient"></div>
          </div>

          <!-- 裝置控制的按鈕們 -->
          <div class="live_device_btn_group">
            <!-- 收音 -->
            <button
              class="live_ctrl_btn switch_device_mode_btn microphone_control_btn"
              @click="toggleMicrophone"
            >
              <img
                v-if="device.isMicrophoneClosed === false"
                src="../assets/img/v2/live/icon_voice@2x.png"
                class="switch_device_mode_btn_img close_microphone_mode"
                alt="Close microphone button"
              />
              <img
                v-else
                src="../assets/img/v2/live/icon_mute@2x.png"
                class="switch_device_mode_btn_img open_microphone_mode"
                alt="Open microphone button"
              />
            </button>
            <!-- 相機 -->
            <button
              class="live_ctrl_btn switch_device_mode_btn camera_control_btn"
              @click="toggleCamera"
            >
              <img
                v-if="device.isCameraClosed === false"
                src="../assets/img/v2/live/icon_video@2x.png"
                class="switch_device_mode_btn_img close_camera_mode"
                alt="Close camera button"
              />
              <img
                v-else
                src="../assets/img/v2/live/icon_novideo@2x.png"
                class="switch_device_mode_btn_img open_camera_mode"
                alt="Open camera button"
              />
            </button>
            <!-- 三個點 -->
            <button
              v-if="loginType === 'teacher'"
              class="live_ctrl_btn switch_device_mode_btn other_btn"
              @click="toggleDeviceSelectGroup"
            >
              <img
                src="../assets/img/v2/live/icon_other@2x.png"
                class="switch_device_mode_btn_img other"
                alt="Other button"
              />
              <!-- <img
                v-if="liveMode === 'line'"
                src="../assets/img/v2/live/icon_shrink@2x.png"
                alt="The button which switch live mode to block mode"
              /> -->
            </button>
            <!-- 聊天室 -->
            <button
              class="live_ctrl_btn switch_device_mode_btn chatroom_control_btn d-medium-none"
              @click="device.isChatroomClosed = !device.isChatroomClosed"
            >
              <img
                v-if="device.isChatroomClosed === false"
                src="../assets/img/v2/live/icon_chat@2x.png"
                class="switch_device_mode_btn_img hide_chatroom_mode"
                alt="Hide chatroom button"
              />
              <img
                v-else
                src="../assets/img/v2/live/icon_nochat@2x.png"
                class="switch_device_mode_btn_img show_chatroom_mode"
                alt="Show chatroom button"
              />
            </button>

            <!-- Device Select Group(絕對定位在控制按鈕的上方) -->
            <div v-show="device.isShowSelectGroup" class="device_select_group">
              <!-- Microphone -->
              <div class="device_select_group_unit select_microphone">
                <label
                  for="select_microphone_device"
                  class="select_device_label select_microphone_device_label"
                  >Microphone</label
                >
                <select
                  id="select_microphone_device"
                  v-model="device.currentMicrophone.id"
                  name="select_microphone_device"
                  class="device_select_tag select_microphone_device"
                  @change="reloadStream"
                >
                  <template v-if="device.microphoneList.length > 0">
                    <option
                      v-for="(mic, index) in device.microphoneList"
                      :id="`microphone-${index}}`"
                      :key="mic['deviceId']"
                      :value="mic['deviceId']"
                    >
                      {{ mic['label'] }}
                    </option>
                  </template>
                </select>
              </div>

              <!-- Camera -->
              <div class="device_select_group_unit select_camera">
                <label
                  for="select_camera_device"
                  class="select_device_label select_camera_device_label"
                  >Camera</label
                >
                <select
                  id="select_camera_device"
                  v-model="device.currentCamera.id"
                  name="select_camera_device"
                  class="device_select_tag select_camera_device"
                  @change="reloadStream"
                >
                  <template v-if="device.cameraList.length > 0">
                    <option
                      v-for="(cam, index) in device.cameraList"
                      :id="`camera-${index}`"
                      :key="cam['deviceId']"
                      :value="cam['deviceId']"
                    >
                      {{ cam['label'] }}
                    </option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- Chatroom -->
        <div class="live_chat_box" :class="{ hide: device.isChatroomClosed }">
          <h4 class="chat_title">聊天室</h4>
          <!-- 聊天的歷史紀錄 -->
          <div class="chat_history" @scroll="checkMsgScrollTop">
            <ul class="chat_history_list">
              <li
                v-for="sender in historyMsg.showList"
                :key="`${sender.id}-${makeNumberString(8)}`"
                ref="li"
                class="chat_histroy_unit"
                :class="{ chat_message_date_unit: sender.weekName }"
              >
                <!-- 日期標籤 -->
                <template v-if="sender.weekName">
                  <span class="chat_message_date">{{ sender.weekName }}</span>
                </template>

                <!-- 一般對話訊息 -->
                <template v-else>
                  <span class="chat_identity" :data-type="sender.sender_type">{{
                    sender.sender_name
                  }}</span>
                  <div class="chat_content">
                    <p class="chatgroup__message">
                      {{ sender.message }}
                    </p>

                    <span class="chat_sent_time">{{
                      sender.created_at | formatDateOnlyTime
                    }}</span>
                  </div>
                </template>
              </li>

              <!-- <li class="chat_histroy_unit">
                <span class="chat_identity">Student</span>
                <div class="chat_content">
                  <p class="chatgroup__message">
                    老師可以重複上一段嗎?我完全沒看到~糟糕了啦!!!!
                  </p>

                  <span class="chat_sent_time">11:44 AM</span>
                </div>
              </li>-->
            </ul>
          </div>
          <!-- 聊天的輸入框 -->
          <div class="chat_input">
            <h6 class="chat_input_title">傳送聊天訊息</h6>
            <div class="chat_area">
              <!-- 輸入框 -->
              <textarea
                v-model.trim="chat.msg"
                class="chat_textarea"
                placeholder="Shift+Enter to Newline"
                @keyup.enter="checkMsgShouldSend"
              ></textarea>
              <!-- 送出的容器 -->
              <div class="chat_submit_container">
                <button
                  class="chat_submit"
                  :class="{ disabled: !chat.isMessageSenderActive }"
                  @click="checkMsgShouldSend"
                >
                  {{
                    chat.isMessageSenderActive
                      ? $t('chat_room.chat')
                      : `${chat.countDown}s`
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// Resources
import { axiosSuccessHint } from '@/plugins/utility.js';
import { fetchIsTestPath, fetchNotTestPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import { checkIsEmpty } from '@/plugins/checker.js';

// import echo
import Echo from 'laravel-echo';
import io from 'socket.io-client';

// AgoraRTC
import AgoraRTC from 'agora-rtc-sdk-ng';

export default {
  name: 'AppLive',
  components: {},
  mixins: [commonMixinObj],
  props: {
    // aaa: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  data() {
    return {
      // 目前的主持老師有幾位(幾個畫面)
      hostNumber: 6,

      // 'line' => live mode : 最上方會有一列給使用者選擇現在主要關注的live是哪一個
      liveMode: 'line',

      // 聊天歷史訊息
      historyMsg: {
        currentPage: 1,
        hasNext: true,
        nextPage: 2,
        list: [],
        showList: [],
        ticking: false,
      },

      // 傳送聊天訊息相關
      chat: {
        // textarea
        msg: '',
        // 按鈕預設文字
        chatText: '聊天',
        // 目前這位使用者送出的訊息 id 是多少
        messageid: 0,
        countDown: 0,
        studentSendMessageCountdowntime: 60000,
        vipSendMessageCountdowntime: 30000,
        isMessageSenderActive: true,
      },

      // device btn status
      device: {
        isShowSelectGroup: false,
        isMicrophoneClosed: false,
        isCameraClosed: false,
        isChatroomClosed: false,
        cameraList: [],
        microphoneList: [],
        // 目前預設的攝影機裝置 id
        currentCamera: {
          id: null,
          obj: {},
        },
        // 目前預設的麥克風裝置 id
        currentMicrophone: {
          id: null,
          obj: {},
        },
      },

      // rtc object
      rtc: {
        client: null,
        // joined: false,
        published: false,
        params: {},
        localStream: null,
        // 本地端 -- 音軌
        localAudio: null,
        // 本地端 -- 影像軌
        localVideo: null,
        // publishingRemoteUser 會是該 user 的物件 {remoteUser: {...}, mediaType: {...}}
        publishingRemoteUser: [],
        // /////// 以下內容都是該 remoteUser 的 uid ////////////
        // totalUser 包含自己 | 講師 | 助教 | 其他學生
        totalUser: [],
        // hostUser 只有講師 | 助教
        hostUser: [],
        // 根據不同的模式顯示運算出不同的順序
        lineModeOrderChange: false,
        lineModeCurrentUid: null,
        lineModeStreams: [],
        blockModeStreams: [],
      },

      // rtc option
      options: {
        appID: null,
        channel: null,
        uid: null,
        token: null,
        role: null,
      },

      // video related controls
      vid: {
        videofit: 'contain',
      },

      // volume: {
      //   volumebardrag: false,
      //   nowVolume: 1,
      //   nowVolumePercenttage: 100,
      // },

      // muted: {
      //   mutedOrNot: false,
      //   beforeMutedNowVolume: 0,
      //   beforeMutedNowVolumePercenttage: 0,
      // },

      // 控制 socket 連線
      isSocketLinked: false,
    };
  },
  computed: {
    /**
     * @author odin
     * @description 根據目前的老師數量而變化class名稱
     */
    hostClass() {
      return {
        host1: this.hostNumber === 1,
        host2: this.hostNumber === 2,
        host3: this.hostNumber === 3,
        host4: this.hostNumber === 4,
        host5: this.hostNumber === 5,
        host6: this.hostNumber === 6,
      };
    },

    /**
     * @author odin
     * @description 根據目前的這堂課取得的 lessonid
     */
    lessonid() {
      return this.$store.state.live.lessonid;
    },

    /**
     * @author odin
     * @description 根據目前的這堂課取得的 timeid
     */
    timeid() {
      return this.$store.state.live.timeid;
    },

    /**
     * @author odin
     * @description 取得這堂課的 appId
     * @return {string}
     */
    rtcAppId() {
      return this.$store.state.rtc.appId;
    },

    /**
     * @author odin
     * @description 取得這堂課的 channel
     * @return {string}
     */
    rtcChannel() {
      return this.$store.state.rtc.channel;
    },

    /**
     * @author odin
     * @description 取得這堂課的 rtcToken
     * @return {string}
     */
    rtcToken() {
      return this.$store.state.rtc.rtcToken;
    },

    /**
     * @author odin
     * @description 取得這堂課的 liveNow(新版的會自動產出 uid，當 join 的時候就會回傳，在更新到 data 就好)
     * @return {boolean}
     */
    rtcuid() {
      //student:1, teacher:2
      const typenumber = this.loginType === 'student' ? '1' : '2';
      return typenumber + this.makeNumberString(8);
    },

    /**
     * @author odin
     * @description 回傳第一支影片依據不同的模式會顯示的 id 不同
     * @return {boolean}
     */
    firstLineModeVideoId() {
      return `video-${this.liveMode}-${this.rtc.lineModeCurrentUid}`;
    },
  },
  watch: {
    /**
     * @author odin
     * @description 處理歷史訊息的排序 以及 加入日期分隔元件
     */
    'historyMsg.list'(list) {
      let showArr = [];
      // let dateLabelArr = [];
      const sortedList = [...list].sort((a, b) => {
        return a.id - b.id;
      });

      sortedList.forEach((item, index, arr) => {
        // console.log('item', item);
        let thisWeekName = this.formatDateWithWeekName(item.created_at);
        let nextItem = arr[index + 1] ? arr[index + 1] : item;
        let nextWeekName = this.formatDateWithWeekName(nextItem.created_at);

        if (index === 0) {
          // 第一個要加入日期分隔
          // dateLabelArr.push(item.created_at);
          showArr.push({
            id: item.id + 1000,
            weekName: thisWeekName,
          });
        } else if (thisWeekName !== nextWeekName) {
          // 當兩者的日期不相等的時候就要加入日期標籤分隔
          // dateLabelArr.push(item.created_at);
          showArr.push({
            id: item.id + 1000,
            weekName: nextWeekName,
          });
        }

        showArr.push(item);
      });

      this.historyMsg.showList = showArr;
      const lastIndex = showArr.length - 1;

      // 等到 Dom 渲染好才執行滑動的動作
      this.$nextTick(() => {
        this.$refs.li[lastIndex].scrollIntoView();
      });
    },

    /**
     * @author odin
     * @description 處理 hostNumber 的數量 以及 blockMode 的資料 邏輯
     */
    'rtc.hostUser'(hostUser) {
      // 記錄目前的直播數量
      this.hostNumber = hostUser.length;

      // lineMode 的資料 當沒有變動的時候才做複製
      if (!this.rtc.lineModeOrderChange) {
        [...hostUser].forEach((uid, index) => {
          if (index === 0) {
            this.rtc.lineModeCurrentUid = uid;
          } else {
            this.rtc.lineModeStreams.push(uid);
          }
        });
      }

      // blockMode 的資料 完全複製目前的 remoteStreams 的資料
      this.rtc.blockModeStreams = [...hostUser];
    },
  },
  created() {
    // 元件初始化
    this.init();

    // 控制是否要連線
    if (this.isSocketLinked) {
      // 綁定 Echo 到 Vue 上
      this.Echo = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname,
        client: io,
        auth: {
          headers: {
            Authorization: this.loginToken,
          },
        },
      });
    }
  },
  mounted() {
    // 建立 RTC
    this.startRTC();
  },
  methods: {
    /**
     * @author odin
     * @description 直播頁初始化
     */
    init() {
      // 取得最新的30筆歷史對話紀錄
      this.fetchHistoryMsg();

      // 取得課程的 channel
      this.fetchCourseChannel();
    },

    /**
     * @author odin
     * @description 建立 RTC client | 事件處理 | 建立訪客角色 | Error handling
     */
    async startRTC() {
      const vm = this;

      // rtc 的選項設定
      vm.options = {
        appID: vm.rtcAppId,
        channel: vm.rtcChannel,
        uid: vm.rtcuid,
        token: vm.rtcToken,
        role: this.loginType === 'teacher' ? 'host' : 'audience',
      };

      // 創建 Client 物件
      vm.rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });

      // 設定 option 到對應的位置
      vm.rtc.params = vm.options;

      // 設定客戶端使用者的身份
      await vm.rtc.client.setClientRole(vm.options.role);
      // vm.autoSetClientRole();

      // 註冊 AgoraRTC client 事件
      vm.handleRTCEvents();

      // 將客戶端使用者加入頻道
      try {
        const uid = await vm.rtc.client.join(
          vm.options.appID,
          vm.options.channel,
          vm.options.token,
        );

        console.log('uid', uid);

        // 將目前這位客戶端的使用者(自己)，由 Agora 自動產出的 uid 記錄到 data 中
        vm.options.uid = uid;
        // vm.rtc.lineModeCurrentUid = uid;
        // vm.rtc.lineModeStreams = uid;

        // 把自己加入
        vm.userJoinedDataHandle(vm.options.uid);

        // 如果是老師的身份才會進行取得裝置的動作
        // 先取得本地端的 攝像機 | 麥克風，之後再進行本地端的錄音錄影
        if (vm.loginType === 'teacher') {
          vm.agoraGetLocalDevice();
        } else {
          console.log('學生不能夠發布自己的音軌跟影像軌！');
        }
      } catch (err) {
        console.log('Joining Channel Error => ', err);
      }
    },

    /**
     * @author odin
     * @param {number | string} thisUserUid 使用者的唯一代號
     * @description 當使用者加入後的資料處理
     */
    userJoinedDataHandle(thisUserUid) {
      const thisUserType = this.getUidType(thisUserUid);

      console.log('thisUserUid', thisUserUid);
      console.log('thisUserType', thisUserType);

      // 將 uid 記錄起來
      this.rtc.totalUser.push(thisUserUid);

      if (thisUserType === 'teacher') {
        this.rtc.hostUser.push(thisUserUid);
        this.hostNumber = this.rtc.hostUser;
      }
    },

    /**
     * @author odin
     * @description 依照登入的設定客戶端使用者的身份
     */
    autoSetClientRole() {
      if (this.loginType === 'teacher') {
        this.rtc.client.setClientRole('host', e => {
          if (!e) {
            console.log('setHost success');
          } else {
            console.log('setHost error', e);
          }
        });
      } else if (this.loginType === 'student') {
        this.rtc.client.setClientRole('audience', e => {
          if (!e) {
            console.log('setAudience success');
          } else {
            console.log('setAudience error', e);
          }
        });
      }
    },

    /**
     * @author odin
     * @description 本地的音軌以及影片軌開啟
     */
    agoraGetLocalDevice() {
      console.log('agoraGetLocalDevice');

      const vm = this;

      AgoraRTC.getDevices().then(devices => {
        // 檢查是否都有確認好裝置
        let bothEquiped = true;

        const audioDevices = devices.filter(function (device) {
          return device.kind === 'audioinput' && device.deviceId !== 'default';
        });
        const videoDevices = devices.filter(function (device) {
          return device.kind === 'videoinput';
        });

        console.log('devices', devices);
        console.log('audioDevices', audioDevices);
        console.log('videoDevices', videoDevices);

        // 放置 並且 預設第一個 麥克風裝置為預設裝置
        if (audioDevices.length > 0) {
          vm.device.microphoneList = [...audioDevices];

          vm.device.currentMicrophone.obj = audioDevices[0];
          vm.device.currentMicrophone.id = audioDevices[0]['deviceId'];
        } else {
          vm.$bus.$emit('notify:message', '無偵測到麥克風');
          // 缺少任何一個裝置都不可以
          bothEquiped = false;
        }

        // 放置 並且 預設第一個 攝影機裝置為預設裝置
        if (videoDevices.length > 0) {
          vm.device.cameraList = [...videoDevices];

          vm.device.currentCamera.obj = videoDevices[0];
          vm.device.currentCamera.id = videoDevices[0]['deviceId'];
        } else {
          vm.$bus.$emit('notify:message', '無偵測到攝影機');
          // 缺少任何一個裝置都不可以
          bothEquiped = false;
        }

        if (bothEquiped) {
          // 開啟本地的錄音錄影
          vm.publishLocalStream();
        }
      });
    },

    /**
     * @author odin
     * @description 由於切換裝置或是切換模式的時候要重新 reload 遠端的 stream 會呼叫的 function
     */
    reloadStream() {
      const localAudio = this.rtc.localAudio;
      const localVideo = this.rtc.localVideo;

      console.log('reloadStream');
      console.log('device', this.device);

      // 停止所有本地的 Stream 收音 錄影
      this.stopLocalStream();

      // 一開始沒有所以不需要 publish
      if (localAudio || localVideo) {
        // 創建新的 local stream | 設置 video encoding profile | nitialize the local stream
        this.publishLocalStream();
      }
    },

    /**
     * @author odin
     * @description 開始錄音錄影·
     */
    async publishLocalStream() {
      console.log('publishLocalStream');
      const microphoneId = this.device.currentMicrophone.id;
      const cameraId = this.device.currentCamera.id;

      console.log('publishLocalStream cameraId', cameraId);

      const localAudio = microphoneId
        ? await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId,
          })
        : await AgoraRTC.createMicrophoneAudioTrack();

      const localVideo = cameraId
        ? await AgoraRTC.createCameraVideoTrack({
            cameraId,
          })
        : await AgoraRTC.createCameraVideoTrack();

      console.log('localAudio', localAudio);
      console.log('localVideo', localVideo);

      // Use the Agora Web SDK NG
      try {
        // await this.rtc.client.publish([localAudio, localVideo]);

        await this.rtc.client.publish(localAudio);
        await this.rtc.client.publish(localVideo);

        console.log('publish success');

        // 儲存本地端的 音軌 跟 影像軌
        this.rtc.localAudio = localAudio;
        this.rtc.localVideo = localVideo;

        localVideo.play(this.firstLineModeVideoId);
        // localAudio.play(); // local 不需播放音檔
      } catch (e) {
        console.log('publish failed', e);
      }
    },

    /**
     * @author odin
     * @description 停止本地端的播放
     */
    async stopLocalStream(isDisableDevices = false) {
      const localAudio = this.rtc.localAudio;
      const localVideo = this.rtc.localVideo;

      // Use the Agora Web SDK NG
      if (localAudio || localVideo) {
        try {
          // await this.rtc.client.unpublish([localAudio, localVideo]);

          localAudio.stop();
          localVideo.stop();

          if (isDisableDevices) {
            localAudio.setEnabled(false);
            localVideo.setEnabled(false);
          }

          await this.rtc.client.unpublish(localAudio);
          await this.rtc.client.unpublish(localVideo);

          await this.rtc.client.leave();

          console.log('stopLocalStream success');
        } catch (e) {
          console.log('stopLocalStream failed', e);
        }
      }
    },

    /**
     * @author odin
     * @description 用來製造 uid 用的 function
     * @return {string}
     */
    makeNumberString(length) {
      let result = '';
      let characters = '0123456789';
      let charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    },

    /**
     * @author odin
     * @param {number | string} uid -- Agora client 的 uid
     * @description 利用 uid 來判斷是哪個身份列別的用戶
     * @return {string} teacher | student
     */
    getUidType(uid) {
      return uid.toString().slice(0, 1) === '1' ? 'student' : 'teacher';
    },

    /**
     * @author odin
     * @description toggle live mode
     */
    toggleLiveMode() {
      if (this.liveMode === 'line') {
        this.liveMode = 'block';
      } else if (this.liveMode === 'block') {
        this.liveMode = 'line';
      }
    },

    /**
     * @author odin
     * @description toggle live mode
     */
    toggleMicrophone() {
      const result = !this.device.isMicrophoneClosed;
      const localAudio = this.rtc.localAudio;

      // 修改圖示
      this.device.isMicrophoneClosed = result;

      // Toggle local audio track
      if (result) {
        localAudio.setEnabled(false);
        console.log('Disable audio track success');
      } else {
        localAudio.setEnabled(true);
        console.log('Enable audio track success');
      }
    },

    /**
     * @author odin
     * @description toggle live mode
     */
    toggleCamera() {
      const result = !this.device.isCameraClosed;
      const localVideo = this.rtc.localVideo;

      // 修改圖示
      this.device.isCameraClosed = result;

      // Toggle local video track
      if (result) {
        localVideo.setEnabled(false);
        console.log('Disable video track success');
      } else {
        localVideo.setEnabled(true);
        console.log('Enable video track success');
      }
    },

    /**
     * @author odin
     * @param {object} e 滾動事件的物件
     * @description 處理滾動事件是否到頂部
     */
    checkMsgScrollTop(e) {
      let last_known_scroll_position = e.target.scrollTop;
      const vm = this;

      if (!vm.historyMsg.ticking) {
        window.requestAnimationFrame(function () {
          // console.log(last_known_scroll_position);
          if (last_known_scroll_position === 0 && vm.historyMsg.hasNext) {
            console.log('頂到了且有下一頁');
            vm.fetchHistoryMsg(vm.historyMsg.nextPage);
          }

          vm.historyMsg.ticking = false;
        });
      }
      vm.historyMsg.ticking = true;
    },

    /**
     * @author odin
     * @description toggle Device Select Group
     */
    toggleDeviceSelectGroup() {
      this.device.isShowSelectGroup = !this.device.isShowSelectGroup;
    },

    /**
     * @author odin
     * @param {object} e 滾動事件的物件
     * @description 確認是否可以送出訊息了
     */
    checkMsgShouldSend() {
      if (this.chat.isMessageSenderActive) {
        this.sendMsg();
      } else {
        this.$bus.$emit('notify:message', '請稍後再送出');
      }
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的 response
     * @description 處理回傳的聊天記錄資料
     */
    handlefetchHistoryMsgData(res) {
      // 順序是反的
      const data = res.data.data;
      // 轉順序
      const dataR = data.reverse();

      const links = res.data.links;
      // const meta = res.data.meta;

      // 頁數處理
      if (links.next) {
        // 還有下一頁
        this.historyMsg.nextPage = this.currentPage + 1;
      } else {
        // 沒有下一頁了
        this.historyMsg.nextPage = this.historyMsg.currentPage;
        this.historyMsg.hasNext = false;
      }

      // 將資料從頭放進去
      this.historyMsg.list = [...dataR, ...this.historyMsg.list];
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的 response
     * @description 處理回傳的送出聊天的資料回傳
     */
    handleSendMsgData(res) {
      console.log('handleSendMsgData res', res);

      // 固定 this 的指向
      const vm = this;
      const newstMsgObj = res.data.data;

      // 清空 textarea
      this.chat.msg = '';

      // 更新訊息列表
      this.historyMsg.list.push(newstMsgObj);

      // 判斷是否要禁言(功能都還沒做)
      this.sendMsgBan();

      // 根據身份別判斷要禁言的時間
      if (this.loginType !== 'teacher' && !this.isTest && !this.isTeacher) {
        // console.log('有進來');

        //Sender timer
        let goaltimestamp =
          new Date().getTime() + this.chat.studentSendMessageCountdowntime;
        if (this.isVip || this.isVVip) {
          goaltimestamp =
            new Date().getTime() + this.char.vipSendMessageCountdowntime;
        }
        this.sendMessageCountdowntimer = window.setInterval(
          vm.sendMessageCountDownHandler,
          1000,
          goaltimestamp,
        );
      }
    },

    /**
     * @author odin
     * @param {object} res axios 回傳的 response
     * @description 依據回傳的物件建立 channelListener
     */
    handleCourseChannel(res) {
      console.log('handleCourseChannelRes', res);
      const vm = this;
      const courseObj = res.data.data;
      const channel = courseObj.channel;

      if (channel) {
        //listen recieved message
        vm.Echo.join(channel)
          .here(users => {
            console.log('here user:', users);
          })
          .joining(user => {
            console.log('joining user: ', user);
          })
          .leaving(user => {
            console.log('leaving', user);
          })
          .listen('ChatBroadcast', data => {
            console.log('ChatBroadcast:');
            //filter message
            console.log('same message id', vm.chat.messageid === data.id);
            if (vm.chat.messageid === data.id) {
              //message from self
            } else {
              //message from others
              // let datethis = moment(data.created_at).local();
              // if (messages.first) {
              //   let datefirst = moment(messages.first.created_at).local();
              //   if (!datethis.isSame(datefirst, 'day')) {
              //     showDateMessage(datethis, 'now');
              //   }
              // } else {
              //   showDateMessage(datethis, 'now');
              // }
              // showMessage(data, 'now');
              // messages.first = data;

              // 將從其他人傳來的訊息丟到資料陣列中，透過 watch 的邏輯處理顯示在畫面上
              this.historyMsg.list.push(data);
            }
          })
          .listen('ChannelBroadcast', data => {
            console.log('ChannelBroadcast', data);
            // $('#videogroup__viewernumber').html(data.total);
          })
          .listen('EndBroadcast', data => {
            console.log('EndBroadcast', data);
            // alert('課程已結束！');
            vm.$bus.$emit('notify:message', '課程已結束！');
            // window.location = 'courses.html';
            setTimeout(() => {
              vm.$router.push({
                name: 'course',
                params: { lang: vm.$route.params.lang },
              });
            }, 500);
          });
      }
    },

    /**
     * @author odin
     * @description 綁定 rtc 事件觸發
     */
    handleRTCEvents() {
      const vm = this;
      const rtc = this.rtc;

      // Occurs when an error message is reported and requires error handling.
      rtc.client.on('error', err => {
        console.log('rtc error', err);
      });

      console.log('before user-joined');

      // Occurs when a remote user or host joins the channel.
      rtc.client.on('user-joined', user => {
        console.log('hook:user-joined user =>', user);
        const thisUserUid = user['uid'];

        // 當使用者加入後的資料處理
        vm.userJoinedDataHandle(thisUserUid);
      });

      // Occurs when the remote stream publish.
      // The Agora Web SDK NG replaces the stream-added, stream-removed, and stream-updated events with the user-published and user-unpublished events.
      rtc.client.on('user-published', async (remoteUser, mediaType) => {
        console.log('hook:user-published remoteUser => ', remoteUser);
        console.log('hook:user-published mediaType => ', remoteUser);

        try {
          const subscribeRes = await vm.rtc.client.subscribe(
            remoteUser,
            mediaType,
          );

          console.log('hook:user-published subscribeRes => ', subscribeRes);

          // 依照 publish 的順序加入陣列中
          vm.rtc.publishingRemoteUser.push({
            remoteUser,
            mediaType,
          });

          // 判斷哪些要加入 hostUser
          if (
            remoteUser.uid !== vm.options.uid &&
            vm.getUidType(remoteUser.uid) === 'teacher'
          ) {
            vm.rtc.hostUser.push(remoteUser.uid);
            vm.$nextTick(() => {
              const nowPlayDomId = `video-${vm.liveMode}-${remoteUser.uid}`;

              if (mediaType === 'video') {
                console.log('subscribe video success');
                remoteUser.videoTrack.play(nowPlayDomId);
              }

              if (mediaType === 'audio') {
                console.log('subscribe audio success');
                remoteUser.audioTrack.play();
              }
            });
          }
        } catch (err) {
          console.log('hook:user-published error => ', err);
        }
      });

      // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
      // The Agora Web SDK NG replaces the stream-added, stream-removed, and stream-updated events with the user-published and user-unpublished events.
      rtc.client.on('user-unpublished', async (remoteUser, mediaType) => {
        console.log('hook:user-unpublished remoteUser => ', remoteUser);
        console.log('hook:user-unpublished mediaType => ', remoteUser);

        try {
          const unsubscribeRes = await vm.rtc.client.unsubscribe(
            remoteUser,
            mediaType,
          );

          console.log(
            'hook:user-unpublished unsubscribeRes => ',
            unsubscribeRes,
          );

          // 移除陣列中播放的資料
          vm.removeView(remoteUser.uid);

          // 等 Dom 運算完以後
          vm.$nextTick(() => {
            const nowPlayDomId = `video-${vm.liveMode}-${remoteUser.uid}`;

            if (mediaType === 'video') {
              console.log('unsubscribe video success');
              remoteUser.videoTrack.stop(nowPlayDomId);
            }

            if (mediaType === 'audio') {
              console.log('unsubscribe audio success');
              remoteUser.audioTrack.stop();
            }
          });
        } catch (err) {
          console.log('hook:user-published error => ', err);
        }
      });

      // Occurs when a remote user of the Native SDK calls enableLocalVideo(true) to enable video capture.
      rtc.client.on('enable-local-video', evt => {
        console.log('enable-local-video evt', evt);

        const uid = evt.uid;

        console.log('stream enable video capture remote-uid: ', uid);

        // 這邊只是做樣式變換，應該是不需要的
        // $('#video_panel_' + id).removeClass('disable__video__capture');
      });

      // Occurs when a remote user of the Native SDK calls enableLocalVideo(false) to disable video capture.
      rtc.client.on('disable-local-video', evt => {
        console.log('disable-local-video evt', evt);

        const uid = evt.uid;

        console.log('stream disable video capture remote-uid: ', uid);

        // 這邊只是做樣式變換，應該是不需要的
        // $('#video_panel_' + id).addClass('disable__video__capture');
      });

      // After requesting a new token
      rtc.client.on('onTokenPrivilegeWillExpire', () => {
        // rtc.client.renewToken(token);
        console.log('onTokenPrivilegeWillExpire');
      });

      // After requesting a new token
      rtc.client.on('onTokenPrivilegeDidExpire', () => {
        // client.renewToken(token);
        console.log('onTokenPrivilegeDidExpire');
      });
    },

    /**
     * @author odin
     * @param {number} remoteStreamId -- 遠端的連線的 id
     * @description 影片播放的事件註冊
     */
    handlePlayerEvent(remoteStreamId) {
      console.log('remoteStreamId 還沒做好', remoteStreamId);

      // this.$nextTick(() => {
      //   const video = document.getElementById('video' + remoteStreamId);
      //   const audio = document.getElementById('audio' + remoteStreamId);

      //   video.addEventListener('dblclick', e => {
      //     e.preventDefault();
      //   });

      //   video.addEventListener('pause', e => {
      //     console.log('video pause e', e);
      //     video.play();
      //   });

      //   video.addEventListener('volumechange', event => {
      //     console.log('video volumechange event', event);

      //     console.log(
      //       'The VIDEO ' + remoteStreamId + ' volume changed, volume: ',
      //       video.volume,
      //     );
      //     console.log(
      //       'The VIDEO ' + remoteStreamId + ' is muted: ',
      //       video.muted,
      //     );
      //   });

      //   audio.addEventListener('volumechange', event => {
      //     console.log('audio volumechange event', event);

      //     console.log(
      //       'The AUDIO ' + remoteStreamId + ' volume changed, volume: ',
      //       audio.volume,
      //     );
      //     console.log(
      //       'The AUDIO ' + remoteStreamId + ' is muted: ',
      //       audio.muted,
      //     );
      //   });
      // });
    },

    /**
     * @author odin
     * @param {number} remoteStreamId -- 遠端的連線的 id
     * @description 新增資料改變視訊的 view 數量
     */
    addView(remoteStreamId) {
      console.log('要新增直播的方框的遠端 id, 但還沒做', remoteStreamId);
    },

    /**
     * @author odin
     * @param {number} remoteStreamUId
     * @description 將直播的方框資料移除 -- 更新原始資料 rtc.totalUser
     */
    removeView(remoteStreamUId) {
      console.log('要移除的方框資料 id, 但還沒做', remoteStreamUId);

      let removeIndex = -1;
      let targetArr = [...this.rtc.totalUser];

      targetArr.forEach((item, index) => {
        if (item.remoteUser.uid === remoteStreamUId) {
          removeIndex = index;
        }
      });

      // 移除
      const removedArr = targetArr.splice(removeIndex, 1);
      console.log('removeView removedArr => ', removedArr);

      // 將刪除過後的陣列依照排序
      this.rtc.totalUser = targetArr;

      if (this.liveMode === 'line') {
        this.removeLineModeLive();
      }
    },

    /**
     * @author odin
     * @param {number} remoteStreamUId
     * @description 將直播的方框資料移除 -- 更新到 line mode 相關的 data
     */
    removeLineModeLive(remoteStreamUId) {
      if (this.rtc.lineModeCurrentUid === remoteStreamUId) {
        // 結束直播的正好是目前正在播放的
        this.lineModeCurrentUid = this.rtc.lineModeStreams[0];

        // 移除在上方的第一個
        this.rtc.lineModeStream.splice(0, 1);
      } else {
        let targetArr = [...this.rtc.lineModeStreams];

        // 取得 index
        const removeIndex = targetArr.findIndex(uid => {
          return uid === remoteStreamUId;
        });

        // 移除
        const removedArr = targetArr.splice(removeIndex, 1);
        console.log('removeLineModeLive removedArr => ', removedArr);

        // 放置資料
        this.rtc.lineModeStream = removedArr;
      }
    },

    /**
     * @author odin
     * @param {number} goaltime 目標時間的TimeStamp
     * @description 處理倒數計時，計時期間 disabled 按鈕，並且在按鈕上顯示倒數計時的秒數
     */
    sendMessageCountDownHandler(goaltime) {
      console.log('goaltime', goaltime);

      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = goaltime - now;

      // Output the result
      // Time calculations for seconds
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      console.log('countDown seconds', seconds);

      // 修改狀態以及更新秒數
      this.chat.isMessageSenderActive = false;
      this.chat.countDown = seconds;

      if (distance <= 0) {
        clearInterval(this.sendMessageCountdowntimer);
        this.chat.isMessageSenderActive = true;
        this.chat.countDown = 0;
        // $('#chatgroup__sendbtntext').html(i18n.chat_room.chat);
      }
    },

    /**
     * @author odin
     * @param {number} page 頁碼
     * @description 取得最新的30筆歷史對話紀錄
     */
    async fetchHistoryMsg(page = 1) {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      let apiPath = '';

      // 決定 Api Path
      if (this.isTest) {
        apiPath = `${fetchIsTestPath}/${this.lessonid}/times/${this.timeid}/chats?page=${page}`;
      } else {
        apiPath = `${fetchNotTestPath}/${this.lessonid}/times/${this.timeid}/chats?page=${page}`;
      }

      try {
        const res = await this.axios({
          url: apiPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchHistoryMsg', res);
          // 資料處理
          this.handlefetchHistoryMsgData(res);
        }
      } catch (err) {
        console.log('fetchHistoryMsg', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 發送聊天訊息
     */
    async sendMsg() {
      const msg = this.chat.msg;
      let apiPath = '';

      if (checkIsEmpty(msg)) {
        this.$bus.$emit('notify:message', '不得送出空白訊息');
      } else {
        // 決定 Api Path
        if (this.isTest) {
          apiPath = `${fetchIsTestPath}/${this.lessonid}/times/${this.timeid}/chats`;
        } else {
          apiPath = `${fetchNotTestPath}/${this.lessonid}/times/${this.timeid}/chats`;
        }

        try {
          const res = await this.axios({
            url: apiPath,
            method: 'post',
            data: { message: msg },
            headers: {
              Authorization: this.loginToken,
            },
          });

          if (res.data.data || res.data.status) {
            axiosSuccessHint('sendMsg', res);
            // 資料處理
            this.handleSendMsgData(res);
          }
        } catch (err) {
          console.log('sendMsg', err);
        }
      }
    },

    /**
     * @author odin
     * @description 取得課程的 channel
     */
    async fetchCourseChannel() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      let apiPath = '';
      // 決定 Api Path
      if (this.isTest) {
        apiPath = `${fetchIsTestPath}/${this.lessonid}`;
      } else {
        apiPath = `${fetchNotTestPath}/${this.lessonid}`;
      }

      try {
        const res = await this.axios({
          url: apiPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchCourseChannel', res);
          // 資料處理
          this.handleCourseChannel(res);
        }
      } catch (err) {
        console.log('fetchCourseChannel', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log('AppLive => to, from, next', to, from, next);

    // 清除該直播課程的相關資料
    this.$store.dispatch('clearLiveCourseData');
    this.$store.dispatch('clearRTCTokenData');

    // 停止錄音錄影
    this.stopLocalStream(true).then(() => {
      next();
    });
  },
};
</script>

<style lang="scss" scoped></style>
