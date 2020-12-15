<template>
  <div class="root purchase_list_root">
    <section class="sec remaining_container">
      <!-- 餘課數 -->
      <div class="remaining_course_box">
        <!-- 一般餘課數 -->
        <span class="remaining_line">
          {{ $t('purchase.normal_point', [remainingCourse.points]) }}
        </span>
        <!-- 評論餘課數 -->
        <span class="remaining_line">
          {{
            $t('purchase.reviewable_point', [remainingCourse.reviewable_points])
          }}
        </span>
      </div>
    </section>

    <!-- 購買堂數的內容 -->
    <section class="sec orderlist_section">
      <!-- 手機版以外顯示 -->
      <table v-if="orderList.length > 0" class="orderlist_table">
        <thead>
          <tr>
            <!-- 銷售日期 -->
            <th>{{ $t('myaccount.order.sale_date') }}</th>
            <!-- 銷售單號 -->
            <th>{{ $t('myaccount.order.sale_id') }}</th>
            <!-- 銷售品項 -->
            <th>{{ $t('myaccount.order.item_name') }}</th>
            <!-- 購買堂數 -->
            <th>{{ $t('myaccount.order.courses_number') }}</th>
            <!-- 銷售金額 -->
            <th>{{ $t('myaccount.order.sale_price') }}</th>
            <!-- 訂單狀態 -->
            <th>{{ $t('myaccount.order.order_status') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orderList" :key="order.uuid">
            <!-- 銷售日期 -->
            <td>{{ order.created_at | formatDateWithSlash }}</td>
            <!-- 銷售單號 -->
            <td>{{ order.uuid }}</td>
            <!-- 銷售品項 -->
            <td>{{ order.name }}</td>
            <!-- 購買堂數 -->
            <td>{{ order.spec }}</td>
            <!-- 銷售金額 -->
            <td>{{ order.price }}</td>
            <!-- 訂單狀態 -->
            <td :class="{ 'warn-text': order.status === 'unpaid' }">
              {{ order.status_text }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 手機版顯示 -->
      <div v-if="orderList.length > 0" class="orderlist_div">
        <div class="order_unit" v-for="order in orderList" :key="order.uuid">
          <!-- 銷售日期 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.sale_date') }}:
            </span>
            <span class="order_content_text">{{
              order.created_at | formatDateWithSlash
            }}</span>
          </div>

          <!-- 銷售單號 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.sale_id') }}:
            </span>
            <span class="order_content_text">{{ order.uuid }}</span>
          </div>

          <!-- 銷售品項 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.item_name') }}:
            </span>
            <span class="order_content_text">{{ order.name }}</span>
          </div>

          <!-- 購買堂數 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.courses_number') }}:
            </span>
            <span class="order_content_text">{{ order.spec }}</span>
          </div>

          <!-- 銷售金額 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.sale_price') }}:
            </span>
            <span class="order_content_text">{{ order.price }}</span>
          </div>

          <!-- 銷售金額 -->
          <div class="order_line">
            <span class="order_title"
              >{{ $t('myaccount.order.order_status') }}:
            </span>
            <span
              class="order_content_text"
              :class="{ 'warn-text': order.status === 'unpaid' }"
              >{{ order.status_text }}</span
            >
          </div>
        </div>
      </div>

      <!-- 沒有orderList 的時候 -->
      <div v-if="orderList.length === 0" class="no_orderlist">
        {{ $t('myaccount.order.no_orderlist') }}
      </div>
    </section>

    <!-- 下方的按鈕 -->
    <section v-if="orderList.length > 0" class="order_btn_section">
      <router-link
        :to="{
          name: 'purchase',
          params: { lang: this.$route.params.lang },
        }"
        class="kart-btn kart-sub go_purchase"
        >{{ $t('myaccount.order.buy_course') }}</router-link
      >
    </section>

    <!-- <span class="remaining_course_title">{{
      $t('myaccount.remaining.total_remaining_course')
    }}</span>
    <div class="remaining_course_count">
      <span class="remaining_course_control remaining_course_num">{{
        remainingCourse
      }}</span>
      <span class="remaining_course_control remaining_course_text">{{
        $t('myaccount.remaining.course_unit')
      }}</span>
    </div> -->
  </div>
</template>

<script>
// Resources
import { fetchOrderListPath } from '@/store/ajax-path.js';
import commonMixinObj from '@/mixins/common.js';
import { axiosSuccessHint } from '@/plugins/utility.js';

export default {
  name: 'AppMyAccountOrderList',
  props: {
    remainingCourse: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderList: [
        // {
        //   uuid: '6fab82b6-806e-4980-a622-5e97232c1ace',
        //   status: 'paid',
        //   status_text: '\u5df2\u4ed8\u6b3e',
        //   name: '\u5341\u5802\u5957\u9910',
        //   spec: 10,
        //   price: 30,
        //   sale_price: 15,
        //   is_set: 0,
        //   created_at: '2020-10-14T08:06:41.000000Z',
        // },
        // {
        //   uuid: '2ddbd85f-7c3a-48ce-9794-830d795cf599',
        //   status: 'unpaid',
        //   status_text: '\u4ed8\u6b3e\u5931\u6557',
        //   name: '4\u5802',
        //   spec: 4,
        //   price: 90,
        //   sale_price: 45,
        //   is_set: 0,
        //   created_at: '2020-10-14T10:10:59.000000Z',
        // },
        // {
        //   uuid: 'b217e362-bced-4a4a-9f68-5750fbb3ba01',
        //   status: 'paid',
        //   status_text: '\u5df2\u4ed8\u6b3e',
        //   name: 'ten course',
        //   spec: 10,
        //   price: 200,
        //   sale_price: 100,
        //   is_set: 0,
        //   created_at: '2020-10-19T09:41:15.000000Z',
        // },
      ],
    };
  },
  mixins: [commonMixinObj],
  created() {
    // 元件初始化
    this.init();
  },
  methods: {
    /**
     * @author odin
     * @description 元件初始化
     */
    init() {
      // 取得這個使用者(學生) 的購買清單
      this.fetchOrderList();
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的 物件
     * @description 處裡取得學生購買清單的資料
     */
    handlefetchOrderListData(res) {
      this.orderList = res.data.data;
    },

    /**
     * @author odin
     * @description 取得這個使用者(學生) 的購買清單
     */
    async fetchOrderList() {
      // 開啟 燈箱
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: fetchOrderListPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          // 取得使用者的購買清單紀錄 成功
          axiosSuccessHint('fetchOrderList', res);

          // 資料處理
          this.handlefetchOrderListData(res);
        }
      } catch (err) {
        const message = err.response.data.message;

        // 取得使用者的購買清單紀錄 失敗
        if (message) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', message);
        }
      }

      // 關閉 燈箱
      this.$bus.$emit('loading:off');
    },
  },
};
</script>
