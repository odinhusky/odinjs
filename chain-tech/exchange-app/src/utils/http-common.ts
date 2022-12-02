import axiosClient from "axios";
import defaultSettings from "defaultSettings";
const  { apiDomain, ssl } = defaultSettings;
const baseApiUrl = ssl ? `https://${apiDomain}` :  `http://${apiDomain}`

const instance = axiosClient.create({
  baseURL: baseApiUrl,
  timeout: 5000
});


export default instance;
