export default class Ordering {
  constructor(field, descending = false) {
    this.field = field;
    this.descending = descending;
  }

  apply(list) {
    const { field, descending } = this;
    let comparator;
    if (field == null) {
      return list;
    }
    if (field === 'name') {
      comparator = descending
        ? (a, b) => String(b.name).localeCompare(a.name)
        : (a, b) => String(a.name).localeCompare(b.name);
    } else if (field === 'memoryUsed') {
      comparator = descending
        ? (a, b) => b.usedResource.memoryUsed - a.usedResource.memoryUsed
        : (a, b) => a.usedResource.memoryUsed - b.usedResource.memoryUsed
    } else if (field === 'memoryTotal') {
      comparator = descending
        ? (a, b) => b.totalResource.memory - a.totalResource.memory
        : (a, b) => a.totalResource.memory - b.totalResource.memory
    } else if (field === 'cpuUsed') {
      comparator = descending
        ? (a, b) => b.usedResource.cpuUsed - a.usedResource.cpuUsed
        : (a, b) => a.usedResource.cpuUsed - b.usedResource.cpuUsed
    } else if (field === 'cpuTotal') {
      comparator = descending
        ? (a, b) => b.totalResource.cpu - a.totalResource.cpu
        : (a, b) => a.totalResource.cpu - b.totalResource.cpu
    } else if (field === 'gpuTotal') {
      comparator = descending
        ? (a, b) => b.totalResource.gpu - a.totalResource.gpu
        : (a, b) => a.totalResource.gpu - b.totalResource.gpu
    } else if (field === 'gpuUsed') {
      comparator = descending
        ? (a, b) => b.usedResource.gpuUsed - a.usedResource.gpuUsed
        : (a, b) => a.usedResource.gpuUsed - b.usedResource.gpuUsed
    } else if (field === 'activeJobs') {
      comparator = descending
        ? (a, b) => b.activeJobs - a.activeJobs
        : (a, b) => a.activeJobs - b.activeJobs
    } else if (field === 'schedulable') {
      comparator = descending
        ? (a, b) => String(b.schedulable).localeCompare(a.schedulable)
        : (a, b) => String(a.schedulable).localeCompare(b.schedulable)
    } else if (field === 'resource') {
      comparator = descending
        ? (a, b) => String(b.resource).localeCompare(a.resource)
        : (a, b) => String(a.resource).localeCompare(b.resource);
    }
    return list.slice().sort(comparator);
  }
}
