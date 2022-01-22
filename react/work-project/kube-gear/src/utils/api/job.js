import request from './request';

const javaRestServerUri = `${window.ENV.javaRestServerUri}/api`;
// const pylonUri  = window.ENV.pylonUri;

export const getJobList = () => {
  return request({
    url: '/jobs'
  });
};

export const stopJob = (userName, jobName) => {
  return request({
    url: `/jobs/${userName}~${jobName}/executionType`,
    method: 'PUT',
    data: { value: 'STOP' }
  });
};

export const deleteJob = (userName, jobName) => {
  return request({
    url: `/user/${userName}/jobs/${jobName}`,
    method: 'DELETE'
  });
};

export const deleteJobHide = (userName, jobName) => {
  return request({
    url: `/jobs/${userName}~${jobName}`,
    method: 'DELETE'
  })
}

export const getJobInfo = (userName, jobName) => {
  return request({
    url: userName ? `/jobs/${userName}~${jobName}` : `/jobs/${jobName}`
  });
};

export const getJobConfig = (userName, jobName) => {
  return request({
    url: userName ? `/jobs/${userName}~${jobName}/config` : `/jobs/${jobName}/config`
  });
};

export const getJobSSH = (userName, jobName) => {
  return request({
    url: userName ? `/jobs/${userName}~${jobName}/ssh` : `/jobs/${jobName}/ssh`
  });
};

export const getJobInfoEvent = (userName, jobName) => {
  return request({
    url: userName ? `/jobs/${userName}~${jobName}/events` : `/jobs/${jobName}`
  })
}

export const submitJob = (user, data) => {
  const option = user ?
    {
      url: '/jobs',
      method: 'POST',
      data
    }
    :
    {
      baseURL: `${window.ENV.restServerUri}/api/v2/`,
      url: '/jobs',
      method: 'POST',
      data
    };
  const yaml = true
  return request(option, true, yaml);
};

export const getContainerLogUrlBeforeShow = (url) => {
  return request({
    baseURL: `${window.ENV.restServerUri}/`,
    url
  })
}

// ! paramerter here is uri from getContainerLogUrlBeforeShow
export const getContainerLog = (uri) => {
  return request({
    baseURL: `${window.ENV.restServerUri}/`,
    url: uri
  })
}

export const setJobLifeHour = (data) => {
  return request({
    baseURL: javaRestServerUri,
    method: 'PUT',
    url: '/jobLifeHour/',
    data
  });
}

export const getJobLifeHour = () => {
  return request({
    baseURL: javaRestServerUri,
    url: '/jobLifeHour/'
  })
}

export const createRepo = (data) => {
  return request({
    method: 'POST',
    url: '/harbor/images',
    data
  });
}

export const createJobTemplate = (data) => {
  return request({
    method: 'POST',
    url: '/jobTemplate/',
    baseURL: javaRestServerUri,
    data
  });
}

export const putJobTemplate = ({ id, data }) => {
  return request({
    method: 'PUT',
    url: `/jobTemplate/${id}/`,
    baseURL: javaRestServerUri,
    data
  });
}

export const putJobTemplateJobConfig = ({ id, data }) => {
  return request({
    method: 'PUT',
    url: `/jobTemplate/${id}/jobConfig`,
    baseURL: javaRestServerUri,
    data
  });
}

export const getNodeAvailableResource = () => {
  return request({
    url: '/node/resource',
    baseURL: javaRestServerUri
  });
}
