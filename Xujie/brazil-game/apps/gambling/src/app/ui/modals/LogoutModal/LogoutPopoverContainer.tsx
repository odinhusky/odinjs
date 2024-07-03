import { renderByUVersion } from '../../utils/renderByUVersion';
import DefaultLogoutContainer from './env/pernambucana/DefaultLogoutContainer';
import U1LogoutContainer from './env/u1/U1LogoutContainer';
import P1LogoutContainer from './env/p1/P1LogoutContainer';
import EmptyStyleContainer from '../../components/EmptyStyleContainer';
export const LogoutContainer = renderByUVersion(
  {
    p1: P1LogoutContainer,
    u1: U1LogoutContainer,
    u5: EmptyStyleContainer,
    u6: EmptyStyleContainer,
  },
  DefaultLogoutContainer
);
