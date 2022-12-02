class Filter {
  constructor(keyword = '', types = 0) {
    this.keyword = keyword;
    this.types = types;
  }

  apply(licenseList) {
    const { keyword, types } = this;
    const filters = [];

    if (keyword !== '') {
      // '用关键字过滤'
      filters.push(({ ip }) => ip.includes(keyword));
    }

    switch (types) {
      case 0:
      default:
        break;
    
      case 1:
        filters.push(({ error }) => typeof(error) !== 'object')
        break;
      case 2:
        filters.push(({ error }) => typeof(error) === 'object')
        break;
    }

    if (filters.length === 0) return licenseList;

    return licenseList.filter(item =>
      filters.every(filter => filter(item))
    );
  }
}

export default Filter;
