import { cx } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';

interface BtnProps {
  onClick?: () => void;
  className?: string;
}
const QuestionBtn = (props: BtnProps) => {
  return (
    <button onClick={props.onClick} className={cx('w-6 h-6', props.className)}>
      <Icon name="ic_question" color="var(--base-1-main)" className="w-full" />
    </button>
  );
};

export default QuestionBtn;
