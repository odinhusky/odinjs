import axios from 'axios';

const axiosInstance = axios.create();

export function boot({ app, Vue, router }) {
  // 全域處理 ajax error
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      console.log('interceptors');
      // 錯誤提示
      errorNotifier(error.response);

      // 若 unauthorize 導頁
      if (error.response && error.response.status === 401) {
        router.push({
          name: 'login',
          params: { lang: router.currentRoute.params.lang },
        });
      }
      return Promise.reject(error);
    },
  );
  Vue.prototype.axios = axiosInstance;

  function errorNotifier(response) {
    const i18n = app.i18n;
    // 連線失敗
    if (!response) {
      return notifyError(i18n.t('connectFailed'));
    }

    // 驗證失敗，特殊處理
    if (response.status === 422) {
      return notifyError(
        formatValidationResponseToMessages(response).join('\n'),
      );
    }

    // 若 server 有提供 error message 直接顯示
    const { message } = response.data;
    if (message) {
      return notifyError(message);
    }

    // 根據 status code 顯示 default error message
    if (response.status === 401) {
      return notifyError(i18n.t('unauthorized'));
    }
    if (response.status === 404) {
      return notifyError(i18n.t('notFound'));
    }
    if (response.status >= 500) {
      return notifyError(i18n.t('serverError'));
    }

    const defaultMessage = `${i18n.t('undefinedAxiosError')}(${
      response.status
    })`;
    return notifyError(defaultMessage);
  }
}

export default axiosInstance;

function formatValidationResponseToMessages(response) {
  const { errors, message } = response.data;

  if (!errors) {
    return [message];
  }
  return Object.keys(errors).reduce(
    (carry, key) => carry.concat(errors[key]),
    [],
  );
}

function notifyError(message) {
  alert(message);
}
