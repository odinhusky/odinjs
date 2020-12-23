// Sort
function quickSort(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let l = [];
  let r = [];
  let [p, ...ary] = arr;

  ary.forEach((item) => {
    if (item < p) {
      l.push(item);
    } else {
      r.push(item);
    }
  });

  return [...quickSort(l), p, ...quickSort(r)];
}

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
    for (let i = 0; len - j - 1; i++) {
      count++;
      if (arr[i + 1] < arr[i]) {
        swap(arr, i + 1, i);
      }
    }
  }

  return arr;
}

function select(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  let minIndex;

  for (let j = 0; j < len - 1; j++) {
    minIndex = j;
    for (let i = 0; i < len; i++) {
      if (arr[minIndex] > arr[i]) {
        minIndex = i;
      }
    }
    swap(arr, j, minIndex);
  }

  return arr;
}

function insert(arr) {
  let len = arr.length;
  if (len < 2) return arr;

  for (let j = 0; j < len - 1; j++) {
    for (let i = j + 1; i > 0; i--) {
      if (arr[i] < arr[i - 1]) {
        swap(arr, i, i - 1);
      }
    }
  }

  return arr;
}

[5, 8, 11, 97, 1, 2, 3, 4, 5, 8, 63];
