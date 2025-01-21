import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import LangueSelect from '@components/LangueSelect';
import { cx } from '@libs/commonUtils';
import {
  handleCheckoutPageErrorBackClick,
  handleCheckoutPageToCustomerServiceClick,
  handleCheckoutPageSuccessOKClick,
} from '@libs/mode2/action/checkoutPageAction/actionType';
import useCheckoutPageActions from '@libs/mode2/action/checkoutPageAction/useCheckoutPageActions';
import Icon from '@libs/mode2/components/Icon';
import { PayCheckoutDetailStateResult } from '@libs/mode2/external/api/endpoint/wallet/GetPayCheckoutDetailEndpoint';

const PayResult = ({
  status,
  isExpiration,
}: {
  status: PayCheckoutDetailStateResult;
  isExpiration: boolean;
}) => {
  const { handleCheckoutPageClick } = useCheckoutPageActions();
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  return (
    <div className="flex flex-col gap-3 text-sm py-4 ">
      <div className="flex justify-between items-center bgi-[var(--grayscale-20)] rounded p-2">
        <span className="bgi-text-[var(--base-2-main)] font-medium">
          Change language
        </span>
        <LangueSelect className="!w-32" />
      </div>
      {status === PayCheckoutDetailStateResult.PENDING && isExpiration && (
        <div className="flex flex-col gap-3 bgi-[var(--grayscale-20)] rounded px-3 py-4">
          <div className="flex justify-center">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bgi-[var(--state-error-main)]">
              <Icon name="ic_close" className="w-6 h-6" color="#ffff" />
            </div>
          </div>

          <div className="text-center bgi-text-[var(--grayscale-100)] text-base font-medium">
            The time is up
          </div>
          <div className="text-[var(--grayscale-70)] text-sm font-medium border-t border-[var(--grayscale-30)] pt-3">
            Your session is expired, please start from the beginning.
          </div>
          <BasePrimaryBtn
            className={cx('font-semibold')}
            onClick={() => {
              handleCheckoutPageClick({
                actionName: handleCheckoutPageErrorBackClick,
                payload: {
                  callback: finishRecharge,
                },
              });
            }}
            children={'Back to Payment page'}
          />
        </div>
      )}
      {status === PayCheckoutDetailStateResult.SUCCESS && (
        <div className="flex flex-col gap-3 bgi-[var(--grayscale-20)] rounded px-3 py-4">
          <div className="flex justify-center">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bgi-[var(--state-success-main)]">
              <Icon name="ic_check" className="w-6 h-6" color="#ffff" />
            </div>
          </div>

          <div className="text-center bgi-text-[var(--grayscale-100)] text-base font-medium">
            Transaction successful
          </div>
          <div className="bgi-text-[var(--grayscale-70)] text-sm font-medium border-t border-[var(--grayscale-30)] pt-3">
            {
              'To view transaction details, please navigate to Account > Balance record > Add cash record.'
            }
          </div>
          <BasePrimaryBtn
            className={cx('font-semibold')}
            onClick={() => {
              handleCheckoutPageClick({
                actionName: handleCheckoutPageSuccessOKClick,
                payload: {
                  callback: finishRecharge,
                },
              });
            }}
            children={'OK'}
          />
        </div>
      )}
      {status === PayCheckoutDetailStateResult.FAILED && (
        <div className="flex flex-col gap-3 bgi-[var(--grayscale-20)] rounded px-3 py-4">
          <div className="flex justify-center">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bgi-[var(--state-error-main)]">
              <Icon name="ic_close" className="w-6 h-6" color="#ffff" />
            </div>
          </div>

          <div className="text-center bgi-text-[var(--grayscale-100)] text-base font-medium">
            Transaction failed
          </div>
          <div className="bgi-text-[var(--grayscale-70)] text-sm font-medium border-t border-[var(--grayscale-30)] pt-3">
            If you have any issues, please do not hesitate to contact our
            <span
              className="ml-1 border-b border-[var(--grayscale-70)] cursor-pointer"
              onClick={() => {
                handleCheckoutPageClick({
                  actionName: handleCheckoutPageToCustomerServiceClick,
                });
              }}
            >
              customer service
            </span>
            .
          </div>
          <BasePrimaryBtn
            className={cx('font-semibold')}
            onClick={() => {
              handleCheckoutPageClick({
                actionName: handleCheckoutPageErrorBackClick,
                payload: {
                  callback: finishRecharge,
                },
              });
            }}
            children={'Back to Payment page'}
          />
        </div>
      )}
    </div>
  );
};

export default PayResult;
