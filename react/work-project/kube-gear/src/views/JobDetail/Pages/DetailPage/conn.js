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
// import { get, isNil } from 'lodash';
import qs from 'querystring';

// import { isJobV2 } from './utils';
import { getJobInfo, getJobConfig, getJobSSH, stopJob as stopJobReq } from 'utils/api';

const params = new URLSearchParams(window.location.search);
const namespace = params.get('username');
const jobName = params.get('jobName');

export class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotFoundError';
  }
}

export async function fetchJobInfo() {
  const res = await getJobInfo(namespace, jobName);
  if (res) {
    return res;
  } else {
    throw new Error(res.message);
  }
}

export async function fetchJobConfig() {
  const res = await getJobConfig(namespace, jobName);
  if (res) {
    return res;
  } else {
    throw new Error(res.message);
  }
}

export async function fetchSshInfo() {
  const res = await getJobSSH(namespace, jobName);
  if (res)
    return res;
  else
    throw new Error(res.message);
}

export function getJobMetricsUrl(jobName) {
  return `${window.ENV.grafanaUri}/dashboard/db/gong-zuo-ceng-gai-shu?var-job=${namespace ? `${namespace}~${jobName}` : jobName}`;
}

export function cloneJob() {
  const query = {
    op: 'resubmit',
    type: 'job',
    user: namespace,
    jobname: jobName
  };

  // plugin
  // const pluginId = get(jobConfig, 'extras.submitFrom');
  // if (!isNil(pluginId)) {
  //   const plugins = config.PAI_PLUGINS;
  //   const pluginIndex = plugins.findIndex(x => x.id === pluginId);
  //   if (pluginIndex === -1) {
  //     alert(
  //       `Clone job failed. The job was submitted by ${pluginId}, but it is not installed.`
  //     );
  //   }
  //   window.open(`/plugin.html?${qs.stringify({
  //     ...query,
  //     index: pluginIndex
  //   })}`, '_blank')
  //   return;
  // }

  // // job v2
  // if (isJobV2(jobConfig)) {
  //   window.location.href = `/submit-v2.html?${qs.stringify(query)}`;
  // } else {
  //   window.location.href = `/submit.html?${qs.stringify(query)}`;
  // }

  window.open(`/job-submit?${qs.stringify(query)}`, '_blank');
}

export async function stopJob() {
  const flag = confirm(`Are you sure to stop ${jobName}?`);
  if (flag) {
    const res = await stopJobReq(namespace, jobName);
    if (res)
      return res;
    else
      throw new Error(res.message);
  }
}

export async function getContainerLog(logUrl) {
  const ret = {
    fullLogLink: logUrl,
    text: null
  };

  const res = await fetch(logUrl);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const content = doc.getElementsByClassName('content')[0];
    const pre = content.getElementsByTagName('pre')[0];
    ret.text = pre.innerText;
    // // fetch full log link
    // if (pre.previousElementSibling) {
    //   const link = pre.previousElementSibling.getElementsByTagName('a');
    //   if (link.length === 1) {
    //     ret.fullLogLink = link[0].href;
    //   }
    // }
    return ret;
  } catch (e) {
    throw new Error('Log not available');
  }
}

export function openJobAttemptsPage(retryCount) {
  const search = namespace ? namespace + '~' + jobName : jobName;
  const jobSessionTemplate = JSON.stringify({
    iCreate: 1,
    iStart: 0,
    iEnd: retryCount + 1,
    iLength: 20,
    aaSorting: [[0, 'desc', 1]],
    oSearch: {
      bCaseInsensitive: true,
      sSearch: search,
      bRegex: false,
      bSmart: true
    },
    abVisCols: []
  });
  sessionStorage.setItem('apps', jobSessionTemplate);
  // window.open(window.ENV.yarnWebPortalUri);
}
