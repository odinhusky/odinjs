import { IUserLoginStatusModal } from '../../types';
import { BaseModal } from '../../../BaseModal';
import U7LoginModal from '../../../../components/LoginModal/1';
import './index.scss';
import useLoginMode from '../../hooks/useLoginMode';
export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {
    const modeProps = useLoginMode({
    setIsLogin: props.setIsLogin,
    onClose: props.close,
  });
  return (
    <BaseModal>
      <U7LoginModal {...modeProps}></U7LoginModal>
    </BaseModal>
  );
};
