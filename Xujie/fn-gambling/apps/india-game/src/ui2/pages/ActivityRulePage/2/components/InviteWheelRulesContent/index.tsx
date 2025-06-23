import RulesContainer from '@components/RulesContainer';
import RulesImgTitle from '@components/RulesImgTitle';
import renderI18N from '@libs/commonUtils/renderI18N';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { DEFAULT_BG } from '@constant/style';

const WITHDRAW_REQUIRE = 500;
const InviteWheelRulesContent = () => {
  const { t } = useTranslation();
  const messages = [
    {
      i18nKey: 'spin_and_share_wheel_rules_1',
      // i18nOption: { withdrawRequire: formatMoney({ value: 500 }) },
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_2',
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_3',
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_4',
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_5',
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_6',
    },
    {
      i18nKey: 'spin_and_share_wheel_rules_7',
      // i18nOption: { productName: sdkUtils.productName() },
    },
  ];

  const bgMainPath = getImgUrl(
    EResourceLevel.V,
    'invitation_wheel_rules_background_m'
  );
  return (
    <div
      className={cx(
        '-mx-4 tablet:-mx-0 p-4 h-screen pt-3',
        DEFAULT_BG,
        'bg-contain se:bg-cover bg-bottom bg-fixed mobile:bg-local'
      )}
      style={{
        backgroundImage: `url(${bgMainPath})`,
      }}
    >
      <RulesImgTitle title={{ i18nKey: 'deposit_wheel_rules_title' }} />
      <RulesContainer
        className="w-auto mt-3 mx-4"
        children={
          <div className="p-3 pl-6">
            <ul className="text-sm bgi-text-[var(--grayscale-100)] font-normal list-decimal">
              {messages.map((item, index) => (
                <li key={'_' + index}>
                  {renderI18N(
                    {
                      ...item,
                      i18nOption: {
                        withdrawRequire: formatMoney({
                          value: WITHDRAW_REQUIRE,
                        }),
                        productName: sdkUtils.productName(),
                      },
                    },
                    t
                  )}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
};

export default InviteWheelRulesContent;
