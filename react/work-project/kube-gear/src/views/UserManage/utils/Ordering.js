// import {getModified, getDuration, getStatusIndex} from './utils';

export default class Ordering {
  /**
   * @param {"username" | "roles" | "virtualGroups" | "jobLifeHour"  | "state" | undefined} field
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
    if (field === 'username') {
      comparator = descending
        ? (a, b) => String(b.username).localeCompare(a.username)
        : (a, b) => String(a.username).localeCompare(b.username);
    } else if (field === 'roles') {
      comparator = descending
        ? (a, b) => String(b.roles).localeCompare(a.roles)
        : (a, b) => String(a.roles).localeCompare(b.roles);
    } else if (field === 'virtualGroups') {
      comparator = descending
        ? (a, b) => String(b.virtualGroups).localeCompare(a.virtualGroups)
        : (a, b) => String(a.virtualGroups).localeCompare(b.virtualGroups);
    } else if (field === 'jobLifeHour') {
      comparator = (a, b) => {
        let { jobLifeHour: jobLifeHourA } = a;
        let { jobLifeHour: jobLifeHourB } = b;
        jobLifeHourA = jobLifeHourA ? parseInt(jobLifeHourA) : 0;
        jobLifeHourB = jobLifeHourB ? parseInt(jobLifeHourB) : 0;
        return descending ? jobLifeHourA - jobLifeHourB : jobLifeHourB - jobLifeHourA
      }
    } else if (field === 'state') {
      comparator = descending
        ? (a, b) => String(b.state).localeCompare(a.state)
        : (a, b) => String(a.state).localeCompare(b.state);
    }
    return userInfos.slice().sort(comparator);
  }
}
