import Modal from '@mode2/components/Modal';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import { LoginContent } from '@components/LoginContent';
import { useBreakPoint } from '@libs/commonUtils';

export const LoginModal = (props: ILoginModalProps) => {
  const { isMobile } = useBreakPoint();

  return props.open && !isMobile ? (
    <Modal>
      <div
        className="relative flex flex-col bgi-[var(--bg-main)] mobile:max-h-[90vh]
            mobile:w-[400px] mobile:h-auto w-full h-full pb-6
            mobile:rounded-lg rounded-none
            mobile:border mobile:border-solid mobile:border-[var(--grayscale-50)] border-none"
      >
        <LoginContent {...props} className="px-4" />
      </div>
    </Modal>
  ) : null;
};
