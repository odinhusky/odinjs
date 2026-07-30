<template>
  <!-- 这里是 dynamicComponent 组件的模板 -->
  <component :is="resolvedComponent" v-bind="$attrs" v-model="modelValue" :name="name" />
</template>

<script>
  import { markRaw, computed } from "vue"

  export default {
    props: {
      componentName: String,
      value: [String, Number, Boolean, Array, Object],
      name: String
    },
    data() {
      return {
        resolvedComponent: null,
        modelValue: this.value // 初始化 modelValue 为传入的 value
      }
    },
    created() {
      this.loadComponent()
    },
    watch: {
      componentName() {
        this.loadComponent()
      },
      value(newValue) {
        this.modelValue = newValue // 当外部 value 改变时，更新内部 modelValue
      }
    },
    computed: {
      // 计算属性，用于监听 modelValue 的变化，并通过 emit 触发 input 事件
      model: {
        get() {
          return this.modelValue
        },
        set(newValue) {
          this.modelValue = newValue
          this.$emit("input", newValue)
        }
      }
    },
    methods: {
      async loadComponent() {
        try {
          const module = await import(`./selects/${this.componentName}.vue`)
          this.resolvedComponent = markRaw(module.default || module)
        } catch (error) {
          console.error(`Failed to load component '${this.componentName}':`, error)
        }
      }
    }
  }
</script>
