import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getRole = () => {
  return request({
    baseURL,
    url: '/role/'
  });
};

export const createRole = data => {
  return request({
    baseURL,
    url: '/role/',
    method: 'POST',
    data
  });
};

export const deleteRole = data => {
  return request({
    baseURL,
    url: '/role/',
    method: 'DELETE',
    data
  });
};

export const updateRole = (id, data) => {
  return request({
    baseURL,
    url: `/role/${id}`,
    method: 'PUT',
    data
  });
};

export const getPrivilege = () => {
  return request({
    baseURL,
    url: '/privilege/'
  });
};

export const getUserList = () => {
  return request({
    url: '/user'
  });
};

export const createUser = data => {
  return request({
    baseURL,
    url: '/user/',
    method: 'POST',
    data
  });
};

export const deleteUser = name => {
  return request({
    baseURL,
    url: `/user/${name}`,
    method: 'DELETE'
  });
};

export const applyUser = data => {
  return request({
    url: '/auth/signup',
    method: 'POST',
    data
  });
};

// 審批用戶 拒絕用戶 修改用戶
export const updateUser = data => {
  return request({
    baseURL,
    url: '/user/',
    method: 'PUT',
    data
  });
};

// 更新集群用戶
export const assignVGs = data => {
  const { username, virtualGroups } = data;
  return request({
    url: `/user/${username}/virtualGroups`,
    method: 'PUT',
    data: {
      virtualGroups
    }
  });
};

export const updateGithubPAT = data => {
  const { username, githubPAT } = data;
  return request({
    url: `user/${username}/githubPAT`,
    method: 'PUT',
    data: {
      githubPAT
    }
  });
};

export const getCurrentUserInfo = (username) => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}/api`,
    url: `/user/${username}`
  });
};

export const getUsersVgInfo = username => {
  return request({
    baseURL,
    url: `/user/${username}/virtualGroups`
  });
};

export const createHaborUser = data => {
  return request({
    url: '/harbor/user',
    method: 'POST',
    data
  });
};

export const userLogin = data => {
  return request({
    url: '/authn/basic/login',
    method: 'POST',
    data
  }, false);
};

export const userSignUp = data => {
  return request({
    baseURL,
    url: '/auth/signup',
    method: 'POST',
    data
  }, false);
};

export const changeUsersPassword = ({ name, data }) => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}/api`,
    url: `/user/${name}/changePassword`,
    method: 'PUT',
    data
  });
}

export const sendChangePasswordEmail = data => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: '/api/auth/sendChangePasswordEmail',
    method: 'POST',
    data
  }, false)
}

export const checkChangePasswordToken = params => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: `/api/auth/checkChangePasswordToken?token=${params}`,
    method: 'GET'
  }, false)
}

export const changeUserPasswordByToken = data => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: '/api/auth/changeUserPassword',
    method: 'POST',
    data
  }, false)
}

export const deleteUserLimitResource = name => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}/api`,
    url: `/user/${name}/limitResource`,
    method: 'DELETE'
  });
}

export const getUserLimitResource = username => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: `api/user/${username}/limitResource`,
    method: 'GET'
  })
}

export const getSSHPrivateKey = (username) => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: `/api/user/${username ? username : 'admin'}/sshRsaKey/private`,
    method: 'GET'
  })
}

export const getJumpServerKey = () => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: '/api/sshRsaKey/jumpServerPrivateKey',
    method: 'GET'
  })
}

export const getUserUsedResource = params => {
  return request({
    baseURL,
    url: 'user/job/resourceUsedTime',
    params
  })
}

export const getUserAllLimitedVgResource = username => {
  return request({
    baseURL,
    url: `/user/${username}/userLimitResource`
  })
}

export const getAllowRegister = () => {
  return request({
    baseURL,
    url: '/auth/allowRegister',
    method: 'GET'
  }, false)
}

export const getOnlineUser = () => {
  return request({
    baseURL,
    url: '/user/statistics/count',
    method: 'GET'
  }, false)
}

export const deleteToken = (token) => {
  return request({
    baseURL,
    url: `/token/${token}`,
    method: 'DELETE'
  })
}
