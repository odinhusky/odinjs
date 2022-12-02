import axios from 'axios';

export const logout = () => {
  localStorage.setItem('token', '');
  // localStorage.setItem('user', '');
  alert("登入過期，請重新登入");
  // window.location.reload();
}

/**
 * @author odin
 * @param {object} options -- axios option. ref: https://github.com/axios/axios
 * @param {boolean} checkToken -- whether check token, default is true, token is from localStorage.
 * @param {boolean} isReturnAllRes -- Resolve all res if true, default false
 * @description Promise -- package axios with another Promise
 * @return {Promise}
*/
export const request = (
  options,
  checkToken = true,
  isReturnAllRes = false
) => {
  const token = localStorage.getItem('token');
  // console.log('token', token);
  // console.log('checkToken', checkToken, checkToken && !token);

  if (checkToken && !token) return logout();

  const combineOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options
  };


  return new Promise((resolve, reject) => {
    axios(combineOptions)
      .then(res => {
        const date = res.headers.date;
        const apiTimeStamp = new Date(date).getTime();

        // 紀錄最後一個成功接收到的 API 時間
        localStorage.setItem('apiTimeStamp', apiTimeStamp.toString());

        // console.log('RES', res)

        if(isReturnAllRes) {
          resolve(res);
        } else {
          resolve(res.data.data);
        }
      })
      .catch(err => {
        reject(err.response ? err.response : err);
      });
  });
};

export default request;
