import axios from 'axios';
import cookies from 'js-cookie';
// import { toast } from 'react-toastify';
import { update401 } from 'layouts/Main/features/userinfo/userinfoSlice';
import { i18n } from 'utils';

const logout = () => {
  cookies.set('token', '');
  cookies.set('user', '');
  cookies.set('admin', '');
  location.href = '/';
}

// axios.interceptors.response.use(
//   response => {
//     return response;
//   },
//   err => {
//     console.log('errr', err)
//     if (err && err.response) {
//       switch (err.response.status) {
//         case 401:
//           console.log('401', err)
//           console.log(cookies.get('token'))
//           if (cookies.get('token')) {
//             toast.error(`${err.response.data.code}, ${err.response.data.message}`, {
//               onClick: logout,
//               onClose: logout
//             });
//           }
//           break;
//       }

//       return Promise.reject(err.response || err.data)
//     } else {
//       return Promise.reject(err)
//     }
//   }
// )

export const interceptor = (store) => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      if (err && err.response) {
        switch (err.response.status) {
          case 401:
            if (cookies.get('token')) {
              store.dispatch(update401({ isError: true, errorMsg: err.response.data.message }))
              cookies.set('token', '');
            }
            break;
        }

        return Promise.reject(err.response || err.data)
      } else {
        return Promise.reject(err)
      }
    }
  )
};

/**
 * @author Benjimin & odin
 * @param {object} options -- axios option. ref: https://github.com/axios/axios
 * @param {boolean} checkToken -- whether check token, default is true, token is from cookies.
 * @param {boolean} yaml --
 * @param {boolean} isReturnAllRes -- Resolve all res if true, default false
 * @description Promise -- package axios with another Promise
 * @return {Promise}
*/
const request = (
  options,
  checkToken = true,
  yaml = false,
  isReturnAllRes = false
) => {
  const token = cookies.get('token');
  const locale = cookies.get('lang') || i18n.language;
  if (checkToken && !token) return logout();

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
        const date = res.headers.date;
        const apiTimeStamp = new Date(date).getTime();

        localStorage.setItem('apiTimeStamp', apiTimeStamp);

        if(isReturnAllRes) {
          resolve(res);
        } else {
          resolve(res.data);
        }
      })
      .catch(err => {
        // console.log('err', err);

        const { config } = err;
        if(config === undefined) {
          reject(err);
          return;
        }

        const { url } = config;
        if (err.status === 401 && (url !== '/authn/basic/login')) return
        reject(err.response ? err.response : err);
      });
  });
};

export default request;
