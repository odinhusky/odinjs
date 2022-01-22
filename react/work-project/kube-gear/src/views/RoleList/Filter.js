class Filter {
  constructor(keyword = '', types = []) {
    this.keyword = keyword;
    this.types = types;
  }

  apply(list) {
    const { keyword, types } = this;
    const filters = [];

    if (keyword !== '') {
      // '用关键字过滤'
      filters.push(({ name }) => name.includes(keyword));
    }
    if (types && types.length > 0) {
      filters.push(({ privileges }) => types.every(item => privileges.includes(item)))
    }

    if (filters.length === 0) return list;

    return list.filter(item =>
      filters.every(filter => filter(item))
    );
  }
}

export default Filter;
