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
    } else if (field === 'nfsDisk') {
      comparator = descending
        ? (a, b) => String(b.nfsDisk).localeCompare(a.nfsDisk)
        : (a, b) => String(a.nfsDisk).localeCompare(b.nfsDisk);
    } else if (field === 'host') {
      comparator = descending
        ? (a, b) => String(b.host).localeCompare(a.host)
        : (a, b) => String(a.host).localeCompare(b.host);
    } else if (field === 'path') {
      comparator = descending
        ? (a, b) => String(b.path).localeCompare(a.path)
        : (a, b) => String(a.path).localeCompare(b.path);
    } else if (field === 'used') {
      comparator = descending
        ? (a, b) => b.used - a.used
        : (a, b) => a.used - b.used;
    } else if (field === 'available') {
      comparator = descending
        ? (a, b) => b.available - a.available
        : (a, b) => a.available - b.available;
    } else if (field === 'available2') {
      comparator = (a, b) => {
        return descending ? b.available - a.available : a.available - b.available
      }
    } else if (field === 'request') {
      comparator = descending
        ? (a, b) => b.request - a.request
        : (a, b) => a.request - b.request;
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    }
    return list.slice().sort(comparator);
  }
}
