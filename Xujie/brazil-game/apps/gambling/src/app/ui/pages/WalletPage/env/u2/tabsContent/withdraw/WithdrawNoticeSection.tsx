// import { RootState } from 'apps/gambling/src/app/reduxStore';
// import { useSelector } from 'react-redux';

export const WithdrawNoticeSection = (props: any) => {
  const { onClickToVIP, vip_level, withdrawLimitMin, withdrawLimitMax } = props;
  // const withdrawBegin = useSelector(
  //   (state: RootState) => state.app.withdrawBegin
  // );
  // const withdrawEnd = useSelector((state: RootState) => state.app.withdrawEnd);

  const sectionStyle = `
  p-2 md:py-2 md:px-2.5 lg:py-3 lg:px-5
  mb-4 lg:mb-5
  text-sm md:text-base lg:text-xl
  bg-[#333] text-[var(--grayscale-70)] rounded-lg
  leading-5 md:leading-6 lg:leading-7
  `;
  return (
    <div>
      <div className="text-white font-bold text-base md:text-xl lg:text-3xl mb-3 md:mb-5 lg:mb-8 font-medium">
        Regras de Retirada
      </div>
      <section className={`${sectionStyle} md:flex`}>
        <div>
          O valor e a frequência do saque diário estão diretamente relacionados
          ao seu nível VIP. Nível atual{' '}
          <button
            className={'text-[var(--grayscale-70)]'}
            onClick={onClickToVIP}
          >
            VIP{vip_level}
          </button>
          , o valor mínimo de saque diário é de
          <span className={'text-[var(--grayscale-70)]'}>
            {' '}
            R$ {withdrawLimitMin}
          </span>{' '}
          e o valor máximo de saque é de
          <span className={'text-[var(--grayscale-70)]'}>
            {' '}
            R$ {withdrawLimitMax}
          </span>
          .
        </div>
        <div className="flex text-center mt-3 md:mt-0 md:ml-2.5 lg:ml-5 justify-center items-center">
          <button
            className="text-white w-full md:w-auto py-2 px-8 md:py-1.5 shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)] text-base md:text-lg rounded-[100px] font-normal"
            onClick={onClickToVIP}
          >
            Cheque
          </button>
        </div>
      </section>

      <section className={sectionStyle}>
        O valor da retirada deve ser em múltiplos de 10. Por exemplo: 10, 20,
        110, 920, 28.620…
      </section>

      <section className={sectionStyle}>
        As recompensas da promoção podem ser retiradas diretamente.
      </section>

      <section className={sectionStyle}>
        O saldo não retirável na conta de recarga (Atividade) (incluindo, entre
        outros, o valor da recarga, recompensas por participar de atividades e
        valor de ganhos e perdas do jogo, etc.), pode ser retirado aumentando o
        valor da transação do jogo e obtendo um valor de lucro maior.
      </section>

      <section className={sectionStyle}>
        Por favor, preencha o número do CPF corretamente. Se a informação
        estiver incorreta, o saque falhará. Certifique-se de verificar as
        informações com atenção.
      </section>

      {/* <section className={sectionStyle}>
        Prezado cliente: Olá! Em resposta às exigências do Banco Central do Brasil e do recém-criado comitê de agências reguladoras relevantes no Brasil, a plataforma precisa concluir a troca de dados entre o Banco Central e as agências reguladoras relevantes das
        <span className={"text-[var(--state-warn-main)]"}> {withdrawBegin}h </span>
        <span className={"text-[var(--state-warn-main)]"}>às {withdrawEnd}h </span>, horário brasileiro!Todos os nossos esforços são para garantir que a operação da plataforma esteja mais em conformidade com as leis e regulamentos brasileiros relevantes! Proteger a privacidade dos utilizadores e os direitos e interesses conexos. Obrigado pela sua compreensão. As retiradas serão normais durante outros períodos de tempo na plataforma.
      </section> */}
    </div>
  );
};
