import { useImageCache } from '@libs/mode2/usecase/useImageCache';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import React, { useEffect, useRef, useState } from 'react';

interface SpriteAnimatorProps {
  sprite: string;
  width: number;
  height: number;
  frameCount: number;
  fps?: number;
  loop?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  isPlaying?: boolean;
  isCache?: boolean;
  onEnd?: () => void;

  startFrame?: number; // 起始幀 (inclusive)
  endFrame?: number; // 結束幀 (exclusive)
  reverse?: boolean; // 是否反向播放
}

export const SpriteAnimator = ({
  sprite,
  width,
  height,
  frameCount,
  fps = frameCount,
  loop = true,
  rows = 1,
  style = {},
  isPlaying = true,
  isCache = true,
  onEnd,
  startFrame = 0,
  endFrame,
  reverse = false,
}: SpriteAnimatorProps) => {
  const totalFrames = frameCount;
  const finalFrame =
    endFrame !== undefined ? Math.min(endFrame, totalFrames) : totalFrames;

  const currentPxTimes = useTemplateLayoutStore(
    (state) => state.currentPxTimes
  );

  const calcWidth = currentPxTimes ? width * currentPxTimes : width;
  const calcHeight = currentPxTimes ? height * currentPxTimes : height;

  const [frame, setFrame] = useState(startFrame);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const frameRef = useRef(startFrame);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const prevSpriteRef = useRef(sprite);

  const columns = Math.ceil(frameCount / rows);

  const tick = (time: number) => {
    if (!isPlaying) return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    const interval = 1000 / fps;

    if (delta >= interval) {
      lastTimeRef.current = time;

      let next = frameRef.current + (reverse ? -1 : 1);
      const outOfBounds = reverse ? next < startFrame : next >= finalFrame;

      if (outOfBounds) {
        if (loop) {
          next = reverse ? finalFrame - 1 : startFrame;
        } else {
          cancelAnimationFrame(requestRef.current!);
          requestRef.current = null;
          onEnd?.();
          return;
        }
      }

      frameRef.current = next;
      setFrame(next);
    }

    requestRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const fetchImageSrc = async () => {
      try {
        const src = isCache ? await useImageCache.getByCache(sprite) : sprite;
        setImageSrc(src);
      } catch (e) {
        console.error('Error fetching cached image:', e);
      }
    };

    fetchImageSrc();
  }, [sprite, isCache]);

  useEffect(() => {
    // 每次播放狀態或素材變更時，重設 frame & 動畫
    cancelAnimationFrame(requestRef.current!);
    requestRef.current = null;
    lastTimeRef.current = 0;

    frameRef.current = startFrame;
    setFrame(startFrame);
    prevSpriteRef.current = sprite;

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, sprite, startFrame, finalFrame, reverse]);

  const x = (frame % columns) * calcWidth;
  const y = Math.floor(frame / columns) * calcHeight;

  return (
    <div
      aria-hidden
      style={{
        width: calcWidth,
        height: calcHeight,
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: `-${x}px -${y}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${columns * calcWidth}px ${rows * calcHeight}px`,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
};

export default SpriteAnimator;
