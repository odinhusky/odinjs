// functions
/**
 * @author odin
 * @description 繪製bingo卡以及綁定換一張bingo卡的事件
 */
function initAll() {
  document.getElementById('reload').onclick = anotherCard;
  newCard();
}

/**
 * @author odin
 * @description 換一張bingo 卡
 */
function anotherCard() {
  for (var i = 1; i < usedNums.length; i++) {
    usedNums[i] = false;
  }
  newCard();
  return false;
}

/**
 * @author odin
 * @description 繪製一張bingo卡
 */
function newCard() {
  for (var i = 0; i < 24; i++) {
    setSquare(i);
  }
}

/**
 * @author odin
 * @description 隨機取得一個整數
 */
function getNewNum() {
  return Math.floor(Math.random() * 15);
}

/**
 * @author odin
 * @description 設定值到每一格並且綁定 toggleColor 的點擊事件
 */
function setSquare(thisSquare) {
  var currSquare = 'square' + thisSquare;
  var colPlace = new Array(
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
  );
  var colBasis = colPlace[thisSquare] * 15;
  var newNum;

  do {
    newNum = colBasis + getNewNum() + 1;
  } while (usedNums[newNum]);
  usedNums[newNum] = true;
  document.getElementById(currSquare).innerHTML = newNum;
  document.getElementById(currSquare).className = '';
  document.getElementById(currSquare).onmousedown = toggleColor;
}

/**
 * @author odin
 * @description 處理換色以及資料處理的 function
 */
function toggleColor(evt) {
  var number = parseInt(evt.target.innerHTML);

  if (evt) {
    var thisSquare = evt.target;
  } else {
    var thisSquare = window.event.srcElement;
  }

  // 顏色處理
  if (thisSquare.className == '') {
    thisSquare.className = 'pickedBG';
  } else {
    thisSquare.className = '';
  }

  // 資料處理
  toggleNumber(number, pickedList);

  checkWin();
}

/**
 * @author odin
 * @description 資料處理，並且更新目前選到的數字，是否Bingo的確認
 */
function toggleNumber(number, pickedList) {
  // 在 pickedList 裡面該數值的 index
  var pIndex;

  if (pickedList.includes(number)) {
    // 有找到了～所以移除該數字

    // 先找到在陣列中的index
    pickedList.forEach(function (item, i) {
      if (item === number) {
        pIndex = i;
      }
    });

    // 移除
    pickedList.splice(pIndex, 1);
  } else {
    // 沒找到所以新增該數字
    pickedList.push(number);
  }

  updatePickedNumber();
}

/**
 * @author odin
 * @description 更新選中的數字
 */
function updatePickedNumber() {
  var text = pickedList.join(' ,');

  $('#picked_list').text(text);
}

/**
 * @author odin
 * @description 確認是否Bingo
 */
function checkWin() {
  var winPattern = {
    // 水平
    lane1: ['#square0', '#square5', '#square10', '#square14', '#square19'],
    lane2: ['#square1', '#square6', '#square11', '#square15', '#square20'],
    lane3: ['#square2', '#square7', '#free', '#square16', '#square21'],
    lane4: ['#square3', '#square8', '#square12', '#square17', '#square22'],
    lane5: ['#square4', '#square9', '#square13', '#square18', '#square23'],
    // 垂直
    verti1: ['#square0', '#square1', '#square2', '#square3', '#square4'],
    verti2: ['#square5', '#square6', '#square7', '#square8', '#square9'],
    verti3: ['#square10', '#square11', '#free', '#square12', '#square13'],
    verti4: ['#square14', '#square15', '#square16', '#square17', '#square18'],
    verti5: ['#square19', '#square20', '#square21', '#square22', '#square23'],
    // 斜線
    slashl: ['#square0', '#square6', '#free', '#square17', '#square23'],
    slashr: ['#square19', '#square15', '#free', '#square8', '#square4'],
  };

  var winTitle = Object.keys(winPattern);
  var winCounts = 0;

  winTitle.forEach(function (item) {
    var bingoCheck = winPattern[item].every(function (item2) {
      console.log('item2', $(item2).hasClass('pickedBG'));
      return $(item2).hasClass('pickedBG');
    });

    if (bingoCheck) {
      winCounts++;
    }
  });

  // update bingo counts
  $('#bingo_counts').text(winCounts);
}

// 變數
var usedNums = new Array(76);
var pickedList = [];

// 一開始執行的順序
window.onload = initAll;
