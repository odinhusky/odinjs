import { memo, ReactNode } from 'react';
import { useTemplateLayoutBase } from '@/hooks/templates/useTemplateLayoutBase';
import { MemorizedTemplateLayoutHTML } from './MemorizedTemplateLayoutHTML';

/**
 *  [mode4] 只支援手機樣式版型
 */
const TemplateLayout = memo(({ children }: { children: ReactNode }) => {
  useTemplateLayoutBase();
  return <MemorizedTemplateLayoutHTML children={children} />;
});

export default TemplateLayout;
