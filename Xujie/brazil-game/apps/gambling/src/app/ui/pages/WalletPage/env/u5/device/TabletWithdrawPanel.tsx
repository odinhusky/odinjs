import { IWithdrawPanelCommon } from '../../../components/withdraw/WithdrawPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import { Input } from '../../../../../components-bs/Inputs/Input';
import { WithdrawForm } from '../../../components/withdraw/WithdrawForm';
import { formatLocaleMoney } from '../../../../../utils/format';

const TabletWithdrawPanel = ({
  isDuringRestrictTime,
  withdrawLimitMax,
  vip_level,
  onClickToVIP,
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
}: IWithdrawPanelCommon) => {
  const withdrawBegin = useSelector(
    (state: RootState) => state.app.withdrawBegin
  );
  const withdrawEnd = useSelector((state: RootState) => state.app.withdrawEnd);

  if (isDuringRestrictTime) {
    return (
      <div className="p-8 rounded-lg bg-[var(--grayscale-20)] text-white mt-10 text-sm">
        <div className="text-center">A conta está sendo liquidada</div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          Prezado cliente: Olá! Em resposta às exigências do Banco Central do
          Brasil e do recém-criado comitê de agências reguladoras relevantes no
          Brasil, a plataforma precisa concluir a troca de dados entre o Banco
          Central e as agências reguladoras relevantes das{' '}
          <span className="text-[var(--state-warn-main)]">{withdrawBegin}</span>{' '}
          às{' '}
          <span className="text-[var(--state-warn-main)]">{withdrawEnd}</span>,
          horário brasileiro!
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          As recompensas da promoção podem ser retiradas Todos os nossos
          esforços são para garantir que a operação da plataforma esteja mais em
          conformidade com as leis e regulamentos brasileiros relevantes!
          Proteger a privacidade dos utilizadores e os direitos e interesses
          conexos. Obrigado pela sua compreensão..
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          As retiradas serão normais durante outros períodos de tempo na
          plataforma.
        </div>
      </div>
    );
  }

  return (
    <div className="text-white mt-8">
      {contextHolder}
      <div className="p-8 rounded-lg bg-[var(--grayscale-20)]">
        <Input
          className="hover:text-white"
          type="text"
          inputmode="numeric"
          inputClassName="text-sm placeholder:text-sm placeholder:text-[var(--grayscale-60)] text-white"
          themeStyle={'normal'}
          placeholder={`Retirada mínima R$${formatLocaleMoney(
            withdrawLimitMin
          )}`}
          value={amountInput.data}
          validation={amountInput.isValidation}
          errorMessage={amountInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          onChange={(event: any) => {
            const inputValue = event.target.value;
            const numericValue = inputValue.replace(/[^0-9]/g, '');
            validateAmount(numericValue);
          }}
        />

        <div className="text-[var(--grayscale-70)] text-sm -mt-4">
          Atualmente VIP{vip_level}, o valor mínimo de saque diário é de R${' '}
          {formatLocaleMoney(withdrawLimitMin)} e o valor máximo de saque é de
          R$ {formatLocaleMoney(withdrawLimitMax)}.
        </div>

        <div className="p-3 mb-8 text-sm text-[var(--state-warn-main)] bg-[var(--grayscale-10)] rounded-lg mt-8">
          Por favor, preencha o número do CPF corretamente. Se a informação
          estiver incorreta, o saque falhará. Certifique - se de verificar as
          informações com atenção.
        </div>

        <WithdrawForm
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
          inputSectionClassName="mb-8"
          inputClassName="text-sm placeholder:text-sm placeholder:text-[var(--grayscale-60)] text-white"
          metaInputClassName="hover:text-white text-sm"
          errorMessageClassName="text-[var(--state-error-main)]"
          selectClassName="text-sm"
          titleClassName="text-base font-bold"
        />

        <div className="mt-8 flex justify-center">
          <button
            onClick={onClickToWithdraw}
            className="linear-5-button py-[10px] min-w-[312px] text-sm font-extrabold rounded-full"
          >
            Retirar
          </button>
        </div>
      </div>

      <div className="mt-10 p-8 rounded-lg bg-[var(--grayscale-20)] text-sm">
        <div className="text-center text-base font-extrabold">
          Regras de Retirada
        </div>

        <div className="flex justify-center items-center rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5 gap-5">
          <div>
            O valor e a frequência do saque diário estão diretamente
            relacionados ao seu nível VIP.Nível atual{' '}
            <span className="text-[var(--state-warn-main)]">
              VIP{vip_level}
            </span>
            , o valor mínimo de saque diário é de{' '}
            <span className="text-[var(--state-warn-main)]">
              R$ {formatLocaleMoney(withdrawLimitMin)}
            </span>{' '}
            e o valor máximo de saque é de{' '}
            <span className="text-[var(--state-warn-main)]">
              R$ {formatLocaleMoney(withdrawLimitMax)}
            </span>
            .
          </div>

          <button
            onClick={onClickToVIP}
            className="linear-5-button min-w-[120px] py-[10px] text-sm font-extrabold rounded-full"
          >
            Cheque
          </button>
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          O valor da retirada deve ser em múltiplos de 10.
          <br />
          Por exemplo: 10, 20, 110, 920, 2.8620…
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          As recompensas da promoção podem ser retiradas diretamente.
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          O saldo não retirável na conta de recarga (Atividade) (incluindo,
          entre outros, o valor da recarga, recompensas por participar de
          atividades e valor de ganhos e perdas do jogo, etc.), pode ser
          retirado aumentando o valor da transação do jogo e obtendo um valor de
          lucro maior.
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          Por favor, preencha o número do CPF corretamente. Se a informação
          estiver incorreta, o saque falhará. Certifique-se de verificar as
          informações com atenção.
        </div>
        <div className="rounded-lg bg-[var(--grayscale-10)] py-3 px-5 mt-5">
          Prezado cliente: Olá! Em resposta às exigências do Banco Central do
          Brasil e do recém-criado comitê de agências reguladoras relevantes no
          Brasil, a plataforma precisa concluir a troca de dados entre o Banco
          Central e as agências reguladoras relevantes das {withdrawBegin} às{' '}
          {withdrawEnd}, horário brasileiro!Todos os nossos esforços são para
          garantir que a operação da plataforma esteja mais em conformidade com
          as leis e regulamentos brasileiros relevantes! Proteger a privacidade
          dos utilizadores e os direitos e interesses conexos. Obrigado pela sua
          compreensão. As retiradas serão normais durante outros períodos de
          tempo na plataforma.
        </div>
      </div>
    </div>
  );
};

export default TabletWithdrawPanel;
