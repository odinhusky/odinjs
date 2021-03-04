const isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  /**
   * @return {boolean}
   */
  Wechat: function() {
    return /micromessenger/.test(navigator.userAgent.toLowerCase());
  },
  WechatMP: function() {
    return (
      /miniprogram/.test(navigator.userAgent.toLowerCase()) ||
      window.__wxjs_environment === 'miniprogram'
    );
  },
  any: function() {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

mobileDetect();

// if(isMobile.iOS()) {
//     if(window.location = 'https://www.apple.com/') {

//     } else {
//         window.location = 'https://www.apple.com/';
//     }
//     let div = document.createElement("div");
//     div.classList.add("downloadcontainer");
//     div.innerHTML = '<img class="downloadimgios" src="images/v1/app-store-badge_512.png" alt="">';
//     $('body').append(div);
//     div.addEventListener("click", function(e) {
//         console.log("Download!!");
//         window.location = 'https://www.apple.com/';
//     });
// }

// if(isMobile.Android()) {
//     if(window.location = 'https://www.google.com/') {

//     } else {
//         window.location = 'https://www.google.com/';
//     }
//     let div = document.createElement("div");
//     div.classList.add("downloadcontainer");
//     div.innerHTML = '<img class="downloadimgandroid" src="images/v1/google-play-badge_512.png" alt="">';
//     $('body').append(div);
//     div.addEventListener("click", function(e) {
//         console.log("Download!!");
//         window.location = 'https://www.google.com/';
//     });
// }

function mobileDetect() {
  if (window.sessionStorage.getItem('has_mobile_detected')) {
    return;
  }
  window.sessionStorage.setItem('has_mobile_detected', 'done');

  if (isMobile.WechatMP()) {
    if (isMobile.iOS()) {
      // 與微信 ios 相同
      return (window.location =
        'download-wechat-ios.html?' + window.location.pathname);
    }
    if (isMobile.Android()) {
      return (window.location =
        'download-wechat-mp-android.html?' + window.location.pathname);
    }
  }
  if (isMobile.Wechat()) {
    if (isMobile.iOS()) {
      return (window.location =
        'download-wechat-ios.html?' + window.location.pathname);
    }
    if (isMobile.Android()) {
      return (window.location =
        'download-wechat-android.html?' + window.location.pathname);
    }
  }

  if (isMobile.Android() || isMobile.iOS()) {
    return (window.location = 'index.html?' + window.location.pathname);
  }
}
