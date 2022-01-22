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
    if (field === 'IP') {
      comparator = descending
        ? (a, b) => String(b.ip).localeCompare(a.ip)
        : (a, b) => String(a.ip).localeCompare(b.ip);
    } else if (field === 'license') {
      comparator = descending
        ? (a, b) => String(b.keyId).localeCompare(a.keyId)
        : (a, b) => String(a.keyId).localeCompare(b.keyId);
    } else if (field === 'expiryDate') {
      comparator = descending
        ? (a, b) => parseInt(b.licenseDate) - parseInt(a.licenseDate)
        : (a, b) => parseInt(a.licenseDate) - parseInt(b.licenseDate);
    } else if (field === 'gpuCount') {
      comparator = descending 
        ? (a, b) => b.gpuCount - a.gpuCount
        : (a, b) => a.gpuCount - b.gpuCount
    } else if (field === 'gpuLimit') {
      comparator = descending 
        ? (a, b) => b.gpuLimit - a.gpuLimit
        : (a, b) => a.gpuLimit - b.gpuLimit
    }
    return list.slice().sort(comparator);
  }
}
