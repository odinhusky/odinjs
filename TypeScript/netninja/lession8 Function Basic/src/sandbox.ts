let greet: Function;

// greet = 'hello';

greet = () => {
  console.log('hello, again');
}

// # 如果要表示參數是預設的，可以有兩種表示方式
// $ 第一種就是沒有預設值，只指定參數名稱以及型態時，需要在 : 之前加上 ?，表示預設的參數
// % 第二種就是有預設值，指定參數名稱、型態以及預設值時，"不"需要在 : 之前加上 ?
// - 在傳完參數之後的小括弧後方，如果有寫類型，代表這個函式會回傳的資料類型，如果為 void 則為不會回傳任何資料的函式

const add = (a: number, b: number, c?: number | string, d: boolean = false): void => {
  console.log(a + b);
  console.log('default => c', c);
  console.log('default => d', d);
}

add(5, 10, 'string')

const minus = (a: number, b: number): number => (a - b);

// ! 這邊不用特別宣告 result 的類型，ts 會自己判斷函式回傳的內容確定 result 的類型
let result = minus(10, 9);