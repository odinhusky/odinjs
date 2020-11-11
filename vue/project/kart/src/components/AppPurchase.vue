<template>
  <div class="root purchase_root" :class="rootClassObj">
    <main class="main-10">
      <h2 class="page_title purchase_title">{{ $t('purchase.title') }}</h2>

      <section
        v-if="isShowAgentCodeInput"
        class="sec purchase_agentcode_section"
      >
        <div class="purchase_agentcode_control">
          <input
            v-model="agentCode"
            type="text"
            name="agent_code"
            class="agent_code"
            :placeholder="$t('placeholder.agent_code')"
          />
          <button
            class="kart-btn kart-sub agent_code_confirm"
            @click.prevent="modifyAgentCode"
          >
            {{ $t('system_message.confirm') }}
          </button>
        </div>
      </section>

      <!-- 課程內容 -->
      <section
        v-if="purchaseCourses.length > 0"
        class="sec purchase_courses_section"
      >
        <!-- 單一個課程 -->
        <div
          v-for="course in purchaseCourses"
          :key="course.id"
          class="price_container"
        >
          <div class="price_box">
            <h5 class="price_title">{{ course.name }}</h5>

            <div class="flex-line" :class="{ hide_price: isHideOriginalPrice }">
              <!-- 牌價 -->
              <div v-if="!isHideOriginalPrice" class="price_unit original">
                <span class="price_unit_line price_unit_title">{{
                  $t('purchase.price')
                }}</span>
                <span class="price_unit_line price_unit_money"
                  >{{ dollarSign }} {{ handlePriceDollar(course) }}</span
                >
              </div>
              <!-- 優惠價 -->
              <div class="price_unit sale">
                <span class="price_unit_line price_unit_title">{{
                  $t('purchase.sale_price')
                }}</span>
                <span class="price_unit_line price_unit_money"
                  >{{ dollarSign }} {{ handleSpecialPriceDollar(course) }}</span
                >
              </div>
            </div>
          </div>

          <button
            class="kart-rect-btn kart-sub gobuy"
            @click.prevent="judgePayWays"
          >
            {{ $t('purchase.buy_now') }}
          </button>
        </div>
      </section>

      <!-- 剩餘課程 -->
      <section v-if="purchaseCourses.length > 0" class="sec remaining_section">
        <!-- 一般 -->
        <span class="remaining_line normal_remaining">{{
          $t('purchase.normal_point', [remaining.points])
        }}</span>
        <!-- 點評 -->
        <span class="remaining_line review_remaining">{{
          $t('purchase.reviewable_point', [remaining.reviewable_points])
        }}</span>
      </section>

      <!-- 頁碼 -->
      <ThePagination
        v-if="purchaseCourses.length > 0"
        :page-obj="pageObj.props"
        @fetchSpecificCoursePage="fetchPurchaseCoursesWithoutSet"
      />

      <!-- 沒有課程的時候顯示 -->
      <AppNoClasses v-if="purchaseCourses.length === 0" />
    </main>

    <!-- 文字燈箱 -->
    <!-- <AppLightBox v-model="lightbox.openOrNot" :classname="lightbox.classname">
      <template>{{ lightbox.message }}</template>
    </AppLightBox> -->

    <!-- 代理商燈箱 -->
    <AppLightBox v-model="agentbox.openOrNot" :classname="lightbox.classname">
      <template>
        <div class="agnet_container">
          <h5 class="agnet_title">{{ $t('purchase.agent_title') }}</h5>

          <div class="agent_lines_container">
            <!-- 名稱 -->
            <div class="agent_line">
              <span class="agent_line_text agent_line_prefix">{{
                $t('purchase.agent_name')
              }}</span>
              <span class="agent_line_text agent_line_content">{{
                agentbox.message.name
              }}</span>
            </div>
            <!-- 電話 -->
            <div class="agent_line">
              <span class="agent_line_text agent_line_prefix">{{
                $t('purchase.agent_phone')
              }}</span>
              <span class="agent_line_text agent_line_content">{{
                agentbox.message.phone
              }}</span>
            </div>
            <!-- 信箱 -->
            <div class="agent_line">
              <span class="agent_line_text agent_line_prefix">{{
                $t('purchase.agent_email')
              }}</span>
              <span class="agent_line_text agent_line_content">{{
                agentbox.message.email
              }}</span>
            </div>
            <!-- 微信號 -->
            <div class="agent_line">
              <span class="agent_line_text agent_line_prefix">{{
                $t('purchase.agent_wechat')
              }}</span>
              <span class="agent_line_text agent_line_content">{{
                agentbox.message.wechat
              }}</span>
            </div>
          </div>

          <!-- 關閉按鈕 -->
          <button
            class="kart-btn kart-sub close_agent_box"
            @click.prevent="agentbox.openOrNot = false"
          >
            {{ $t('system_message.close') }}
          </button>
        </div>
      </template>
    </AppLightBox>
  </div>
</template>

<script>
// Resource
import {
  fetchPurchaseCoursesPath,
  fetchRemainingCoursePath,
  fetchAgentDetailPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';

// Component
import AppLightBox from '@/components/AppLightBox';
import ThePagination from '@/components/ThePagination.vue';
import AppNoClasses from '@/components/AppNoClasses.vue';

export default {
  name: 'AppPurchase',
  components: {
    AppLightBox,
    ThePagination,
    AppNoClasses,
  },
  mixins: [commonMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      // agentCode
      agentCode: '',
      // 課堂內容
      purchaseCourses: [],
      // 剩餘課程數
      remaining: {
        points: 0,
        reviewable_points: 0,
      },
      // 文字燈箱結構
      // lightbox: {
      //   openOrNot: false,
      //   classname: 'purchase_lightbox',
      //   message: '',
      // },
      // 代理商燈箱結構
      agentbox: {
        openOrNot: false,
        classname: 'agent_lightbox',
        message: {
          id: 1,
          name: '凯雅学堂',
          phone: '+8615527716868',
          email: '2243087193@qq.com',
          wechat: 'k-art-learning',
          address: '台北市長安東路一段81號',
          open_hour: '10:00~18:00',
        },
      },
      // 頁碼
      pageObj: {
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
    };
  },
  computed: {
    loginToken() {
      return this.$store.state.user.loginToken;
    },

    userType() {
      return this.$store.state.user.detail.is_teacher ? 'teacher' : 'student';
    },

    userCountryCode() {
      return this.$store.state.user.detail[this.userType].cellphone_info
        .country_code;
    },

    /**
     * @author odin
     * @description 依據國碼判斷什麼時候要出現原價
     */
    isHideOriginalPrice() {
      return this.userCountryCode === '+86' ||
        this.userCountryCode === '+852' ||
        this.userCountryCode === '+886'
        ? false
        : true;
    },

    /**
     * @author odin
     * @description 依據登入的資料判斷 agentCodeInput 是不是要出現
     */
    isShowAgentCodeInput() {
      return true;
    },

    /**
     * @author odin
     * @description 判斷要用哪個金錢符號
     */
    dollarSign() {
      let result = '';
      switch (this.userCountryCode) {
        case '+86':
        case '+852':
          result = '¥';
          break;

        case '+886':
          result = 'NTD';
          break;

        default:
          result = 'USD';
          break;
      }
      return result;
    },
  },
  created() {
    // init
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 開啟燈箱
     */
    // showAlert() {
    //   this.lightbox.openOrNot = true;
    // },

    /**
     * @author odin
     * @description 開啟燈箱
     */
    showAgentAlert() {
      this.agentbox.openOrNot = true;
    },

    /**
     * @author odin
     * @description purchase 資料初始化
     */
    init() {
      // 取得可以購買的課程列表
      this.fetchPurchaseCoursesWithoutSet();
      // 取得資料的初始化
      this.initAxioses();
    },

    /**
     * @author odin
     * @description 一開始的時候一併送出 axios 的請求
     */
    async initAxioses() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        // 取得餘課數
        const fetchRemainingCourseRes = await this.fetchRemainingCourse();

        // 取得代理商資訊
        const fetchAgentDetailRes = await this.fetchAgentDetail();

        // 成功提示
        axiosSuccessHint('fetchRemainingCourse', fetchRemainingCourseRes);
        axiosSuccessHint('fetchAgentDetail', fetchAgentDetailRes);

        if (
          fetchRemainingCourseRes !== undefined &&
          fetchAgentDetailRes !== undefined
        ) {
          // 資料處理
          this.handleFetchRemainingCourseData(fetchRemainingCourseRes);
          this.handleFetchAgentDetailData(fetchAgentDetailRes);
        }
      } catch (err) {
        console.log('initAxioses', err);
      } finally {
        // 關閉 loading
        this.$bus.$emit('loading:off');
      }
    },

    /**
     * @author odin
     * @description 處理 剩餘課程數 的資料
     * @param {object} res ajax 成功的 response
     */
    handleFetchRemainingCourseData(res) {
      const data = res.data.data;
      this.remaining.points = data.points;
      this.remaining.reviewable_points = data.reviewable_points;
    },

    /**
     * @author odin
     * @description 處理 代理商 的資料
     * @param {object} res ajax 成功的 response
     */
    handleFetchAgentDetailData(res) {
      const resObj = res.data.data;
      Object.keys(resObj).forEach(key => {
        // this.agentbox.message[key] = resObj[key];
        this.$set(this.agentbox.message, key, resObj[key]);
      });
    },

    /**
     * @author odin
     * @description 根據收到的值判斷現在是要出現哪一種原價的金額
     */
    handlePriceDollar(purchaseCourseObj) {
      let result = '';
      switch (this.userCountryCode) {
        case '+86':
        case '+852':
          result = purchaseCourseObj.price;
          break;

        case '+886':
          result = purchaseCourseObj.twd_price;
          break;

        default:
          result = purchaseCourseObj.usd_price;
          break;
      }
      return result;
    },

    /**
     * @author odin
     * @description 根據收到的值判斷現在是要出現哪一種"特"價的金額
     */
    handleSpecialPriceDollar(purchaseCourseObj) {
      let result = '';
      switch (this.userCountryCode) {
        case '+86':
        case '+852':
          result = purchaseCourseObj.sale_price;
          break;

        case '+886':
          result = purchaseCourseObj.twd_sale_price;
          break;

        default:
          result = purchaseCourseObj.usd_sale_price;
          break;
      }
      return result;
    },

    /**
     * @author odin
     * @description 判斷要出現哪一種付款方式
     */
    judgePayWays() {
      switch (this.userCountryCode) {
        case '+86':
        case '+852':
          this.showAgentAlert();
          break;

        case '+886':
          this.showAgentAlert();
          break;

        default:
          this.showAgentAlert();
          break;
      }
    },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)
     */
    fetchRemainingCourse() {
      return this.axios({
        url: fetchRemainingCoursePath,
        method: 'get',
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)
     */
    fetchAgentDetail() {
      return this.axios({
        url: fetchAgentDetailPath,
        method: 'post',
        data: {
          country_code: this.userCountryCode,
        },
        headers: {
          Authorization: this.loginToken,
        },
      });
    },

    /**
     * @author odin
     * @description 修改該會員的agentcode
     */
    modifyAgentCode() {
      console.log('修改agentCode');
    },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)
     */
    // async fetchRemainingCourse() {
    //   try {
    //     const res = await this.axios({
    //       url: fetchRemainingCoursePath,
    //       method: 'get',
    //       headers: {
    //         Authorization: this.loginToken,
    //       },
    //     });

    //     if (res.data.data) {
    //       // 成功提示
    //       axiosSuccessHint('fetchRemainingCourse', res);

    //       // 課堂資料處理
    //       this.remaining = res.data.data;
    //     }
    //   } catch (err) {
    //     axiosErrorHint('fetchRemainingCourse', err);

    //     // 燈箱顯示
    //     this.lightbox.message = err.response.data.message || err;
    //     this.showAlert();

    //     // 未認證代表沒有登入或是 token 過期
    //     setTimeout(() => {
    //       if (err.response.data.message === 'Unauthenticated.') {
    //         this.$router.push({ path: '/login' });
    //       }
    //     }, 1500);
    //   }
    // },

    /**
     * @author odin
     * @description 取得可以購買的課程(非套裝課程)
     */
    async fetchPurchaseCoursesWithoutSet(page = 1) {
      try {
        const res = await this.axios({
          url: `${fetchPurchaseCoursesPath}?is_set=0&page=${page}`,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          // 成功提示
          axiosSuccessHint('fetchPurchaseCoursesWithoutSet', res);

          const data = res.data.data;
          const meta = res.data.meta;
          const links = res.data.links;

          // 課堂資料處理
          this.purchaseCourses = data;

          // 頁碼處理
          this.vueHandlePaginationData('pageObj', links, meta);
        }
      } catch (err) {
        console.log('fetchPurchaseCoursesWithoutSet', err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
