import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getHuborHost = () => {
  return request({
    url: '/harbor/host'
  });
};

export const getHuborStatistics = () => {
  return request({
    url: '/harbor/page/statistics'
  });
};

export const getProjectList = params => {
  return request({
    url: '/harbor/page/projects',
    params
  });
};

export const getHarborConfiguration = () => {
  return request({
    url: '/harbor/page/configurations'
  });
};

export const getHarborQuotas = () => {
  return request({
    url: '/harbor/page/quotas'
  });
};

// data: { projectName, isPublic }
export const createProject = data => {
  return request({
    url: '/harbor/page/projects',
    method: 'POST',
    data
  });
};

// data: { projectName, isPublic }
export const updateProject = (projectId, isPublic) => {
  return request({
    url: `/harbor/page/projects/${projectId}`,
    method: 'PUT',
    data: { isPublic }
  });
};

export const updateProjectQuota = (quotaId, hard) => {
  return request({
    url: `/harbor/page/quotas/${quotaId}`,
    method: 'PUT',
    data: { hard }
  });
};

export const updateDefaultQuota = (data) => {
  return request({
    url: '/harbor/page/configurations',
    method: 'PUT',
    data
  });
};

// params: { projectId, page, page_size }
export const getRepoList = params => {
  return request({
    url: '/harbor/page/repositories',
    params
  });
};

export const getReposTags = name => {
  return request({
    url: `/harbor/page/repositories/${encodeURIComponent(name)}/tags`
  });
};

export const deleteReposTag = (repoName, tagName) => {
  return request({
    url: `/harbor/page/repositories/${encodeURIComponent(repoName)}/tags/${encodeURIComponent(tagName)}`,
    method: 'DELETE'
  });
};

export const getProjectMember = id => {
  return request({
    url: `harbor/page/projects/${id}/members`
  });
};

export const addProjectMember = (projectId, username, roleId) => {
  return request({
    url: `harbor/page/projects/${projectId}/members`,
    method: 'POST',
    data: {
      username,
      roleId
    }
  });
};

export const updateProjectMember = (projectId, userId, roleId) => {
  return request({
    url: `harbor/page/projects/${projectId}/members/${userId}`,
    method: 'PUT',
    data: {
      roleId
    }
  });
};

export const deleteProjectMember = (projectId, userId) => {
  return request({
    url: `harbor/page/projects/${projectId}/members/${userId}`,
    method: 'DELETE'
  });
};

export const getHaborRepoInfo = () => {
  return request({
    url: 'harbor/repositories'
  });
};

export const getHaborRepoTags = (name, withFullName = true) => {
  return request({
    url: `harbor/repositories/${encodeURIComponent(name)}/tags`,
    params: {
      withFullName: withFullName ? true : undefined
    }
  });
};

export const uploadHarborImage = data => {
  return request({
    url: 'harbor/images',
    method: 'POST',
    data
  });
};

export const getHarborVolumeInfo = () => {
  return request({
    url: '/harbor/page/systeminfo/volumes'
  });
};

export const deleteHarborProject = (id) => {
  return request({
    url: `/harbor/page/projects/${id}`,
    method: 'DELETE'
  })
}

export const deleteProjectRepositories = (repository) => {
  return request({
    url: `/harbor/page/repositories/${repository}`,
    method: 'DELETE'
  });
};

export const saveTagToNFS = (data) => {
  return request({
    baseURL,
    url: '/harbor/saveToNfs',
    method: 'POST',
    data
  })
}

export const saveTagToGlusterfs = (data) => {
  return request({
    baseURL,
    url: '/harbor/saveToGlusterfs',
    method: 'POST',
    data
  })
}

export const saveTagToXdfs = (data) => {
  return request({
    baseURL,
    url: '/harbor/saveToXdfs',
    method: 'POST',
    data
  })
}

export const uploadFromNfs = (data) => {
  return request({
    baseURL,
    url: '/harbor/loadFromNfs',
    method: 'POST',
    data
  })
}

export const uploadFromGlusterfs = (data) => {
  return request({
    baseURL,
    url: '/harbor/loadFromGlusterfs',
    method: 'POST',
    data
  })
}

export const uploadFromXdfs = (data) => {
  return request({
    baseURL,
    url: '/harbor/loadFromXdfs',
    method: 'POST',
    data
  })
}
