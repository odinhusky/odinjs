import {INotificationDrawer} from "../../types/INotificationDrawer";
import {NotificationContainer} from "./NotificationContainer";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {twMerge} from "tailwind-merge";
import {useNotificationDrawer} from "../../hooks/useNotificationDrawer";
import {environment} from "../../../../../../environments/environment";
import React from "react";
import t from "apps/gambling/src/assets/constant/lang";


const NotificationDrawer = ({
  closeDrawer
}: INotificationDrawer) => {
  const { isMobile } = useBreakpoint()

  const {
    messages,
    expandableIndex,
    handleClick,
  } = useNotificationDrawer();

  return (
    <NotificationContainer closeDrawer={closeDrawer}>
      <div
        className={
          twMerge(
            'relative flex flex-col p-4 w-full h-full bg-[var(--grayscale-25)] rounded-lg shadow-[-12px_0_12px_0_rgba(0,0,0,.5)]',
            isMobile && 'p-3'
          )
        }
      >
        <div
          className='absolute -right-2 -top-3 bg-[var(--grayscale-40)] rounded-full p-2 cursor-pointer shadow-[0_4px_4px_0_rgba(0,0,0,.25)] hover:brightness-[1.3] active:brightness-[0.7]'
          onClick={()=>closeDrawer()}
        >
          <img alt='close' className='w-6' src={`assets/${environment.uVersion}/icon_close.png`} />

        </div>

        <div className={
          twMerge(
            'text-center mt-4 font-extrabold text-lg',
            isMobile && 'mt-1'
          )
        }>
          {t['notificationPageTitle']}
        </div>

        <div
          className={
            twMerge(
              'mt-4 w-full grow flex flex-col overflow-y-scroll gap-2 text-sm',
              isMobile && 'mt-3')
          }
        >
          {
            messages.map((message, index) => {
              const isRead = message.is_read === 1
              const expanded = expandableIndex === index

              return (
                <div
                  key={message.id}
                  className={
                    twMerge(
                      'p-5 bg-[var(--grayscale-15)] rounded-lg cursor-pointer',
                      isMobile && 'p-3'
                    )
                  }
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => handleClick(event, index, message.is_read === 0, message.id)}
                >
                  <div
                    className='relative w-full flex gap-2 items-center'
                  >

                    {
                      expanded && (<img alt='arrow' className='w-4 absolute right-0 top-1/2 -translate-y-1/2'
                                        src={`assets/${environment.uVersion}/icon_arrow_up_message.png`}/>)
                    }

                    <div
                      className={
                        twMerge(
                          'w-[10px] h-[10px] bg-[var(--grayscale-30)] rounded-full',
                          !isRead && 'bg-[var(--state-warn-main)]'
                        )
                      }
                    />

                    <div
                      className={
                        twMerge(
                          'text-[var(--grayscale-60)]',
                          (expanded || !isRead) && 'text-[var(--grayscale-80)]'
                        )
                      }
                    >{message.created_at}</div>
                  </div>


                  <div
                    className={
                      twMerge(
                        'mt-2 font-bold text-[var(--grayscale-80)]',
                        isMobile && 'mt-1',
                        (expanded || !isRead) && 'text-[var(--grayscale-100)]'
                      )
                    }
                  >
                    {message.title}
                  </div>

                  {
                    expanded && (
                      <div className={
                        twMerge(
                          'w-full h-[1px] mt-3 bg-[var(--grayscale-30)]',
                          isMobile && 'mt-2'
                        )
                      }/>
                    )
                  }

                  {
                    expanded && (
                      <div className={
                        twMerge(
                          'w-full mt-3 text-[var(--grayscale-80)]',
                          isMobile && 'mt-2'
                        )
                      }>
                        {message.content}
                      </div>
                    )
                  }

                </div>
              )
            })
          }
        </div>
      </div>
    </NotificationContainer>
  )
}

export default NotificationDrawer;