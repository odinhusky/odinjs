<template>
  <div class="__ag__msg-list-item__">
    <ag-ipx :bg="bg" :image="image"></ag-ipx>
    <div class="__ag__msg-title__">
      <div class="__ag__backdiv__" @click="__ag__onBackPress__">
        <text class="agiconfont __ag__back__">&#xe61d;</text>
      </div>
      <text style="width: 100px; text-align: center" class="__ag__msg_text__"
        >群聊</text
      >
      <div class="__ag__backdiv__"></div>
    </div>
    <div class="__ag__msg-search__">
      <input
        class="__ag__msg-search-input__"
        :class="[env.brand == 'bl' ? '__ag__msg-search-input_bl__' : '']"
        :hideDoneButton="true"
        type="text"
        placeholder="搜索"
        ref="inputref"
        v-model="searchVal"
        return-key-type="search"
        @focus="__ag__focus__"
        @blur="__ag__blur__"
      />
      <text class="search-text" v-if="isSearch" @click="__ag__cancel__"
        >取消</text
      >
    </div>
    <scroller
      class="__ag__msg-content__"
      :show-scrollbar="false"
      :class="[
        ipx ? '__ag__msg-contentipx__' : '',
        ivx && ipx ? '__ag__msg_ivx__' : '',
      ]"
    >
      <refresh
        class="__ag__refresh__"
        @refresh="onrefresh"
        @pullingdown="onpullingdown"
        :display="a__ag__refreshing__ ? 'show' : 'hide'"
      >
        <loading-indicator class="__ag__loading__"></loading-indicator>
        <text class="__ag__refreshtext__">{{ a__ag__freshText__ }}</text>
      </refresh>
      <div
        class="list-item-swipe"
        v-for="item in groupList2"
        @click.stop="__ag__onchat__(item)"
        :key="item.id"
      >
        <div class="list-item-left">
          <div class="__ag__group_item__">
            <text class="agiconfont group-icon">&#xe67e;</text>
          </div>
        </div>
        <div class="list-item-right">
          <div class="list-item-content">
            <text class="name-text"
              >{{ item.groupName }}（{{
                item.joinMap && item.joinMap.g && item.joinMap.g.amount
              }}）</text
            >
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import agMinix from "./components/__ag__minix__.js"
import agMinUrl from "./components/__ag__minurl__.js"
import util from "./components/util.js"
import ipx from "./components/__ag__ipx__.vue"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-ipx": ipx,
  },
  data() {
    return {
      groupList: [],
      searchVal: "",
      isSearch: false,
      a__ag__isFreshing__: false,
      a__ag__freshing__: false,
      a__ag__triggered__: false,
      a__ag__freshText__: "释放更新",
      a__ag__refreshing__: false,
    }
  },
  computed: {
    groupList2() {
      let w = this.searchVal.toUpperCase()
      return this.groupList.filter((r) => {
        if (r.userHide == 2) {
          return false
        }

        if (w && r.groupName && r.groupName.indexOf(w) == -1) {
          return false
        }
        return true
      })
    },
  },
  mounted() {},
  methods: {
    async onrefresh() {
      this.a__ag__refreshing__ = true
      this.a__ag__freshText__ = "加载中..."
      this.__ag__onRefresh__()
    },
    onpullingdown() {
      this.a__ag__freshText__ = "释放更新"
    },
    async __ag__onRefresh__() {
      if (this.a__ag__freshing__) return
      this.a__ag__freshing__ = true
      this.a__ag__isFreshing__ = true
      if (!this.a__ag__triggered__) {
        this.a__ag__triggered__ = true
      }
      await this.__ag__loadData__()
    },
    async __ag__loadData__() {
      try {
        let resp = await this.__ag__listGroup__()
        this.a__ag__refreshing__ = false
        this.a__ag__freshing__ = false
        this.a__ag__triggered__ = false
        this.a__ag__isFreshing__ = false
        if (!resp.data || !resp.data.length) {
          this.groupList = []
          return
        }
        this.groupList = resp.data
      } catch (error) {
        console.log(error)
      }
    },
    __ag__cancel__() {
      this.searchVal = ""
    },
    __ag__focus__() {
      this.isSearch = true
    },
    __ag__blur__() {
      this.isSearch = false
    },
    __ag__onchat__(item) {
      let params = {
        uid: item.groupId + "",
        type: 2,
      }
      util.getPush("__ag__chat__", params)
    },
    __ag__onBackPress__() {
      util.pop()
    },
  },
}
</script>
<style scoped lang="less">
@import "./style/theme.less";
.__ag__msg-list-item__ {
  position: fixed;
  top: 0;
  bottom: 66wx;
  background-color: @gray20;
}
.__ag__msg-title__ {
  width: 750px;
  height: 44wx;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: @black10;
  background-color: @gray14;
  background-image: @bg-image;
  position: relative;
}
.__ag__msg_text__ {
  color: @modify-finsh;
}
.__ag__msg-search__ {
  width: 750px;
  padding: 16wx;
  padding-top: 8wx;
  padding-bottom: 8wx;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.__ag__msg-search-input__ {
  flex: 1;
  height: 32wx;
  border-radius: 4wx;
  text-align: center;
  background-color: @gray15;
  border-style: solid;
  border-width: 2px;
  border-color: @primary;
  border-radius: 77px;
  placeholder-color: @primary;
}
.__ag__msg-search-input_bl__ {
  background-color: @yellow2;
}
.search-text {
  width: 32wx;
  height: 32wx;
  line-height: 32wx;
  text-align: center;
  margin-left: 8wx;
  font-size: 15wx;
}
.__ag__msg-content__ {
  width: 750px;
  position: absolute;
  top: 230px;
  bottom: 0;
  background-color: @white;
  padding-bottom: 20px;
}
.__ag__msg-contentipx__ {
  top: 252px;
  padding-bottom: 34px;
}
.__ag__msg_ivx__ {
  top: 272px;
  padding-bottom: 34px;
}
.list-item-swipe {
  width: 750px;
  height: 65wx;
  padding-left: 16wx;
  padding-right: 16wx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.list-item-left {
  position: relative;
  overflow: unset;
  flex-direction: row;
  align-items: center;
}
.list-item-right {
  flex: 1;
  height: 65wx;
  display: flex;
  flex-direction: row;
  margin-left: 12wx;
  padding-bottom: 16wx;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: @black10;
}
.list-item-content {
  height: 65wx;
  flex: 1;
  flex-direction: row;
  align-items: center;
}
.name-text {
  height: 20wx;
  line-height: 20wx;
  flex: 1;
  text-overflow: ellipsis;
  lines: 1;
  font-size: 17wx;
  color: @black90;
}
.__ag__group_item__ {
  width: 48wx;
  height: 48wx;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: @gray2;
  margin-right: 12wx;
}
.group-icon {
  color: @black90;
  font-size: 25wx;
}
.group-text {
  font-size: 17wx;
  color: @black90;
}
.__ag__backdiv__ {
  width: 100px;
  height: 88px;
  align-items: center;
  justify-content: center;
}
.__ag__back__ {
  color: @modify-finsh;
  font-size: 50px;
}
.__ag__refresh__ {
  width: 750px;
  padding: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__refreshtext__ {
  margin-left: 30px;
}
.__ag__loading__ {
  color: @black;
}
</style>
