import PayResult from './component/PayResult';
import LeaveModal from './component/LeaveModal';
import useCustomizeCheckout from '@/ui/hooks/pages/customizeCheckoutPage/useCustomizeCheckout';
import PayContent from './component/PayContent';
import BackNavigate from '@components/BackNavigate';
import { cx, useBreakPoint } from '@libs/commonUtils';

const CustomizeCheckoutPage = () => {
  const {
    showLeaveModal,
    LeaveModalProps,
    payCheckoutData,
    countdownTime,
    onSubmitUTR,
    isPayFinish,
    payMethod,
    handleBack,
    title,
  } = useCustomizeCheckout();
  const { isDesktop } = useBreakPoint();
  return (
    <>
      {isDesktop && (
        <div className="mt-2">
          <BackNavigate onBack={handleBack} />
          <div
            className={cx(
              'mt-5',
              'bgi-text-[var(--base-2-main)]',
              'text-center font-bold text-3xl'
            )}
          >
            {title}
          </div>
        </div>
      )}

      <div className="mx-[-1px]">
        {payCheckoutData && isPayFinish ? (
          <PayResult
            status={payCheckoutData.status}
            isExpiration={countdownTime <= 0}
          />
        ) : (
          <>
            {showLeaveModal && <LeaveModal {...LeaveModalProps} />}
            <PayContent
              type={payMethod}
              data={payCheckoutData}
              countdownTime={countdownTime}
              onSubmitUTR={onSubmitUTR}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CustomizeCheckoutPage;
