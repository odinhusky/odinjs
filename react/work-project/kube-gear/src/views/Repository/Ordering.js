import moment from 'moment';

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
    } else if (field === 'public') {
      comparator = descending
        ? (a, b) => String(b.metadata.public).localeCompare(a.metadata.public)
        : (a, b) => String(a.metadata.public).localeCompare(b.metadata.public);
    } else if (field === 'entity_name') {
      comparator = descending
        ? (a, b) => String(b.entity_name).localeCompare(a.entity_name)
        : (a, b) => String(a.entity_name).localeCompare(b.entity_name);
    } else if (field === 'role_name') {
      comparator = descending
        ? (a, b) => String(b.role_name).localeCompare(a.role_name)
        : (a, b) => String(a.role_name).localeCompare(b.role_name);
    } else if (field === 'repo_count') {
      comparator = descending
        ? (a, b) => b.repo_count - a.repo_count
        : (a, b) => a.repo_count - b.repo_count;
    } else if (field === 'tags_count') {
      comparator = descending
        ? (a, b) => b.tags_count - a.tags_count
        : (a, b) => a.tags_count - b.tags_count;
    } else if (field === 'pull_count') {
      comparator = descending
        ? (a, b) => b.pull_count - a.pull_count
        : (a, b) => a.pull_count - b.pull_count;
    } else if (field === 'size') {
      comparator = descending
        ? (a, b) => b.size - a.size
        : (a, b) => a.size - b.size;
    } else if (field === 'current_user_role_id') {
      comparator = descending
        ? (a, b) => String(b.current_user_role_id).localeCompare(a.current_user_role_id)
        : (a, b) => String(a.current_user_role_id).localeCompare(b.current_user_role_id);
    }
    else if (field === 'creation_time') {
      comparator = (a, b) => {
        const start = moment(a.creation_time)
        const end = moment(b.creation_time)

        return descending ? end.diff(start) : start.diff(end)
      }
    }
    else if (field === 'created') {
      comparator = (a, b) => {
        const start = moment(a.created)
        const end = moment(b.created)

        return descending ? end.diff(start) : start.diff(end)
      }
    }
    return jobs.slice().sort(comparator);
  }
}
