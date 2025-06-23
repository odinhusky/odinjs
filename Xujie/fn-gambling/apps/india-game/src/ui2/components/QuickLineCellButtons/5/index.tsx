import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MyPageBtnListScenarios,
  useMyPageStore,
} from '@mode2/zustand/page/myPageStore';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import RedDot from '@components/RedDot';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

const QuickLineCellButtons = memo(() => {
  const { t } = useTranslation();
  const usageScenariosList = useMyPageStore(
    (state) => state.usageScenariosList
  );

  const iconsMapping: Record<string, string> = {
    activity: 'ic_activity_default_1',
    earn_money: 'ic_earn_money_default_1',
    user: 'ic_user_default_1',
    bank_account: 'ic_bank_account',
    change_password: 'ic_change_password',
    question: 'ic_question',
    customer_support_1: 'ic_customer_support_1',
    reload: 'ic_reload',
  };

  const lineBtnList = (
    usageScenariosList.find((item) => {
      return item.scenarios === MyPageBtnListScenarios.DEFAULT;
    })?.usageScenariosList || []
  ).map((item) => ({
    ...item,
    iconName: `${iconsMapping[item.iconName] || item.iconName}`,
  }));

  return (
    <div className="btnItems">
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx('item', {
              'item-border': item.isBorder,
            })}
            onClick={item.onAction}
          >
            <Icon className="w-6 h-6" name={item.iconName} />

            <div className="item-txt flex items-center gap-1">
              {renderI18N(item.name, t)}
              {item.isShowRedDot ? (
                <RedDot className={'animate-none w-2 h-2'} />
              ) : null}
            </div>

            {item.isShowArrow ? (
              <BaseCacheImg
                src={getImgUrl(EResourceLevel.ICONS, 'ic_arrow_right_1')}
                imgName="ic_arrow_right_1"
                className="!w-4 !h-4"
                alt="ic_arrow_right_1"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
});

export default QuickLineCellButtons;
