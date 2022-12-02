export default class Ordering {
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
    } else if (field === 'nfsDisk') {
      comparator = descending
        ? (a, b) => String(b.nfsDisk).localeCompare(a.nfsDisk)
        : (a, b) => String(a.nfsDisk).localeCompare(b.nfsDisk);
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    } else if (field === 'available') {
      comparator = descending
        ? (a, b) => {
          const aSize = a.size - a.used;
          const bSize = b.size - b.used;
          return bSize - aSize
        }
        : (a, b) => {
          const aSize = a.size - a.used;
          const bSize = b.size - b.used;
          return aSize - bSize
        }
    } else if (field === 'available2') {
      comparator = descending
        ? (a, b) => b.available - a.available
        : (a, b) => a.available - b.available
    }
    return jobs.slice().sort(comparator);
  }
}
