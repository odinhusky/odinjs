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
    } else if (field === 'roles') {
      comparator = descending
        ? (a, b) => String(b.privileges.join('')).localeCompare(a.privileges.join(''))
        : (a, b) => String(a.privileges.join('')).localeCompare(b.privileges.join(''));
    }
    return list.slice().sort(comparator);
  }
}
