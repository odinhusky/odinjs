import { FloatButton } from 'antd';
import cx from '@commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  FloatActionButton as FloatActionButtonObj,
  useFloatActionButtonListStore,
} from '@mode2/zustand/components/floatActionButtonStore';
import useFloatActionButtonAction from '@mode2/action/components/floatActionButton/useFloatActionButtonAction';
import { handleFABDrawerActionClick } from '@mode2/action/components/floatActionButton/acitonType';
import { BackTopButton } from '@components/BackTopButton';

import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useMemo, useState } from 'react';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import RedDot from '@components/RedDot';
import { useBreakPoint } from '@libs/commonUtils';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import ActivityCenterButton from '@components/ActivityCenterButton';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { divide, isEmpty } from 'lodash';
import Icon from '@mode2/components/Icon';

const ActionButton = ({
  item,
  styles,
  imageClassName,
  imgType = '',
}: {
  item: FloatActionButtonObj;
  styles?: React.CSSProperties;
  imageClassName?: string;
  imgType?: string;
}) => {
  return (
    <div
      key={item.type}
      className={cx(
        'bg-shadow-[var(--inset-shadow)] rounded-full',
        'w-10 h-10 mobile:w-14 mobile:h-14',
        'flex justify-center items-center',
        'cursor-pointer',
        'relative',
        item.className
      )}
      style={styles}
      onClick={item.onActionClick}
    >
      {isEmpty(imgType) ? (
        <Icon
          name={`${item.icon}_default`}
          className={cx(
            'rounded-full',
            'object-contain',
            'w-full h-full',
            'hover:brightness-[1.15]',
            'active:brightness-[0.85]',
            'shadow-[4px_4px_8px_0px_#33333340]',
            imageClassName
          )}
        />
      ) : (
        <img
          src={getImgUrl(EResourceLevel.V, item.icon, imgType)}
          className={cx(
            'rounded-full',
            'object-contain',
            'w-full h-full',
            'hover:brightness-[1.15]',
            'active:brightness-[0.85]',
            'shadow-[4px_4px_8px_0px_#33333340]',
            imageClassName
          )}
          alt={item.label}
        />
      )}
      {item?.isShowRedDot ? (
        <RedDot
          type="img"
          className={
            'absolute mobile:top-[3px] mobile:right-[3px] top-0 right-0'
          }
        />
      ) : null}
    </div>
  );
};

export const FloatActionButton = () => {
  useFloatActionButtonBase();
  const { isDesktop } = useBreakPoint();
  const { navToLoginPage } = useNavPageClick();
  const [btnBoxVisible, setBtnBoxVisible] = useState(false);

  const fabConfig = useFloatActionButtonListStore((state) => state.fabConfig);

  const isShowDrawerControlBar = useFloatActionButtonListStore(
    (state) => state.isShowDrawerControlBar
  );
  const isOpenDrawer = useFloatActionButtonListStore(
    (state) => state.isOpenDrawer
  );

  const { handleFloatActionButtonClick } = useFloatActionButtonAction();

  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const currentCash = useRebateRewardModalStore((state) => state.currentCash);
  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );
  const isLogin = useIsLoginStore((state) => state.isLogin);

  const moneyBoxBtnItemConfig = {
    icon: 'piggy_bank',
    label: 'MoneyBox',
    type: 'MONEY_BOX',
    isShowRedDot: currentCash > 0,
    onActionClick: () => handleMoneyBoxBtnClick(),
  };

  const iconMapping: Record<ServicesTypeResult | string, string> = {
    IN_BOX: 'fab_inbox',
    [ServicesTypeResult.WHATS_APP]: 'fab_whatsapp',
    [ServicesTypeResult.INSTAGRAM]: 'fab_instagram',
    [ServicesTypeResult.TELEGRAM]: 'fab_telegram',
    [ServicesTypeResult.LIVE_CHAT]: 'fab_livechat',
    [ServicesTypeResult.YOUTUBE]: 'fab_youtube',
    [ServicesTypeResult.FACEBOOK]: 'fab_facebook',
    [ServicesTypeResult.TIKTOK]: 'fab_tiktok',
    [ServicesTypeResult.TWITTER]: 'fab_twitter',
    [ServicesTypeResult.UNKNOWN]: '',
  };

  const fabItems = useMemo(() => {
    if (!fabList.length) return [];

    if (fabList.length > 1) {
      const specifiedOrder = [
        ServicesTypeResult.LIVE_CHAT,
        'IN_BOX',
        ServicesTypeResult.WHATS_APP,
        ServicesTypeResult.TELEGRAM,
        ServicesTypeResult.INSTAGRAM,
        ServicesTypeResult.YOUTUBE,
      ];

      fabList.sort((a, b) => {
        const indexA = specifiedOrder.indexOf(a.type);
        const indexB = specifiedOrder.indexOf(b.type);

        return indexA - indexB;
      });
    }

    return fabList.map((item) => {
      return {
        ...item,
        icon: iconMapping[item.type] || '',
      };
    });
  }, [fabList]);

  const handleMoneyBoxBtnClick = () => {
    if (isLogin) {
      setIsShowRebateRewardModal(true);
    } else {
      navToLoginPage();
    }
  };

  const renderButtons = () => {
    return fabItems.map((item, index) => {
      return <ActionButton key={item.type + '-' + index} item={item} />;
    });
  };

  const checkRedDot = () => {
    return fabItems.some((item) => item.isShowRedDot);
  };

  return fabConfig.isFeatureSupport ? (
    <FloatButton.Group
      rootClassName={''}
      className={cx(
        'w-auto end-0 bottom-[68px] shadow-none flex flex-col items-end'
      )}
      shape="square"
    >
      <div className={'flex flex-row justify-center items-center'}>
        {/* 桌面版水平收合按鈕 */}
        {/* {isShowDrawerControlBar && !isDesktop ? (
          <img
            alt={isOpenDrawer ? 'Close Drawer' : 'Open Drawer'}
            className={cx('w-4', 'object-contain cursor-pointer')}
            src={getImgUrl(
              EResourceLevel.V,
              isOpenDrawer ? 'icon_float_close' : 'icon_float_open'
            )}
            onClick={() => {
              handleFloatActionButtonClick({
                actionName: handleFABDrawerActionClick,
              });
            }}
          />
        ) : null} */}

        <div
          className={cx(
            'flex flex-col justify-center gap-2 tablet:gap-3 p-2',
            'rounded-l-lg',
            isOpenDrawer ? 'w-auto px-2 items-center' : 'w-0 px-0'
          )}
        >
          {/* 存錢罐通知 */}
          {fabConfig.isShowMoneyBoxBtn && (
            <ActionButton item={moneyBoxBtnItemConfig} imgType={'.gif'} />
          )}

          {/* {renderButtons()} */}
          {isDesktop ? (
            renderButtons()
          ) : btnBoxVisible ? (
            <div
              className="flex flex-col gap-4 bgi-[var(--transparent-gray-50)] rounded-xl p-2
                  shadow-[4px_4px_8px_0px_#33333340]"
            >
              <div className="flex flex-col gap-2">{renderButtons()}</div>
              <div className="w-full h-[1px] bgi-[var(--transparent-white-20)]" />
              <div
                className="relative m-auto cursor-pointer"
                onClick={() => {
                  setBtnBoxVisible(!btnBoxVisible);
                }}
              >
                <Icon
                  className="mobile:w-12 mobile:h-12 w-10 h-10"
                  name={'fab_close_default'}
                />
              </div>
            </div>
          ) : (
            <div
              className="relative mobile:mx-3 mx-2 cursor-pointer drop-shadow-[4px_4px_8px_#33333340]"
              onClick={() => {
                setBtnBoxVisible(!btnBoxVisible);
              }}
            >
              <Icon
                className="mobile:w-12 mobile:h-12 w-10 h-10"
                name={'fab_add_default'}
              />
              {checkRedDot() && (
                <RedDot
                  type="img"
                  className={
                    'absolute mobile:top-[3px] mobile:right-[3px] top-0 right-0'
                  }
                />
              )}
            </div>
          )}

          {isShowDrawerControlBar ? <BackTopButton /> : null}
        </div>
      </div>
      {/* 觸發紅包雨按鈕 */}
      {isOpenDrawer && <ActivityCenterButton className="p-2" />}
    </FloatButton.Group>
  ) : null;
};
