import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { Trans, useTranslation } from 'react-i18next';
import sdkUtils from '@mode2/utils/sdk';
import { usePostPopInviteRegisterAdConfigMutation } from '@mode2API/index';
import React, { useEffect, useState } from 'react';
import { PopInviteRegisterAdConfigResult } from '@mode2API/endpoint/invite/PostPopInviteRegisterAdConfigEndpoint';

export const InviteAdContent = () => {
  const { t } = useTranslation();
  const bgPath = getImgUrl(EResourceLevel.V, 'share_wheels');
  // 'text-shadow-lg bgi-text-[var(--base-1-variant8)] '
  const titleColor = cx(
    'bgi-text-[var(--base-1-variant8)]',
    'bgi-text-border-[var(--grayscale-00),2px]'
  );
  const subTitleColor = cx(
    'bgi-text-[var(--grayscale-100)]',
    'font-medium text-xl',
    'bgi-text-border-[var(--grayscale-100),10px]'
  );
  const highlightedClass = cx(
    'bgi-text-[var(--base-1-variant8)]',
    'text-4xl font-extrabold',
    'bgi-text-border-[var(--grayscale-100),10px]'
  );

  const [postPopInviteRegisterAdConfig, { data, isSuccess }] =
    usePostPopInviteRegisterAdConfigMutation();

  const [config, setConfig] = useState<PopInviteRegisterAdConfigResult>({
    dailyInviteReward: 0,
    earnDailyMax: 0,
    inviteWheelReward: 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setConfig(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    postPopInviteRegisterAdConfig();
  }, []);

  return (
    <div
      className="aspect-[1.036] p-7"
      style={{
        backgroundImage: `url(${bgPath})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className={cx(
          'justify-between flex flex-col',
          'h-full',
          'text-2xl font-bold text-center'
        )}
      >
        <div className="">
          <span
            className={cx('block', titleColor)}
            data-stroke={t('invite_register_ad_title')}
          >
            {t('invite_register_ad_title')}
          </span>

          <span
            className={cx('block', titleColor)}
            data-stroke={t('invite_register_ad_subtitle', {
              productName: sdkUtils.productName(),
            })}
          >
            {t('invite_register_ad_subtitle', {
              productName: sdkUtils.productName(),
            })}
          </span>
        </div>

        <div className="text-start mb-[50px]">
          <span
            className={cx('block', subTitleColor)}
            data-stroke={t('invite_register_ad_text_1')}
          >
            {t('invite_register_ad_text_1')}
          </span>

          <span
            className={cx('flex items-center gap-1', subTitleColor)}
            data-stroke={
              <Trans
                i18nKey="invite_register_ad_text_1_1"
                values={{
                  dailyReward: formatMoney({ value: config.dailyInviteReward }),
                }}
                components={{
                  dailyRewardTag: <span className={cx(highlightedClass)} />,
                }}
              />
            }
          >
            <Trans
              i18nKey="invite_register_ad_text_1_1"
              values={{
                dailyReward: formatMoney({ value: config.dailyInviteReward }),
              }}
              components={{
                dailyRewardTag: <span className={cx(highlightedClass)} />,
              }}
            />
          </span>

          <span
            className={cx('mt-1', subTitleColor)}
            data-stroke={t('invite_register_ad_text_2')}
          >
            {t('invite_register_ad_text_2')}
          </span>

          <span
            className={cx('flex items-center gap-1', subTitleColor)}
            data-stroke={
              <Trans
                i18nKey="invite_register_ad_text_2_1"
                values={{
                  inviteWheelReward: formatMoney({
                    value: config.inviteWheelReward,
                  }),
                }}
                components={{
                  wheelRewardTag: <span className={cx(highlightedClass)} />,
                }}
              />
            }
          >
            <Trans
              i18nKey="invite_register_ad_text_2_1"
              values={{
                inviteWheelReward: formatMoney({
                  value: config.inviteWheelReward,
                }),
              }}
              components={{
                wheelRewardTag: <span className={cx(highlightedClass)} />,
              }}
            />
          </span>
        </div>

        <div className="mb-[35px]">
          <span
            className={cx(
              'flex justify-center items-center gap-1 m-auto',
              subTitleColor
            )}
            data-stroke={
              <Trans
                i18nKey="invite_register_ad_content"
                values={{
                  earnDaily: formatMoney({ value: config.earnDailyMax }),
                }}
                components={{
                  earnDailyTag: <span className={cx(highlightedClass)} />,
                }}
              />
            }
          >
            <Trans
              i18nKey="invite_register_ad_content"
              values={{
                earnDaily: formatMoney({ value: config.earnDailyMax }),
              }}
              components={{
                earnDailyTag: <span className={cx(highlightedClass)} />,
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InviteAdContent;
