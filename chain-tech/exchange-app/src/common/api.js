import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = "http://192.168.0.22"
// const url = "http://3.1.37.240:3002"


const Api = {
  async post(api, data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    return axios.post(url + api, data, config).then((res) => {
      return res.data
    })
      .catch((error) => {
        if (error.response.status === 401) {
          AsyncStorage.removeItem("token")
          AsyncStorage.removeItem("user")
          alert("登入過期，請重新登入")
        } else {
          alert(error.response.data.msg)
        }
        return error.response
      })
  },
  async postData(api, data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    return axios.post(url + api, data, config).then((res) => {
      return res.data
    })
  },
  async patchData(api, data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    return axios.patch(url + api, data, config).then((res) => {
      return res.data
    })
      .catch((error) => {
        return error.response
      })
  },
  async postFormData(api, data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: data => {
        console.log(data)
        return data
      },
    };
    return axios.post(url + api, data, config)
  },
  async get(api) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    const response = await axios.get(url + api, config)
    return response
  },
  async getData(api) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    const response = await axios.get(url + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async put(api, data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    const response = await axios.put(url + api, data, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async delete(api) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };
    const response = await axios.delete(url + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  },
  async deleteData(api,data) {
    let token = await AsyncStorage.getItem("token")
    let config = {
      data,
      headers: {
        Authorization: "Bearer " + token
      }
    };
    const response = await axios.delete(url + api, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error.response
      })
    return response
  }
}

export default Api