<template>
  <div
    class="teamCircleBg"
    :style="{
      backgroundColor: team === 'a' ? '#ba0303' : '#2758a7',
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
    <div
      class="white-border"
      :style="{
        width: `${size - 10}px`,
        height: `${size - 10}px`,
      }"
    ></div>
    <text
      class="capital-text"
      :style="{
        fontSize: fontSize ? `${fontSize}px` : `${size / 2}px`,
      }"
      >{{ capital }}</text
    >
  </div>
</template>

<script>
export default {
  name: "team-capital-circle",
  props: {
    size: {
      type: Number,
      required: true,
    },
    team: {
      type: String,
      default: "a",
    },
    capital: {
      type: String,
      required: true,
    },
    fontSize: {
      type: Number,
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/default.less";

.teamCircleBg {
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.white-border {
  // border: 3px solid red;
  border-width: 3px;
  border-color: @white;

  border-radius: 50%;
  top: 5px;
  left: 5px;
  position: absolute;
  z-index: 2;
}

.capital-text {
  color: @white;
  font-weight: bold;
}
</style>
