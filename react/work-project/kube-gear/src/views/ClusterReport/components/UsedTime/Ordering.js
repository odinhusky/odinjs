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
        ? (a, b) => String(b.username).localeCompare(a.username)
        : (a, b) => String(a.username).localeCompare(b.username);
    } else if (field === 'cpu') {
      comparator = descending
        ? (a, b) => b.resourceUsedTime.cpu - a.resourceUsedTime.cpu
        : (a, b) => a.resourceUsedTime.cpu - b.resourceUsedTime.cpu
    } else if (field === 'memory') {
      comparator = descending
        ? (a, b) => b.resourceUsedTime.memory - a.resourceUsedTime.memory
        : (a, b) => a.resourceUsedTime.memory - b.resourceUsedTime.memory
    } else if (field === 'storage') {
      comparator = descending
        ? (a, b) => b.resourceUsedTime.storage - a.resourceUsedTime.storage
        : (a, b) => a.resourceUsedTime.storage - b.resourceUsedTime.storage
    } else if (field === 'jobCount') {
      comparator = descending
        ? (a, b) => b.resourceUsedTime.jobCount - a.resourceUsedTime.jobCount
        : (a, b) => a.resourceUsedTime.jobCount - b.resourceUsedTime.jobCount
    } else if (field === 'jobTime') {
      comparator = descending
        ? (a, b) => b.resourceUsedTime.jobTime - a.resourceUsedTime.jobTime
        : (a, b) => a.resourceUsedTime.jobTime - b.resourceUsedTime.jobTime
    } else if (field === 'gpu') {
      const computeValue = obj => {
        return Object.values(obj).reduce((acc, curr) => acc += curr, 0)
      }
      comparator = descending
        ? (a, b) => computeValue(b.resourceUsedTime.gpu) - computeValue(a.resourceUsedTime.gpu)
        : (a, b) => computeValue(a.resourceUsedTime.gpu) - computeValue(b.resourceUsedTime.gpu)
    }
    return list.slice().sort(comparator);
  }
}
