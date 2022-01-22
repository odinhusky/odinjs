import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}`;

export const getVirtualGroup = () => {
  return request({
    url: '/virtual-groups'
  });
};

export const createVirtualGroup = data => {
  return request({
    url: '/virtual-groups',
    method: 'POST',
    data
  });
};

export const deleteVirtualGroup = vgname => {
  return request({
    url: '/virtual-groups',
    method: 'DELETE',
    data: {
      name: vgname
    }
  });
};

export const getResourceVirtualGroup = groupName => {
  return request({
    baseURL,
    url: `/api/resource/${groupName}/virtualGroups/`
  });
};

export const getVg = () => {
  return request({
    baseURL,
    method: 'GET',
    url: '/api/virtualGroup/'
  });
};

export const postResourceVirtualGroup = data => {
  return request({
    baseURL,
    method: 'POST',
    url: '/api/virtualGroup/',
    data
  });
};

export const putResourceVirtualGroup = (name, data) => {
  return request({
    baseURL,
    method: 'PUT',
    url: `/api/virtualGroup/${name}`,
    data
  });
};

export const deleteResourceVirtualGroup = (name) => {
  return request({
    baseURL,
    method: 'DELETE',
    url: `/api/virtualGroup/${name}`
  });
};

export const getHivedResourceUnit = () => {
  return request({
    baseURL,
    url: 'api/resource/hived/resourceUnit'
  })
}

export const getVgLimitResource = (vg) => {
  return request({
    baseURL,
    url: `api/virtualGroup/${vg}/userLimitResource`
  })
}

export const getVgUserLimitResource = (vg, username) => {
  return request({
    baseURL,
    url: `api/virtualGroup/${vg}/users/${username}/userLimitResource`
  })
}

export const putVgLimitResource = (vg, data) => {
  return request({
    baseURL,
    method: 'PUT',
    url: `api/virtualGroup/${vg}/userLimitResource`,
    data
  })
}

export const putVgResourceName = (data) => {
  return request({
    baseURL,
    method: 'PUT',
    url: 'api/resource/resourceCell/name',
    data
  })
}