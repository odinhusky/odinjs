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
    if (field === 'taskroleName') {
      comparator = descending
        ? (a, b) => String(b.taskroleName).localeCompare(a.taskroleName)
        : (a, b) => String(a.taskroleName).localeCompare(b.taskroleName);
    } else if (field === 'taskIndex') {
      comparator = descending
        ? (a, b) => b.taskIndex - a.taskIndex
        : (a, b) => a.taskIndex - b.taskIndex
    } else if (field === 'type') {
      comparator = descending
        ? (a, b) => String(b.virtualCluster).localeCompare(a.virtualCluster)
        : (a, b) => String(a.virtualCluster).localeCompare(b.virtualCluster);
    }
    return jobs.slice().sort(comparator);
  }
}
