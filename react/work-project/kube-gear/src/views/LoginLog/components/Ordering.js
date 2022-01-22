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
    if (field === 'username') {
      comparator = descending
        ? (a, b) => String(b.username).localeCompare(a.username)
        : (a, b) => String(a.username).localeCompare(b.username);
    } else if (field === 'clientIp') {
      comparator = descending
        ? (a, b) => String(b.clientIp).localeCompare(a.clientIp)
        : (a, b) => String(a.clientIp).localeCompare(b.clientIp);
    } else if (field === 'createdDate') {
      comparator = descending
        ? (a, b) => b.createdDate - a.createdDate
        : (a, b) => a.createdDate - b.createdDate
    }
    return list.slice().sort(comparator);
  }
}
