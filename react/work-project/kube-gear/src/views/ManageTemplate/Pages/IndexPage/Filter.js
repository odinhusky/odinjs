class Filter {
  constructor(
    keyword = '',
    owner = new Set(),
    privilege = new Set(),
    username = ''
  ) {
    this.keyword = keyword;
    this.owner = owner;
    this.privilege = privilege;
    this.username = username;
  }

  apply(list) {
    const { keyword, owner, privilege, username } = this;

    const filters = [];

    if (keyword !== '') {
      // '用关键字过滤'
      filters.push(({ name }) => name.includes(keyword));
    }

    if (owner.size > 0) {
      filters.push((item) => owner.has(item.owner))
    }

    if (privilege.size > 0) {
      filters.push((template) => privilege.has(checkPrivilege(template, username)))
    }

    if (filters.length === 0) return list;

    return list.filter(item =>
      filters.every(filter => filter(item))
    );
  }
}

function checkPrivilege(template, username) {
  let privilegeText = 'notHasEditPrivilege';
  if (username === template.owner ) {
    privilegeText = 'hasEditPrivilege'
  } else {
    if (template.canWriteUsers.includes(username)) {
      privilegeText = 'hasEditPrivilege'
    }
  }
  return privilegeText
}

export default Filter;
