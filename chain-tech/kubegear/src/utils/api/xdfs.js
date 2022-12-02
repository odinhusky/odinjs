import request from './request';
const baseURL = `${window.ENV.javaRestServerUri}/api`;

// Use to GlobalContext
export const getXdfsIsEnabled = () => {
  return request({
    baseURL,
    url: '/xdfsVolume/config/isEnabled'
  })
}

// Use to Management
export const getXdfsVolume = () => {
  return request({
    baseURL,
    url: '/xdfsVolume/'
  });
};

export const getXdfsVolumeWhichCanBind = () => {
  return request({
    baseURL,
    url: '/xdfsVolume/canBindVolumeInfo'
  });
};

export const createXdfsVolume = data => {
  return request({
    baseURL,
    method: 'POST',
    url: '/xdfsVolume/bind',
    data
  });
};

export const deleteXdfsVolume = data => {
  return request({
    baseURL,
    method: 'DELETE',
    url: '/xdfsVolume/',
    data: {
      name: data
    }
  });
};

export const getXdfsDetailsVolume = data => {
  return request({
    baseURL,
    url: `/xdfs/?volume=${data}`
  });
};

export const getModifyXdfsDetail = name => {
  return request({
    baseURL,
    url: `/xdfs/${name}`
  });
};

export const modifyXdfsDetail = data => {
  return request({
    baseURL,
    method: 'PUT',
    url: '/xdfs/',
    data
  });
};

// Use to General
export const getUsersXdfs = (user, params = { withInfo: true }) => {
  return request({
    baseURL,
    url: `user/${user}/canUseXdfsList`,
    params
  });
};

export const updateXdfsPrivilege = (name, data) => {
  return request({
    baseURL,
    url: `/xdfs/${name}/privilege`,
    method: 'PUT',
    data
  });
};

export const createXdfsFolder = (name, path, folder) => {
  return request({
    url: `/xdfs/${name}/file${path}${folder}`,
    method: 'PUT'
  });
};

export const uploadXdfsFile = (name, path, data, onUploadProgress) => {
  return request({
    url: `/xdfs/${name}/file${path}`,
    method: 'POST',
    data,
    onUploadProgress
  });
};

export const downloadXdfsFile = (name, path) => {
  return request({
    url: `/xdfs/${name}/file${path}?download=true`,
    responseType: 'blob'
  });
};

export const copyXdfsFile = (name, path, data) => {
  return request({
    url: `/xdfs/${name}/file${path}?cp=true`,
    method: 'POST',
    data
  });
};

export const moveXdfsFile = (name, path, data) => {
  return request({
    url: `/xdfs/${name}/file${path}?mv=true`,
    method: 'POST',
    data
  });
};

export const unZipXdfsFile = (name, path) => {
  return request({
    url: `/xdfs/${name}/file${path}?unzip=true`,
    method: 'POST'
  });
};

export const getXdfsFilePath = (name, path) => {
  return request({
    url: `/xdfs/${name}/file/${path}`
  });
};

export const deleteXdfsDetail = name => {
  return request({
    baseURL,
    method: 'DELETE',
    url: '/xdfs/',
    data: { name: name }
  });
};

export const deleteXdfsFile = (name, path) => {
  return request({
    url: `/xdfs/${name}/file${path}`,
    method: 'DELETE'
  });
};

export const createXdfs = data => {
  return request({
    baseURL,
    method: 'POST',
    url: 'xdfs/',
    data
  });
};

// Use to User Manage edit modal
export const getXdfsDetails = () => {
  return request({
    baseURL,
    url: 'xdfs/'
  });
};
