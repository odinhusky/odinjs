// Adding New Utilities
// 新增自己的 Utilities

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .scroll-snap-none {
    scroll-snap-type: none;
  }
  .scroll-snap-x {
    scroll-snap-type: x;
  }
  .scroll-snap-y {
    scroll-snap-type: y;
  }
}

// 編譯完之後就會有了

// 同時也支援 responsive 的設定

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @variants responsive {
    .scroll-snap-none {
      scroll-snap-type: none;
    }
    .scroll-snap-x {
      scroll-snap-type: x;
    }
    .scroll-snap-y {
      scroll-snap-type: y;
    }
  }
}

// 但我還希望加上 hover 或是 focus

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @variants responsive, hover, focus {
    .scroll-snap-none {
      scroll-snap-type: none;
    }
    .scroll-snap-x {
      scroll-snap-type: x;
    }
    .scroll-snap-y {
      scroll-snap-type: y;
    }
  }
}

// 如果現在有不同的圓形的話，要怎麼撰寫自己的 utitlties

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @variants responsive, hover, focus {
    .cicle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .circle-red {
      background-color: red;
    }

    .circle-blue {
      background-color: blue;
    }

    .circle-black {
      background-color: black;
    }
  }
}

// 這樣子就可以套用嚕～
<div class="circle circle-black hover:circle-red md:circle-blue"></div>
