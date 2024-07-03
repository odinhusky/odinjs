import { renderByUVersion } from '../../utils/renderByUVersion';
import { Header as WHeader } from './env/wild/Header';
import { Header as CHeader } from './env/u1/Header';
import { Header as PHeader } from './env/p1/Header';
import { Header as RHeader } from './env/u2/index';
import { Header as U5Header } from './env/u5/index';
import { Header as U6Header } from './env/u6/index';
import { Header as U7Header } from './env/u7/index';
import { Header as U9Header } from './env/u9/index';
import { IHeader } from './types/IHeader';

export const Header = (props: IHeader) => {
  return renderByUVersion(
    {
      wild777bet: <WHeader {...props} />,
      p1: <PHeader {...props} />,
      u1: <CHeader {...props} />,
      u2: <RHeader {...props} />,
      u5: <U5Header {...props} />,
      u6: <U6Header {...props} />,
      u7: <U7Header {...props} />,
      u9: <U9Header {...props} />,
    },
    <CHeader {...props} />
  );
};
