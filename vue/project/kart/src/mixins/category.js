/**
 * @author odin
 * @description 各個頁面的預設 category
 */
const defaultCategory = {
  course: '',
  enroll: 'cart',
  browse: 'course',
  'my-account': 'mysetting',
};

const categoryMixinObj = {
  data() {
    return {
      category: '',
    };
  },
  created() {
    // 取得一開始的分類
    const category =
      window.localStorage.getItem(`${this.routeName}Category`) ||
      defaultCategory[this.$route.name];

    if (this.routeName !== 'course') {
      this.category = category;
    }
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    /**
     * @author odin
     * @description 處理 老師的中文姓名
     * @param {string} category 切換的 category 名稱
     */
    changeCategory(category) {
      this.category = category;
      window.localStorage.setItem(`${this.routeName}Category`, category);
    },
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log('to', to);
    console.log('from', from);

    // 離開時清除該 localStorage
    window.localStorage.removeItem(`${this.routeName}Category`);

    next();
  },
};

export default categoryMixinObj;
