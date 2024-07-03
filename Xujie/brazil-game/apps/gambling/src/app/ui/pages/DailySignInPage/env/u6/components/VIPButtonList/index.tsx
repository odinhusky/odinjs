import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useScrollSelectFixCenter } from "../../../../../../hooks/useScrollSelectFixCenter";
import { environment } from "../../../../../../../../environments/environment";
import cx from "apps/gambling/src/app/ui/utils/cx";

const vips: number[] = [];

for (let i = 1; i <= 25; i += 1) {
  vips.push(i);
}

interface VIPButtonListProps {
  selectedVIP: number;
  setSelectedVIP: React.Dispatch<React.SetStateAction<number>>;
  currentVIP: number;
}

export const VIPButtonList = ({
  selectedVIP,
  setSelectedVIP,
  currentVIP,
}: VIPButtonListProps) => {
  const { scrollWrapperRef } = useScrollSelectFixCenter(selectedVIP - 1, false);
  const onArrowEvent = function (selectIndex: number) {
    if (selectIndex < 0) {
      return;
    }
    if (selectIndex > vips.length) {
      return;
    }
    setSelectedVIP(selectIndex);
  };
  return (
    <div className="relative">
      <div
        className="vip-tab-items relative flex gap-2 tablet:gap-[18px] mobile:gap-3 tablet:text-xl mobile:text-lg text-base mobile:h-[50px] h-10
          tablet:mx-[70px] mobile:mx-[58px] mx-[46px] overflow-x-scroll items-center"
        ref={scrollWrapperRef}
      >
        {vips.map((vip) => {
          return (
            <div
              key={vip}
              className={cx(
                "relative flex-shrink-0 flex gap-3 tablet:text-xl mobile:text-lg text-base rounded-lg mobile:py-2 mobile:px-4 py-1 px-3 items-center font-bold overflow-hidden bg-linear-1-main scale-100",
                "shadow-[0px_-4.49px_4.49px_0px_#00000033_inset,0px_4.49px_4.49px_0px_#FFFFFF33_inset] cursor-pointer",
                {
                  "scale-110": selectedVIP === vip,
                  "bg-transparente-gray-30 cursor-pointer shadow-none":
                    currentVIP < vip,
                }
              )}
              onClick={() => {
                setSelectedVIP(vip);
              }}
            >
              {vip === currentVIP && (
                <img
                  alt="lockOpen"
                  src={`assets/${environment.uVersion}/icon_lock_open.png`}
                  className="w-3/12"
                />
              )}
              {vip > currentVIP && (
                <img
                  alt="lockOpen"
                  src={`assets/${environment.uVersion}/icon_lock_close.png`}
                  className="w-3/12"
                />
              )}
              <div>VIP{vip}</div>
              {selectedVIP != vip && (
                <div className="absolute left-0 top-0 w-full h-full bg-black opacity-60" />
              )}
            </div>
          );
        })}
      </div>
      {/* 箭头按钮 */}
      {/* 左 */}
      <button
        className={cx(
          "group absolute tablet:w-[70px] tablet:h-[60px] mobile:w-[58px] mobile:h-12 w-[46px] h-9 -left-3 top-1/2 -translate-y-1/2 bg-[p] active:brightness-75 pointer-events-auto",
          {
            "cursor-not-allowed pointer-events-none":
              selectedVIP <= 0 || selectedVIP <= 1,
          }
        )}
        onClick={(e) => {
          onArrowEvent(selectedVIP - 1);
        }}
      >
        <img
          className={cx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:drop-shadow-[0px_0px_14.4px_#FFFFFF80]",
            {
              "opacity-60": selectedVIP <= 0 || selectedVIP <= 1,
            }
          )}
          src={`assets/${environment.uVersion}/icon_arrow_left.png`}
          alt="arrow-left"
        />
      </button>
      {/* 右 */}
      <button
        className={cx(
          "group absolute tablet:w-[70px] tablet:h-[60px] mobile:w-[58px] mobile:h-12 w-[46px] h-9 -right-3 top-1/2 -translate-y-1/2 bg-[p] active:brightness-75 pointer-events-auto",
          {
            "cursor-not-allowed pointer-events-none":
              selectedVIP >= vips.length,
          }
        )}
        onClick={(e) => {
          onArrowEvent(selectedVIP + 1);
        }}
      >
        <img
          className={cx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:drop-shadow-[0px_0px_14.4px_#FFFFFF80]",
            {
              "opacity-60": selectedVIP >= vips.length,
            }
          )}
          src={`assets/${environment.uVersion}/icon_arrow_right.png`}
          alt="arrow-right"
        />
      </button>
    </div>
  );
};
