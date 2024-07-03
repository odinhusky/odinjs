import { useEffect, useMemo, useState } from "react"
const useAnimation = (close: () => void): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isCloseAnimation, setIsCloseAnimation] = useState(false);

  useEffect(() => {
    if (isCloseAnimation) {
      let timeout = setTimeout(() => {
        close();
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [isCloseAnimation, close]);

  return [isCloseAnimation, setIsCloseAnimation];
};


export const useBatchSetAnimate = <T extends Record<string, string>>(data: T, duration?: number) => {
  const timeout = duration || 500
  const defaultAnimate = useMemo(() => {
    let result = {} as any
    for (const key in data) {
      result[key] = data[key].trim().startsWith('animate__') ? `animate__animated ${data[key]}` : data[key]
    }
    return result
  }, [data])
  const [animate, setAnimate] = useState<T>({} as T)
  const [key, setKey] = useState<string>('')
  useEffect(() => {
    if (!defaultAnimate[key]) return
    const timer = setTimeout(() => {
      setAnimate(pre => ({
        ...pre,
        [key]: '' // 动画执行完清除className,解决屏幕百分比<100% 模糊问题
      }))
    }, timeout)
    return () => {
      clearTimeout(timer)
    }
  }, [key])
  const runAnimate = async (key: keyof T, callback?: () => void) => {
    const className = defaultAnimate[key]
    if (!className) {
      callback?.()
      return
    }
    setAnimate(pre => ({
      ...pre,
      [key]: className
    }))
    setKey(key as string)
    callback && setTimeout(() => {
      callback?.()
    }, timeout)
  }
  return { animate, runAnimate }

}
export const useAnimateClass: (defaultAnimate?: string, duration?: number) => void = (defaultAnimate, duration = 500) => {
  const [animate, setAnimate] = useState(defaultAnimate)
  useEffect(() => {
    if (!defaultAnimate) return
    const timer = setTimeout(() => {
      setAnimate('')  // 动画执行完清除className,解决屏幕百分比<100% 模糊问题
    }, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [])
  const runAnimate = async (name: string, callback?: () => void) => {
    setAnimate(name)
    callback && setTimeout(() => {
      callback?.()
    }, duration)
  }
  return { animate, runAnimate }
}


export default useAnimation;