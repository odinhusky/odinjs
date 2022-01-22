import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

// Use to Management
export const getNfsDiskList = () => {
  return request({
    baseURL,
    url: '/nfsDisk/'
  });
};

export const createNfsDisk = data => {
  return request({
    baseURL,
    url: '/nfsDisk/',
    method: 'POST',
    data
  });
};

export const deleteNfsDisk = name => {
  return request({
    baseURL,
    url: `/nfsDisk/${name}`,
    method: 'DELETE'
  });
};

export const syncNfsDisk = name => {
  return request({
    baseURL,
    method: 'POST',
    url: `nfsDisk/${name}/synchronize`
  });
};

export const getNfsDiskHostList = () => {
  return request({
    baseURL,
    url: '/nfsDisk/config/hosts'
  });
};

export const updateNfs = (data) => {
  return request({
    baseURL,
    url: 'nfs/',
    data,
    method: 'PUT'
  })
}

// Use to General
export const getUserNfs = username => {
  return request({
    baseURL,
    url: `/user/${username}/canUseNfsList?withInfo=true`
  });
};

export const updateNfsPrivilege = (name, data) => {
  return request({
    baseURL,
    url: `nfs/${name}/privilege`,
    data,
    method: 'PUT'
  })
}

export const createNfsFolder = (name, path, folder) => {
  return request({
    url: `/nfs/${name}/file${path}${folder}`,
    method: 'PUT'
  });
};

export const uploadNfsFile = (name, path, data, onUploadProgress) => {
  return request({
    url: `/nfs/${name}/file${path}`,
    method: 'POST',
    data,
    onUploadProgress
  });
};

export const downloadNfsFile = (name, path) => {
  return request({
    url: `/nfs/${name}/file${path}?download=true`,
    responseType: 'blob'
  });
};

export const copyNfsFile = (name, path, data) => {
  return request({
    url: `/nfs/${name}/file${path}?cp=true`,
    method: 'POST',
    data
  });
};

export const moveNfsFile = (name, path, data) => {
  return request({
    url: `/nfs/${name}/file${path}?mv=true`,
    method: 'POST',
    data
  });
};

export const unZipNfsFile = (name, path) => {
  return request({
    url: `/nfs/${name}/file${path}?unzip=true`,
    method: 'POST'
  });
};

export const getNfsFilePath = (name, path) => {
  return request({
    url: `/nfs/${name}/file/${path}`
  });
};

export const deleteNfs = data => {
  return request({
    baseURL,
    url: '/nfs/',
    method: 'DELETE',
    data
  });
};

export const deleteNfsFile = (name, path) => {
  return request({
    url: `/nfs/${name}/file${path}`,
    method: 'DELETE'
  });
};

export const createNfs = data => {
  return request({
    baseURL,
    url: '/nfs/',
    method: 'POST',
    data
  });
};

// Use to User Manage edit modal
export const getNfsList = () => {
  return request({
    baseURL,
    url: '/nfs/'
  });
};




export const getNfsDiskInfo = name => {
  return request({
    url: `/nfs-disk/${name}/info`
  });
};

export const getNfsInfo = name => {
  return request({
    baseURL,
    url: `/nfs/${name}/info`
  });
};

// export const getNfsUser = name => {
//   return request({
//     url: `nfs/${name}/users`
//   });
// };

// export const setNfsUser = (name, data) => {
//   return request({
//     url: `nfs/${name}/users`,
//     method: 'POST',
//     data
//   });
// };
