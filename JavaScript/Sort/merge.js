// 排序 3: 合併排序 Merge Sort

// https://ithelp.ithome.com.tw/articles/10218895

// Big O(n logn)：Merge Sort 合併排序法
// 好了，前面三個講這麼多但都是 O(n²) 效能不佳，而 Merge Sort 算是效能相當不錯的 Big O(n logn)，各大瀏覽器也都有實作到 Merge Sort 。但相對比較難理解一些。希望我的解釋能清楚。

// Merge Sort 概念就是把原始陣列切分成更小的 Array (拆分) ，直到小 Array 最後只剩一個值，然後再合併成排序好的大 Array (合併)

// 觀察步驟
// 拆分: 一直切直到剩一個值
// 合併: 兩個陣列只比第一個值，小的放前面大的放後面

// 實際操作
// 跟前兩天一樣的題目

// before sort
[8, 9, 2, 5, 1][
  // after sort
  (1, 2, 5, 8, 9)
];

// 拆分
// 把 Array 切半一直切到剩一個元素

// 總共切 n - 1 次

// 合併
// 排序小陣列再合併成大陣列

// 從上面我們可以看到合併小陣列時，因為小陣列已經排序好，所以只要比第一個數字就好了，把較小數字丟進新的 Array 裡 (到底是誰發明這麼聰明的方法)

// 觀察 Big O
// 拆分步驟為 n -1
// 每輪合併要花 n 次，總共 log n 輪
// 時間複雜度就是 (n - 1 ) + n*log n
// 去掉係數就是 O(n log n)
// 程式碼
// 在實作成 js code，merge sort 真的比前三個難許多。花了雙倍時間去想。

// 先來寫一個 merge function

// js here --------------------------------
//
// Example
// [8, 9] [2] -> [2, 8, 9]
// [2, 8, 9]  [1, 5] -> [1, 2, 5, 8, 9]
// ---------------------------------------
function merge(left, right) {
  const result = [];

  let il = 0; // record the left position
  let ir = 0; // record the right position

  while (il < left.length && ir < right.length) {
    // 哪邊值比較小就加入進 result
    if (left[il] < right[ir]) {
      result.push(left[il]);
      il++;
    } else {
      result.push(right[ir]);
      ir++;
    }
  }

  // 只剩左邊陣列就直接加入 result
  while (il < left.length) {
    result.push(left[il]);
    il++;
  }

  // 只剩右邊陣列就直接加入 result
  while (ir < right.length) {
    result.push(right[ir]);
    ir++;
  }

  return result;
}

// 再來再寫分割

// js here --------------------------------
//
// Example
// [8, 9, 2]  -> [8, 9] [2]
// [8, 9, 2, 5, 1] -> [8, 9, 2] [5, 1]
// ---------------------------------------

function mergeSlice(array) {
  const len = array.length;

  // 如果只剩一個值就不用切了
  if (len === 1) {
    return array;
  }

  const mid = Math.floor(len / 2);
  const leftArray = array.slice(0, mid);
  const rightArray = array.slice(mid, len);

  // 這邊用遞迴一直切切到最後才會一個一個合併
  return merge(mergeSlice(leftArray), mergeSlice(rightArray));
}

console.log(mergeSlice([8, 9, 2, 5, 1])); // [ 1, 2, 5, 8, 9 ]
