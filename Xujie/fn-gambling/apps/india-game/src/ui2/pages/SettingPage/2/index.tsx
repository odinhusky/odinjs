import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  SettingPageMusicSwitchTypes,
  SettingPageTypes,
  useSettingPageStore,
} from '@libs/mode2/zustand/page/settingPageStore';
import useMode2SettingPageBase from '@mode2/usecase/page/settingPage/useMode2SettingPageBase';
import useSettingPageAction from '@mode2/action/settingPageAction/useSettingPageAction';
import { handleSettingPageSwitchClick } from '@mode2/action/actionTypes';
import { useTranslation } from 'react-i18next';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { useMemo } from 'react';

const AboutUsItems = () => {
  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );
  const serviceList = useMemo(() => {
    return (
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.ABOUT_US
      )?.customerServiceList || []
    );
  }, [usageScenariosList]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {serviceList.map((item) => {
        return (
          <div
            className="flex justify-center w-full border-b pb-4 border-[var(--transparent-white-10)] items-center cursor-pointer"
            onClick={item.onActionClick}
          >
            <div className="flex justify-center items-center w-full gap-2 shrink-0 flex-row !justify-start">
              <Icon name={item.icon} className="!w-6 !h-6 !rounded-none" />
              <div className="text-center bgi-text-[var(--grayscale-100)] text-lg font-medium !bgi-text-[var(--base-2-variant1)]">
                {item.label}
              </div>
            </div>
            <Icon className={'w-4 h-4'} name="ic_arrow_right_1" />
          </div>
        );
      })}
    </div>
  );
};

export const SettingPage = () => {
  useMode2SettingPageBase();
  const { t } = useTranslation();

  const { handleSettingPageClick } = useSettingPageAction();

  const tabIndex = useSettingPageStore((state) => state.tabIndex);
  const musicSwitch = useSettingPageStore((state) => state.musicSwitch);

  const list = [
    SettingPageMusicSwitchTypes.ON,
    SettingPageMusicSwitchTypes.OFF,
  ];

  const Switch = () => {
    return (
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-10')}>
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className={cx(FLEX_ITEMS_CENTER, 'gap-3 cursor-pointer')}
              onClick={() => {
                handleSettingPageClick({
                  actionName: handleSettingPageSwitchClick,
                  payload: {
                    value:
                      SettingPageMusicSwitchTypes[index === 0 ? 'ON' : 'OFF'],
                  },
                });
              }}
            >
              <Icon
                name={
                  musicSwitch === item
                    ? 'ic_check_radio_checked'
                    : 'ic_check_radio_unchecked'
                }
                className="w-[18px] h-[18px]"
              />
              <div>{item}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full mt-4 px-4">
      {/* 音樂設定 */}
      {tabIndex === SettingPageTypes.MUSIC_SETTING ? (
        <div
          className={cx(
            'flex items-center justify-between',
            'bgi-text-[var(--base-2-variant1)]'
          )}
        >
          <div className="flex items-center gap-2">
            <Icon name="ic_music" />
            <span className="text-lg font-medium">
              {t('profile_settings_game_music')}
            </span>
          </div>
          <Switch />
        </div>
      ) : null}

      {/* 客服社群列表 */}
      {tabIndex === SettingPageTypes.SOCIALLIST ? <AboutUsItems /> : null}

      {/*{tabIndex === SettingPageTypes.SOCIALLIST ? (*/}
      {/*    <SocialList*/}
      {/*      scenarios={SocialScenarios.ABOUT_US}*/}
      {/*      isShowLabelFromProps={true}*/}
      {/*      className="w-full flex-col items-center justify-center gap-4"*/}
      {/*      classNameUnitBox="w-full border-b pb-4 border-[var(--transparent-white-10)] items-center cursor-pointer"*/}
      {/*      classNameUnit="w-full gap-2 shrink-0 flex-row !justify-start"*/}
      {/*      iconOuterClassName=""*/}
      {/*      iconClassName="!w-6 !h-6 !rounded-none"*/}
      {/*      classNameLabel="text-lg font-medium !bgi-text-[var(--base-2-variant1)]"*/}
      {/*      isShowLabel={true}*/}
      {/*      children={<Icon name="ic_arrow_right_1" className="w-4 h-4" />}*/}
      {/*    />*/}
      {/*  ) :*/}
      {/*  null}*/}
    </div>
  );
};

export default SettingPage;
