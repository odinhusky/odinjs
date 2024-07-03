import { IWithdrawPanelCommon } from '../../../components/withdraw/WithdrawPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import WalletWithdrawDuringRestrictTime from './WalletWithdrawDuringRestrictTime';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import WalletWithdrawForm from './WalletWithdrawForm';
import WalletWithdrawWarningZone from './WalletWithdrawWarningZone';
import t from 'apps/gambling/src/assets/constant/lang';
import WalletBtn from './WalletBtn';
import WalletWithdrawInputUnit from './WalletWithdrawInputUnit';
import { formatLocaleMoney } from 'apps/gambling/src/app/ui/utils/format';

export const WalletSharedWithdrawPanel = ({
  isDuringRestrictTime,
  withdrawLimitMin,
  amountInput,
  validateAmount,
  nameInput,
  setNameInput,
  validateName,
  CPFInput,
  setCPFInput,
  validateCPForCNPJ,
  selectInput,
  setSelectInput,
  tipoPixOptions,
  selectOption,
  setSelectOption,
  validateSelectInput,
  onClickToWithdraw,
  contextHolder,
  isWithdrawBtnDisabled,
}: IWithdrawPanelCommon) => {
  const withdrawBegin = useSelector(
    (state: RootState) => state.app.withdrawBegin
  );
  const withdrawEnd = useSelector((state: RootState) => state.app.withdrawEnd);

  if (isDuringRestrictTime) {
    return (
      <WalletWithdrawDuringRestrictTime
        withdrawBegin={withdrawBegin}
        withdrawEnd={withdrawEnd}
      />
    );
  }

  return (
    <div className="text-white">
      {contextHolder}
      <div>
        <WalletWithdrawInputUnit
          label={t['accountHolderName']}
          placeholder={`${t['minimalWithdrawAmount']} ${t['moneyWithRSign'](
            formatLocaleMoney(withdrawLimitMin)
          )}`}
          value={amountInput.data}
          validation={amountInput.isValidation}
          onChange={(event: any) => {
            const inputValue = event.target.value;
            const numericValue = inputValue.replace(/[^0-9]/g, '');
            validateAmount(numericValue);
          }}
          errorMessage={amountInput.errorMessage}
          errorMessageClassName={cx('text-[var(--state-error-main)]')}
          metaInputClassName={cx('py-[10px] px-4 tablet:py-3')}
        />

        {/* Warning */}
        <WalletWithdrawWarningZone />

        <WalletWithdrawForm
          nameInput={nameInput}
          setNameInput={setNameInput}
          validateName={validateName}
          CPFInput={CPFInput}
          setCPFInput={setCPFInput}
          validateCPForCNPJ={validateCPForCNPJ}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          tipoPixOptions={tipoPixOptions}
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          validateSelectInput={validateSelectInput}
        />

        <div className="mt-8 flex justify-center">
          <WalletBtn
            children={t['Withdraw']}
            disabled={isWithdrawBtnDisabled}
            onClick={onClickToWithdraw}
            btnClass={cx('mobile:max-w-[320px]', 'h-[40px] tablet:h-[48px]')}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletSharedWithdrawPanel;
