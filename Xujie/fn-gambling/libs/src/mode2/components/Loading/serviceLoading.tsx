// let needLoadingRequestCount = 0;

/**
 * @deprecated 容易造成例外無法關閉，不適合使用
 */
export const showFullScreenLoading = () => {
  // if (needLoadingRequestCount === 0) {
  //   const dom = document.createElement('div');
  //   dom.setAttribute('id', 'loading');
  //   document.body.appendChild(dom);
  //   ReactDOM.createRoot(dom).render(<Loading />);
  // }
  // needLoadingRequestCount++;
};

/**
 * @deprecated 容易造成例外無法關閉，不適合使用
 */
export const hideFullScreenLoading = () => {
  // if (needLoadingRequestCount <= 0) return;
  // needLoadingRequestCount--;
  // if (needLoadingRequestCount === 0) {
  //   document.body.removeChild(
  //     document.getElementById('loading') as HTMLElement
  //   );
  // }
};
