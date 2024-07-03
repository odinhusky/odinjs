import React, { useEffect, useRef, useState } from "react";
import { content } from "tailwindcss-classnames";
import { tcx } from "../../utils/tcx";


interface IWatermarkPhotoProps {
  src: string
  content: string
  className?: string
  alt?: string
  row?: number
  column?: number
}

export const WatermarkPhoto = ({
  alt,
  src,
  content,
  className,
  row = 8,
  column = 8,
}: IWatermarkPhotoProps) => {
  const targetRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (targetRef.current && (targetRef.current as any).offsetHeight) {
        const height = (targetRef.current as any).offsetHeight;
        const newScale = height / (70 * row - 50);
        setScale(newScale);
        console.log('set watermark scale', scale);
      }
      else {
        console.log('watermark loading');
      }

    };

    // 监听窗口大小变化
    window.addEventListener('resize', updateScale);
    updateScale(); // 初始化比例

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [row,targetRef.current]);

  const fontSize = `${20 * scale}px`;
  const mb = `${50 * scale}px`;
  const mr = `${10 * scale}px`;

  console.log('scale', scale);
  return (
    <div
      className={tcx('relative h-full w-full overflow-hidden', className)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className='[transform:translate(-50%,-50%)_rotate(45deg)] absolute right-0 top-0 h-full w-full'
        style={{
          'fontSize': fontSize,
        }}
      >
        {Array.from({ length: row }, (_, i) =>
          <div key={i} className='font-bold select-none whitespace-nowrap text-[rgba(0,0,0,0.25)]'
            style={{
              'marginBottom': mb,
            }}
          >
            {
              Array.from({ length: column }, (_, j) =>
                <span key={j} className=''
                  style={{
                    'marginRight': mr,
                  }}
                >{content}</span>)
            }
          </div>)
        }
      </div>
      <div>
        <img ref={targetRef} alt={alt || "imageWithWaterMark"} className='w-full' src={src} />
      </div>
    </div>
  )
}
