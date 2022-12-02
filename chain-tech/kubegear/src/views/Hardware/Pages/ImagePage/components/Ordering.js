// import {getModified, getDuration, getStatusIndex} from './utils';

export default class Ordering {
  /**
   * @param {"name" | "tag" | "usedContainers" | "id"  | "size" | "created" | undefined} field
   * @param {boolean | undefined} descending
   */
  constructor(field, descending = false) {
    this.field = field;
    this.descending = descending;
  }

  apply(userInfos) {
    const { field, descending } = this;

    let comparator;
    if (field == null) {
      return userInfos;
    }

    if (field === 'name') {
      comparator = descending
        ? (a, b) => String(b.name).localeCompare(a.name)
        : (a, b) => String(a.name).localeCompare(b.name);
    } else if (field === 'tag') {
      comparator = descending
        ? (a, b) => String(b.tag).localeCompare(a.tag)
        : (a, b) => String(a.tag).localeCompare(b.tag);
    } else if (field === 'usedContainers') {
      comparator = descending
        ? (a, b) => String(b.usedContainers).localeCompare(a.usedContainers)
        : (a, b) => String(a.usedContainers).localeCompare(b.usedContainers);
    } else if (field === 'id') {
      comparator = descending
        ? (a, b) => String(b.id).localeCompare(a.id)
        : (a, b) => String(a.id).localeCompare(b.id);
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    } else if (field === 'created') {
      comparator = descending
        ? (a, b) => b.created - a.created
        : (a, b) => a.created - b.created;
    }

    return userInfos.slice().sort(comparator);
  }
}
