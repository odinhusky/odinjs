import axios from 'axios';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { i18n } from 'utils';

const logout = () => {
  cookies.set('token', '');
  cookies.set('user', '');
  cookies.set('admin', '');
  location.href = '/'
}

axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          if (cookies.get('token')) {
            toast.error(`${err.response.data.code}, ${err.response.data.message}`, {
              onClick: logout,
              onClose: logout
            });
          }
          break;
      }

      return Promise.reject(err.response || err.data)
    } else {
      return Promise.reject(err)
    }
  }
);

/**
 * @param option axios option. ref: https://github.com/axios/axios
 * @param checkToken whether check token, default is true, token is from cookies.
 * @return Promise
 */
const request = (options, checkToken = true, yaml = false) => {
  const token = cookies.get('token');
  const locale = cookies.get('lang') || i18n.language;
  if (checkToken && !token)
    return logout();

  const baseURL = `${window.ENV.restServerUri}/api/v2/`;
  const combineOptions = {
    baseURL,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': yaml ? 'text/yaml' : 'application/json',
      Authorization: `Bearer ${token}`,
      'Accept-Language': locale
    },
    ...options
  };

  return new Promise((resolve, reject) => {
    axios(combineOptions)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response : err);
      });
  });
};

export default request;
