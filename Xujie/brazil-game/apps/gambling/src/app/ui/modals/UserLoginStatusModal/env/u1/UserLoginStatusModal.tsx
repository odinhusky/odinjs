import { IUserLoginStatusModal } from "../../types"
import { Container as WContainer } from "../../env/wild/Container"
import { Container as CContainer } from "./Container"
import { CloseICON } from "../../../../components-bs/Icons/CloseICON"
import { renderByUVersion } from "../../../../utils/renderByUVersion"
import { UserLoginStatusSection } from "../../../../components-bs/UserLoginStatusSection"

const Container = renderByUVersion(
  {
    wild777bet: WContainer,
    u1: CContainer,
  },
  CContainer
)

export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {
  const isShowCloseButton =
    props.showCloseButton == undefined ? true : props.showCloseButton

  return (
    <div
      className={
        "z-[1100] bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center px-5 w-full h-full"
      }
      // NOTE: onclick 改用，避免拖拉文字到modal外層會直接關閉
      onMouseDown={() => {
        // NOTE: 手機版用戶會誤點
        // !isMobile && props.close()
      }}
    >
      <Container
        className={"w-full sm:w-[396px] p-4 rounded-2xl"}
        onMouseDown={(event: any) => {
          event.stopPropagation()
        }}
      >
        {isShowCloseButton && (
          <section
            className={
              "flex flex-col justify-center items-end absolute top-[4px] right-[4px]"
            }
          >
            <div
              onClick={() => {
                props.close()
              }}
            >
              <CloseICON />
            </div>
          </section>
        )}

        <UserLoginStatusSection
          confirmToLogin={() => {
            props.setIsLogin(true)
            props.close()
          }}
          confirmToRegister={() => {
            props.setIsLogin(false)
            props.close()
          }}
          openNotificationWithIcon={props.openNotificationWithIcon}
        />
      </Container>
    </div>
  )
}
