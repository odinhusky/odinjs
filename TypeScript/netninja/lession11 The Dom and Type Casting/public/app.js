"use strict";
// # 在最後面加上 ! 代表告訴 TS 我這邊一定有一個值，所以你不用跟我報錯，你就是給做就對了！
// const anchor = document.querySelector('a')!;
// console.log('anchor.href =>', anchor.href);
// if(anchor) {
//   console.log('anchor.href =>', anchor.href);
// }
// console.log('anchor.href =>', anchor.href);
// const form = document.querySelector('form')!;
var form = document.querySelector('.new-item-form');
console.log(form.children);
// inputs
var type = document.querySelector('#type');
var tofrom = document.querySelector('#toform');
var details = document.querySelector('#details');
var amount = document.querySelector('#amount');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(type.value, tofrom.value, details.value, amount.value);
});
