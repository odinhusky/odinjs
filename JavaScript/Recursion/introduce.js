// 參考圖片1
// What's Recursion?
// 大家都學過高中數學，如果想用程式寫一個階層 5! = 5 x 4 x 3 x 2 x 1 = 120 怎麼做呢?

function recursion(a) {
  return (function (b = a - 1) {
    return (function (c = b - 1) {
      return (function (d = c - 1) {
        return (function (e = d - 1) {
          return a * b * c * d * e;
        })();
      })();
    })();
  })();
}
console.log(recursion(5)); // 120

// 恩，似乎是非常笨的方法，因為其實一直在重覆一樣的方法。那改成遞迴怎麼做呢 ?

function recursion(num) {
  if (num == 1) {
    return 1;
  } else {
    return num * recursion(num - 1);
  }
}
console.log(recursion(5)); // 120

// 是不是簡潔多了！所以遞迴簡單來說就是 => 在函式之中呼叫函式自己本身

// 補充
// 之所以可以這樣寫，是因為函式堆疊（stack）在執行時是後進先出，當函式呼叫另一個函式時，需要等到裡面的函式執行完產生結果後，才會繼續回來執行自己的函式內容。

// 推薦邦友寫的 Event Loop 機制 => https://ithelp.ithome.com.tw/articles/10214017

// 若問題有同樣 pattern 在裡面，例如俄羅斯娃娃長得ㄧ模有樣只是尺寸會等比例變小、階層每一個數字都是前一個 - 1，就非常適合用遞迴解。遞迴好處就是程式碼簡潔好懂，但缺點就是效能通常會比較差。而且一定要設不再呼叫函式的條件防止無窮遞迴程式當掉

function recursion() {
  console.log('recursion ');
  recursion();
}
recursion(); // 哭哭 無窮遞迴

// Big O (2^n) Fibonacci 費波那契
// Fibonacci 是使用遞迴的著名例子，為了怕接下來文章太硬，就先來看個影片，證明演算法不只是紙上的數學而已。大自然隨處都可見 ! (講者講到臉上都在發光，我甚麼時候看演算法才能這樣)

// https://www.youtube.com/watch?time_continue=379&v=SjSHVDfXHQ4&feature=emb_logo

// 看完之後應該對 Fibonacci 有個概念了，接下來就正式進到內文囉

// Fibonacci 費波那契序列指的就是
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...

// 參考圖片2

Fibonacci(0) : 0
Fibonacci(1) : 1
Fibonacci(2) : 1
Fibonacci(6) : 8

// 每個數字都是前兩個的總和, 0 + 1 = 1, 1+1 = 2, 2+1 = 3 以此類推

// 第 0 項 F(0) = 0
// 第 1 項 F(1) = 1
// 第 n 項 F(n ) = f( n-1 ) + f( n-2 ) // 第 n-1 項 + 第 n-2 項

// 參考圖片3

// 觀察 Big O
// 圖解 F(5) 如上圖

// 每次步驟變兩倍
// 總共有 n 層,
// 時間複雜度是 O(2^n)

// 參考圖片4

// 每一項都分成 f(n-1) + f(n-2) 一直拆到 f(1) = 1, f(0) =0 為止, 然後再把它全部加起來 (黃色數字) 就等於 5，而總共要執行 15 次這個函式

// 時間複雜度為 O(2^n) , 也就是 2 的 n 次方. 實際上來說這樣的執行速度非常慢, 例如 input 是 100 時，執行步驟會暴增到 30 位數．這樣的時間複雜度在設計演算法需要避免 (需要優化，例如存進 cache，明天篇章會提到 )

function F(num){

	if(num == 0){
		return 0;
	}else if(num == 1){
		return 1;
	}else{
		return F(num - 1) + F(num - 2)
	}
}
F(5); // 5

// What's dynamic programming?
// 「計算並儲存小問題的解，並將這些解組合成大問題的解。」

// 這邊先記幾個關鍵字 "儲存"、"小問題" 、"組合"、"大問題"。所以基本上一個問題假如能符合以下就可以使用動態規劃來思考

// 可以拆成很多小問題
// 答案可以透過組合小問題來解
// 小問題重覆量很高

// 雖然動態規劃跟遞迴並不相同，遞迴是函式呼叫函式，而動態規劃一種設計演算法的範型。但他們還是常常被擺在一塊，因為也可以說動態規劃常被拿來優化純遞迴。怎麼說呢?
// 以上一篇介紹的遞迴著名例子 Fibonacci 來說好了

// 參考圖片5

// 會發現其實 Fibonacci 序列一直再重覆計算一樣的東西，例如 F(1) 被重覆算了 5 次，F(2) 被重覆算了 3 次。
// 如果我們先"儲存" 這些 "小的值" (減少再次需要被重覆計算)，再 "組合" 成最後 "大結果"，不就可以優化了嗎？

// 參考圖片6

// 只有黃色部分需要計算，其他都是重覆的不需要再計算一次浪費效能

// 實際操作
// 檢驗數字是否已經存在 cache 當中
// 如果這個數字已經在 cache 中，則使用這個數字
// 如果這個數字不在 cache 中，把它算出來後放在 cache 中，因此可以在未來被使用

// 程式碼

let count = 0 // 拿來計算函式執行次數
let yellowCoount = 0; // 拿來計算不在 cache 裡的
function Fibonacci (num, cache = []){
	count ++;
	if(cache[num]){
		return cache[num]
	}else{
		// yellowCoount
		yellowCoount ++;
		if(num == 0){
			cache[num] = 0;
		}else if(num == 1){
			cache[num] = 1;
		}else{
			cache[num] = Fibonacci(num - 1, cache) + Fibonacci(num - 2, cache)
		}
		return cache[num]
	}
	
}
Fibonacci(5); //  
console.log(count) // 9
console.log(yellowCoount) // 6


// 會發現沒有在 cache 裡的只有黃色部份 6 個，而去存取 cache 裡值有 3 次，所以總共執行 9 次函式，比沒有存 cache 的 15 次少．

// 觀察 Big O
// 算每一項的同時我們需要去讀取前兩項的值

// 每次需要 3 個步驟
// 總共需要算 n-1 次,
// 總共的步驟數是 3(n-1) ，拔掉係數後時間複雜度是 O(n)
// 優化後的 Fibonacci 從 Big O(2^n) 變到 Big O(n)，效能進步超驚人。當 input 越多，就會感受差異更多

// n	正常 F(n)	優化 F(n)
// 3	5	5
// 5	15	9
// 7	41	13
// 10	177	19
// 20	21891

// 其實我對動態規劃也還在很粗淺的認識階段。連著名的背包問題跟換零錢問題都還沒做過，所以能說的也不太多。有邦友寫動態規劃百題之經典、理論與實作，有興趣可以連去看 ~

// => https://ithelp.ithome.com.tw/users/20112376/ironman/2672

// [LeetCode #322] Dynamic Programming

// 322. Coin Change
// 不得不承認用動態規劃思考對於新手門檻真的頗高，不過這題實在太經典了，還是要練習一下。

// Question:
// You are given coins of different denominations and a total amount of money amount. 
// Write a function to compute the fewest number of coins that you need to make up that amount. 
// If that amount of money cannot be made up by any combination of the coins, return -1.

// Note:
// You may assume that you have an infinite number of each kind of coin.

// Example 1:

// Input: coins = [1, 2, 5], amount = 11
// Output: 3 
// Explanation: 11 = 5 + 5 + 1
// Example 2:

// Input: coins = [2], amount = 3
// Output: -1

// * @param {number[]} coins
// * @param {number} amount
// * @return {number}
// */
// var coinChange = function(coins, amount) {
   
// };

// 轉成圖片大家可能比較好懂到底要幹嘛

// 參考圖片 7

// 一開始腦中可能像我一樣一片空白，不過先不要這麼貪心急著找答案，就先用最簡單想法來試試吧。

// Think
// 極限值/特殊狀況
// 有可能有負的面額

// 大概會怎麼解
// 試想假如每種面額的硬幣都會用到
// $1 + 10 = 11
// $2 + 9 = 11
// $5 + 6 = 11

// 參考圖片 8

// 接下來 10、9、6 又可以寫成兌換硬幣的組合，例如 10 = 5 + 5, 9 = 5 + 2 + 2, 6 = 5 + 1

// 總結以上，由於我們要找出最少數目，所以可以這樣想

f(11) = Math.min(1 + f(10), 1 + f(9), 1 + f(6))

// 其中 1 分別代表兌換面額 $1、$2、$5 的數量，而 f(n) 表示兌換 n 元所需最少數量。程式可以簡化成

f(11) = Math.min(f(10), f(9), f(6))

// 然後繼續跟一直重覆步驟直到找到 f(0)，f(0) 代表當下硬幣數量就可以代表需要的錢，
// ex. f(5) = 1 + f(0), 1 代表 $5，只要 1 個 $5 就可以達到 amount 5

// 分解步驟

// 第一次
f(11) ＝ Math.min(1 + f(10), 1 + f(9), 1 + f(6))

// 第二次
f(10) = Math.min(1 + f(9), 1 + f(8), 1 + f(5)) 
f(9) = Math.min(1 + f(8), 1 + f(7), 1 + f(4))
f(6) = Math.min(1 + f(5), 1 + f(4), 1 + f(1))

// 第三次
f(9)) = Math.min(1 + f(8), 1 + f(7), 1 + f(4))
f(8) = Math.min(1 + f(7), 1 + f(6), 1 + f(3))
f(5) = Math.min(1 + f(4), 1 + f(3), 1 + f(0))  // 看到 f(0) 了

// 看到 f(0) 代表找到啦
// amount 5 只有一種方式就是直接拿 1 個 $5，往回推算

f(5) = 1
f(10) = 1+ 1 = 2
f(11) = 1 + 2

// 所以答案 2 個 $5，1 個 $1，總共 3 個硬幣，答案就是 3

// 參考圖片 9

// 哪種資料結構解
// 思考了之後才會知道會往動態規劃方向走

// 完整程式碼
// 今天工作實在太忙，連在飛機上都還努力拼寫鐵人賽!
coinChange([1,7,8],35);
var coinChange = function(coins, amount) {
  if (!amount || !coins.length) {
      return 0;
  }

  let out = [0];
  let i, l;
  let index = 1;

  while (!out[amount]) {

      out[index] = Infinity;

      for (i = 0, l = coins.length; i < l; i++) {

          if (coins[i] <= index) {
              out[index] = Math.min(out[index], 1 + out[index - coins[i]]);
          }

      }
      index++;
  }

  console.log('out', out);

  return out[amount] === Infinity ? -1 : out[amount];
};

// 會提到 Two Pointer，除了 LeetCode 有一個類別是 "Two Pointer"，另外認為很適合拿來入門刷題。因為剛開始刷題總是很容易朝著 Big O(n²) 方向想，例如以下

for (var i = 0; i < len - 1; i++) {
  for (var j = i + 1; j < len; j++) {
		...
	}
}

// 又或是

for(){
	// 包 map/indexOf/find 這樣基本上都是遍歷兩次 Big O(n²)
}


// for 一次、indexOf 一次。然後為了題目順序又 sort 一次。時間複雜度已是比 Big O (n²) 還差。難怪解出來是
// Runtime: 400 ms, faster than 5.94% of JavaScript online submissions 效能超差

// 用 Two Pointer 方向想吧

// 參考圖片10

// Two pointer 直接翻譯就是兩個指針(廢話)，以這題來說就是 pointer 跟 ind，我們來想一下題目，題目說已經按照大小排好了

// num[pointer] + num[ind] < targer，兩個總和若太小則 pointer ++，讓他總和變大

// 參考圖片11

// num[pointer] + num[ind] > targer，兩個總和若太大 ind -- ，讓他總和變小

// 參考圖片12

// 完整程式碼

var twoSum = function(numbers, target) {
  let pointer = 0;
  let len = numbers.length
  let ind = len - 1

  while( target !== numbers[ind] + numbers[pointer]){
      target > numbers[ind] + numbers[pointer] ? pointer ++ : ind --;
  }

  return [pointer+1, ind+1];
};

// 以上

