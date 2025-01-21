import Icon from '@mode2/components/Icon';
import cx from '@commonUtils/cx';
import useBackTopButtonAction from '@mode2/action/components/backTopButton/useFloatActionButtonAction';
import { handleBackTopButtonActionClick } from '@mode2/action/components/backTopButton/acitonType';
import { useTranslation } from 'react-i18next';

/**
 * 觸發滾動置頂
 * 預設 <TemplateLayout/> 內定義的 [id={'main-content'}] 有效
 * @constructor
 */

export const BackTopButton = (props: {
  targetElementId?: string;
  className?: string;
}) => {
  const { handleBackTopButtonClick } = useBackTopButtonAction();
  const targetId = props.targetElementId || '';
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'bgi-[var(--grayscale-20)] hover:bgi-[var(--grayscale-30)] active:bgi-[var(--grayscale-10)]',
        'w-11 h-11 rounded',
        'flex flex-col justify-center items-center',
        'cursor-pointer',
        props.className
      )}
      onClick={() => {
        handleBackTopButtonClick({
          actionName: handleBackTopButtonActionClick,
          payload: { targetElementId: targetId },
        });
      }}
    >
      <Icon
        className={cx('h-4 w-4', 'object-contain')}
        name="ic_arrow_up_1"
        color={'var(--base-2-main)'}
      />
      <div className="text-sm font-medium bgi-text-[var(--grayscale-100)]">
        {t('home_btn_top')}
      </div>
    </div>
  );
};
