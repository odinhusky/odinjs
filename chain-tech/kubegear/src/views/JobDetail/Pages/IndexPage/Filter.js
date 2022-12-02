import { getStatusText } from './utils';

const LOCAL_STORAGE_KEY = 'pai-job-filter';

class Filter {
  /**
   * @param {Set<string>?} users
   * @param {Set<string>?} virtualGroups
   * @param {Set<string>?} statuses
   */
  constructor(
    keyword = '',
    users = new Set(),
    virtualGroups = new Set(),
    statuses = new Set()
  ) {
    this.keyword = keyword;
    this.users = users;
    this.virtualGroups = virtualGroups;
    this.statuses = statuses;

    this._cachedJob = null;
  }

  clear() {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  save() {
    const content = JSON.stringify({
      users: Array.from(this.users),
      virtualGroups: Array.from(this.virtualGroups),
      statuses: Array.from(this.statuses)
    });
    // console.log('seseder', LOCAL_STORAGE_KEY, content);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, content);
  }

  load() {
    try {
      const content = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      // console.log('lowlowder', JSON.parse(content))
      // const {users, virtualGroups, statuses} = JSON.parse(content);
      const { users, statuses } = JSON.parse(content);
      if (Array.isArray(users)) {
        this.users = new Set(users);
      }
      // Abort belonging VGs loading
      // if (Array.isArray(virtualGroups)) {
      //   this.virtualGroups = new Set(virtualGroups);
      // }
      if (Array.isArray(statuses)) {
        this.statuses = new Set(statuses);
      }
    } catch (e) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  /**
   * @param {any[]} jobs
   */
  apply(jobs) {
    const { keyword, users, virtualGroups, statuses } = this;

    const filters = [];
    if (keyword !== '') {
      filters.push(
        ({ name, username, virtualGroup }) => {
          return (
            name.indexOf(keyword) > -1
            || username.indexOf(keyword) > -1
            || (virtualGroup && virtualGroup.indexOf(keyword) > -1))
        }
      );
    }

    if (users.size > 0) {
      filters.push(({ username }) => {
        // console.log('username', username)
        return users.has(`user_${username}`)
      });
    }

    if (virtualGroups.size > 0) {
      // console.log('vgs', virtualGroups);
      filters.push(({ virtualGroup }) => virtualGroups.has(`group_${virtualGroup}`));
    }

    if (statuses.size > 0) {
      filters.push(job => statuses.has(getStatusText(job)));
    }

    if (filters.length === 0) return jobs;

    // filters.forEach((f) => console.log('filters', f.name, f));
    // console.log('jobs', jobs)
    // console.log('fufujobs', jobs.filter((job) => filters.every((filter) => filter(job))))
    return jobs.filter(job => (filters.every(filter => filter(job))));
  }
}

export default Filter;
