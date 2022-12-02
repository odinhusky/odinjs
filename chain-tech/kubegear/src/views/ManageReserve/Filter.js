class Filter {
  constructor(
    keyword = '',
  ) {
    this.keyword = keyword;
  }

  /**
   * @param {any[]} vg
   */
  apply(vg) {
    const { keyword } = this;
    const filters = [];

    if (keyword !== '') {
      filters.push(({ jobName }) => {
        return jobName.indexOf(keyword) > -1;
      });
    }

    if (filters.length === 0) return vg;

    return vg.filter(item => filters.every(filter => filter(item)));
  }
}

export default Filter;
