import Icon from '@libs/mode2/components/Icon';
import BaseModal from '@mode2/components/Modal';
import { ReactNode } from 'react';
export interface IActivityTipsModelProps {
  title: ReactNode;
  content: ReactNode;
  onClose?: () => void;
}
const ActivityTipsModel = ({
  title,
  content,
  onClose,
}: IActivityTipsModelProps) => {
  return (
    <BaseModal className="!bg-transparent p-6">
      <div className="relative bgi-[var(--primary-10)] text-white max-w-96 rounded-lg p-5 flex flex-col gap-4 text-center">
        <div
          className="absolute w-6 h-6 left-1/2 -translate-x-1/2 -bottom-10 cursor-pointer border border-white rounded-full p-1"
          onClick={onClose}
        >
          <Icon className="w-full" color="white" name="ic_close" />
        </div>
        <div className="font-semibold text-base ">{title}</div>
        <div className="text-sm">{content}</div>

        <button
          className="bg-[var(--btn-main)] w-full h-8 rounded flex justify-center items-center bgi-text-[var(--primary-10)] text-sm font-semibold"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </BaseModal>
  );
};
export default ActivityTipsModel;
