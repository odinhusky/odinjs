import styled from "styled-components";
import {CopyButton} from "./CopyButton";
import {notification} from "antd";
import {useInviteConfig} from "../../../../../hooks/useInviteConfig";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {appCopy} from "../../../../../utils/appCopy";


const BorderLinkButtonContainer = styled.div`
  position: relative;
  height: 60px;
  margin: 1vw auto 4vw;
  background-color: var(--white); /* 將 background-image 改為 background-color */
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type IInviteSection = {
  inviteUrl: string;
  onClickToCopy?: () => void;
}

export const InviteCopySection = (props: IInviteSection) => {
  const [api, contextHolder] = notification.useNotification();
  const {isMobile, isTablet} = useBreakpoint();
  const onClickToCopy = () => {
    appCopy(props.inviteUrl);
    api.success({
      message: 'Copiado!',
    });
  }
  const {currentConfig} = useInviteConfig();
  const isInvitationOpen = currentConfig ? currentConfig.isInvitationOpen : false

  return !isInvitationOpen
    ? (<></>)
    : (<>
      <BorderLinkButtonContainer className={'mb-4 rounded-2xl p-2 sm:p-6 w-full sm:w-3/5'}>
        {contextHolder}
        <div className={'text-sm font-bold text-black'}>
          {props.inviteUrl}
        </div>
        <CopyButton
          style={{
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px'
          }}
          className={
            'relative left-[24px] hidden h-[60px] w-[221px] sm:block'
          }
          onClick={onClickToCopy}
        >
          Cópia de
        </CopyButton>
      </BorderLinkButtonContainer>

      <CopyButton
        style={{
          height: isMobile ? '46px' : '60px'
        }}
        className={'block h-[48px] w-[200px] sm:hidden text-sm'}
        onClick={onClickToCopy}
      >
        Cópia de
      </CopyButton>
    </>)
}
