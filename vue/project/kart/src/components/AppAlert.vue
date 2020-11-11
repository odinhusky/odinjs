<template>
  <div v-if="openOrNot" class="alert_body" :class="rootClassObj">
    <div class="alert_mask"></div>
    <div class="alert_box" :class="classname">
      <slot name="icon">
        <div v-if="isShowIcon" class="icon_part">
          <img
            src="../assets/img/alert/warning_Web@2x.png"
            class="alert_icon_img"
          />
        </div>
      </slot>

      <div v-if="title !== ''" class="text_part">
        <h2 class="alert_title">{{ title }}</h2>
        <p v-if="subtitle !== ''" class="alert_subtitle">{{ subtitle }}</p>
      </div>

      <slot name="content"></slot>

      <button
        v-if="isShowCancel"
        class="close_position close_btn"
        @click.prevent="closeAlert"
      ></button>
    </div>
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';

export default {
  name: 'AppAlert',
  mixins: [commonMixinObj],
  model: {
    prop: 'openOrNot',
    event: 'close',
  },
  props: {
    // v-model傳來的，對應的事openOrNot的props
    openOrNot: {
      required: true,
      default: false,
    },
    title: {
      // type: String,
      required: true,
      default: '',
    },
    classname: {
      // type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    isShowIcon: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowCancel: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * @author odin
     * @description 由內部註冊closeAlert，因為燈箱是由外部的data控管開闔，同時也要註冊一個closeAlert的method來對應控制該data
     */
    closeAlert() {
      this.$emit('close', false);
    },
  },
};

// Example
// <AppAlert
//   :title="alert.title"
//   :classname="alert.classname"
//   v-model="alert.openOrNot"
// >
//   <template slot="content"></template>
// </AppAlert>

// data structure
// alert: {
//   openOrNot: false,
//   title: '',
//   classname: '',
// },

// model explaintion
// v-model="value" => :value="value" @input="(passValue) => value = passValue
// 透過model(2.2.0新增)的屬性，可以在子元件中定義從父元件的觀點看到的 v-model 的解釋，讓參數有所不同
// model: {
//   prop: 'openOrNot', // 將v-model傳過來的值作為prop，但名字可以從value改為自定義，以這裡來說，在component內部這個prop就叫做 openOrNot 而不是 value
//   event: 'close', // 父元件層所預設的事件綁定是 @input="(passValue) => value = passValue，透過這行設定則改為 @close="(passValue) => value = passValue，也可以透過這個事件的綁定，傳送emit並且攜帶參數，改變父層的資料結構，同時又傳進來子元件中，產生互動
// },
// 以AppAlert這個元件來說，利用v-model="openOrNot"的布林值傳入，開啟時由父元件控制，如果點選內部的叉叉，就會傳送$emit('close', false)，改變父層openOrNot為false，又再傳入該元件中，造成元件隱藏，同時也不需要在父層多註冊關閉的method
</script>

<style lang="scss" scoped></style>
