import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LineBtnUnit, useMyPageStore } from '@mode2/zustand/page/myPageStore';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import Icon from '@mode2/components/Icon';
import RedDot from '@components/RedDot';
import { handleMyPageTeamClubLineBtnClick } from '@mode2/action/myPageAction/acitonType';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';

const QuickLineCellButtons = memo(() => {
  const { t } = useTranslation();
  const lineBtnList = useMyPageStore((state) => state.lineBtnList);
  const { handleMyPageClick } = useMyPageActions();
  const teamClubButton: LineBtnUnit = {
    iconName: 'earn_money',
    name: { i18nKey: 'leftnav_earn' },
    isBorder: true,

    isShowRedDot: false,
    isShowArrow: true,
    onAction: () => {
      handleMyPageClick({
        actionName: handleMyPageTeamClubLineBtnClick,
      });
    },
  };

  const lineBtnItems = useMemo(() => {
    return lineBtnList.map((item) => {
      const isEarn = item.name.i18nKey === 'account_menu_earn_money';
      return isEarn ? teamClubButton : { ...item };
    });
  }, [lineBtnList]);

  return (
    <div className="flex flex-col my-4 bgi-[var(--grayscale-10)] rounded p-3">
      {lineBtnItems.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx('', {
              'bgi-[var(--base-2-main)] rounded-lg pb-px': item.isBorder,
            })}
            onClick={item.onAction}
          >
            <div className="bgi-[var(--grayscale-10)] rounded-b-lg flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Icon
                  className="w-6 h-6"
                  name={`ic_${item.iconName}`}
                  color={item && item.color ? item.color : 'var(--base-2-main)'}
                />
                <span className="bgi-text-[var(--base-2-main)]">
                  {renderI18N(item.name, t)}
                </span>
              </div>

              <div className="item-txt flex items-center gap-1">
                {item.isShowRedDot ? (
                  <RedDot size="8" className={'animate-none w-2 h-2'} />
                ) : null}
              </div>

              {item.isShowArrow ? (
                <Icon
                  className="w-4 h-4"
                  name="ic_arrow_right_1"
                  color="var(--base-2-main)"
                />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default QuickLineCellButtons;
