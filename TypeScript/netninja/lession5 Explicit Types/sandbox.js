// ? explicit types
// 知道這個變數是什麼類型但一開始不知道要給什麼值
var character;
var age;
var isLogined;
// age = 'luigi'
age = 30;
// isLogined = 1;
isLogined = false;
// # arrays
// 如果要定義陣列的資料型別有哪些就如下所示
var ninjas;
// ninjas.push('abc') // 因為還沒定義明確的陣列實字，所以不能使用push的方式
ninjas = ['yoshi', 'mario'];
// 必須再給予陣列之後，才能夠使用陣列的相關原生方法
ninjas.push('odin');
// # union types
// 想要給予不同的種類的值的宣告
var mixed = [];
mixed.push(30);
mixed.push('odin');
// mixed.push(true);
var uid;
uid = '123';
uid = 123;
// & Object
var ninjaOne;
ninjaOne = { name: 'yoshi', age: 30 };
var ninjaTwo = {
    name: 'mario',
    age: 23,
    beltColour: 'black'
};
console.log('ninjaTwo => ', ninjaTwo);
