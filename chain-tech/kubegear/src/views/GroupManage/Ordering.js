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
    } if (field === 'name') {
      comparator = descending
        ? (a, b) => String(b.name).localeCompare(a.name)
        : (a, b) => String(a.name).localeCompare(b.name);
    } else if (field === 'role') {
      comparator = (a, b) => {
        const first = a.roles.join('');
        const second = b.roles.join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'leaders') {
      comparator = (a, b) => {
        const first = a.leaders.join('');
        const second = b.leaders.join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'users') {
      comparator = (a, b) => {
        const first = a.users.join('');
        const second = b.users.join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'resources') {
      comparator = (a, b) => {
        const first = a.resources.join('');
        const second = b.resources.join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'children') {
      comparator = (a, b) => {
        const first = a.children.map(child => child.name).join('');
        const second = b.children.map(child => child.name).join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'virtualGroups') {
      comparator = (a, b) => {
        const first = a.virtualGroups.join('');
        const second = b.virtualGroups.join('');
        return descending ? String(second).localeCompare(first) : String(first).localeCompare(second)
      }
    } else if (field === 'jobLifeHour') {
      comparator = descending 
        ? (a, b) => b.jobLifeHour - a.jobLifeHour
        : (a, b) => a.jobLifeHour - b.jobLifeHour
    } else if (field === 'state') {
      comparator = descending 
        ? (a, b) => b.state - a.state
        : (a, b) => a.state - b.state
    } else if (field === 'groupState') {
      comparator = (a, b) => {
        const state = obj => {
          const { applyState, inviteState } = obj
          if (applyState === 1 && inviteState === 1) {
            return 0
          } else if (applyState === 1 && inviteState === 0) {
            return 1
          } else {
            return 2
          }
        }
        const first = state(a);
        const second = state(b);
        return descending ? second - first : first - second
      }
    } else if (field === 'storageUsed') {
      comparator = descending 
        ? (a, b) => b.storageUsed - a.storageUsed
        : (a, b) => a.storageUsed - b.storageUsed
    } else if (field === 'storage') {
      comparator = descending 
        ? (a, b) => b.storage - a.storage
        : (a, b) => a.storage - b.storage
    } else if (field === 'cpuUsed') {
      comparator = descending 
        ? (a, b) => b.cpuUsed - a.cpuUsed
        : (a, b) => a.cpuUsed - b.cpuUsed
    } else if (field === 'cpu') {
      comparator = descending 
        ? (a, b) => b.cpu - a.cpu
        : (a, b) => a.cpu - b.cpu
    } else if (field === 'gpu') {
      comparator = (a, b) => {
        const A = Object.values(a.gpu).reduce((acc, curr) => acc += curr, 0)
        const B = Object.values(b.gpu).reduce((acc, curr) => acc += curr, 0)

        return descending ? B - A : A - B
      }
    } else if (field === 'group') {
      comparator = (a, b) => {
        return descending ? String(b.group).localeCompare(a.group) : String(a.group).localeCompare(b.group)
      }
    } else if (field === 'subResource') {
      comparator = (a, b) => {
        const A = a.children.map(child => child.name).join('');
        const B = b.children.map(child => child.name).join('');
        return descending ? String(B).localeCompare(A) : String(A).localeCompare(B)
      }
    }
    return list.slice().sort(comparator);
  }
}
