import cx from '@commonUtils/cx';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import NoData from '@components/NoData';
import {
  InviteWheelRewardResult,
  InviteWheelRewardType,
} from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelRewardListEndpoint';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';

const WheelRewardTitleMapping = {
  [InviteWheelRewardType.INVITE]: 'spin_and_share_wheel_record_invite_spin',
  [InviteWheelRewardType.FREE]: 'spin_and_share_wheel_record_free_spin',
  [InviteWheelRewardType.PINDUODUO]: 'spin_and_share_wheel_record_fortune_pack',
};
const SpinRecordItem = (props: InviteWheelRewardResult) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'w-full flex justify-between',
        'bgi-[var(--base-2-50)] rounded-lg p-2',
        'text-sm font-medium bgi-text-[var(--grayscale-100)]'
      )}
    >
      <div className={'flex justify-start items-center gap-2 w-auto'}>
        <img
          src={getImgUrl(
            EResourceLevel.V,
            `${props.type.toLocaleLowerCase()}_spin`
          )}
          alt=""
          className={'w-8 h-8'}
        />
        <p>{t(WheelRewardTitleMapping[props.type] || '')}</p>
      </div>

      <div className={'flex flex-col justify-end items-end text-xs'}>
        <p>{formatMoney(props.amount, true)}</p>
        <p className={'bgi-text-[var(--transparent-white-70)]'}>
          <span> {formatDate(props.time)}</span>
        </p>
      </div>
    </div>
  );
};

const InviteWheelSpinRecord = () => {
  const { t } = useTranslation();
  const inviteWheelSpinRecord = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelSpinRecord
  );

  return (
    <div className={cx('w-full px-4')}>
      <div
        className={cx(
          'gap-2 p-2',
          'flex flex-col justify-center rounded-lg',
          'text-sm font-medium bgi-text-[var(--grayscale-100)]',
          'bgi-border-[var(--base-2-light)]'
        )}
      >
        <p>{t('spin_and_share_wheel_record')}</p>
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

      {/*<NoData />*/}
    </div>
  );
};

export default InviteWheelSpinRecord;
