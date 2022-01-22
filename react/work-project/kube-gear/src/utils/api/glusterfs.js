
import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

// Use to Management
export const getGlusterfsVolume = () => {
  return request({
    baseURL,
    url: 'glusterfsVolume/'
  });
};

export const getGlusterfsVolumeWhichCanBind = () => {
  return request({
    baseURL,
    url: 'glusterfsVolume/canBindVolumeInfo'
  });
};

export const createGlusterfsVolume = data => {
  return request({
    baseURL,
    method: 'POST',
    url: 'glusterfsVolume/bind',
    data
  });
};

export const deleteGlustersVolume = data => {
  return request({
    baseURL,
    method: 'DELETE',
    url: 'glusterfsVolume/',
    data: {
      name: data
    }
  });
};

export const getGlusterfsDetailsVolume = data => {
  return request({
    baseURL,
    url: `glusterfs/?volume=${data}`
  });
};

export const getModifyGlusterfsDetail = name => {
  return request({
    baseURL,
    url: `glusterfs/${name}`
  });
};

export const modifyGlusterfsDetail = data => {
  return request({
    baseURL,
    method: 'PUT',
    url: 'glusterfs/',
    data
  });
};

// Use to General
export const getUsersGlusterfs = (user, params = { withInfo: true }) => {
  return request({
    baseURL,
    url: `user/${user}/canUseGlusterfsList`,
    params
  });
};

export const updateGlusterfsPrivilege = (name, data) => {
  return request({
    baseURL,
    url: `/glusterfs/${name}/privilege`,
    method: 'PUT',
    data
  });
};

export const createGlusterfsFolder = (name, path, folder) => {
  return request({
    url: `/glusterfs/${name}/file${path}${folder}`,
    method: 'PUT'
  });
};

export const uploadGlusterfsFile = (name, path, data, onUploadProgress) => {
  return request({
    url: `/glusterfs/${name}/file${path}`,
    method: 'POST',
    data,
    onUploadProgress
  });
};

export const downloadGlusterfsFile = (name, path) => {
  return request({
    url: `/glusterfs/${name}/file${path}?download=true`,
    responseType: 'blob'
  });
};

export const copyGlusterfsFile = (name, path, data) => {
  return request({
    url: `/glusterfs/${name}/file${path}?cp=true`,
    method: 'POST',
    data
  });
};

export const moveGlusterfsFile = (name, path, data) => {
  return request({
    url: `/glusterfs/${name}/file${path}?mv=true`,
    method: 'POST',
    data
  });
};

export const unZipGlusterFile = (name, path) => {
  return request({
    url: `/glusterfs/${name}/file${path}?unzip=true`,
    method: 'POST'
  });
};

export const getGlusterfsFilePath = (name, path) => {
  return request({
    url: `glusterfs/${name}/file/${path}`
  });
};

export const deleteGlusterfsDetail = name => {
  return request({
    baseURL,
    method: 'DELETE',
    url: 'glusterfs/',
    data: { name: name }
  });
};

export const deleteGlusterfsFile = (name, path) => {
  return request({
    url: `/glusterfs/${name}/file${path}`,
    method: 'DELETE'
  });
};

export const createGlusterfs = data => {
  return request({
    baseURL,
    method: 'POST',
    url: 'glusterfs/',
    data
  });
};

// Use to User Manage edit modal
export const getGlusterfsDetails = () => {
  return request({
    baseURL,
    url: 'glusterfs/'
  });
};
