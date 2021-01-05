// Sort

[8, 4, 3, 1, 3, 7, 6];

function quickSort(A) {
  if (A.length < 2) return A;

  let l = [],
    r = [];
  let [p, ...ary] = A;

  ary.forEach((item) => {
    if (p > item) {
      l.push(item);
    } else {
      r.push(item);
    }
  });

  return [...quickSort(l), p, ...quickSort(r)];
}

function swap(A, i1, i2) {
  let temp = A[i1];
  A[i1] = A[i2];
  A[i2] = temp;
}

function bubbleSort(A) {
  let len = A.length;

  if (len < 2) return A;

  for (let j = 0; j < len - 1; j++) {
    for (let i = 0; i < len - j - 1; i++) {
      if (A[i + 1] < A[i]) {
        swap(A, i + 1, i);
      }
    }
  }

  return A;
}

function selectionSort(A) {
  let len = A.length;

  if (len < 2) return A;

  let minIndex;

  for (let j = 0; j < len - 1; j++) {
    minIndex = j;
    for (let i = j; i < len; i++) {
      if (A[minIndex] > A[i]) {
        minIndex = i;
      }
    }
    swap(A, minIndex, j);
  }

  return A;
}

function insertSort(A) {
  let len = A.length;

  if (len < 2) return A;

  for (let j = 0; j < len - 1; j++) {
    for (let i = j + 1; i > 0; i--) {
      if (A[i - 1] > A[i]) {
        swap(A, i - 1, i);
      }
    }
  }

  return A;
}

function mergeSort(A) {
  let len = A.length;

  if (len < 2) return A;

  function merge(l, r) {
    const result = [];
    let il = 0,
      ir = 0;

    while (il < l.length && ir < r.length) {
      if (l[il] < r[ir]) {
        result.push(l[il]);
        il++;
      } else if (l[il] > r[ir]) {
        result.push(r[ir]);
        ir++;
      }
    }

    while (il < l.length) {
      result.push(l[il]);
      il++;
    }

    while (ir < r.length) {
      result.push(r[ir]);
      ir++;
    }

    return result;
  }

  function mergeSlice(A) {
    if (len === 1) return A;

    let mid = Math.floor(len / 2);
    let leftA = A.slice(0, mid);
    let rightA = A.slice(mid, len);

    return merge(mergeSlice(leftA), mergeSlice(rightA));
  }

  return mergeSlice(A);
}

function binarySearch(A, target) {
  let len = A.length;

  if (len < 2) return A;

  let start = 0,
    end = len - 1,
    mid;

  while (start <= end) {
    mid = Math.floor(start + end / 2);

    if (target < A[mid]) {
      end = mid - 1;
    } else if (target > A[mid]) {
      start = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
}
