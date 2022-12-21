const obj = {
  a: {
    b: 1
  },
  c: [1, 2, 4],
  d: null,
  e: [1, 2, { 4: 5 }],
  f: { 4: 1 }
};

function traverseByOdin(obj) {
  function flatObjToArr(obj) { return Object.values(obj).flat(); }

  function judge(item) {
    if(item === null) return [];
    if(Array.isArray(item)) return item;
    if(typeof item === 'object') return flatObjToArr(item).flatMap(item => judge(item));
    return item;
  }

  const resultArr = flatObjToArr(obj).flatMap(item => judge(item));

  return resultArr.join(' ');
}

traverseByOdin(obj);  // '1 1 2 4 1 2 5 1'