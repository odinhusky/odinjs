var character = 'odin';
console.log(character);
var inputs = document.querySelectorAll('input');
console.log(inputs);
inputs.forEach(function (input) {
    console.log(input);
});
// Compile
// tsc <要轉換ts檔案> <要被轉換的檔案路徑以及名稱>
// 如果js與ts的名稱相同，則只需要輸入 => tsc <要轉換ts檔案>
// Compiling Watch
// tsc <要轉換ts檔案> <要被轉換的檔案路徑以及名稱> -w
