// import { getModified, getDuration, getStatusIndex } from './index';

export default class Ordering {
  /**
   * @param {"name" | "modified" | "user" | "duration" | "virtualCluster" | "retries" | "status" | "taskCount" | "gpuCount" | undefined} field
   * @param {boolean | undefined} descending
   */
  constructor(field, descending = false) {
    this.field = field;
    this.descending = descending;
  }

  apply(jobs) {
    const { field, descending } = this;
    let comparator;
    if (field == null) {
      return jobs;
    }
    if (field === 'name') {
      comparator = descending
        ? (a, b) => String(b.name).localeCompare(a.name)
        : (a, b) => String(a.name).localeCompare(b.name);
    }  else if (field === 'user') {
      comparator = descending
        ? (a, b) => String(b.username).localeCompare(a.username)
        : (a, b) => String(a.username).localeCompare(b.username);
    }  else if (field === 'virtualCluster') {
      comparator = descending
        ? (a, b) => String(b.virtualCluster).localeCompare(a.virtualCluster)
        : (a, b) => String(a.virtualCluster).localeCompare(b.virtualCluster);
    } else if (field === 'retries') {
      comparator = descending
        ? (a, b) => b.retries - a.retries
        : (a, b) => a.retries - b.retries;
    }  else if (field === 'taskCount') {
      comparator = descending
        ? (a, b) => b.totalTaskNumber - a.totalTaskNumber
        : (a, b) => a.totalTaskNumber - b.totalTaskNumber;
    } else if (field === 'gpuCount') {
      comparator = descending
        ? (a, b) => b.totalGpuNumber - a.totalGpuNumber
        : (a, b) => a.totalGpuNumber - b.totalGpuNumber;
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    }
    return jobs.slice().sort(comparator);
  }
}
