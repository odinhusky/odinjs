import cx from "../../../../../utils/cx";

type QuestionSection4 = {
    className?: string;
};
export const QuestionSection4 = (props: QuestionSection4) => {
  return (
    <div className={cx(
        props.className
    )}>
      Declaração especial: Para garantir a justiça da plataforma, a
      plataforma adota uma estratégia antitrapaça, e os usuários
      trapaceiros serão banidos permanentemente, os fundos obtidos
      ilegalmente serão congelados e as responsabilidades legais
      relevantes serão investigadas.
    </div>
  )
}