import { EResourceLevel, getImgUrl } from '@mode2/utils';
import sdkUtils from '@mode2/utils/sdk';
import { handleCustomerServiceAction } from '@mode2/action/components/customerServiceList/acitonType';
import { useMemo } from 'react';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { useTranslation } from 'react-i18next';
import useCustomerServiceAction from '@mode2/action/components/customerServiceList/useCustomerServiceAction';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import cx from '@commonUtils/cx';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_JUSTIFY_CENTER,
} from '@libs/constant/style';
import renderI18N from '@libs/commonUtils/renderI18N';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@libs/mode2/components/Icon';

export const FeedBackCustomerSupport = () => {
  const { t } = useTranslation();

  const { handleCustomerServiceClick } = useCustomerServiceAction();

  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );

  const feedbackServiceList = useMemo(() => {
    const serviceList =
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.FEEDBACK
      )?.customerServiceList || [];

    return serviceList.map((item) => {
      return {
        label: '',
        contentKey: {
          i18nKey: 'help_center_customer_support_online_customer_service',
        },
        icon: 'fab_livechat',
        actionTextKey: 'earn_money_notice_contact',
        onActionClick: () => {
          if (item.type === ServicesTypeResult.LIVE_CHAT) {
            sdkUtils.openChat(() => {
              handleCustomerServiceClick({
                actionName: handleCustomerServiceAction,
                payload: item.payload,
              });
            });
          } else {
            handleCustomerServiceClick({
              actionName: handleCustomerServiceAction,
              payload: item.payload,
            });
          }
        },
      };
    });
  }, [usageScenariosList, t]);

  return (
    <div
      className={cx(
        'customer-support',
        FLEX_COL,
        'gap-3 mobile:gap-5 tablet:gap-6',
        'rounded-b-lg',
        'text-base',
        'tablet:bgi-[var(--grayscale-25)]',
        'px-4 mobile:px-6',
        'pb-0 tablet:pb-6',
        'pt-0 tablet:pt-6',
        'tablet:rounded-b-lg'
      )}
    >
      <div
        className={cx(
          'customer-box',
          FLEX_JUSTIFY_CENTER,
          'flex-col tablet:flex-row',
          'items-center tablet:items-start',
          'gap-3 tablet:gap-4'
        )}
      >
        <div
          className={cx(
            'bgi-[var(--base-1-50)]',
            'overflow-hidden',
            'rounded-[100%]'
          )}
        >
          <img
            src={getImgUrl(EResourceLevel.V, 'feedback_avatar')}
            alt=""
            className="w-[60px] h-[60px]"
          />
        </div>
        <div className="flex flex-col support-desc gap-3 tablet:gap-2 tablet:flex-1">
          <div
            className={cx(
              'text-center tablet:text-left',
              'mobile:text-xl text-lg mobile:font-semibold font-medium',
              'bgi-text-[var(--state-warn-main)]'
            )}
          >
            {t('help_center_customer_support_online_support')}
          </div>
          <div
            className={cx(
              'desc-list',
              FLEX_COL,
              'mobile:text-base text-sm font-medium',
              'items-center tablet:items-start'
            )}
          >
            <div
              className={cx(
                'flex items-center',
                'text-center tablet:text-left',
                'text-sm tablet:text-base'
              )}
            >
              <Icon
                className={cx(
                  'inline-block',
                  'w-5 h-5',
                  'tablet:w-6 tablet:h-6'
                )}
                name="ic_feedback_star"
              />
              <span className=" bgi-text-[var(--grayscale-100)]">
                {t('help_center_customer_support_welcome_to_gamename', {
                  productName: sdkUtils.productName(),
                })}
              </span>
              <Icon
                name="ic_feedback_star"
                className={cx(
                  'inline-block',
                  'w-5 h-5',
                  'tablet:w-6 tablet:h-6'
                )}
              />
            </div>
            <div
              className={cx(
                'inline-block',
                'text-center tablet:text-left',
                'text-sm tablet:text-base'
              )}
            >
              <div className="relative inline-block tablet:w-6 tablet:h-6 w-5 h-5">
                <Icon
                  className={cx('absolute tablet:pt-2 pt-1')}
                  name="ic_feedback_cash"
                />
              </div>
              <span className="bgi-text-[var(--grayscale-100)]">
                {t('help_center_customer_support_millions_of_players')}
              </span>
              <div className="relative inline-block tablet:w-6 tablet:h-6 w-5 h-5">
                <Icon
                  className={cx('absolute tablet:pt-2 pt-1')}
                  name="ic_feedback_cash"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {feedbackServiceList.map((item, index) => (
        <div
          key={item.label + index}
          className={cx(
            'chat-box',
            FLEX_CENTER,
            'flex-row gap-3',
            'flex-wrap mobile:flex-nowrap',
            'rounded-lg',
            'tablet:p-4 mobile:py-3 mobile:px-6 py-2 px-3',
            'bgi-[var(--grayscale-20)]',
            'mobile:justify-start'
          )}
        >
          {/*<Icon*/}
          {/*  level={EResourceLevel.V}*/}
          {/*  className={cx('w-10 h-10')}*/}
          {/*  name={item.icon}*/}
          {/*/>*/}
          <div
            className={cx(
              FLEX_CENTER,
              'gap-3',
              'w-full mobile:w-auto',
              'mobile:mr-auto'
            )}
          >
            <img
              src={getImgUrl(EResourceLevel.V, `${item.icon}_default`)}
              className={cx('w-10 h-10')}
              alt={item.label}
            />

            <div
              className={cx(
                FLEX_COL,
                'justify-center',
                'mobile:flex-1',
                'text-base font-medium'
              )}
            >
              <div className={cx('chat-title')}>{item.label}</div>
              <div className={cx('text-sm', 'bgi-text-[var(--grayscale-100)]')}>
                {renderI18N(item.contentKey, t)}
              </div>
            </div>
          </div>

          <BasePrimaryBtn
            className={cx(
              'w-auto bgi-[var(--base-1-main)] py-1 px-3 rounded-lg max-h-8',
              'shadow-[0px_-2px_2px_0px_#FFFFFF66_inset,0px_2px_2px_0px_#FFFFFF99_inset]'
            )}
            classNameText='!bgi-text-[var(--grayscale-00)]'
            onClick={() => {
              item.onActionClick();
            }}
          >
            {t(item.actionTextKey)}
          </BasePrimaryBtn>
        </div>
      ))}
    </div>
  );
};

export default FeedBackCustomerSupport;
