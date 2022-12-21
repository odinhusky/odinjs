const obj = {
  a: { b: 1 },
  c: [1, 2, 4],
  d: null,
  e: [1, 2, { 4: 5 }],
  f: { 4: 1 }
};

const traverse = (obj) => {

  const arr = [];

  function judge (obj) {
    console.log('arr', arr);
    if (obj === null) return;
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if ((typeof obj[key] === 'object') && !Array.isArray(obj[key])) {
          return judge(obj[key])
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((arrData) => {
            if (typeof arrData === 'object') {
              return judge(arrData)
            } else {
              arr.push(arrData)
            }
          })
        } else {
          arr.push(obj[key])
        }
      })
    }
  }

  judge(obj);

  return arr.join(' ');
}

traverse(obj)