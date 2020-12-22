// 排序 1 : 排序簡介 & 氣泡排序 Bubble Sort

// 若圖書館的書都沒分類全部亂成一團，那你勢必要一本一本翻找到天荒地老。但經過好好排序就可以很快地找到。

// 下面影片用不同排序呈現如何最有效率地整理書架？

// https://www.youtube.com/watch?v=WaNLJf8xzC4&feature=emb_logo

// 程式面來說，大家可能跟我一樣第一個想到的是 javaScript 的 Array.prototype.sort，那你知道 Array.prototype.sort 背後是用甚麼演算法嗎 ?
// 以 Chrome 來說 elements < 10 時會用插入排序 (InsertionSort)，>10 時會用快速排序 (QuickSort)。若有興趣可以看這一串討論(https://www.quora.com/What-is-the-sorting-algorithm-behind-a-Javascript-Array-sort-method)。這兩個排序在之後文章也會提到。

// 跟前面的資料結構一樣，並沒有一種完美的排序存在。而是要看不同的情況選擇最適用的排序法。在開始之前，就來先看看這個影片吧，影片顯示出不同排序視覺化之後的過程

// https://www.youtube.com/watch?v=kPRA0W1kECg&feature=emb_logo

// 來介紹不同的常見排序吧 !

// O(n²) Bubble Sort
// 最簡單，但效能相對也很差的一種排序。概念就是兩兩比較，如果第一個比第二個大那就交換位置，反之則維持不動。

// 觀察步驟
// 目前值跟下一個值比較，看誰小

// 目前值 ≤= 下一個值 → 不變\

// 目前值 > 下一個值 → 交換位置

// 實際操作

// 以一樣的題目操作不同排序法

// before sort
[8, 9, 2, 5, 1][
  // after sort
  (1, 2, 5, 8, 9)
];

// 第一輪開始
[8, 9, 2, 5, 1]; // 比較 8 跟 9 大小
----[8, 9, 2, 5, 1]; // 8 < 9 所以位置不動。接下來比較 9 跟 2 大小
----[8, 2, 9, 5, 1]; // 9 > 2 所以位置互換。接下來比較 9 跟 5 大小
----[8, 2, 5, 9, 1]; // 9 > 5 所以位置互換。接下來比較 9 跟 8 大小
----[8, 2, 5, 1, 9][ // 9 > 1 所以位置互換
  // 第一輪比完了，總共比了 n -1 次 (4 次)，這時候我們只會知道 "9" 是裡面最大的數字。

  // n 是甚麼
  // n 就是總長度，所以這個題目 n = 5

  // 第二輪開始
  (8, 2, 5, 1, 9)
]; // 這是比完第一輪後結果
----[2, 8, 5, 1, 9];
----[2, 5, 8, 1, 9];
----[2, 5, 1, 8, 9][ // 最後面在第一輪比過了，所以可以不用再比一次
  // 第二輪比完了，總共比了 n -2 次 (3 次)，這時候我們會知道 "8" 是裡面第二大的數字。

  // 第三輪開始 一樣兩兩比較 比 n -3 次完結果
  (2, 1, 5, 8, 9)
][
  // 第四輪開始 一樣比像上面兩兩比較 比 n - 4 次完結果
  (1, 2, 5, 8, 9)
];

// 呼，終於比完了，這時候要觀察時間複雜度了

// 觀察 Big O
// 總共要比較 n-1 輪。第一輪執行 n -1 次，第二輪 執行 n -2 次，第 n -1 輪執行 1 次
// 時間複雜度是 (n-1) + (n-2) + .... + 1 = (1+n-1)*(n -1)/2 上底加下底 x 高 / 2
// 時間複雜度會忽略所有係數，所以等於 O(n*2)
// 這時候可能有疑問說那假如題目是 [1, 2, 5, 8, 9]，時間複雜度不就只有 O(1) 嗎? NoNoNo 時間複雜度會用 "最壞狀況" 來計算 ，也就是我的例子 [8, 2, 5, 1, 9] 要排到最後才有結果

// 程式碼
// 概念懂了再來寫程式相對容易很多，我通常也會像上面這樣土法煉鋼完再歸納邏輯寫出程式。

// 計算幾次
let count = 0;

function BubbleSort(array) {
  let len = array.length;

  // 總共比 n -1 輪
  for (let j = 0; j < len - 1; j++) {
    // 比較次
    for (let i = 0; i < len - j - 1; i++) {
      count++;
      if (array[i + 1] < array[i]) {
        swap(array, i, i + 1);
      }
    }
  }
  console.log(count);
  return array;
}

console.log(BubbleSort([8, 9, 2, 5, 1])); // [ 1, 2, 5, 8, 9 ]
// count = 10

// 先把交換寫好 之後會一直用到
function swap(arr, index1, index2) {
  // 要先把第一個值存下來
  let tmpValue = arr[index1];
  arr[index1] = arr[index2];
  // 假如這邊寫 array[index2] = array[index1]; 那兩個值會是一樣的
  arr[index2] = tmpValue;
}

// function quickSort(arr) {
//   if (arr.length < 2) return arr;

//   let left = [],
//     right = [];

//   const [pivot, ...ary] = arr;

//   ary.forEach((item) => {
//     if (item > pivot) {
//       right.push(item);
//     } else {
//       left.push(item);
//     }
//   });

//   return [...quickSort(left), ...quickSort(right)];
// }
