// 排序 4: 快速排序 Quick Sort

// https://ithelp.ithome.com.tw/articles/10219567

// Big O(n logn)：Quick Sort 快速排序
// Quick Sort 會先選一個基準數 (pivot)，然後其他元素跟 pivot 輪流比較，小的放前大的放後。pivot 兩邊也會切割成更小的 Array 直到只剩一個值，最後再組裝。

// gif 5

// 觀察步驟
// 一樣的題目如下

// before sort
[8, 9, 2, 5, 1]
// after sort
[1, 2, 5, 8, 9]

// 圖片 4

// 隨便選一個值當基準數 (pivot)
// 最左邊會有一個 pointer (指標) L，最右邊位置也會有一個 pointer R
// R 往左移動直到找到一個小於 pivot 停下來
// L 往右移動直到找到一個大於 pivot 停下來

// 圖片 5

// 值交換位置，L 跟 R 繼續移動

// 圖片 6

// 若一直沒有停下來，那 L 跟 R 重疊時，重疊的值跟基準(pivot)交換，當回合結束。

// 切割
// 以基準值出發分為左右兩塊 Array
// 繼續重覆上述步驟一直到 Array 只剩一個
// 組裝
// 把排序好的 Array 組裝

// 實際操作
// 我知道上面說明很難懂，還是來看範例好了

// 第一輪
// 第一次交換
[8, 9, 2, 5, 1]  // Determine pivot, I choose 8
 -

[8, 9, 2, 5, 1] // start pointer at left and right
 -
 L           R

[8, 9, 2, 5, 1] // R 找到一個 < 8 的停下來，因為 1 < 8 所以第一步就停了
 -
 L           R

[8, 9, 2, 5, 1] // L 找到一個 > 8 的停下來，他往右移到 9 就停住
 -
    L        R

[8, 1, 2, 5, 9] // When L & R all stop, swich position
 -
    L        R

// 第二次交換

[8, 1, 2, 5, 9] // 5 < 8, so stop
 -
    L     R

[8, 1, 2, 5, 9] // L 碰到 R 了但都沒發現 > 8 的，但碰到代表第一輪結束，把 pivot 跟 5 交換
 -
          LR

[5, 1, 2, 8, 9] 
 -        -

//  第一輪結束我們其實已經以 8 為分界 分成左邊 Array [5, 1, 2] 跟 右邊 Array [9] ，再來只要針對這兩邊再繼續做一樣的事情就好

// 第二輪   
[5, 1, 2]  // Determine pivot
 -

[5, 1, 2]  // start pointer at left and right
 -
 L     R

[5, 1, 2]  // R < 5, so stop
 -
 L     R

[5, 1, 2]  // L 沒找到 > 5 的直到碰到 R
 -
       LR

[2, 1, 5]  // 碰到代表這回合結束，交換位置
 -     -
       
// 第三輪
[2, 1]  // Determine pivot
 -

[2, 1]  // start pointer at left and right
 -
 L  R

[2, 1]  // 1 < 2, so stop
 -
 L  R


[2, 1]  //  碰到
 -
    LR

[1, 2]  //  碰到所以交換



// 第四輪  [9] 就不用排了

// 圖片 7

// 程式碼

let data = [8, 9, 2, 5, 1];

let quickSort = (arr, L, R) => {
    // 實作劃分過程
    const partition = (array, L, R) => {
        let pivot = L + 1;
        for (let i = L + 1; i <= R; i++) {
            if (array[i] < array[L]) {
                swap(array, i, pivot);
                pivot++;
            }
        }

        // 記得把 pivot 跟最後一個比它小的元素互換
        swap(array, L, pivot - 1);
        return pivot - 1;
    }
    const _quickSort = (array, L, R) => {
        if (L >= R) return array;

        // 在 partition 裡面調整數列，並且回傳 pivot 的 index
        const pivotIndex = partition(array, L, R);
        _quickSort(array, L, pivotIndex - 1);
        _quickSort(array, pivotIndex + 1, R);
        return array;
    };
    return _quickSort(arr, 0, arr.length - 1);
}

// array 裡面的值自己交換 array[index1] = array[index2]
function swap(arr, index1, index2) {
    // es6 Destructuring
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

console.log(quickSort(data, 0, data.length - 1))

// 另外看到邦友 Gary 的文章也有實作快速排序覺得超簡潔的好厲害(如下)

function quickSort(arr) {
  if (arr.length < 2) return arr
  const [p, ...ary] = arr
  const left = [], right = []

  ary.forEach(c => {
    if (c < p) left.push(c)
    else right.push(c)
  })

  return [...quickSort(left), p, ...quickSort(right)]
}