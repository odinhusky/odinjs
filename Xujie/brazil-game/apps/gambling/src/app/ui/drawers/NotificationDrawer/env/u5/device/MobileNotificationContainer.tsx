import React from "react";


export const MobileNotificationContainer = ({
  children
}: { children: React.ReactNode }) => {
  return (
    <div
        style={{
          scrollbarColor: 'var(--grayscale-60)  var(--grayscale-30)',
          scrollbarWidth:'thin'
        }}
      className='text-white p-6 z-[1005] fixed right-0 top-0 bottom-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)]'
    >
      {children}
    </div>
  )
}