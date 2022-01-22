import React from 'react';

import Filter from './Filter';
import Ordering from './Ordering';

export default React.createContext({
  allJobs: null,
  refreshJobs() {
    // Equvalent to "refreshJobs: () => {this.allJobs=null;},"
    this.allJobs = null;
  },
  filteredJobs: [],
  selectedJobs: [],
  setSelectedJobs(selectedJobs) {
    this.selectedJobs = selectedJobs;
  },

  stopJob(job) {
    job.executionType = 'STOP';
  },

  deleteJob(job) {
    job.executionType = 'DELETED';
  },

  username: '',

  filter: new Filter(),
  setFilter(filter) {
    this.filter = filter;
  },

  ordering: new Ordering(),
  setOrdering(ordering) {
    this.ordering = ordering;
  }
});
