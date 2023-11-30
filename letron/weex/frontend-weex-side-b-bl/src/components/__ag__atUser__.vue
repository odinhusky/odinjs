<template>
  <div class="__ag__atuser__">
    <text class="agiconfont __ag__atuserclose__" @click="onclose"
      >&#xe64b;</text
    >
    <scroller class="__ag__atuser__" :show-scrollbar="false">
      <div
        class="__ag__atuseritem__"
        @click="atUser(item)"
        v-for="item in list"
        :key="item.uid"
      >
        <ag-user
          :avatar="item.avatar"
          :name="item.userNicename"
          :isRadius="false"
          class="__ag__atuseritemimg__"
        ></ag-user>
        <text class="__ag__atuseritemtext__">{{ item.userNicename }}</text>
      </div>
    </scroller>
  </div>
</template>

<script>
import userimg from "./__ag__userImg__.vue"
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  components: {
    "ag-user": userimg,
  },
  data() {
    return {}
  },
  methods: {
    onclose() {
      this.$emit("onclose")
    },
    atUser(item) {
      this.$emit("atUser", item)
    },
  },
}
</script>
<style scoped land="less">
@import "../style/theme.less";
.__ag__atuser__ {
  flex: 1;
  position: relative;
}
.__ag__atuseritem__ {
  width: 750px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 112px;
  padding: 32px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f2f3f4;
}
.__ag__atuseritemimg__ {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.__ag__atuserclose__ {
  font-size: 20wx;
  position: absolute;
  top: 32px;
  right: 32px;
  color: rgba(0, 0, 0, 0.4);
}
.__ag__atuseritemtext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 17wx;
  color: #000000;
}
</style>
