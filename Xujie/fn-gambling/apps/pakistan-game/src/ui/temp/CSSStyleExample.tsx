import '@/styles/cssStyleExample.scss';

export const CSSStyleExample = () => {
  return (
    <div className="example-bg pa-20">
      <h1 className="example-h1">樣式規劃以及講解</h1>
      <p className="ma-b-20">
        1. 從就專案 india-game 搬動過來的 code可能包含 3 種樣式，
        <div className="ma-b-20 pa-l-20 ma-t-20">
          TailwindCSS classes: 為了讓專案可以兼容 TailwindCSS classes
          目前專案中也有設定對應現有
          india-game的斷點(tailwind.variables.[uVersion].ts)以及對應舊專案的(styles/[mode]/root.scss)。
        </div>
        <div className="ma-b-20 pa-l-20">
          Styled-Components:
          有必要的話請盡量轉換成BaseComponent或是一般Component，也可以是一般元素搭配className，全憑該元素的使用邏輯以及場景。
        </div>
        <div className="pa-l-20">
          SCSS/CSS: 直接搬移過來就可以使用，如果有錯誤的部分則依照提示排除。
        </div>
        <br />
        由於大方向是將 TailwindCSS 替換成 SCSS
        的寫法，之後開發的方向也建議盡量避免使用 TailwindCSS classes
        為主，可以撰寫等效的 CSS className 到 SCSS 的檔案中。
      </p>
      <p className="ma-b-20">
        2. 將 TailwindCSS 撰寫成等效的 SCSS 程式: 首先針對個別的 Component 進行
        SCSS 檔案的新增，基本上希望一個 Component 對應到一個自己的 scss
        檔案，簡單的 BaseComponent 可能使用現有 util class 也可能就滿足需求。
        <br />
        這種狀況的 scss 檔不需要在每一個不同的 版本下都建立一份
        scss檔案，而是採取共用的方式。如果有特定版本的元件需要使用到不同的樣式則一起在同一份
        scss 檔定義好之後，透過 cx 以及環境變數去添加應該要套用的 classname。
        <br />
        以目前的CSSStyleExample 為例，直接在styles的下方新增對應的
        cssStyleExample.scss，直接引用進來做樣式的對應。
      </p>
      <p className="ma-b-20">
        3.
        每一隻檔案目前會有以下幾支共用檔案，除了mixinscss以及utils.scss外，其他的放在各個不同的版本資料夾中
      </p>

      <div className="ma-b-20 pa-l-20">
        -- Root.scss: 這是依照india-game 定義的顏色，之後棄用 TailwindCSS
        的時候會移除。所包含的變數可以提供 TailwindCSS 直接用 var() 做取用，例如
      </div>

      <div className="ma-b-20 pa-l-20">
        -- var.scss: 這是定義該 uVersion
        相關使用到的顏色，之後也可以不只包含顏色，還可以包含間距或是固定的樣式，但不可以在這支檔案中定義共用的
        className。另外，將原本的程式移轉過來的時候，要將 var()
        移除，直接使用定義的變數。另外也不能使用被賦職的變數當作另一個變數的值。例如:
        <br />
        <code>
          --primary-main-from: #45ccf7;
          <br />
          --primary-main-to: --primary-main-from; (O)
          <br />
          --primary-main-to2: --primary-main-to;(X)
        </code>
      </div>

      <div className="ma-b-20 pa-l-20">
        -- bp.scss: 是使用 @mixin功能的斷點設計，這邊目前是維持跟
        tailwind.variables.[mode].ts
        中定義的一樣，根據不同的語意定義各個版本的斷點。使用的方式可以參照
        cssStyleExample.scss。
      </div>

      <div className="showDesk">我只在1024以上的情況顯示</div>

      <div className="ma-b-20 pa-l-20">
        -- mixin.scss: 方便開發的時候一些包裝過後的邏輯，使用 @mixin [name]
        做宣告，使用時則用 @include [name]做帶入，也可以像 function
        一樣傳入特定的值，就會輸出不同的結果，以做一個圓型形狀來說定義如下
        <div>{`@mixin circle($val: 20px) {`}</div>
        <div className="pa-l-12">{`width: $val;`}</div>
        <div className="pa-l-12">{`height: $val;`}</div>
        <div className="pa-l-12">{`border-radius: 50%;`}</div>
        <div>{`}`}</div>
        則在使用的時候就要
        <div>{`.class {`}</div>
        <div className="pa-l-12">{`@include circle(30px)`}</div>
        <div className="pa-l-12">{`background-color: red;`}</div>
        <div className="pa-l-12">{`...`}</div>
        <div>{`}`}</div>
      </div>

      <div className="ma-b-20 pa-l-20">
        -- utils.scss: 這是對於 tailwind 的學習，將常用的或是 spacing 類
        css屬性包裝成 utils class做使用，在測試或是快速調整間距的時候非常有用。
      </div>
    </div>
  );
};

export default CSSStyleExample;
