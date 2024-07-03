import { UserLoginStatusSection } from "../../../../components-bs/UserLoginStatusSection";
import { Container } from "../u2/Container";
import { IUserLoginStatusModal } from "../../types";
import { environment } from "../../../../../../environments/environment";

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
        className={"w-[calc(100%_-_56px)] md:w-[400px] !p-6 !px-4 md:!p-8 lg:!px-5 box-border rounded-xl relative !overflow-visible border-2 border-[var(--grayscale-70)] bg-linear-6-main"}
        onMouseDown={(event: any) => {
          event.stopPropagation();
        }}
      >
        <div className={"absolute top-[10px] right-[10px] md:top-[15px] md:right-[15px] lg:top-[15px] lg:right-[15px] cursor-pointer"} onClick={props.close}>
          <img className="w-6 md:w-[30px] lg:w-[34px]" src={`assets/${environment.uVersion}/icon_close.png`} alt="icon_close" />
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
