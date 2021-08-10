
// # 在最後面加上 ! 代表告訴 TS 我這邊一定有一個值，所以你不用跟我報錯，你就是給做就對了！

// const anchor = document.querySelector('a')!;

// console.log('anchor.href =>', anchor.href);

// if(anchor) {
//   console.log('anchor.href =>', anchor.href);
// }

// console.log('anchor.href =>', anchor.href);

// const form = document.querySelector('form')!;
const form = document.querySelector('.new-item-form') as HTMLFormElement;
console.log(form.children);

// inputs
const type = document.querySelector('#type') as HTMLSelectElement;
const tofrom = document.querySelector('#toform') as HTMLInputElement;
const details = document.querySelector('#details') as HTMLInputElement;
const amount = document.querySelector('#amount') as HTMLInputElement;

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  
  console.log(
    type.value,
    tofrom.value,
    details.value,
    amount.value
  );
})