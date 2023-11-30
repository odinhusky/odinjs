<template>
  <div>
    <div class="country-mask" @click="close"></div>
    <div class="country-picker" :class="{ typing }">
      <div class="country-search">
        <input
          @focus="typing = true"
          @blur="typing = false"
          class="country-input"
          v-model="search"
          placeholder="选择国家"
          :hideDoneButton="true"
        />
        <div class="country-close" @click="submit">确定</div>
      </div>

      <!-- <picker-view  :value="val" @change="onchange" class="country-picker-view">
				<picker-view-column >
					<div :key="item.key" v-for="item in list2" class="country-item">
						<div>
						{{item.name}}
						</div>
						<div>
						+{{item.id}}	
						</div>
					</div>
				</picker-view-column>
			</picker-view> -->
    </div>
  </div>
</template>

<script>
import vars from "@/components/vars.js"

export default {
  data() {
    return {
      typing: false,
      val: [191],
      search: "",
      country: {},
    }
  },
  props: {
    value: {
      type: String,
      default: "+86",
    },
  },
  onLoad() {
    let id = this.value * 1
    for (let i in vars.country) {
      if (vars.country[i].id == id) {
        this.val[0] = i
        break
      }
    }
  },
  onShow() {},
  mounted() {},
  computed: {
    list2() {
      if (!this.search) {
        return vars.country
      }
      let s = this.search.toLowerCase()
      return vars.country.filter((r) => {
        return r.key.indexOf(s) > -1
      })
    },
  },
  methods: {
    close() {
      this.$emit("close")
    },
    submit() {
      if (this.country) {
        if (this.country.id == undefined) {
          this.country.id = "86"
        }
        this.$emit("input", "+" + this.country.id)
      }
      this.$emit("close")
    },
    onchange(event) {
      let val = event.detail.value[0]

      this.country = this.list2[val]
    },
  },
}
</script>

<style scoped>
.country-mask {
  background-color: #0004;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

.country-picker {
  position: fixed;
  bottom: 0;
  height: 60vh;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  box-sizing: border-box;
}
.country-picker.typing {
  padding-bottom: 30vh;
}
.country-picker-view {
  height: calc(100% - 50px);
}
.country-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.country-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
}
.country-close {
  font-size: 13px;
  color: orange;
  flex: 0 0 40px;
  text-align: center;
}
.country-input {
  flex: 1 1 auto;
}
</style>
