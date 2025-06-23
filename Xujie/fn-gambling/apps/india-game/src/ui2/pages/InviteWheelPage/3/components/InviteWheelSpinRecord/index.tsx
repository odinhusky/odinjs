import cx from '@commonUtils/cx';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import NoData from '@components/NoData';
import { InviteWheelRewardResult } from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelRewardListEndpoint';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import Avatar from '@components/Avatar';

// const WheelRewardTitleMapping = {
//   [InviteWheelRewardType.INVITE]: 'spin_and_share_wheel_record_invite_spin',
//   [InviteWheelRewardType.FREE]: 'spin_and_share_wheel_record_free_spin',
//   [InviteWheelRewardType.PINDUODUO]: 'spin_and_share_wheel_record_fortune_pack',
// };
/**
 * Evan for [V6] Done
 */
const SpinRecordItem = (props: InviteWheelRewardResult) => {
  const { avatarId, name, amount, time } = props;
  return (
    <div
      className={cx(
        'w-full flex justify-between',
        'rounded-lg py-2',
        'text-base font-normal bgi-text-[var(--base-2-variant1)]'
      )}
    >
      <div
        className={'flex justify-start items-center gap-2 w-auto font-medium'}
      >
        <Avatar
          rootClassName={'!w-8 !h-8'}
          className={'!w-8 !h-8 border-0'}
          isShowVIP={false}
          isGuest={false}
          isShowRedDot={false}
          otherAvatarId={avatarId}
        />

        <p>{name}</p>
      </div>

      <div className={'flex flex-col justify-end items-end '}>
        <p
          className={cx({
            'bgi-text-[var(--grayscale-100)] text-xl': amount > 0,
            'bgi-text-[var(--base-2-variant1)] text-base font-normal mr-4':
              amount <= 0,
          })}
        >
          {amount > 0
            ? formatMoney({ value: amount, includeDecimal: true })
            : '- -'}
        </p>
        <p className={'text-xs bgi-text-[var(--base-2-variant2)]'}>
          <span> {formatDate(time, 'YYYY-MM-DD HH:mm:ss')}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
const InviteWheelSpinRecord = () => {
  const { t } = useTranslation();
  const inviteWheelSpinRecord = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelSpinRecord
  );

  const bgPath = getImgUrl(EResourceLevel.V, 'pattern');
  return (
    <div className={cx('w-full px-4')}>
      <div
        className={cx(
          'gap-2 p-2 mt-3',
          'flex flex-col justify-center',
          'text-base font-medium bgi-text-[var(--grayscale-100)]',
          'bgi-[var(--base-2-variant11)]',
          'bgi-border-[var(--base-1-main)]',
          'border-[3px] rounded-lg'
        )}
        style={{
          backgroundImage: `url(${bgPath})`,
          backgroundSize: '80%',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="flex justify-start gap-1">
          <div
            className={'w-[5px] h-auto bgi-[var(--base-1-variant3)]  my-1.5'}
          />
          <p>{t('spin_and_share_wheel_record')}</p>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {inviteWheelSpinRecord ? (
            inviteWheelSpinRecord.map((item, index) => {
              return <SpinRecordItem {...item} key={index} />;
            })
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteWheelSpinRecord;
