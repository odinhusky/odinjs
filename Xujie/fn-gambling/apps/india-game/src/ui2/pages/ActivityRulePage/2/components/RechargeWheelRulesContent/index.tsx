import RulesContainer from '@components/RulesContainer';
import RulesImgTitle from '@components/RulesImgTitle';
import renderI18N from '@libs/commonUtils/renderI18N';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import { DEFAULT_BG } from '@constant/style';
import cx from '@commonUtils/cx';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';

const RechargeWheelRulesContent = () => {
  const { t } = useTranslation();
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

  const bgMainPath = getImgUrl(
    EResourceLevel.V,
    'deposit_wheel_rules_background_m'
  );

  return (
    <div
      className={cx(
        '-mx-4 tablet:-mx-0 p-4 flex flex-col gap-3 bgi-text-[var(--grayscale-100)] h-screen pt-3 ',
        DEFAULT_BG,
        'bg-contain se:bg-cover bg-bottom bg-fixed mobile:bg-local'
      )}
      style={{
        backgroundImage: `url(${bgMainPath})`,
      }}
    >
      <RulesImgTitle
        classNameText="drop-shadow-[0px_2px_2px_#33333340]"
        title={{ i18nKey: 'deposit_wheel_rules_title' }}
      />
      <RulesContainer
        className="p-3"
        children={
          <ol className="list-decimal text-sm ml-4">
            {massage.map((item, index) => (
              <li key={index}>{renderI18N(item, t)}</li>
            ))}
          </ol>
        }
      />
    </div>
  );
};

export default RechargeWheelRulesContent;
