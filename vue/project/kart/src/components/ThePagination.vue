<template>
  <div class="pagination_body">
    <button
      class="page_btn prev_page_btn"
      :class="{ unactive: pageObj.current === pageObj.prev }"
      @click.prevent="goPrevPage"
    >
      &lt;
    </button>

    <button
      v-for="page in scopeArray"
      :key="page"
      class="page_btn num_page_btn"
      :class="{ current: page === pageObj.current }"
      @click.prevent="goSpecifiPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="page_btn next_page_btn"
      :class="{ unactive: pageObj.current === pageObj.next }"
      @click.prevent="goNextPage"
    >
      &gt;
    </button>
  </div>
</template>

<script>
// resources
import { isOdd } from '@/plugins/checker.js';

export default {
  name: 'ThePagination',
  components: {},
  props: {
    pageObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    /**
     * @author odin
     * @description 要顯示的頁面計算
     */
    scopeArray() {
      // 總筆數
      // const total = this.pageObj.total;
      // 總頁數
      const totalPages = this.pageObj.totalPages;
      // 目前在哪一頁
      const currentPage = this.pageObj.current;
      // 上一頁
      // const prevPage = this.pageObj.prev;
      // 下一頁
      // const nextPage = this.pageObj.next;
      // 一頁有幾筆內容
      // const perPage = this.pageObj.perPage;
      // 路徑
      // const path = this.pageObj.path;
      // 一次只能秀幾個頁籤(最好是奇數)
      const limitPage = this.pageObj.limitPage;

      let scopeArray = [];

      if (totalPages > limitPage) {
        if (currentPage === 1 || currentPage === 2) {
          for (let i = 1; i <= limitPage; i++) {
            scopeArray.push(i);
          }
        } else if (currentPage + 1 === totalPages) {
          let i = -(limitPage - 2);
          let end = limitPage + i;
          for (i; i < end; i++) {
            scopeArray.push(currentPage + i);
          }
        } else if (currentPage === totalPages) {
          let i = -(limitPage - 1);
          let end = limitPage + i;
          for (i; i < end; i++) {
            scopeArray.push(currentPage + i);
          }
        } else {
          if (isOdd(limitPage)) {
            let sideUnit = parseInt(limitPage / 2);
            let i = -sideUnit;
            let end = sideUnit + 1;
            for (i; i < end; i++) {
              scopeArray.push(currentPage + i);
            }
          } else {
            let sideUnit = parseInt(limitPage / 2);
            let i = -sideUnit + 1;
            let end = sideUnit + 1;
            for (i; i < end; i++) {
              scopeArray.push(currentPage + i);
            }
          }
        }
      } else if (totalPages <= limitPage) {
        for (let i = 1; i <= totalPages; i++) {
          scopeArray.push(i);
        }
      }

      // console.log('scopeArray', scopeArray);
      return scopeArray;
    },
  },
  created() {},
  methods: {
    /**
     * @author odin
     * @description 判斷後決定是否能回上一頁，可以的話就emit出去父元件，重新打ajax
     */
    goPrevPage() {
      if (this.pageObj.current === this.pageObj.prev) {
        return;
      } else {
        this.$emit('fetchSpecificCoursePage', this.pageObj.current - 1);
      }
    },

    /**
     * @author odin
     * @description 判斷後決定是否能回上一頁，可以的話就emit出去父元件，重新打ajax
     */
    goNextPage() {
      if (this.pageObj.current === this.pageObj.next) {
        return;
      } else {
        this.$emit('fetchSpecificCoursePage', this.pageObj.current + 1);
      }
    },

    /**
     * @author odin
     * @param {number} page 要前往的頁數
     * @description 判斷後決定是否能回上一頁，可以的話就emit出去父元件，重新打ajax
     */
    goSpecifiPage(page) {
      if (this.pageObj.current === page) {
        return;
      } else {
        this.$emit('fetchSpecificCoursePage', page);
      }
    },
  },
};
</script>
