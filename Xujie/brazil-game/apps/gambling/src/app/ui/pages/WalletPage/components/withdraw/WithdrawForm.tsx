import { Input, InputValue } from "../../../../components-bs/Inputs/Input";
import { MobileInput } from "../../../../components-bs/Inputs/MobileInput";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import Select from 'react-select';
import { renderByUVersion } from "../../../../utils/renderByUVersion";
import { selectInputStyleProps as WselectInputStyleProps } from '../../env/wild/tabsContent/withdraw/selectInputStyleProps';
import { selectInputStyleProps as RselectInputStyleProps } from '../../env/u2/tabsContent/withdraw/selectInputStyleProps';
import { selectInputStyleProps as CselectInputStyleProps } from '../../env/u1/tabsContent/withdraw/selectInputStyleProps';
import { selectInputStyleProps as PselectInputStyleProps } from '../../env/p1/tabsContent/withdraw/selectInputStyleProps';
import { selectInputStyleProps as U5selectInputStyleProps } from '../../env/u5/selectInputStyleProps';
import { twMerge } from "tailwind-merge";
import cx from "../../../../utils/cx";

type ISelectOption = {
  value: string;
  label: string;
};

export type IWithdrawForm = {


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

export const WithdrawForm = (props: IWithdrawForm) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const MainInput = isMobile ? MobileInput : Input;
  const inputSectionClassName = props?.inputSectionClassName ? props?.inputSectionClassName : 'mb-2 md:mb-4 lg:mb-5';

  const titleClassName = props?.titleClassName ? props?.titleClassName : 'text-white font-bold block mb-1 '

  const inputClassName = props?.inputClassName ? props.inputClassName : 'text-main-primary-main leading-none text-sm md:text-xl';

  const selectedInputPlaceholder = {
    'CPF': 'Por favor insira seu CPF',
    'E-mail': 'Por favor insira seu e-mail',
    'Telefone(+55)': ''
  }[props.selectOption.label]

  return (
    <section className={'text-left'}>
      <section className={inputSectionClassName}>
        <label className={titleClassName}>
          Nome do titular da conta
        </label>

        <MainInput
          inputClassName={inputClassName}
          themeStyle={'normal'}
          className={twMerge("w-full ", props.metaInputClassName)}
          placeholder={'Insira o nome do titular do cartão'}
          value={props.nameInput.data}
          validation={props.nameInput.isValidation}
          errorMessage={props.nameInput.errorMessage}
          pureContainer={true}
          onChange={(event: any) => {
            const isError = props.validateName(event.target.value);
          }}
          errorMessageClassName={props.errorMessageClassName}
        />
      </section>

      <section className={inputSectionClassName}>
        <label className={titleClassName}>
          {/*Código CPF/CNPJ*/}
          Código CPF
        </label>
        <MainInput
           themeStyle={'normal'}
          className={twMerge("w-full rounded-lg", props.metaInputClassName)}
          inputClassName={
            inputClassName
          }
          // placeholder={'Insira o seu código CPF/CNPJ'}
          placeholder={'Insira o seu código CPF'}
          value={props.CPFInput.data}
          validation={props.CPFInput.isValidation}
          errorMessage={props.CPFInput.errorMessage}
          pureContainer={true}
          onChange={(event: any) => {
            const isError = props.validateCPForCNPJ(event.target.value);
          }}
           errorMessageClassName={props.errorMessageClassName}
        />
      </section>

      <section className={inputSectionClassName}>
        <label className={titleClassName}>
          Tipo Pix
        </label>
        <Select
          menuPlacement={'bottom'}
          className={twMerge("rounded-lg leading-none text-xl", props.selectClassName)}
          isSearchable={false}
          styles={renderByUVersion({
            "wild777bet": WselectInputStyleProps(isMobile),
            "p1": PselectInputStyleProps(isMobile),
            "u1": CselectInputStyleProps(isMobile),
            "u2": RselectInputStyleProps(isMobile),
            "u5": U5selectInputStyleProps(isMobile)
          }, PselectInputStyleProps(isMobile))}
          value={props.selectOption}
          onChange={(item: any) => {
            props.setSelectOption(item);
          }}
          options={props.tipoPixOptions}
        />
      </section>

      <section className={''}>
        <label className={titleClassName}>
          {props.selectOption.label}
        </label>
        <MainInput
          className={twMerge("w-full rounded-lg", props.metaInputClassName)}
          inputClassName={inputClassName}
          themeStyle={'normal'}
          placeholder={selectedInputPlaceholder}
          value={props.selectInput.data}
          validation={props.selectInput.isValidation}
          errorMessage={props.selectInput.errorMessage}
          pureContainer={true}
          prefix={
            props.selectOption.label === 'Telefone(+55)' ? (
              <div className={cx(`mr-2 text-sm md:text-xl`,inputClassName)}>+55</div>
            ) : (
              ''
            )
          }
          onChange={(event: any) => {
            props.validateSelectInput(event.target.value);
          }}
          errorMessageClassName={props.errorMessageClassName}
        />
      </section>
    </section>
  )
}
