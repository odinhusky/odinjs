// # array
let names = ['luigi', 'mario', 'yoshi'];

// name = ''

names.push('toad');
// names.push(4); // - 不能改動一開始不包含的資料種類，一開始只有字串，就只能改變成其他字串
// names[0] = 3

let numbers = [10, 20, 30, 40];
numbers.push(25)
// numbers.push('odin')

// - 想要其他內容，一開始就要宣告包含其他資料種類的陣列
let mixed = ['ken', 4, 'odin', 4, true];

mixed.push('odin2')
mixed.push(10)
// mixed.push({})

// & Object

const ninja = {
  name: 'mario',
  belt: 'black',
  age: 30
}

ninja.age = 40;
ninja.name = 'ryu';
// ninja.age = '30';  // 各個屬性還有自己的類型歸屬
// ninja.b = {}       // 不具新增物件屬性的功能