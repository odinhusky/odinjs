<script setup lang="ts">
const el = ref<HTMLElement | null>(null)

// 這裡我們手動解構 x, y，並觀察 style 的變化
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 100, y: 100 },
  // 增加這個設定可以防止拖曳到一半卡住
  preventDefault: true
})
</script>

<template>
  <div ref="el" :style="style" class="draggable-box">
    <p>🚀 拖曳測試中</p>
    <p>座標：{{ Math.round(x) }}, {{ Math.round(y) }}</p>
  </div>
</template>

<style scoped>
.draggable-box {
  /* 關鍵修正：一定要有定位，style 裡的 left/top 才會動 */
  position: fixed;
  touch-action: none; /* 防止行動裝置上的捲動干擾 */
  user-select: none; /* 防止拖曳時選取到文字 */

  /* 樣式美化 */
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: move;
  z-index: 9999;
}
</style>
