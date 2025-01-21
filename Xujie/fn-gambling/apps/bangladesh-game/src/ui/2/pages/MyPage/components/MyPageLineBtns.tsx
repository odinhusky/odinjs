import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  useMyPageActionsStore,
  useMyPageStore,
} from '@mode2/zustand/page/myPageStore';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import RedDot from '@components/RedDot';
import Icon from '@libs/mode2/components/Icon';

export const MyPageLineBtns = memo(() => {
  const { t } = useTranslation();
  const lineBtnList = useMyPageStore((state) => state.lineBtnList);
  const lineBtnActionObj = useMyPageActionsStore(
    (state) => state.lineBtnActionObj
  );

  return (
    <div className="btnItems">
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx('item', {
              'item-border': item.isBorder,
            })}
            onClick={() => {
              if (`${item.actionName}` in lineBtnActionObj)
                lineBtnActionObj[item.actionName]();
            }}
          >
            <Icon
              className="w-6 h-6"
              name={`ic_${item.iconName}`}
              color={item && item.color ? item.color : 'var(--base-2-main)'}
            />

            <div className="item-txt flex items-center gap-1">
              {renderI18N(item.name, t)}
              {item.isShowRedDot ? (
                <RedDot size="8" className={'animate-none'} />
              ) : null}
            </div>

            <Icon
              className="w-4 h-4"
              name={`ic_arrow_right_1`}
              color="var(--base-2-main)"
            />
          </button>
        );
      })}
    </div>
  );
});

export default MyPageLineBtns;
