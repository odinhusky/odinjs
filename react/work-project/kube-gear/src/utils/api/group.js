import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getGroupData = name => {
  return request({
    baseURL,
    url: `/group/${name ? name : ''}`
  })
}

export const getGroupLeaders = name => {
  return request({
    baseURL,
    url: `/group/${name}/leaders/`
  })
}

export const createGroup = data => {
  return request({
    baseURL,
    url: '/group/',
    data,
    method: 'POST'
  })
}

export const updateGroup = (data, name) => {
  return request({
    baseURL,
    url: `/group/${name ? name : data.name}`,
    data,
    method: 'PUT'
  })
}

export const deleteGroup = name => {
  return request({
    baseURL,
    url: `/group/${name}`,
    method: 'DELETE'
  })
}

export const getGroupMembers = name => {
  return request({
    baseURL,
    url: `/group/${name}/users/`
  })
}

export const getGroupApplyList = params => {
  return request({
    baseURL,
    url: '/groupApply/',
    params
  })
}

export const inviteGroupMember = data => {
  return request({
    baseURL,
    url: '/groupApply/invite',
    data,
    method: 'POST'
  })
}

export const unbindResourceFromGroup = (group, resource) => {
  return request({
    baseURL,
    url: `/resource/${resource}/group/${group}`,
    method: 'DELETE'
  })
}

export const getGroupNameList = () => {
  return request({
    baseURL,
    url: '/group/'
  })
}

export const applyGroup = data => {
  return request({
    baseURL,
    url: '/groupApply/apply',
    data,
    method: 'POST'
  })
}

export const updateMembersVirtualGroup = ({ groupName, userName, data }) => {
  return request({
    baseURL,
    url: `/group/${groupName}/users/${userName}/virtualGroups`,
    data,
    method: 'PUT'
  })
}

export const deleteMembersVirtualGroup = ({ groupName, userName, data }) => {
  return request({
    baseURL,
    url: `/group/${groupName}/users/${userName}/virtualGroups`,
    data,
    method: 'DELETE'
  })
}

export const getGroupUserLimitResource = (groupName, userName) => {
  return request({
    baseURL,
    url: `/group/${groupName}/users/${userName}/virtualGroupUserLimitResource`
  })
}

export const getGroupVirtualGroup = (groupName) => {
  return request({
    baseURL,
    url: `group/${groupName}/resources/virtualGroups/`
  })
}
