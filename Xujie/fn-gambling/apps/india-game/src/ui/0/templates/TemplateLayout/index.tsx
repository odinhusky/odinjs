import { memo, ReactNode } from 'react';

const TemplateLayout = memo(({ children }: { children: ReactNode }) => {
  return children;
});

export default TemplateLayout;
