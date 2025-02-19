import { ReactNode, memo } from 'react';
import { isEqual } from 'lodash';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import cx from '@commonUtils/cx';

interface TemplatePageContentProps {
  children?: ReactNode;
}

export const TemplatePageContent = memo(
  ({ children }: TemplatePageContentProps) => {
    return (
      <div
        className={cx(
          // 'm-auto max-w-[1240px]',
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'px-4 pb-4'
        )}
      >
        {children}
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default TemplatePageContent;
