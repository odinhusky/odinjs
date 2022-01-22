class Filter {
  /**
   * @param {Set<string>?} resources
   */
  constructor(
    keyword = '',
    resources = new Set()
  ) {
    this.keyword = keyword;
    this.resources = resources;
  }

  /**
   * @param {any[]} vg
   */
  apply(vg) {
    const { keyword, resources } = this;
    const filters = [];

    if (keyword !== '') {
      filters.push(({ name }) => name.indexOf(keyword) > -1);
    }

    if (resources.length > 0) {
      filters.push(({ resource }) => resources.includes(resource));
    }

    if (filters.length === 0) return vg;

    // filters.forEach((f) => console.log('filters', f.name, f));
    // console.log('jobs', jobs)
    // console.log('fufujobs', jobs.filter((job) => filters.every((filter) => filter(job))))
    return vg.filter(item => filters.every(filter => filter(item)));
  }
}

export default Filter;
