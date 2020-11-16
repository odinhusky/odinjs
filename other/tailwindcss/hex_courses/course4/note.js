// 1. 節省命名，雖然class名稱會很長，但可以直接控制元素的css行為

// 2. 如果都只使用 tailwind 的 class，但你的 css 容量不會再增加了(壓縮功能)

// 3. hover => hover:樣式名稱 | 點擊的時候 => active:樣式名稱 | 斷點 => md:樣式名稱

// 4. 將多個語法利用 @apply 來濃縮成一個 classname

// .btn {
//   @apply mt-6 cursor-pointer max-w-sm
// }

// 並且在套用在你要的html標籤上，就可以套用裡面的 utitlity
