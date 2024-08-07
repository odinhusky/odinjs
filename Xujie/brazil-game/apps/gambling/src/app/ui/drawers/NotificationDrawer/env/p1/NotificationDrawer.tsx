import cx from "classnames";
import {
  NotificationItemContainer, NotificationItemExpandable,
  NotificationItemRedDot,
  NotificationItemTitle
} from "../../../../components/NotificationItem";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {INotificationDrawer} from "../../types/INotificationDrawer";
import {NotificationContainer} from "./NotificationContainer";
import {useNotificationDrawer} from "../../hooks/useNotificationDrawer";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";

export const NotificationDrawer = ({
                                     closeDrawer,
                                   }: INotificationDrawer) => {

  const {
    messages,
    expandableIndex,
    handleClick,
  } = useNotificationDrawer();

  const {isMobile} = useBreakpoint();
  useEffect(() => {
    if (isMobile) {
      closeDrawer();
    }
  }, [isMobile])

  return (
    <div
      className={cx(
        'z-[1000] fixed right-0 top-0 bottom-0 left-0 w-full bg-[#090B0F] bg-[rgba(0,0,0,0.6)]',
        {}
      )}
      onClick={(event) => {
        event.stopPropagation();
        closeDrawer();
      }}
    >
      <NotificationContainer>
        <div className={'mb-2 text-2xl font-bold text-[var(--white)]'}>
          Centro de Notificação
        </div>

        <div className={'overflow-y-auto text-base text-white pr-2'}>
          {messages &&
            messages.map((message, index) => (
              <NotificationItemContainer
                key={message.id}
                expand={expandableIndex === index}
                first={
                  index === 0 ||
                  (expandableIndex !== null && index === expandableIndex + 1)
                }
                last={
                  index === messages.length - 1 ||
                  (expandableIndex !== null && index === expandableIndex - 1)
                }
                onClick={(event) => {
                  handleClick(event, index, message.is_read === 0, message.id);
                }}
              >
                <NotificationItemTitle
                  className="item flex flex-row items-center bg-[var(--varient)]"
                  expand={expandableIndex === index}
                  last={
                    index === messages.length - 1 ||
                    (expandableIndex !== null && index === expandableIndex - 1)
                  }
                >
                  {message.is_read === 0 && <NotificationItemRedDot/>}
                  <div className='grow items-center w-2/3'>
                    <div className="text-ellipsis overflow-hidden">{message.title}</div>
                  </div>

                  <div className='flex items-center'>
                    <div className={'date mr-2'}>{message.created_at}</div>
                    {expandableIndex !== index ? (
                      <DownOutlined style={{fontSize: '14px'}}/>
                    ) : (
                      <UpOutlined style={{fontSize: '14px'}}/>
                    )}
                  </div>
                </NotificationItemTitle>
                {expandableIndex === index && (
                  <NotificationItemExpandable
                    style={{
                      background: 'linear-gradient(180deg, #18302F, #18302F)',
                    }}
                  >
                    {message.content}
                  </NotificationItemExpandable>
                )}
              </NotificationItemContainer>
            ))}
        </div>
      </NotificationContainer>
    </div>
  )
}
