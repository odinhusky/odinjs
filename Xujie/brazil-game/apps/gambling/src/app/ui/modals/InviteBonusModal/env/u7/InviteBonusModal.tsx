import { IInitialChargeModal } from '../../index';
import { useInviteConfig } from '../../../../hooks/useInviteConfig';
import cx from '../../../../utils/cx';
import { ScrollBar } from '../../../../components/ScrollBar';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import U7Linear3Btn from '../../../../components-bs/Buttons/env/u7/U7Linear3Btn';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import t from 'apps/gambling/src/assets/constant/lang';
import U7BorderDiv from '../../../../components/U7BorderDiv';
import { environment } from 'apps/gambling/src/environments/environment';

type IItem = {
  title: string;
  money: number;
  className?: string;
};

const Item = (props: IItem) => {
  // = styles
  const fontClass = cx(
    'text-sm leading-[18px]',
    'tab:text-base tab:leading-[20px]'
  );

  return (
    <div className={cx('mb-4', props.className)}>
      <div
        className={cx(
          'font-medium font-[var(--transparent-white-80)]',
          fontClass
        )}
      >
        {props.title}
      </div>

      <U7BorderDiv className={cx('border-stroke2')}>
        <div
          className={cx(
            'flex items-center',
            'rounded-lg',
            'bg-linear-5-main',
            'py-[6px] px-3',
            'tab:py-3'
          )}
        >
          <span
            className={cx(
              'block',
              'mr-auto',
              'font-medium font-[var(--transparent-white-80)]',
              fontClass
            )}
          >
            {t['Reward']}
          </span>
          <span
            className={cx(
              'block',
              'font-bold text-important',
              'text-sm leading-[18px]',
              'tab:text-base tab:leading-[20px]'
            )}
          >
            {t['moneyWithRSign'](props.money)}
          </span>
        </div>
      </U7BorderDiv>
    </div>
  );
};

export const InviteBonusModal = (props: IInitialChargeModal) => {
  const { currentConfig } = useInviteConfig();
  const currentConfigItems = currentConfig ? currentConfig?.items : [];

  return (
    <U7Modal
      modalClass={cx(
        'py-5 px-4',
        'tab:py-5 tab:px-4',
        'bg-cover bg-center bg-no-repeat'
      )}
      modalStyle={{
        backgroundImage: `url(assets/${environment.uVersion}/bg_invite_bonus_modal.png)`,
      }}
      onClose={() => {
        props.close();
      }}
    >
      <div
        id="Alert1"
        className={cx(
          'relative',
          'flex flex-col gap-2 items-center',
          'w-full',
          'mx-7',
          'max-h-[85vh]',
          'text-white'
        )}
      >
        <div className={cx('')}>
          <h4
            className={cx(
              'font-bold text-center text-[var(--grayscale-100)]',
              'text-[26px] leading-[34px]',
              'tab:text-[34px] tab:leading-[44px]',
              'invite-bonus-modal-title-font-shimmer'
            )}
          >
            {t['InviteBonusModalTitle']}
          </h4>

          <p
            className={cx(
              'block',
              'font-normal text-center',
              'text-sm leading-[18px]',
              'tab:text-lg tab:leading-6',
              'mt-1'
            )}
          >
            {t['InviteBonusModalText']}
          </p>

          <ScrollBar
            className={cx('w-full max-h-[48vh] overflow-y-auto', 'mt-5')}
          >
            <div>
              {currentConfigItems.map((item, index) => {
                if (currentConfigItems.length - 1 !== index) {
                  // NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
                  return (
                    <Item
                      key={index}
                      title={`Convidar ${item.num}-${
                        Number(currentConfigItems[index + 1]?.num) - 1
                      }`}
                      money={Number(item.reward) / 100}
                    />
                  );
                } else {
                  return (
                    <Item
                      key={index}
                      title={`Convidar > ${item.num}`}
                      money={Number(item.reward) / 100}
                    />
                  );
                }
              })}
            </div>
          </ScrollBar>

          {/* 按鈕區 */}
          <div className={cx('w-full', 'flex gap-5 justify-between', 'mt-4')}>
            <U7OutlinedBtn
              className={cx('flex-1', 'h-[48px]')}
              children={'Ganhar Dinheiro'}
              onClick={() => {
                props.close();
              }}
            />

            <U7Linear3Btn
              className={cx('flex-1 w-full', 'h-[48px]')}
              children={'Convide Agora'}
              onClick={() => {
                props.onConfirm();
              }}
            />
          </div>
        </div>
      </div>
    </U7Modal>
  );
};
