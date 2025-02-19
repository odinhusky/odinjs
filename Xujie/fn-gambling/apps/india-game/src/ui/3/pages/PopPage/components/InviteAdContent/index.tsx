import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import sdkUtils from '@mode2/utils/sdk';

export const InviteAdContent = () => {
  const { t } = useTranslation();
  const bgPath = getImgUrl(EResourceLevel.V, 'share_wheels');
  const titleColor = 'bgi-text-[var(--base-1-variant5)]';
  const subTitleColor = 'bgi-text-[var(--grayscale-100)] font-medium text-xl';
  return (
    <div
      className="aspect-[1.036] p-7"
      style={{
        backgroundImage: `url(${bgPath})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className=" h-full text-2xl font-bold text-center justify-between flex flex-col ">
        <div>
          <div className={cx('', titleColor)}>{t('Start your gaming')}</div>
          <div className={titleColor}>
            {t(`with ${sdkUtils.productName()}!`)}
          </div>
        </div>

        <div className="text-start mb-[50px]">
          <div className={cx('', subTitleColor)}>
            {t('Invite a friend and')}
          </div>
          <div className={cx('', subTitleColor)}>{t('get 40')}</div>
          <div className={cx('mt-1', subTitleColor)}>
            {t('Spin the Wheel for')}
          </div>
          <div className={cx('', subTitleColor)}>{t('free 500')}</div>
        </div>

        <div className="mb-[35px]">
          <div className={cx('', subTitleColor)}>
            {t('Earn ₹{4,00,000} daily')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteAdContent;
