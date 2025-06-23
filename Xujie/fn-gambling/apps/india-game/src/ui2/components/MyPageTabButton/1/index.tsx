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
        'w-auto h-auto',
        'text-xs mobile:text-xs',
        'font-medium',
        'flex-1 gap-1',
        'px-5 py-1',
        'bgi-[var(--base-1-main)] hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)]'
      )}
      onClick={props.onClick}
      classNameText={cx(FLEX_CENTER, 'flex-col')}
      children={
        <div className="flex gap-2 items-center">
          <Icon
            className={cx('w-6 h-6', 'object-contain')}
            name={props.iconUrl}
            // color={'var(--base-2-main)'}
          />
          <div>{renderI18N(props.btnText, t)}</div>
        </div>
      }
    />
  );
});

export default MyPageTabButton;
