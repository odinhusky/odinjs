export default {
  // 資料
  data: ['1', '2', '3'],
  // 事件
  removeData(id) {
    this.data.splice(id, 1);
    this.render();
  },
  // 渲染方法
  render() {
    const list = document.querySelector('.component ul');
    let content = '';
    console.log('this.data', this.data);
    this.data.forEach((item, i) => {
      content += `<li>${item} <button type="button" class="delete_this" data-id="${i}"">刪除</button></li>`;
    });

    list.innerHTML = content;

    const btns = document.querySelectorAll('.delete_this');

    btns.forEach((btn) =>
      btn.addEventListener('click', (e) => {
        this.removeData(e.target.dataset.id);
      }),
    );
  },
  // 進入這個畫面第一次會觸發的方法

  init() {
    this.render();
  },
};
