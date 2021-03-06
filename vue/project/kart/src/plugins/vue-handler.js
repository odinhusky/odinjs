/**
 * @author odin
 * @param {object}} err -- 由 catch 接收到的 axios 回傳的錯誤物件
 * @description 如果 ajax 錯誤訊息為 Unauthenticated 則導頁回首頁
 */
function vueHandleUnauthenticated(err) {
  setTimeout(() => {
    if (err.response.data.message === 'Unauthenticated.') {
      this.$router.push({
        name: 'login',
        params: { lang: this.$route.params.lang },
      });
    }
  }, 1500);
}

/**
 * @author odin
 * @description 處理 pagination 的資料
 * @param {string}} targetPageObj data對應的頁碼物件名稱
 * @param {object} links ajax 傳過來的 links 物件
 * @param {object} meta ajax 傳過來的 meta 物件
 */
function vueHandlePaginationData(targetPageObj, links, meta) {
  // 放入連結
  targetPageObj.links = links;

  // 放入頁碼相關資訊
  targetPageObj.props.current = meta.current_page;
  targetPageObj.props.prev = meta.from;
  targetPageObj.props.next =
    meta.current_page === meta.last_page
      ? meta.last_page
      : meta.current_page + 1;
  targetPageObj.props.total = meta.total;
  targetPageObj.props.totalPages = meta.last_page;
  targetPageObj.props.perPage = meta.per_page;
  targetPageObj.props.path = meta.path;
  targetPageObj.props.limitPage = 5;
}

export default { vueHandleUnauthenticated, vueHandlePaginationData };
