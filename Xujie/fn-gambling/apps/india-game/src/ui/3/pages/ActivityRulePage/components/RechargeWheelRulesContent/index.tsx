import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import { DEFAULT_BG, MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import { Icon } from '@components/Icon';

const RechargeWheelRulesContent = () => {
  const { t } = useTranslation();
  const wheelLevels = [
    {
      i18nKey: 'deposit_wheel_silver',
      iconName: 'ic_silver',
    },
    {
      i18nKey: 'deposit_wheel_gold',
      iconName: 'ic_gold',
    },
    {
      i18nKey: 'deposit_wheel_diamond',
      iconName: 'ic_diamond',
    },
    {
      i18nKey: 'deposit_wheel_supreme',
      iconName: 'ic_supreme',
    },
  ];
  const massage = [
    {
      i18nKey: 'deposit_wheel_rules_1',
    },
    { i18nKey: 'deposit_wheel_rules_2' },
    { i18nKey: 'deposit_wheel_rules_3' },
    { i18nKey: 'deposit_wheel_rules_4' },
    {
      i18nKey: 'deposit_wheel_rules_5',
      i18nOption: { productName: sdkUtils.productName() },
    },
  ];

  const bgMainPath = getImgUrl(EResourceLevel.V, 'casino_background');

  return (
    <div
      className={cx(
        // '-mx-4 tablet:-mx-0 p-4 flex flex-col gap-3 bgi-text-[var(--grayscale-100)] h-screen pt-3 ',
        // 'bgi-[var(--background-light)] bg-fixed bg-bottom',
        'min-h-screen',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4',
        DEFAULT_BG,
        'bg-contain  bg-top bg-fixed',
        'text-base font-medium bgi-text-[var(--grayscale-100)]',
        'px-4'
      )}
      style={{
        backgroundImage: `url(${bgMainPath})`,
      }}
    >
      <div className="flex flex-col justify-around items-center gap-[64px]">
        <div className="text-2xl mt-[64px]">
          {t('deposit_wheel_rules_title')}
        </div>
        <div className="w-full text-start">
          {massage.map((item, index) => {
            return (
              <div
                key={`${index}_${item.i18nKey}`}
                className="flex gap-2 justify-start mt-3"
              >
                <div className="w-6 h-6 min-w-6 min-h-6 text-sm text-center rounded-full bgi-[var(--base-2-variant7)]">
                  {index}
                </div>
                <p>{renderI18N(item, t)}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-evenly items-center gap-5 text-xs bgi-text-[var(--base-2-variant2)]">
          {wheelLevels.map((item, index) => {
            return (
              <div
                key={`${index}_${item.i18nKey}`}
                className="pt-4 px-4 pb-1 flex flex-col items-center gap-2 rounded-lg bgi-[var(--transparent-white-10)]"
              >
                <Icon className="h-12 w-12" name={item.iconName} />
                <p>{renderI18N(item, t)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RechargeWheelRulesContent;
