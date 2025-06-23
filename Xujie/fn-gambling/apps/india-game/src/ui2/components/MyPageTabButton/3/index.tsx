import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { memo } from 'react';
import Icon from '@components/Icon';
import renderI18N from '@libs/commonUtils/renderI18N';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { FLEX_CENTER } from '@libs/constant/style';
import { MyPageTabButtonProps } from '../MyPageTabButtonProps';

export const MyPageTabButton = memo((props: MyPageTabButtonProps) => {
  const { t } = useTranslation();
  return (
    <BasePrimaryBtn
      className={cx(
        'w-auto h-auto rounded-full',
        'text-xs mobile:text-sm tablet:text-sm',
        'font-medium',
        'flex-1 gap-1',
        'px-5 py-2 mobile:py-2.5'
      )}
      onClick={props.onClick}
      classNameText={cx(FLEX_CENTER, 'flex-col')}
      children={
        <div className="flex items-center gap-1">
          <Icon
            className={cx('w-5 h-5', 'object-contain')}
            name={props.iconUrl}
          />
          <div>{renderI18N(props.btnText, t)}</div>
        </div>
      }
    />
  );
});

export default MyPageTabButton;
