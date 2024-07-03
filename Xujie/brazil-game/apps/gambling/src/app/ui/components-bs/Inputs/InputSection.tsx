import { renderByUVersion } from '../../utils/renderByUVersion';
import { InputSection as PInputSection } from './env/p1/InputSection';
import { InputSection as WInputSection } from './env/wild/InputSection';
import { InputSection as CInputSection } from './env/u1/InputSection';
import { InputSection as RInputSection } from './env/u2/InputSection';
import { InputSection as U5InputSection } from './env/u5/InputSection';
import { InputSection as U4InputSection } from './env/u4/InputSection';
import U7InputSection from './env/u7/U7InputSection';

export const InputSection = renderByUVersion(
  {
    wild777bet: WInputSection,
    p1: PInputSection,
    u1: CInputSection,
    u2: RInputSection,
    u5: U5InputSection,
    u6: U4InputSection,
    u7: U7InputSection,
    u9: U4InputSection,
  },
  PInputSection
);
