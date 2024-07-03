import { useEffect, useRef } from "react";


export const useScrollSelectFixCenter =  (selected: number, isVertical: boolean, behavior: ScrollBehavior = 'smooth') => {
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    const currentItem = scrollWrapperRef.current?.children[selected] as HTMLElement | undefined;
    if(currentItem) {
      if(isVertical) {
        scrollWrapperRef.current?.scrollTo({
          top: currentItem.offsetTop - ((scrollWrapperRef.current?.offsetHeight || 0) - currentItem.offsetHeight ) / 2,
          behavior: behavior
        })
      } else {
        scrollWrapperRef.current?.scrollTo({
          left: currentItem.offsetLeft  - ((scrollWrapperRef.current?.offsetWidth || 0) - currentItem.offsetWidth ) / 2,
          behavior: behavior
        })
      }
    }

  }, [selected])

  return {
    scrollWrapperRef
  }
}
