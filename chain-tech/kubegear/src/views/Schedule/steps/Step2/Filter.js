class Filter {
  constructor(
    keyword = '',
    owner = new Set(),
    username = ''
  ) {
    this.keyword = keyword;
    this.owner = owner;
    this.username = username;
  }

  apply(list) {
    const { keyword, owner } = this;

    const filters = [];

    if (keyword !== '') {
      // '用关键字过滤'
      filters.push(({ name, description }) => (name.includes(keyword) || description.includes(keyword)));
    }

    if (owner.size > 0) {
      filters.push((item) => owner.has(item.owner))
    }

    if (filters.length === 0) return list;

    return list.filter(item =>
      filters.every(filter => filter(item))
    );
  }
}

export default Filter;