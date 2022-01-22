import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;


export const getJobSchedule = params => {
  return request({
    baseURL,
    url: '/jobSchedule/',
    params
  });
};

export const createJobSchedule = data => {
  return request({
    baseURL,
    url: '/jobSchedule/',
    data,
    method: 'POST'
  });
};

export const updateJobSchedule = (id, data, deleteJobConfig = false ) => {
  return request({
    baseURL,
    url: `/jobSchedule/${id}?deleteJobConfig=${deleteJobConfig}`,
    data,
    method: 'PUT'
  });
};

export const deleteJobSchedule = id => {
  return request({
    baseURL,
    url: `/jobSchedule/${id}`,
    method: 'DELETE'
  });
};

export const acceptJobSchedule = id => {
  return request({
    baseURL,
    url: `/jobSchedule/${id}/accept`,
    method: 'PUT'
  })
}

export const denyJobSchedule = id => {
  return request({
    baseURL,
    url: `/jobSchedule/${id}/deny`,
    method: 'PUT'
  })
}

export const getJobScheduleTable = (virtualGroup, id = '') => {
  return request({
    baseURL,
    url: `/jobSchedule/virtualGroup/${virtualGroup}?updateId=${id}`
  });
};

export const getCanUseVirtualGroups = (username, withInfo = false) => {
  return request({
    baseURL,
    url: `user/${username}/canUseVirtualGroups?withInfo=${withInfo}`
  });
}

export const canManageVirtualGroups = username => {
  return request({
    baseURL,
    url: `user/${username}/canManageVirtualGroups`
  })
}

export const getRangeJobSchedule = (start, end) => {
  return request({
    url: `/jobSchedule/?startAt=${start}&endAt=${end}`,
    baseURL
  });
}
