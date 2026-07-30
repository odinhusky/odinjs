import { defineBoot } from "#q-app/wrappers"
import { useCommon } from "@/hook/useCommon"
import type { DirectiveBinding } from "vue"

const { moneyFormat } = useCommon()

interface INumberAnimationParams {
  min?: number
  duration?: number
}

export default defineBoot(({ app }) => {
  app.directive("number-animation", {
    mounted(el: HTMLElement, binding: DirectiveBinding<INumberAnimationParams>) {
      const { min = 0, duration = 500 } = binding && binding.value ? binding.value : { min: 0, duration: 500 }
      const originNumber = el.innerText

      try {
        const max = parseInt(originNumber.replace(/,/g, "")) // 有些值有使用 moneyFormat，先過濾掉千分位符
        let current = min
        let range = max - min
        let increment = (range * (1000 / 60)) / duration // 增加的數值用經過的時間平均計算
        let step = Math.abs(Math.floor(duration / (1000 / 60)))
        let stepDuration = duration / step

        let timer = setInterval(() => {
          current += increment
          el.textContent = moneyFormat(Math.round(current)).toString()
          if ((increment > 0 && current >= max) || (increment < 0 && current <= max)) {
            el.textContent = originNumber // 為了避免計算誤差，動畫完成後塞回原始值
            clearInterval(timer)
          }
        }, stepDuration)
      } catch (e: any) {
        console.warn("number-animation directive get invalid value.")
      }
    }
  })
})
