// Sort

function swap(arr, index1, index2) {
  let temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

function bubble(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let count = 0;

  for (let j = 0; j < len - 1; j++) {
    for (let i = 0; i < len - j - 1; i++) {
      count++;
      if (arr[i + 1] > arr[i]) {
        swap(arr, i + 1, i);
      }
    }
  }

  console.log('count', count);
  return arr;
}

function selection(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let count = 0;
  let minIndex = null;

  for (let j = 0; j < len - 1; j++) {
    minIndex = j;
    for (let i = 0; i < len; i++) {
      count++;
      if (arr[minIndex] > arr[i]) {
        minIndex = i;
      }
    }
    swap(arr, minIndex, j);
  }
  console.log('count', count);
  return arr;
}

function insertion(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let count = 0;

  for (let j = 0; j < len - 1; j++) {
    for (let i = j + 1; i > 0; i--) {
      count++;
      if (arr[i] < arr[i - 1]) {
        swap(arr, i - 1, i);
      }
    }
  }

  console.log('count', count);
  return arr;
}

function quickSort(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let [p, ...ary] = arr;
  let l = [];
  let r = [];

  ary.forEach((item) => {
    if (item < p) {
      l.push(item);
    } else {
      r.push(item);
    }
  });

  return [...quickSort(l), p, ...quickSort(r)];
}

function mergeSort(arr) {
  function merge(left, right) {
    let ir = 0;
    let il = 0;
    const result = [];

    while (il < left.length && ir < right.length) {
      if (left[il] < right[ir]) {
        result.push(left[il]);
        il++;
      } else {
        result.push(right[ir]);
        ir++;
      }
    }

    while (left.length > il) {
      result.push(left[il]);
      il++;
    }

    while (right.length > ir) {
      result.push(right[ir]);
      ir++;
    }

    return result;
  }

  function mergeSlice(arr) {
    const len = arr.length;

    if (len === 1) return arr;

    const mid = Math.floor(len / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid, len);

    return merge(mergeSlice(left), mergeSlice(right));
  }

  return mergeSlice(arr);
}

[5, 8, 11, 97, 1, 2, 3, 4, 5, 8, 63];
