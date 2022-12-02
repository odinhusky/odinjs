const LOCAL_STORAGE_KEY = 'pai-job-filter';

class Filter {
  /**
   * @param {Set<string>?} types
   */
  constructor(keyword = '', types = new Set(), showHiddenFile = false) {
    this.keyword = keyword;
    this.types = types;
    this.showHiddenFile = showHiddenFile;

    this._cachedJob = null;
  }

  save() {
    const content = JSON.stringify({
      types: Array.from(this.types)
    });
    window.localStorage.setItem(LOCAL_STORAGE_KEY, content);
  }

  /*
   * Reloading for filter initialization
   */
  load() {
    try {
      const content = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const { types } = JSON.parse(content);
      if (Array.isArray(types)) {
        this.types = new Set(types);
      }
    } catch (e) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  /**
   * @param {any[]} fsItemsNodes
   */
  apply(fsItemsNodes) {
    const { keyword, types, showHiddenFile } = this;
    const filters = [];

    // Push filter funcs to 'filters'
    if (types.size > 0) {
      filters.push(({ type }) => types.has(type));
    }
    if (keyword !== '') {
      // '用关键字过滤'
      filters.push(({ name }) => name.indexOf(keyword) > -1);
    }

    if (!showHiddenFile) {
      filters.push(({ name }) => name[0] !== '.');
    }

    if (filters.length === 0) return fsItemsNodes;

    return fsItemsNodes.filter(node =>
      filters.every(filter => filter(node))
    );
  }
}

export default Filter;
