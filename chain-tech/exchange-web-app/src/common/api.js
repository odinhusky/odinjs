import axios from 'axios'
import { baseURL } from '@/constants/api';

// const url = "https://ex-api.usefordemo.com"
let config = {
    headers: {
      Authorization: "Bearer "+localStorage.getItem("token")
    }
};

const Api = {
  async post(api, data) {
    return axios.post(baseURL + api, data,config).then((res) => {
      return res.data
    })
      .catch((error) => {
        if(error.response.status === 401){
          console.log('odin', api)
          // localStorage.removeItem("token")
          // localStorage.removeItem("user")
          // alert("登入過期，請重新登入")
          console.log("登入過期，請重新登入");

          // window.location.reload()
        }else{
          alert(error.response.data.msg)
        }
        return error.response
      })
  },
  async postData(api, data) {
    return axios.post(baseURL + api, data,config).then((res) => {
      return res.data
    })
      .catch((error) => {
        return error.response
      })
  },
  async postFormData(api, data) {
    return axios.post(baseURL + api, data,{headers: { 'content-type': 'multipart/form-data',Authorization: localStorage.getItem("token") }}).then((res) => {
      return res.data
    })
      .catch((error) => {
        return error.response
      })
  },
  async get(api) {
    const response = await axios.get(baseURL + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        console.log(error)
        if(error.response.status === 401){
          console.log('odin', api)
          // localStorage.removeItem("token")
          // localStorage.removeItem("user")
          console.log("登入過期，請重新登入");
          // window.location.reload()
        }else{
          alert(error.response.data.msg)
        }
        return error.response
      })
    return response
  },
  async getData(api) {
    const response = await axios.get(baseURL + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async put(api, data) {
    var response = await axios.put(baseURL + api, data,config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async delete(api) {
    await axios.delete(baseURL + api,config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
  },
  async deleteData(api,data) {
    let token = await localStorage.getItem("token")
    let config = {
      data,
      headers: {
        Authorization: token
      }
    };
    const response = await axios.delete(baseURL + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async patchData(api, data) {
    return axios.patch(baseURL + api, data,config).then((res) => {
      return res.data
    })
      .catch((error) => {
        return error.response
      })
  },
}

export default Api