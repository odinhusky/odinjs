import {VIPBorderStyleContainer} from "../../../../components/VIPBorderStyleContainer";

export const Notice = () => {
  return (
    <div className={"flex flex-col mt-10 bg-[#18302F] rounded-2xl py-5 px-10"}>
      <span className={"text-white text-lg text-left w-full"}>Regras de recompensa diária VIP：</span>
      <span className={"text-white text-sm text-left w-full"}>
              <div>· Cada nível só pode receber recompensas por 7 dias no total. As recompensas serão creditadas na próxima vez que você as reivindicar.</div>
              <div>· Para garantir a justiça da plataforma, a plataforma adota uma estratégia antitrapaça, os usuários trapaceiros serão banidos e forneceremos atendimento ao cliente 24 horas para resolver seus problemas.</div>
            </span>
    </div>
  )
}
