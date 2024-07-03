import { InputValue } from "apps/gambling/src/app/ui/components-bs/Inputs/Input";
import cx from "apps/gambling/src/app/ui/utils/cx";
import WalletWithdrawInputUnit from "./WalletWithdrawInputUnit";
import WalletWithdrawSelectUnit from "./WalletWithdrawSelectUnit";
import t from "apps/gambling/src/assets/constant/lang";

type ISelectOption = {
  value: string;
  label: string;
};

interface WalletWithdrawFormProps {

  nameInput: InputValue<string>;
  setNameInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  validateName: (value: string) => void;

  CPFInput: InputValue<string>;
  setCPFInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  validateCPForCNPJ: (value: string) => void;

  selectInput: InputValue<string>;
  setSelectInput: React.Dispatch<React.SetStateAction<InputValue<string>>>;

  tipoPixOptions: ISelectOption[];
  selectOption: ISelectOption;
  setSelectOption: (value: ISelectOption) => void;
  validateSelectInput: (value: string) => void;
  titleClassName?: string;
  inputClassName?: string;
  inputSectionClassName?: string;
  metaInputClassName?: string;
  errorMessageClassName?: string
  selectClassName?: string
}

export const WalletWithdrawForm = (props: WalletWithdrawFormProps) => {

  const inputClassName = props?.inputClassName ? props.inputClassName : 'text-main-primary-main leading-none text-sm md:text-xl';

  const selectedInputPlaceholder = {
    'CPF': t['CPFInputPlaceHolder'],
    'E-mail': t['EmailInputPlaceHolder'],
    'Telefone(+55)': ''
  }[props.selectOption.label]

  return (
    <section className={'text-left'}>
      <WalletWithdrawInputUnit
        label={t['accountHolderName']}
        placeholder={t['accountHolderNameHint']}
        value={props.nameInput.data}
        validation={props.nameInput.isValidation}
        onChange={(event: any) => {
          const isError = props.validateName(event.target.value);
        }}
        errorMessage={props.nameInput.errorMessage}
        errorMessageClassName={props.errorMessageClassName}
        metaInputClassName={props.metaInputClassName}
      />

      <WalletWithdrawInputUnit
        label={t['CPFCode']}
        placeholder={t['CPFCodeHint']}
        value={props.CPFInput.data}
        validation={props.CPFInput.isValidation}
        onChange={(event: any) => {
          const isError = props.validateCPForCNPJ(event.target.value);
        }}
        errorMessage={props.CPFInput.errorMessage}
        errorMessageClassName={props.errorMessageClassName}
        metaInputClassName={props.metaInputClassName}
      />

      <WalletWithdrawSelectUnit
        label={t['typeOfPix']}
        className={cx(props.selectClassName)}
        value={props.selectOption}
        options={props.tipoPixOptions}
        onChange={(item: any) => {
          props.setSelectOption(item);
        }}
      />

      <WalletWithdrawInputUnit
        label={props.selectOption.label}
        placeholder={selectedInputPlaceholder}
        value={props.selectInput.data}
        validation={props.selectInput.isValidation}
        onChange={(event: any) => {
          props.validateSelectInput(event.target.value);
        }}
        errorMessage={props.selectInput.errorMessage}
        errorMessageClassName={props.errorMessageClassName}
        metaInputClassName={props.metaInputClassName}
        prefix={
          props.selectOption.label === t['telephone55'] ? (
            <div className={cx(`mr-2 text-sm md:text-xl`,inputClassName)}>{t['tel55']}</div>
          ) : (
            ''
          )
        }
      />
    </section>
  )
}

export default WalletWithdrawForm;