// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// import { get, map } from 'lodash';
import {
  submitJob as sunmitJobReq,
  getJobConfig,
  getUsersVgInfo,
  // getUserNfs,
  getHaborRepoInfo,
  getHaborRepoTags
} from 'utils/api';

export class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotFoundError';
  }
}

export async function submitJob(jobProtocol) {
  return await sunmitJobReq(null, jobProtocol);
}

export async function submitJobV12(user, jobJson) {
  return await sunmitJobReq(user, jobJson);
}

export async function fetchJobConfigV12(userName, jobName) {
  const res = await getJobConfig(userName, jobName);
  if (res) {
    return res;
  } else {
    throw new Error(res.data.message);
  }
}

export async function listUserVirtualClusters(user) {
  return await getUsersVgInfo(user);
}

// export async function listUserNfsNames(user) {
//   const userNfsInfo = await getUserNfs(user);
//   return map(userNfsInfo, info => get(info, 'name'));
// }

export async function getHarborRepositoriesInfo() {
  const repositoriesInfo = await getHaborRepoInfo();
  return repositoriesInfo;
}

export async function getHarborRepositoriyTags(repository) {
  const repositoryTags = await getHaborRepoTags(repository, false);
  return repositoryTags;
}

export async function fetchUserGroup(api, user, token) {
  const userInfoUrl = `${api}/api/v2/user/${user}`;

  return fetch(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    if (response.ok) {
      return response.json().then(responseData => {
        return responseData.grouplist;
      });
    } else {
      throw Error(`fetch ${userInfoUrl}: HTTP ${response.status}`);
    }
  });
}

export async function fetchStorageConfigData(api) {
  const storageConfigUrl = `${api}/api/v1/kubernetes/api/v1/namespaces/pai-storage/secrets/storage-config`;
  return fetch(storageConfigUrl).then(response => {
    if (response.ok) {
      return response.json().then(responseData => responseData.data);
    } else {
      throw Error(`fetch ${storageConfigUrl}: HTTP ${response.status}`);
    }
  });
}

export async function fetchStorageServer(api) {
  const storageServerUrl = `${api}/api/v1/kubernetes/api/v1/namespaces/pai-storage/secrets/storage-server`;
  return fetch(storageServerUrl).then(response => {
    if (response.ok) {
      return response.json().then(responseData => responseData.data);
    } else {
      throw Error(`fetch ${storageServerUrl}: HTTP ${response.status}`);
    }
  });
}
