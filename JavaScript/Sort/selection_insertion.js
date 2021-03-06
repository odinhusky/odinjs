// 排序 2 : 選擇排序 Selection Sort & 插入排序 Insertion Sort

// https://ithelp.ithome.com.tw/articles/10218442

// 選擇排序同樣很好理解，但效能也相對差 (好理解效能都很差就是)，他跟 Bubble Sort 不一樣的是， Bubble 是每次兩兩比較然後決定是否交換位置，選擇排序是每輪比完才交換位置

// 參考 gif 2

// 觀察步驟
// 隨便找一個數字當初始值開始(通常會從位置第一個的數字開始)。

// 找出最小值
// 每輪結束就把最小值跟初始值交換位置

// 實際操作
// 一樣的題目操作排序

// before sort
[8, 9, 2, 5, 1]
// after sort
[1, 2, 5, 8, 9]

// 第一輪開始,目標要找出最小值，先定義 min = 無限大
[8, 9, 2, 5, 1] // 比較 8 跟 min 大小， min(無限大) > 8，所以 min = 8
 -
[8, 9, 2, 5, 1] // 8(min) < 9 。所以 min 不動還是 8
    -
[8, 9, 2, 5, 1] // 8(min) > 2 所以 min 變成 2
       -
[8, 9, 2, 5, 1] // 2 < 5 所以 min 不動還是 2
          -
[8, 9, 2, 5, 1] // 2 > 1 所以 min 變成 1

// 此輪比完之後 8 跟 1 交換
[8, 9, 2, 5, 1]
--           --
最           min
開
始
比
的

[1, 9, 2, 5, 8]
--           --

// 第一輪比完了，總共比了 n 次，然後知道最小值是 1

// 第二輪開始，目標找出第二小的，min = 無限大
[1, 9, 2, 5, 8] // 從第二個開始比就好 min > 9, min = 9
    -
[1, 9, 2, 5, 8] // 9(min) > 2, min = 2
       -
[1, 9, 2, 5, 8] // 2 < 5, min = 2
          - 
[1, 9, 2, 5, 8] // 2 < 8, min = 2
             - 
// 此輪比完之後 9 跟 2 交換
[1, 9, 2, 5, 8] 
    -- -- 
    最 第
    開 二
    始 小
    比
    的 

[1, 2, 9, 5, 8]
    -- --

// 第二輪比完了，總共比了 n - 1 次，然後知道第二小值是 2。接下來以此類推

// 第三輪開始 比 n -2 次完結果
[1, 2, 5, 9, 8]
       -  -
// 第四輪開始 比 n -3 次完結果
[1, 2, 5, 8, 9]
          -  -

// 觀察 Big O
// 總共比了 n -1 輪，第一輪比 n 次，第二輪比 n -1 次，第 n -1 輪比了 1 次
// 時間複雜度是 (n + 1) * (n-1) / 2 ，扣掉係數就是 O(*2)

// 程式碼
function SelectionSort(array){
	let len = array.length;
	let indexMin;
	// 總共比 n -1 輪
	for(let j = 0; j < len - 1; j++){
		indexMin = j;
		// 比較次
		for(let i = j; i < len; i++){
			if(array[indexMin] > array[i]){
				indexMin = i
			}
			
		}
		// 比完這一輪才交換
		swap(array, j, indexMin)
		
	}
	return array;
}



console.log(SelectionSort([8, 9, 2, 5, 1])); 
// [1, 2, 5, 8, 9]


// ===============================================================================================

// O(n²) 插入排序 Insertion Sort

// 參考圖片1

// 插入排序就是你玩撲克牌接龍會用到的排序法，以同樣例子繼續，假如你已經拿了兩張牌 8, 9, 然後要抽暗牌

// 參考圖片2

// 翻開第三張牌時發現是 2，你就會把 2 放入 8 跟 9 前面對吧。這就是插入排序。

// 參考圖片3

// 我覺得插入排序比較特別是每輪排序時只要關注前面的值(已經被翻開的)，不用管沒被翻開的排

// 參考 gif 3

// 跟 Bubble search 也不一樣，雖然 Bubble search 也會兩兩交換，但每輪結束會知道最大值。插入排序只會每輪只會排出當下明牌的順序而已

// 觀察步驟
// 目前值跟前面比較

// 目前值 < 前面值，交換位置
// 目前值 >= 前面值，位置不動
// 實際操作
// (以下操作 |n| 表示暗牌)

// 第一輪開始
[8, 9, |2|, |5|, |1|] // current = 9 開始，然後跟前面的比
 -  -
[8, 9, |2|, |5|, |1|] // 9 > 8 所以位置不變

// 第一輪比完了，總共比了 1 次

// 第二輪開始，撲克牌翻到 2 
[8, 9, 2, |5|, |1|]  //  current = 2，然後跟前面的比
    -  -
[8, 2, 9, |5|, |1|]  // 2 < 9 所以交換位置，然後 current 繼續跟前面的比
 -  -
[2, 8, 9, |5|, |1|]  // 2 < 8 所以交換位置

// 第二輪比完了，總共比了 2 次

// 第三輪開始
[2, 8, 9, 5, |1|]
          -
// 第三輪結束
[2, 5, 8, 9, |1|] // 總共比了 3 次

// 第四輪開始
[2, 8, 9, 5, 1]
             -
// 第四輪結束
[1, 2, 5, 8, 9] // 總共比了 4 次

// 觀察 Big O
// 總共比了 n -1 輪(4輪)，第一輪比 1 次，第二輪比 2 次，第 n - 1 輪比了 n - 1次
// 時間複雜度是 (1 + n-1)*(n-1) / 2
// 時間複雜度會忽略所有係數，所以是 O(n*2)
// 程式碼
// 假如前兩個排序都有一起寫 js 的話，這一次寫出來應該快很多了

function insertSort(array){
  let len = array.length
  let count = 0;

	// 總共比 n -1 輪
	for(let j = 0; j < len - 1; j++){
		// 比較次
		for(let i = j + 1; i > 0 ; i--){
			count ++;
			if(array[i] < array[i - 1]){
				swap(array, i - 1, i)
			}
		}
	}
	console.log(count)
	return array;
}

console.log(insertSort([8, 9, 2, 5, 1]));  
// [1, 2, 5, 8, 9]
// count = 10

// 坦白說，現在太多 shortcut 提供我們使用，不管是 js 內建方法或是 loadash 等等，讓我們寫程式都一行就得到想要結果，例如以上面例子

[8, 9, 2, 5, 1].sort() // [1, 2, 5, 8, 9]

// 所以一開始用演算法思考的確不容易。但如何進一步思考這些方法背後是如何運作，就是成為資深工程師的過程啦。