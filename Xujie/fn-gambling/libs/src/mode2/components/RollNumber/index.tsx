import React from 'react';
import { useEffect, useMemo, useState } from 'react';

const RollNumber = ({
  leep = 500,
  delay = 100,
  size = 16,
  number = 10,
}: {
  leep?: number;
  delay?: number;
  size?: 16;
  number?: number;
}) => {
  const numList = useMemo(() => number.toString().split(''), [number]);
  const [isRun, setIsRun] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRun(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  const sizeRem = size / 16;
  return (
    <div className="inline-block overflow-hidden">
      {numList.map((item, index) => (
        <div
          className="inline-block align-bottom overflow-hidden"
          style={{
            fontSize: `${sizeRem}rem`,
            height: `${sizeRem}rem`,
            lineHeight: `${sizeRem}rem`,
          }}
          key={index}
        >
          {item !== '.' ? (
            <div
              className="mx-[1px]"
              style={{
                transition: 'all ease-in-out ' + (leep / 1000).toFixed(2) + 's',
                height: `${sizeRem}rem`,
                ...(isRun
                  ? {
                      transform:
                        'translateY(-' + sizeRem * Number(item) + 'rem)',
                    }
                  : {}),
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <div style={{ fontSize: `${sizeRem}rem` }} key={i}>
                  {i}
                </div>
              ))}
            </div>
          ) : (
            <span>.</span>
          )}
        </div>
      ))}
    </div>
  );
};
export default RollNumber;
