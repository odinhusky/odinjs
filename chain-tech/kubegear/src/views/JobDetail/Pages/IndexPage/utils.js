/**
 * @returns {Date}
 */
export function getModified(job) {
  if (!('_modified' in job)) {
    job._modified = new Date(job.completedTime || job.createdTime);
  }
  return job._modified;
}

/**
 * @returns {number}
 */
export function getDuration(job) {
  if (!('_duration' in job)) {
    job._duration = (job.completedTime || Date.now()) - job.createdTime;
  }
  return job._duration;
}

export function convertDurationString(duration) {
  const day = duration.days();
  const hour = duration.hours();
  const minute = duration.minutes();
  const second = duration.seconds();

  return `${day !== 0 ? `${day}d ` : ''}${hour !== 0 ? `${hour}h ` : ''}${minute !== 0 ? `${minute}m ` : ''}${second !== 0 ? `${second}s ` : ''}`
}

function generateStatus(job) {
  if (job.state === 'WAITING') {
    if (job.executionType === 'START') {
      job._statusText = 'Waiting';
      job._statusIndex = 0;
    } else {
      job._statusText = 'Stopping';
      job._statusIndex = 2;
    }
  } else if (job.state === 'RUNNING') {
    if (job.executionType === 'START') {
      job._statusText = 'Running';
      job._statusIndex = 1;
    } else {
      job._statusText = 'Stopping';
      job._statusIndex = 2;
    }
  } else if (job.state === 'SUCCEEDED') {
    job._statusText = 'Succeeded';
    job._statusIndex = 3;
  } else if (job.state === 'FAILED') {
    job._statusText = 'Failed';
    job._statusIndex = 4;
  } else if (job.state === 'STOPPED') {
    job._statusText = 'Stopped';
    job._statusIndex = 5;
  } else {
    job._statusText = 'Unknown';
    job._statusIndex = -1;
  }
}

/**
 * @returns {string}
 */
export function getStatusText(job) {
  if (!('_statusText' in job)) {
    generateStatus(job);
  }
  return job._statusText;
}

/**
 * @returns {number}
 */
export function getStatusIndex(job) {
  if (!('_statusIndex' in job)) {
    generateStatus(job);
  }
  return job._statusIndex;
}
