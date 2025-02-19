import { FunctionComponent } from 'react';

export const OfficialLayout: FunctionComponent<{
  component: FunctionComponent;
}> = ({ component: Component }) => {
  return <Component />;
};

export default OfficialLayout;
