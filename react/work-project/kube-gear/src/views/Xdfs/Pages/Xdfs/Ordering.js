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
    } else if (field === 'source') {
      comparator = descending
        ? (a, b) => String(b.source).localeCompare(a.source)
        : (a, b) => String(a.source).localeCompare(b.source);
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    } else if (field === 'used') {
      comparator = descending
        ? (a, b) => b.used - a.used
        : (a, b) => a.used - b.used;
    } else if (field === 'allocatable') {
      comparator = descending
        ? (a, b) => b.available - a.available
        : (a, b) => a.available - b.available;
    } else if (field === 'allocated') {
      comparator = descending
        ? (a, b) => b.request - a.request
        : (a, b) => a.request - b.request;
    }
    return list.slice().sort(comparator);
  }
}
