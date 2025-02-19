import Modal from '@/components/BaseModal/api';
import { IMyModifyModalProps } from './types';

export const MyModifyModal = (props: IMyModifyModalProps) => {
  return null;
};

export const showMyModifyModal = (props?: IMyModifyModalProps) => {
  return Modal.show({
    content: (
      <MyModifyModal
        {...(props || {})}
        onClose={() => {
          Modal.hide();
          props?.onClose?.();
        }}
      />
    ),
  });
};
