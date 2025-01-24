import { FunctionComponent } from 'react';
import useObserverDeviceBreakPoint from '@mode2/usecase/device/useObserverDeviceBreakPoint';
import { OfficialRoute } from '@/router/OfficialRoute';

export const OfficialLayout: FunctionComponent<{
  component: FunctionComponent;
}> = ({ component: Component }) => {
  useObserverDeviceBreakPoint();
  return (
    <OfficialRoute>
      <Component />
    </OfficialRoute>
  );
};

export default OfficialLayout;
