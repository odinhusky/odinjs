import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { memo } from 'react';
import Icon from '@mode2/components/Icon';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { FLEX_CENTER } from '@libs/constant/style';

interface MyPageTabButtonProps {
  btnText: I18NContent;
  iconUrl: string;
  onClick: () => void;
}

export const MyPageTabButton = memo((props: MyPageTabButtonProps) => {
  const { t } = useTranslation();
  return (
    <BasePrimaryBtn
      className={cx(
        'w-auto h-auto',
        'text-xs mobile:text-sm tablet:text-sm',
        'font-medium',
        'flex-1 gap-1',
        'px-5 py-1'
      )}
      onClick={props.onClick}
      classNameText={cx(FLEX_CENTER, 'flex-col')}
      children={
        <>
          <Icon
            className={cx('w-6 h-6', 'object-contain')}
            name={props.iconUrl}
            // color={'var(--base-2-main)'}
          />
          <div>{renderI18N(props.btnText, t)}</div>
        </>
      }
    />
  );
});

export default MyPageTabButton;
