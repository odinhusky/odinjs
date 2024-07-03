import React from 'react';
import { LogoutSection } from '../../components-bs/UserLogoutSection';
import { BaseModal } from '../BaseModal';
import { LogoutContainer } from './LogoutPopoverContainer';

type ILogoutModal = {
  isWrappedBaseModal?: boolean;
};

// # isWrappedBaseModal === false 等同於 LogoutPopOver ，在部分 uVersion 用於 Mobile 時的 modal顯示
export const LogoutModal = ({ isWrappedBaseModal = true }: ILogoutModal) => {
  const Wrapper = isWrappedBaseModal ? BaseModal : React.Fragment;

  return (
    <Wrapper>
      <LogoutContainer>
        <LogoutSection />
      </LogoutContainer>
    </Wrapper>
  );
};
