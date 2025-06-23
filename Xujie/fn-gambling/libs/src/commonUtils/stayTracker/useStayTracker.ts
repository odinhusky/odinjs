import { BasePagePaths } from '@libs/mode2/routerTypes/types';
import { usePageTracker } from './usePageTracker';

export const useStayTracker = ({
  page,
  tab,
}: {
  page: BasePagePaths;
  tab: string;
}) => {
  const id = `${page}_${tab || ''}`;
  const props = {
    page: page,
    tab: tab,
  };
  usePageTracker({ id, props, eventName: 'tab' });
};
