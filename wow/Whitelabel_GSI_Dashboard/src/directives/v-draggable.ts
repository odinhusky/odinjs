import { ObjectDirective } from "vue"
import interact from "interactjs"

const vDraggableCollision: ObjectDirective<HTMLElement, any> = {
  mounted(el, binding) {
    const margin = binding.value?.margin || 16
    let isDragging = false

    // 設定初始樣式
    const computedStyle = getComputedStyle(el)
    el.style.touchAction = "none"
    el.style.userSelect = "none"
    el.style.position = el.style.position || computedStyle.position || "absolute"
    el.style.top = el.style.top || computedStyle.top || "0px"
    el.style.left = el.style.left || computedStyle.left || "0px"

    // 記錄偏移（滑鼠點擊位置與元素左上角距離）
    let offsetX = 0
    let offsetY = 0

    // 防止拖曳時觸發 click
    const onClick = (e: MouseEvent) => {
      if (isDragging) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }
    el.addEventListener("click", onClick, true)

    // 初始化 draggable 行為
    interact(el).draggable({
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
          endOnly: true
        })
      ],
      listeners: {
        start(event) {
          isDragging = false
          el.setAttribute("data-shifted", "false")

          const rect = el.getBoundingClientRect()
          offsetX = event.client.x - rect.left
          offsetY = event.client.y - rect.top
        },
        move(event) {
          const parentRect = el.parentElement!.getBoundingClientRect()

          let newLeft = event.client.x - parentRect.left - offsetX
          let newTop = event.client.y - parentRect.top - offsetY

          // 邊界限制（含 margin）
          const maxLeft = parentRect.width - el.offsetWidth - margin
          const maxTop = parentRect.height - el.offsetHeight - margin

          newLeft = Math.max(margin, Math.min(newLeft, maxLeft))
          newTop = Math.max(margin, Math.min(newTop, maxTop))

          el.style.left = `${newLeft}px`
          el.style.top = `${newTop}px`

          isDragging = true
        },
        end() {
          setTimeout(() => {
            isDragging = false
          }, 50)
          el.setAttribute("data-shifted", "false")
        }
      }
    })

    // 清理事件與 interact 實例
    el._vDraggableCollisionDestroy = () => {
      interact(el).unset()
      el.removeEventListener("click", onClick, true)
    }
  },

  unmounted(el) {
    if (el._vDraggableCollisionDestroy) {
      el._vDraggableCollisionDestroy()
      delete el._vDraggableCollisionDestroy
    }
  }
}

export default vDraggableCollision
