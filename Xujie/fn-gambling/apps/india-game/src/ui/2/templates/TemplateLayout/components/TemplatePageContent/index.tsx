import { ReactNode, memo } from 'react';
import { isEqual } from 'lodash';

interface TemplatePageContentProps {
  children?: ReactNode;
}

export const TemplatePageContent = memo(
  ({ children }: TemplatePageContentProps) => {
    return (
      <div className={'m-auto max-w-[1240px] px-4 mobile:px-5'}>{children}</div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default TemplatePageContent;
