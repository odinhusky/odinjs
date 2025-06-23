import { memo, ReactNode } from 'react';
import { useTemplateLayoutBase } from '@/hooks/templates/useTemplateLayoutBase';
import { MemorizedTemplateLayoutHTML } from './MemorizedTemplateLayoutHTML';

const TemplateLayout = memo(({ children }: { children: ReactNode }) => {
  useTemplateLayoutBase();
  return <MemorizedTemplateLayoutHTML children={children} />;
});

export default TemplateLayout;
