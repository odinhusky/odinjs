import Icon from '@components/Icon';
import { SocialList } from '@components/SocialList';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import {
  SettingPageMusicSwitchTypes,
  SettingPageTypes,
  useSettingPageStore,
} from '@libs/mode2/zustand/page/settingPageStore';
import useMode2SettingPageBase from '@mode2/usecase/page/settingPage/useMode2SettingPageBase';
import useSettingPageAction from '@mode2/action/settingPageAction/useSettingPageAction';
import { handleSettingPageSwitchClick } from '@libs/mode2/action/settingPageAction/actionType';

export const SettingPage = () => {
  useMode2SettingPageBase();

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
            {/* TODO i18n */}
            <span className="text-lg font-medium">Game music</span>
          </div>
          <Switch />
        </div>
      ) : null}

      {/* 客服社群列表 */}
      {tabIndex === SettingPageTypes.SOCIALLIST ? (
        <SocialList
          scenarios={SocialScenarios.ABOUT_US}
          isShowLabelFromProps={true}
          className="w-full flex-col items-center justify-center gap-4"
          classNameUnitBox="w-full border-b pb-4 border-[var(--transparent-white-10)] items-center cursor-pointer"
          classNameUnit="w-full gap-2 shrink-0 flex-row !justify-start"
          iconOuterClassName=""
          iconClassName="!w-6 !h-6"
          classNameLabel="text-lg font-medium !bgi-text-[var(--base-2-variant1)]"
          isShowLabel={true}
          children={<Icon name="ic_arrow_right_1" className="w-4 h-4" />}
        />
      ) : null}
    </div>
  );
};

export default SettingPage;
