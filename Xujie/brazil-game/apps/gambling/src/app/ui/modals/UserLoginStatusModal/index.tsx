import { renderByUVersion } from '../../utils/renderByUVersion';
import { IUserLoginStatusModal } from './types';
import { UserLoginStatusModal as P1UserLoginStatusModal } from './env/p1/UserLoginStatusModal';
import { UserLoginStatusModal as CUserLoginStatusModal } from './env/u1/UserLoginStatusModal';
import { UserLoginStatusModal as RUserLoginStatusModal } from './env/u2/UserLoginStatusModal';
import { UserLoginStatusModal as U5UserLoginStatusModal } from './env/u5/UserLoginStatusModal';
import { UserLoginStatusModal as U6UserLoginStatusModal } from './env/u6/UserLoginStatusModal';
import { UserLoginStatusModal as U7UserLoginStatusModal } from './env/u7/UserLoginStatusModal';
import { UserLoginStatusModal as U9UserLoginStatusModal } from './env/u9/UserLoginStatusModal';
import useLoginMode from './hooks/useLoginMode';
import { renderByMode } from '../../utils/renderByMode';

export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {
  // const modeProps = useLoginMode({
  //   setIsLogin: props.setIsLogin,
  //   onClose: props.close,
  // });
  return renderByUVersion(
    {
      p1: <P1UserLoginStatusModal {...props} />,
      u1: <CUserLoginStatusModal {...props} />,
      u2: <RUserLoginStatusModal {...props} />,
      u5: <U5UserLoginStatusModal {...props} />,
      u6: <U6UserLoginStatusModal {...props} />,
      u7: <U7UserLoginStatusModal {...props} />,
      // u9: <U9UserLoginStatusModal {...props} />,
    },
    <CUserLoginStatusModal {...props} />
  );
  // return renderByMode("loginModal", {
  //   componentName: "LoginModal",
  //   props: modeProps,
  //   defaultComponent: renderByUVersion(
  //     {
  //       p1: <P1UserLoginStatusModal {...props} />,
  //       u1: <CUserLoginStatusModal {...props} />,
  //       u2: <RUserLoginStatusModal {...props} />,
  //       u5: <U5UserLoginStatusModal {...props} />,
  //       u6: <U6UserLoginStatusModal {...props} />,
  //     },
  //     <CUserLoginStatusModal {...props} />
  //   ),
  //   modalRender: BaseModal,
  // })
};
