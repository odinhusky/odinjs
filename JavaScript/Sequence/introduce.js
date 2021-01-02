// Sequence 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10219931

// Big O(n): 簡易搜尋 Sequential Search
// 執行時間會跟著 n 等比例變多

// 參考圖片1

// 我現在想吃 Grapes，但每個水果都被關在一模一樣的不透明箱子裡，所以我只好一個一個打開來檢查。

let fruits = ['Banana', 'Grapes', 'Watermelon', 'Avocado'];
for (let i = 0; i < fruits.length; i++) {
  if (fruits[i] == 'Grapes') {
    console.log('耶 找到了');
  } else {
    console.log('繼續找下一個箱子吧');
  }
}

// Big O(log n): 二分搜尋 Binary Search
// 輸入數量 n 時，執行步驟是 log n。
// Binary Search 是非常常見的考題之一，概念不會太難，而且效能相當不錯。只有一個地方要注意就是要使用它，input 必須是要排序好的 (ex. 暗箱是 a-z )

// 觀察步驟
// 步驟一 選擇中間值

// 目標值 == 選取值 ，則結束搜尋
// 目標值 < 選取值，則返回步驟一在選取值左邊子陣列中繼續尋找
// 目標值 > 選取值 ，則返回步驟一在選取值右邊子陣列中繼續尋找
// 實際操作
// 這邊用一樣的水果例子。現在有 9 個箱子依字母順序排好 (例如 A 開頭水果一定會排在其他字母開頭水果前面)。我想要找到 Grape 最少幾次就可以找到呢 ?

// 參考圖片2

// 先從中間的箱子開始找，找到 pineapple，而 G 字母比 P 前面所以往前找

// 這邊都以 index 為單位
let start = 0;
let end = fruitArray.length - 1;
let mid;

//  從中間開始切
let mid = Math.floor((start + end) / 2); // 找到 P

// 參考圖片3

// 再從左半邊中間位置找，打開發現是 Banana，而 G 比 B 後面所以往後找

if (target < fruitArray[mid]) {
  // 往左找
  end = mid - 1;
} else if (target > fruitArray[mid]) {
  // 往右找
  start = mid + 1;
} else {
  return mid;
}

// 參考圖片4

// 一樣的方法再從中間找，打開發現是 Cherry，G 比 C 後面所以往後找

// 這邊都以 index 為單位
let start = 0;
let end = fruitArray.length - 1;
let mid;

//  從中間開始切
let mid = Math.floor((start + end) / 2); // 找到 P

// 參考圖片5

// 再從左半邊中間位置找，打開發現是 Banana，而 G 比 B 後面所以往後找

if (target < fruitArray[mid]) {
  // 往左找
  end = mid - 1;
} else if (target > fruitArray[mid]) {
  // 往右找
  start = mid + 1;
} else {
  return mid;
}

// 參考圖片6

// 一樣的方法再從中間找，打開發現是 Cherry，G 比 C 後面所以往後找

// 參考圖片7

// 找到囉 !

// 完整程式碼

function binarySearch(fruitArray, target) {
  // 這邊都以 index 為單位
  let start = 0;
  let end = fruitArray.length - 1;
  let mid;

  while (start <= end) {
    //  從中間開始切
    mid = Math.floor((start + end) / 2);
    if (target < fruitArray[mid]) {
      // 往左找
      end = mid - 1;
    } else if (target > fruitArray[mid]) {
      // 往右找
      start = mid + 1;
    } else {
      return mid;
    }
  }

  // 如果上面都不符合代表找不到
  return -1;
}
// 當然用水果例子我會先用 charCodeAt 字串轉數字再進行 binarySearch

// 1064. Fixed Point

// Question:
// Given an array A of distinct integers sorted in ascending order, return the smallest index i // that satisfies A[i] == i.  Return -1 if no such i exists.
// 給一個裡面都包含不同數字的陣列 A，排序已經由小到大排好了。請找出符合 A[i] = i 的值

// Example:
// Input: [-10,-5,0,3,7]
// Output: 3
// Explanation: 
// For the given array, A[0] = -10, A[1] = -5, A[2] = 0, A[3] = 3, thus the output is 3.
// Example 2:

// Input: [0,2,5,8,17]
// Output: 0
// Explanation: 
// A[0] = 0, thus the output is 0.
// Example 3:

// Input: [-10,-5,3,4,7,9]
// Output: -1
// Explanation: 
// There is no such i that A[i] = i, thus the output is -1.

* @param {number[]} A
* @return {number}
*/


// 其他部分單純用 Binary Search 解

// 參考圖片8

mid = Math.floor((start + end) / 2); // 從中間開始找
if (mid < A[mid]) { // 2 < 0
    // 往左找      
    end = mid - 1;
} else if (mid > A[mid]) { // 2 > 0
    // 往右找
    start = mid + 1 // start = 3
} else {
    minIndex = Math.min(minIndex, mid);
    end = mid - 1;
};

// 參考圖片9

// 完整程式碼

var fixedPoint = function (A) {
  const len = A.length;
  let minIndex = Number.MAX_SAFE_INTEGER;
  if (len < 1) return -1;

  // 這邊都以 index 為單位
  let start = 0;
  let end = len - 1;

  //  從中間開始切
  let mid;

  while (start <= end) {
      mid = Math.floor((start + end) / 2);
      console.log('mid: ' + mid)
      if (mid < A[mid]) { 
          // 往左找      
          end = mid - 1;
      } else if (mid > A[mid]) { 
          // 往右找
          start = mid + 1 
      } else {
          minIndex = Math.min(minIndex, mid);
          end = mid - 1;
      };
  }
  // 如果上面都不符合代表找不到
  return (minIndex == Number.MAX_SAFE_INTEGER) ? -1 : minIndex;

};


console.log(fixedPoint([-10, -5, -2, 0, 4, 5, 6, 7, 8, 9, 10]))