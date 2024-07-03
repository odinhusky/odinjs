import cx from "classnames";
import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import React, {forwardRef, useEffect, useRef} from "react";
import {ILazyImage} from "../image/LazyImage";

interface IDragScrollContainer {
  children: React.ReactElement[] | React.ReactElement;
  className?: string;
  focus?: {
    index: number
    direction: 'vertical' | 'horizontal'
  }
}
// export const DragScrollContainer = (props: IDragScrollContainer) => {
export const DragScrollContainer = forwardRef((props: IDragScrollContainer, ref?: any) => {
  const contentRef = ref? ref : useRef<HTMLDivElement | null>(null);
  const isVertical = props.focus ? props.focus.direction === 'vertical' : false

  const [, api] = useSpring(() => ({
    from: { left: 0 },
    onChange(v: any) {
      contentRef.current?.scroll({ left: v.value.left });
    }
  }));

  const bind = useGesture(
    {
      onWheel() {
        api.stop(); // 取消动画，让浏览器自己处理
      },
      onDrag(h: any) {
        api.start({
          left: -h.offset[0],
          immediate: true // 无动画过程
        });
      }
    },
    {
      drag: {
        // 每次拖动传入 当前的 scrollLeft 作为初始状态
        from: () => [-contentRef.current!.scrollLeft, 0],
        axis: "x", // 仅在 x 方向 drag
        filterTaps: true
      }
    }
  );

  useEffect(() => {
    if(props.focus?.index !== undefined){
      const currentItem = contentRef.current?.children[props.focus?.index]as HTMLElement | undefined;
      if(currentItem) {

        if(isVertical) {
          contentRef.current?.scrollTo({
            top: currentItem.offsetTop  - ((contentRef.current?.offsetHeight || 0) - currentItem.offsetHeight ) / 2,
            behavior: 'smooth'
          })
        } else {
          contentRef.current?.scrollTo({
            left: currentItem.offsetLeft  - ((contentRef.current?.offsetWidth || 0) - currentItem.offsetWidth ) / 2,
            behavior: 'smooth'
          })
        }
      }

    }
  }, [props.focus?.index]);

  return (
    <div className={cx('overflow-x-auto no-scrollbar cursor-pointer relative', props.className)} {...bind()} ref={contentRef}>
      {props.children}
    </div>
  )
})
