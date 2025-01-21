import {
  CustomerServiceScenarios,
  ServiceInfo,
  useCustomerServiceListStore,
} from '@mode2/zustand/components/customerServiceListStore';
import { useMemo } from 'react';
import cx from '@commonUtils/cx';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import Icon from '@mode2/components/Icon';

const CustomerServiceButton = (item: ServiceInfo) => {
  return (
    <div
      key={item.type}
      className={cx(
        'bg-shadow-[var(--inset-shadow)]',
        'w-10 h-10 rounded-full',
        'flex justify-center items-center',
        'cursor-pointer',
        item.className
      )}
      onClick={() => {
        item.onActionClick();
      }}
    >
      <Icon
        name={`${item.icon}_default`}
        className={cx(
          'rounded-full',
          'object-contain',
          'w-full h-full',
          'hover:brightness-[1.15]',
          'active:brightness-[0.85]'
        )}
      />
    </div>
  );
};

export const CustomerServiceList = (props: {
  scenarios: CustomerServiceScenarios;
  className?: string;
}) => {
  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );

  const iconMapping: Record<ServicesTypeResult, string> = {
    [ServicesTypeResult.WHATS_APP]: 'fab_whatsapp',
    [ServicesTypeResult.INSTAGRAM]: 'fab_instagram',
    [ServicesTypeResult.TELEGRAM]: 'fab_telegram',
    [ServicesTypeResult.LIVE_CHAT]: 'fab_livechat',
    [ServicesTypeResult.YOUTUBE]: 'fab_youtube',
    [ServicesTypeResult.FACEBOOK]: 'fab_facebook',
    [ServicesTypeResult.TIKTOK]: 'fab_tiktok',
    [ServicesTypeResult.TWITTER]: 'fab_twitter',
    [ServicesTypeResult.UNKNOWN]: '',
  };

  const serviceList = useMemo(() => {
    const items =
      usageScenariosList.find((item) => item.scenarios === props.scenarios)
        ?.customerServiceList || [];
    return items.map((item) => {
      return {
        ...item,
        icon: iconMapping[item.type] || '',
      };
    });
  }, [usageScenariosList]);

  return serviceList.length > 0 ? (
    <div
      className={cx('flex justify-center gap-4 tablet:gap-3', props.className)}
    >
      {serviceList.map((item, index) => {
        return (
          <CustomerServiceButton key={item.type + '_' + index} {...item} />
        );
      })}
    </div>
  ) : null;
};
