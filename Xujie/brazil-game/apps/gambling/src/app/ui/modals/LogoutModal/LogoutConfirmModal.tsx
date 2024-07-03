import { renderByUVersion } from '../../utils/renderByUVersion';
import { LogoutModal } from '.';
import useBreakpoint from '../../pageTemplate/hooks/useBreakpoint';
import U2LogoutModal from './env/u2/U2LogoutModal';
import U7LogoutModal from './env/u7/U7LogoutModal';

interface LogoutConfirmModalProps {
  isShow?: boolean;
}

export const LogoutConfirmModal = ({ isShow }: LogoutConfirmModalProps) => {
  const { isMobile } = useBreakpoint();

  return renderByUVersion(
    {
      p1: <LogoutModal />,
      u2: <U2LogoutModal />,
      u5: <LogoutModal />,
      u6: <LogoutModal />,
      u7: <U7LogoutModal />,
    },
    <LogoutModal isWrappedBaseModal={!isMobile} />
  );
};

export default LogoutConfirmModal;
