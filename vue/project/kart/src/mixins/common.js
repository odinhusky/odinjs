const commonMixinObj = {
  data() {
    return {
      deviceCategory: '',
      browser: '',
      // 燈箱結構
      lightbox: {
        openOrNot: false,
        classname: 'enroll_lightbox',
        message: '',
      },
    };
  },
  created() {
    // navigation init
    this.deviceCategory = this.judgeClient();
    // browser init
    this.browser = this.judgeBrowser();
  },
  computed: {
    /**
     * @author odin
     * @description 語系內容
     * @return {string}} tw|cn|en
     */
    i18n() {
      const map = {
        'zh-Hans': 'cn',
        'zh-Hant': 'tw',
        'en-US': 'en',
      };
      return map[this.$i18n.locale];
    },

    /**
     * @author odin
     * @description 語系內容
     * @return {string}} zh-Hant|zh-Hans|en-US
     */
    i18nLanguage() {
      return this.$i18n.locale;
    },

    /**
     * @author odin
     * @description root class 切換
     * @return {object}
     */
    rootClassObj() {
      return {
        tw: this.i18n === 'tw',
        cn: this.i18n === 'cn',
        en: this.i18n === 'en',
        ios: this.deviceCategory === 'IOS',
        android: this.deviceCategory === 'Android',
        pc: this.deviceCategory === 'PC',
        'browser-ie': this.browser === 'IE',
        'browser-firefox': this.browser === 'firefox',
        'browser-chrome': this.browser === 'chrome',
        'browser-opera': this.browser === 'opera',
        'browser-safari': this.browser === 'safari',
      };
    },

    /**
     * @author odin
     * @description 是否登入了
     * @return {boolean}
     */
    loginOrNot() {
      let result = this.$store.state.user.detail.app_id ? true : false;
      return result;
    },
    /**
     * @author odin
     * @description 使用者登入時的Token
     * @return {string}
     */
    loginToken() {
      return this.$store.state.user.loginToken;
    },
    /**
     * @author odin
     * @description 使用者的身份類型
     * @return {string} (student | teacher)
     */
    loginType() {
      return this.$store.state.user.type;
    },
    /**
     * @author odin
     * @description 使用者的名稱
     * @return {string} (student | teacher)
     */
    loginUserName() {
      return this.$store.state.user.detail[this.loginType].name;
    },
    /**
     * @author odin
     * @description 使用者的所有資訊
     * @return {object}
     */
    loginDetail() {
      return this.$store.state.user.detail;
    },
    /**
     * @author odin
     * @description 使用者的 email
     * @return {string}
     */
    loginUserEmail() {
      return this.$store.state.user.detail[this.loginType].email;
    },

    /**
     * @author odin
     * @description 使用者的 完整電話號碼(包含國碼)
     * @return {string}
     */
    loginUserFullCellphone() {
      return this.$store.state.user.detail[this.loginType].cellphone;
    },

    /**
     * @author odin
     * @description 使用者的 國碼
     * @return {string}
     */
    loginUserCountryCode() {
      return this.$store.state.user.detail[this.loginType].cellphone_info
        .country_code;
    },

    /**
     * @author odin
     * @description 使用者的 電話號碼("不"包含國碼)
     * @return {string}
     */
    loginUserPhoneNumber() {
      return this.$store.state.user.detail[this.loginType].cellphone_info
        .phone_number;
    },
  },
  // 從 App.vue 註冊的重新整理'
  inject: ['reload'],
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
     * @description 回到最上方
     */
    backToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * @author odin
     * @description 將傳入的時間格式轉換成回傳值顯示的樣子
     * @param {time form | string | timestamp | date object} time 傳入的時間格式
     * @return {string} 2020/09/23
     */
    formatDateWithSlash(time) {
      let d = new Date(time),
        month = d.getMonth() + 1,
        day = d.getDate(),
        year = d.getFullYear();

      if (day < 10) day = '0' + day;

      return `${year}/${month}/${day}`;
    },

    /**
     * @author odin
     * @description 將傳入的時間格式轉換成回傳值顯示的樣子
     * @param {time form | string | timestamp | date object} time 傳入的時間格式
     * @return {string} 2020 11月 04 16:44
     */
    formatDate(time) {
      let d = new Date(time),
        min = d.getMinutes(),
        hour = d.getHours(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        year = d.getFullYear(),
        timeText = '';

      if (this.i18nLanguage === 'en-US') {
        if (hour >= 0 && hour < 12) {
          timeText = 'AM';
        } else if (hour >= 12 && hour < 24) {
          hour = hour - 12;
          timeText = 'PM';
        }
      } else if (
        this.i18nLanguage === 'zh-Hant' ||
        this.i18nLanguage === 'zh-Hans'
      ) {
        if (hour >= 0 && hour < 6) {
          timeText = '凌晨';
        } else if (hour >= 6 && hour < 12) {
          timeText = '早上';
        } else if (hour >= 12 && hour < 18) {
          hour = hour - 12;
          timeText = '下午';
        } else if (hour >= 18 && hour < 24) {
          hour = hour - 12;
          timeText = '凌晨';
        }
      }

      if (day < 10) day = '0' + day;
      if (hour < 10) hour = '0' + hour;
      if (min < 10) min = '0' + min;

      return `${year}-${month}-${day} ${hour}:${min} ${timeText}`;
    },

    /**
     * @author odin
     * @description 將傳入的秒數轉換成 XX:XX:XX (時分秒)
     * @param {number} seconds 傳入的秒數
     * @return {string} XX:XX:XX or XX:XX
     */
    formatSeconds(seconds) {
      let sec = parseInt(seconds); // 秒
      let min = 0; // 分
      let hour = 0; // 小時
      let secString, minString, hourString;

      if (sec > 60) {
        min = parseInt(sec / 60);
        sec = parseInt(sec % 60);
        if (min > 60) {
          hour = parseInt(min / 60);
          min = parseInt(min % 60);
        }
      }

      secString = parseInt(sec) < 10 ? '0' + parseInt(sec) : parseInt(sec);

      minString = parseInt(min) < 10 ? '0' + parseInt(min) : parseInt(min);

      hourString = parseInt(hour) > 0 ? parseInt(hour) + ':' : '';

      return `${hourString}${minString}:${secString}`;
    },

    /**
     * @author odin
     * @description 判斷目前是哪個 navigator
     * @return {string} Android|IOS|PC
     */
    judgeClient() {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //判断是否是 android终端
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //判断是否是 iOS终端
      var isMac = (function () {
        return /macintosh|mac os x/i.test(u);
      })();
      console.log('是否是Android：' + isAndroid); //true,false
      console.log('是否是iOS：' + isIOS);
      if (isAndroid) {
        return 'Android';
      } else if (isIOS) {
        return 'IOS';
      } else if (isMac) {
        return 'IOS';
      } else {
        return 'PC';
      }
    },

    /**
     * @author odin
     * @description 判斷目前是哪個 瀏覽器
     * @return {string}
     */
    judgeBrowser() {
      /* eslint-disable */
      let Sys = {};
      let ua = navigator.userAgent.toLowerCase();
      let s;
      (s = ua.match(/msie ([\d.]+)/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/firefox\/([\d.]+)/))
        ? (Sys.firefox = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
        ? (Sys.chrome = s[1])
        : (s = ua.match(/opera.([\d.]+)/))
        ? (Sys.opera = s[1])
        : (s = ua.match(/version\/([\d.]+).*safari/))
        ? (Sys.safari = s[1])
        : 0;
      // 測試是哪一種瀏覽器
      if (Sys.ie) return 'IE';
      if (Sys.firefox) return 'firefox';
      if (Sys.chrome) return 'chrome';
      if (Sys.opera) return 'opera';
      if (Sys.safari) return 'safari';
      /* eslint-enable */
    },
  },
};

export default commonMixinObj;
