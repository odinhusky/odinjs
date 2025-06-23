import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Checkbox from '@libs/mode2/components/Checkbox';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import useFirstChargeModalAction from '@libs/mode2/action/firstChargeModalAction/useFirstChargeModalAction';
import {
  handleFirstChargeModalClose,
  handleFirstChargeModalNotShowTodayClick,
  handleFirstChargeModalSelectedProductClick,
} from '@mode2/action/actionTypes';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useMobileExclusiveFirstChargeModalBase from './useMobileExclusiveFirstChargeModalBase';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

export const FirstChargeDiscountModal = () => {
  const { t } = useTranslation();

  useMobileExclusiveFirstChargeModalBase({
    offerCountdown: 60 * 10,
  });

  const isNotShowToday = useMode2FirstChargeModalStore(
    (state) => state.isNotShowToday
  );
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );

  const countdownTime = useMode2FirstChargeModalStore(
    (state) => state.countdownTime
  );

  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  const parameters = useMode2FirstChargeModalStore((state) => state.parameters);

  const { handleFirstChargeModalClick } = useFirstChargeModalAction();

  const { formattedTime } = useMillisecondCountdown({
    duration: countdownTime * 1000,
    onEnd: () => console.log('Happy New Year!'),
    millisecondDigits: 2,
  });

  return isShowFirstChargeDiscountModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className="w-[80%] max-w-[384px]  text-center bgi-text-[var(--grayscale-100)]">
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleFirstChargeModalClick({
                actionName: handleFirstChargeModalClose,
              });
            }}
          />
        </div>

        <div className={cx('w-fit h-fit', 'relative', 'min-h-96')}>
          <BaseCacheImg
            className={cx('w-full h-auto cursor-pointer')}
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_first_recharge_vb'
            )}
            imgName="popup_first_recharge_vb"
            alt={'popup_first_recharge_vb'}
            onClick={(e) => {
              // handleFirstChargeModalClick({
              //   actionName: handleFirstChargeModalToWalletClick,
              // });
            }}
            onLoad={() => {}}
            onError={(e) => {}}
          />

          <div
            className={cx(
              'absolute top-0 left-0',
              'flex justify-between flex-col w-full min-w-96 h-full'
            )}
          >
            {/* 上方文字的部分 */}
            <div className="flex flex-col items-start ml-14">
              <h3
                className={cx(
                  'm-0',
                  'text-3xl',
                  'bgi-text-[var(--base-1-variant8)]',
                  'font-bold inline-block'
                )}
              >
                GET UP TO
              </h3>

              <div className={cx('flex')}>
                <span
                  className={cx(
                    'inline-box',
                    'text-[64px] leading-[64px]',
                    'bgi-text-[var(--base-1-variant8)]',
                    'font-extrabold',
                    'pl-4'
                  )}
                >
                  {parameters?.maxRebate * 100 || '37'}
                </span>

                <div className={cx(FLEX_COL, 'justify-start')}>
                  <span
                    className={cx(
                      'inline-block',
                      'bgi-text-[var(--base-1-variant8)]',
                      'font-extrabold',
                      'text-[36px] leading-[30px]'
                    )}
                  >
                    %
                  </span>
                  <span
                    className={cx(
                      'inline-block',
                      'bgi-text-[var(--base-1-variant8)]',
                      'font-bold',
                      'text-lg'
                    )}
                  >
                    CASH
                  </span>
                </div>
              </div>
            </div>

            {/* 內容的部分 */}
            <div
              className={cx(
                'w-full h-full max-h-[284px]',
                'px-4',
                // 'absolute bottom-5 left-0',
                FLEX_COL,
                'gap-2',
                'mb-5'
              )}
            >
              {/* 內容的表頭 */}
              <div
                className={cx(
                  'w-full h-[28px]',
                  'rounded-md',
                  'bgi-[var(--transparent-gray-40)]',
                  FLEX_ITEMS_CENTER,
                  'text-sm',
                  'pl-[26px] pr-[22px]'
                )}
              >
                <span
                  className={cx(
                    'block',
                    'mr-[24px]',
                    'bgi-text-[var(--base-2-variant1)]'
                  )}
                >
                  Cash
                </span>
                <span
                  className={cx(
                    'block',
                    'mr-[11px]',
                    'bgi-text-[var(--base-2-variant1)]'
                  )}
                >
                  Cash Rewards
                </span>
                <span className={cx('block', 'mr-[30px]')}>Total Get</span>
                <span
                  className={cx('block', 'bgi-text-[var(--base-1-variant3)]')}
                >
                  Deposit
                </span>
              </div>

              {/* 內容 */}
              {parameters?.items &&
                parameters.items.map((item) => (
                  <div
                    className={cx('relative min-h-14')}
                    key={item.totalAmount}
                  >
                    <BaseCacheImg
                      className={cx('w-full')}
                      src={getImgUrl(
                        EResourceLevel.POPUP_BANNER,
                        'popup_first_recharge_card'
                      )}
                      imgName="popup_first_recharge_card"
                      alt={'popup_first_recharge_card'}
                    />

                    <div
                      className={cx(
                        'absolute top-[10px] left-2',
                        FLEX_ITEMS_CENTER,
                        'font-bold',
                        'text-xl'
                      )}
                    >
                      <div
                        className={cx(
                          'w-[68.67px] h-7',
                          FLEX_CENTER,
                          'bgi-text-[var(--base-2-variant1)]',
                          'text-xl'
                        )}
                      >
                        {formatMoney({
                          value: item.amount,
                        })}
                      </div>

                      <div
                        className={cx(
                          'w-[11px] h-6',
                          FLEX_CENTER,
                          'bgi-text-[var(--grayscale-100)]',
                          'text-lg',
                          'mx-1'
                        )}
                      >
                        +
                      </div>

                      <div
                        className={cx(
                          'w-[68.67px] h-7',
                          FLEX_CENTER,
                          'bgi-text-[var(--state-warning-variant1)]',
                          'text-xl'
                        )}
                      >
                        {formatMoney({
                          value: item.reward,
                        })}
                      </div>

                      <div
                        className={cx(
                          'w-[11px] h-6',
                          FLEX_CENTER,
                          'bgi-text-[var(--grayscale-100)]',
                          'text-lg',
                          'mx-1'
                        )}
                      >
                        =
                      </div>

                      <div
                        className={cx(
                          'w-[68.67px] h-7',
                          FLEX_CENTER,
                          'bgi-text-[var(--grayscale-100)]',
                          'text-xl'
                        )}
                      >
                        {formatMoney({
                          value: item.totalAmount,
                        })}
                      </div>

                      <div className={cx('w-[92px] ml-2 px-2', FLEX_CENTER)}>
                        <BasePrimaryBtn
                          className={''}
                          classNameText={'text-xl font-medium'}
                          debounceTimer={500}
                          onClick={() =>
                            handleFirstChargeModalClick({
                              actionName:
                                handleFirstChargeModalSelectedProductClick,
                              payload: { amount: item.amount },
                            })
                          }
                        >
                          {formatMoney({
                            value: item.amount,
                          })}
                        </BasePrimaryBtn>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className={cx('my-3 flex justify-center')}>
          <Checkbox
            checked={isNotShowToday}
            onChange={() =>
              handleFirstChargeModalClick({
                actionName: handleFirstChargeModalNotShowTodayClick,
                payload: { value: !isNotShowToday },
              })
            }
            label={t('home_popup_donot_show_again')}
            checkName={getImgUrl(EResourceLevel.ICONS, 'ic_check_box')}
            uncheckName={getImgUrl(
              EResourceLevel.ICONS,
              'ic_check_box_unchecked'
            )}
          />
        </div>

        <div className="flex items-center justify-center">
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
          <div
            className={cx(
              'text-lg mx-4 font-medium bgi-text-[var(--base-1-variant6)]'
            )}
          >
            {t('home_popup_countdown')}
          </div>
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
        </div>

        <div className={cx('text-[32px] font-medium text-[#FFE81B]')}>
          {formattedTime}
        </div>
      </div>
    </BaseModal>
  ) : null;
};
