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
    } else if (field === 'share') {
      comparator = descending
        ? (a, b) => String(b.isPublic).localeCompare(a.isPublic)
        : (a, b) => String(a.isPublic).localeCompare(b.isPublic);
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    } else if (field === 'used') {
      comparator = descending
        ? (a, b) => b.used - a.used
        : (a, b) => a.used - b.used;
    } else if (field === 'allocated') {
      comparator = descending
        ? (a, b) => b.available - a.available
        : (a, b) => a.available - b.available;
    }
    return list.slice().sort(comparator);
  }
}
