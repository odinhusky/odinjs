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
    } else if (field === 'group') {
      comparator = descending
        ? (a, b) => String(b.group).localeCompare(a.group)
        : (a, b) => String(a.group).localeCompare(b.group);
    } else if (field === 'isLeader') {
      comparator = descending
        ? (a, b) => String(b.isLeader).localeCompare(a.isLeader)
        : (a, b) => String(a.isLeader).localeCompare(b.isLeader);
    } else if (field === 'email') {
      comparator = descending
        ? (a, b) => String(b.email).localeCompare(a.email)
        : (a, b) => String(a.email).localeCompare(b.email);
    } else if (field === 'phone') {
      comparator = descending
        ? (a, b) => String(b.phone).localeCompare(a.phone)
        : (a, b) => String(a.phone).localeCompare(b.phone);
    }
    return list.slice().sort(comparator);
  }
}
