import { INotificationDrawer } from "../../types/INotificationDrawer";
import { twMerge } from "tailwind-merge";
import { useNotificationDrawer } from "../../hooks/useNotificationDrawer";
import { environment } from "../../../../../../environments/environment";
import React, { useRef, useState } from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import cx from "../../../../utils/cx";

const NotificationDrawer = ({ closeDrawer }: INotificationDrawer) => {
  const { isMobile } = useBreakpoint();
  const { messages, expandableIndex, handleClick } = useNotificationDrawer();
  const [selectIndex, setSelectIndex] = useState(0); //tab
  const radioNames = ["Todos", "Não lido", "Lido"];
  const listRef = useRef<HTMLDivElement>(null); //列表Ref
  const readedsRef = useRef<Number[]>([]); //已读栏中，已读的数据
  return (
    <div
      className="fixed flex w-full h-full z-[1005] right-0 top-0 bottom-0 left-0 justify-end"
      onClick={() => closeDrawer()}
    >
      <div
        className="flex flex-col gap-2 tablet:gap-5 mobile:gap-4 w-full tablet:w-[480px] mobile:w-[456px] text-[var(--grayscale-100)] bg-[var(--grayscale-25)]
          h-[calc(100%-16px)] tablet:h-[calc(100%-56px-44px)] mobile:h-[calc(100%-72px-16px)] m-2 mobile:m-0 tablet:mt-14 mobile:mt-[72px]
          rounded-r-xl rounded-l-xl mobile:rounded-r-none mobile:rounded-l-xl 
          p-4 mobile:p-6 shadow-[0px_0px_30px_0px_#0000004D]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 标题、按钮 */}
        <div className="flex justify-between items-center">
          <div className="text-2xl tablet:text-xl mobile:text-lg font-bold tablet:font-medium mobile:font-bold">
            Centro de Notificação
          </div>
          <div
            className="w-7 h-7 mobile:w-9 mobile:h-9 cursor-pointer"
            onClick={() => closeDrawer()}
          >
            <img
              alt="close"
              className="w-full h-full p-[5px] mobile:p-[6px]"
              src={`assets/${environment.uVersion}/icon_close.png`}
            />
          </div>
        </div>
        {/* 单选 */}
        <div className="flex text-xs mobile:text-sm h-8 mobile:h-9">
          <div className="flex bg-[var(--grayscale-40)] rounded-lg">
            {radioNames.map((data, index) => {
              return (
                <div
                  className={cx(
                    "tablet:w-[106.33px] mobile:w-[100px] w-[70px] h-full border-2 border-solid border-[#ffffff00] text-center leading-7 mobile:leading-8 cursor-pointer",
                    {
                      "bg-[var(--grayscale-25)] border-2 border-solid border-[var(--grayscale-70)] rounded-lg shadow-[0px_-4px_4px_0px_#00000033_inset,0px_4px_4px_0px_#FFFFFF33_inset]":
                        selectIndex === index,
                    }
                  )}
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    setSelectIndex(index);
                    handleClick(event, -1, false, -1);
                    listRef.current && listRef.current.scrollTo(0, 0);
                    readedsRef.current = [];
                  }}
                >
                  {data}
                </div>
              );
            })}
          </div>
        </div>
        {/* 列表 */}
        <div
          ref={listRef}
          className="flex flex-col gap-3 h-full overflow-y-auto font-normal"
        >
          {messages.map((message, index) => {
            let isCreate = false; //是否创建
            const isRead = message.is_read === 1;
            const expanded = expandableIndex === index;
            // 过滤数据
            if (selectIndex === 0) {
              isCreate = true;
            } else if (selectIndex === 1) {
              // 未读
              if (readedsRef.current.find((id) => id === message.id)) {
                isCreate = true;
              } else if (message.is_read === 0) {
                isCreate = true;
              }
            } else if (selectIndex === 2) {
              // 已读
              if (readedsRef.current.find((id) => id === message.id)) {
                isCreate = false;
              } else if (message.is_read === 1) {
                isCreate = true;
              }
            }
            if (isCreate) {
              return (
                <div
                  key={message.id}
                  className="flex flex-col gap-2 tablet:gap-4 bg-[var(--grayscale-40)] border-[1px] border-solid border-[var(--grayscale-60)] py-3 px-3 rounded-lg cursor-pointer"
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    if (message.is_read === 0) {
                      // 未读
                      if (
                        !readedsRef.current.find((data) => data === message.id)
                      ) {
                        readedsRef.current.push(message.id);
                      }
                    }
                    handleClick(
                      event,
                      index,
                      message.is_read === 0,
                      message.id
                    );
                  }}
                >
                  {/* 标题 */}
                  <div className="relative">
                    <p className="text-sm mr-4 tablet:mr-5 font-medium text-balance">
                      {message.title}
                    </p>
                    {/* 圆点 */}
                    <div
                      className={cx(
                        "absolute w-3 h-3 top-0 right-0 rounded-full",
                        {
                          "bg-state-success-main": !isRead,
                          "bg-[var(--grayscale-60)]":
                            isRead ||
                            readedsRef.current.find((id) => id === message.id),
                        }
                      )}
                    />
                  </div>
                  {/* 时间 */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-[var(--grayscale-70)]">
                      {message.created_at}
                    </div>
                    <img
                      alt="arrow"
                      className="h-[8.89px] w-[13.33px]"
                      src={`assets/${environment.uVersion}/${
                        !isRead
                          ? expanded
                            ? "icon_arrow_up_messageed_on"
                            : "icon_arrow_up_message"
                          : expanded
                          ? "icon_arrow_up_messageed_on"
                          : "icon_arrow_up_messageed_off"
                      }.png`}
                    />
                  </div>
                  {/* 隐藏内容 */}
                  {expanded && (
                    <>
                      <hr className="border-[-1px] border-[var(--grayscale-70)]" />
                      <div className="text-balance">{message.content}</div>
                    </>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
