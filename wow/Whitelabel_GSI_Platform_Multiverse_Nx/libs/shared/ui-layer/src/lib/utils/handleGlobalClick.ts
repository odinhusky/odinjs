export interface HandleGlobalClickParams<T = unknown> {
  target?: string
  payload?: T
  callback: (arg?: T) => void | Promise<void>
  debounceTimer?: number
}

const timerMap = new Map<string, ReturnType<typeof setTimeout>>()

export const handleGlobalClick = <T>({
  target = "default",
  payload,
  callback,
  debounceTimer = 0
}: HandleGlobalClickParams<T>) => {
  const key = String(target || "default")

  const runCallback = () => {
    if (target) {
      if (payload !== undefined) {
        console.log("@@ lib handleGlobalClick target=>", target, payload)
      } else {
        console.log("@@ lib handleGlobalClick target=>", target)
      }
    }

    void callback(payload)
    timerMap.delete(key)
  }

  const existingTimer = timerMap.get(key)
  if (existingTimer) {
    clearTimeout(existingTimer)
    timerMap.delete(key)
  }

  if (debounceTimer <= 0) {
    runCallback()
    return
  }

  const timer = setTimeout(runCallback, debounceTimer)
  timerMap.set(key, timer)
}

export default handleGlobalClick
