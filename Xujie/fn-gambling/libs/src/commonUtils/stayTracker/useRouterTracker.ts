import { useLocation } from 'react-router-dom';
import { usePageTracker } from './usePageTracker';

type RouterStateKey = 'tab' | 'subTab'; // 一級tab已統一為名為tab
interface RouteTrackerState {
  state: Record<RouterStateKey, string>;
}

const serializeState = (state: RouteTrackerState) => {
  try {
    return state ? JSON.stringify(state) : '';
  } catch {
    return '[unserializable]';
  }
};

export const useRouteTracker = () => {
  const location = useLocation();

  const id = `${location.pathname}${location.search}${serializeState(
    location.state
  )}`;
  const props = {
    path: location.pathname,
    query: location.search,
    state: serializeState(location.state),
  };

  usePageTracker({ id, props, eventName: 'page' });
};
