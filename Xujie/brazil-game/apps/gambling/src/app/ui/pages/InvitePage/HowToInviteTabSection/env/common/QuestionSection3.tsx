import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";

type QuestionSection3 = {
  className?: string;
};

export const QuestionSection3 = (prop: QuestionSection3) => {
  return (
    <>
      <div className={cx("inline", prop.className)}>
        Regras de liquidação da plataforma {environment.platformName}:
      </div>
      <div className="inline">
        A comissão devolvida pelo {environment.platformName} é atualizada a cada
        10 a 30 minutos, e a comissão devolvida será liberada toda
        segunda-feira, horário do Brasil. Clique em "Dados diários" para ver os
        detalhes da comissão.
      </div>
    </>
  );
};
