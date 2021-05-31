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
    // 如果有開啟的燈箱就清掉
    this.$bus.$emit('notify:off');
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
     * @description 使用者的 生日
     * @return {string}
     */
    loginUserBirthday() {
      return this.$store.state.user.detail[this.loginType].birthday;
    },

    /**
     * @author odin
     * @description 使用者的 性別
     * @return {string}
     */
    loginUserGender() {
      return this.$store.state.user.detail[this.loginType].gender;
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

    /**
     * @author odin
     * @description 使用者是否為訂閱制學生
     * @return {boolean}
     */
    loginUserIsSubscribed() {
      let isSubscribed = false;

      if (this.loginType === 'student') {
        let subscriptionObj = this.$store.state.user.detail[this.loginType]
          .subscription;

        isSubscribed = subscriptionObj === null ? false : true;
      }

      return isSubscribed;
    },

    /**
     * @author odin
     * @description 使用者是否為學院學生
     * @return {boolean}
     */
    loginUserIsAcademy() {
      let isAcademy = false;

      if (this.loginType === 'student') {
        isAcademy = this.$store.state.user.detail.student.is_academy;
      }

      return isAcademy;
    },

    /**
     * @author odin
     * @description 使用者的等級(學生)
     * @return {string}
     */
    loginUserLevel() {
      let levelStr = '';

      if (this.loginType === 'student') {
        if (this.loginDetail.student.is_vvip) {
          levelStr = 'VIP';
        } else if (
          this.loginDetail.student.vip !== null &&
          typeof this.loginDetail.student.vip === 'object'
        ) {
          levelStr = `VIP (${this.loginUserSubscribedExpiredAt})`;
        } else {
          levelStr = 'normal';
        }
      }

      return levelStr;
    },

    /**
     * @author odin
     * @description 使用者的訂閱到期日，如果沒有的話的話就回傳空字串
     * @return {string}
     */
    loginUserSubscribedExpiredAt() {
      let expiredAt = '';

      if (this.loginType === 'student' && this.loginUserIsSubscribed) {
        let subscriptionObj = this.$store.state.user.detail[this.loginType]
          .subscription;

        expiredAt = this.formatDateWithSlash(subscriptionObj.expired_at);
      }

      return expiredAt;
    },

    /**
     * @author odin
     * @description 是否為測試帳號
     * @return {boolean}
     */
    isTest() {
      let result = false;

      if (this.loginType === 'student') {
        result = this.$store.state.user.detail.is_test;
      }

      return result;
    },

    /**
     * @author odin
     * @description 是否為vip
     * @return {null | 期間}
     */
    isVip() {
      let result = false;

      if (this.loginType === 'student') {
        result = this.$store.state.user.detail.student.vip ? true : false;
      }

      return result;
    },

    /**
     * @author odin
     * @description 是否為vip
     * @return {null | 期間}
     */
    isVVip() {
      let result = false;

      if (this.loginType === 'student') {
        result = this.$store.state.user.detail.student.is_vvip;
      }

      return result;
    },

    /**
     * @author odin
     * @description is_teacher 的值
     * @return {boolean}
     */
    isTeacher() {
      return this.$store.state.user.detail.is_teacher;
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
     * @param {string} i18nLanguageData
     * @description 轉換語系
     */
    changeLanguage(i18nLanguageData) {
      const langMap = {
        'zh-Hans': null,
        'zh-Hant': 'tw',
        'en-US': 'en',
      };
      const lang = langMap[i18nLanguageData];
      this.$router.push({
        name: this.$route.name,
        params: { lang: lang },
      });
    },

    /**
     * @author odin
     * @description 將傳入的時間格式轉換成回傳值顯示的樣子
     * @param {time form | string | timestamp | date object} time 傳入的時間格式
     * @return {string} 2020/09/23
     */
    getTimeStamp(time) {
      return new Date(time).getTime();
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
     * @return {string} 09月 23(週四)
     */
    formatDateWithWeekName(time) {
      let d = new Date(time),
        month = d.getMonth() + 1,
        day = d.getDate(),
        weekDay = d.getDay(),
        weekName = '';

      switch (weekDay) {
        case 0:
          weekName = '週一';
          break;
        case 1:
          weekName = '週二';
          break;
        case 2:
          weekName = '週三';
          break;
        case 3:
          weekName = '週四';
          break;
        case 4:
          weekName = '週五';
          break;
        case 5:
          weekName = '週六';
          break;
        case 6:
          weekName = '週日';
          break;
      }

      if (day < 10) day = '0' + day;

      return `${month}月 ${day}(${weekName})`;
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
     * @param {object} teacherObj 後端傳來的老師物件
     * @description 判斷當前語系選擇要輸出哪一個老師的名稱
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
          teacherName = teacherObj.name_en;
          break;
      }

      return teacherName;
    },

    /**
     * @author odin
     * @param {object} teacherIntroObj 後端傳來的老師物件
     * @description 判斷當前語系選擇要輸出哪一個老師的經歷
     */
    dealTeacherIntro(teacherIntroObj) {
      let teacherIntro = '';

      if (typeof teacherIntroObj === 'object' || teacherIntroObj.intro) {
        switch (this.i18n) {
          case 'tw':
            teacherIntro = teacherIntroObj.intro_hant;
            break;
          case 'cn':
            teacherIntro = teacherIntroObj.intro;
            break;
          case 'en':
            teacherIntro = teacherIntroObj.intro_en;
            break;
        }
      }

      return teacherIntro;
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
      // console.log('是否是Android：' + isAndroid); //true,false
      // console.log('是否是iOS：' + isIOS);
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
