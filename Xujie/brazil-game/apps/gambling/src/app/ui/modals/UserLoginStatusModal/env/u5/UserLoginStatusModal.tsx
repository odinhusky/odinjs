
import { twMerge } from "tailwind-merge";
import { UserLoginStatusSection } from "../../../../components-bs/UserLoginStatusSection";
import { CloseICON } from "../../../../components-bs/env/u5/CloseICON";
import { Container } from "../../Container";
import { IUserLoginStatusModal } from "../../types";

export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {

  return (
    <div
      className={"z-[1100] bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full"}
      // NOTE: onclick 改用，避免拖拉文字到modal外層會直接關閉
      onMouseDown={() => {
        // NOTE: 手機版用戶會誤點
        // !isMobile && props.close()
      }}
    >
      <Container
        className={"w-[320px] md:w-[424px] lg:w-[424px] pb-3 box-border rounded-[20px] relative !overflow-visible"}
        onMouseDown={(event: any) => {
          event.stopPropagation();
        }}
      >
        <div className={"flex justify-end w-full absolute top-[-8px] right-[-8px]"}>
          <CloseICON className={twMerge(
            "linear-4-button"
          )} onClick={props.close} />
        </div>

        <UserLoginStatusSection
          confirmToLogin={() => {
            props.setIsLogin(true);
            props.close();
          }}
          confirmToRegister={() => {
            props.setIsLogin(false)
            props.close();
          }}
          openNotificationWithIcon={props.openNotificationWithIcon}
        />

      </Container>

    </div>
  )
}
