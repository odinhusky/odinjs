import { TabItem as U7TabItem } from '../../../../../../components-bs/TabItem/env/u7/TabItem';
import cx from '../../../../../../utils/cx';
import useBreakpoint from '../../../../../../pageTemplate/hooks/useBreakpoint';

export const TabItem = (props: Parameters<typeof U7TabItem>[0]) => {
  const { isMobile } = useBreakpoint();

  return (
    <U7TabItem
      {...props}
      className={cx(
        isMobile
          ? props.active
            ? 'invite-tab-button'
            : 'invite-tab-unselect-button'
          : props.active
          ? 'invite-tab-button'
          : '',
        'rounded-full border-none',
        isMobile ? 'text-xs' : 'text-sm'
      )}
    />
  );
};
