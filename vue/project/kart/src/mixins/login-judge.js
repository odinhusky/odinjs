const loginJudgeMixinObj = {
  created() {
    this.loginJudge();
  },
  methods: {
    /**
     * @author odin
     * @description 如果不是登入狀態進入該頁面就回到登入頁
     */
    loginJudge() {
      if (!this.loginOrNot) {
        // 為了保險清除相關資料
        if (this.loginToken !== '') {
          this.$store.dispatch('logoutWithoutAjax');
        }

        // 如果未登入在這些頁面以外的頁面的話，就導頁回登入頁面
        if (
          this.$route.name !== 'index' &&
          this.$route.name !== 'login' &&
          this.$route.name !== 'teacher-login' &&
          this.$route.name !== 'forget-password' &&
          this.$route.name !== 'verify-phone-step1' &&
          this.$route.name !== 'verify-phone-step2' &&
          this.$route.name !== 'verify-phone-fail' &&
          this.$route.name !== 'signup'
        ) {
          this.$router.push({
            name: 'login',
            params: { lang: this.$route.params.lang },
          });
        }
      } else {
        // 以登入的狀態
        if (
          this.$route.name === 'index' ||
          this.$route.name === 'login' ||
          this.$route.name === 'teacher-login' ||
          this.$route.name === 'forget-password' ||
          this.$route.name === 'verify-phone-step1' ||
          this.$route.name === 'verify-phone-step2' ||
          this.$route.name === 'verify-phone-fail' ||
          this.$route.name === 'signup'
        ) {
          // 再導頁回 course
          this.$router.push({
            name: 'course',
            params: { lang: this.$route.params.lang },
          });
        }
      }
    },
  },
};

export default loginJudgeMixinObj;
