import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useMyPageStore } from '@libs/mode2/zustand/page/myPageStore';
import { useState } from 'react';

// TODO Ronan
// TODO i18n
// TODO api
export const MyBonusModal = () => {
  const isShowVIPMyBonusModal = useMyPageStore(
    (state) => state.isShowVIPMyBonusModal
  );
  const [curTab, setCurTab] = useState('Month');
  const tabList = ['Month', 'All'];
  // TODO Ronan
  const setShowVIPMyBonusModal = useMyPageStore(
    (state) => state.setShowVIPMyBonusModal
  );

  return isShowVIPMyBonusModal ? (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen h-full fixed top-0 left-1/2 -translate-x-1/2 z-50 bgi-[var(--background-dark)]'
      )}
    >
      {/* 關閉按鈕 */}
      <div
        className={cx(FLEX_CENTER, 'h-20', 'bgi-[var(--base-2-variant5)]')}
        onClick={() => {
          setShowVIPMyBonusModal(false);
        }}
      >
        <Icon name="ic_back_header" className="w-7 h-7 absolute left-4" />
        <div className="text-2xl font-medium bgi-text-[var(--grayscale-100)]">
          My bonus
        </div>
      </div>

      {/* 内容 */}
      <div
        className="w-full h-full text-center bgi-text-[var(--grayscale-100)]"
        style={{
          backgroundImage: `url(${getImgUrl(
            EResourceLevel.ICONS,
            'casino_background'
          )})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-2xl py-4 font-medium">
          <div>Total rewards</div>
          <div className="bgi-text-[var(--base-1-variant8)]">
            {formatMoney(0)}
          </div>
        </div>

        <div
          className={cx(
            'm-4 box-border',
            'border border-[var(--base-1-main)] rounded-md overflow-hidden'
          )}
        >
          <div className={cx('w-full h-full flex')}>
            {tabList.map((item, i) => {
              return (
                <div
                  className={cx(
                    'w-40 h-full text-base font-medium flex-1',
                    'py-3 box-border',
                    'text-lg font-medium',
                    'relative flex items-center justify-center cursor-pointer',
                    {
                      'bgi-text-[var(--base-2-variant1)]': curTab !== item,
                      'bgi-[var(--base-2-variant14)] bgi-text-[var(--grayscale-100)]':
                        curTab === item,
                    }
                  )}
                  key={i}
                  onClick={() => {
                    setCurTab(item);
                  }}
                >
                  {item}
                  {curTab === item ? (
                    <img
                      className={cx(
                        'w-full h-full',
                        'absolute bottom-0 left-0'
                      )}
                      src={getImgUrl(EResourceLevel.ICONS, 'record_header')}
                      alt="active"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* table */}
          <div>
            {Array.from({ length: 3 }, (_, index) => {
              return (
                <div
                  className={cx(
                    'flex justify-between',
                    'py-3 px-4 box-border',
                    'font-medium',
                    'odd:bgi-[var(--base-2-variant10)]'
                  )}
                  key={index}
                >
                  <div className={cx(FLEX_ITEMS_CENTER, 'gap-8')}>
                    <Icon name="ic_my_bonus_rewards_1" className="w-12 h-12" />
                    <div className={cx(FLEX_COL, 'text-base')}>
                      <span>VIP {index} Monthly Rewards</span>
                      <span className="bgi-text-[var(--base-2-variant1)]">
                        YYYY-MM-DD hh:mm:ss
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl bgi-text-[var(--base-1-main)]">
                    {formatMoney(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
