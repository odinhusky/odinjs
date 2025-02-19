import { LinkInfo } from '@mode2/zustand/components/footerStore';
import { forwardRef, memo, Ref } from 'react';

interface HyperLinkInfo extends LinkInfo {
  isDecorate: boolean;
}

const DecorateLink: HyperLinkInfo = {
  labelKey: { i18nKey: '' },
  icon: '',
  isAction: false,
  onActionClick: () => {},
  isDecorate: true,
};
export const Footer = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    return <div ref={ref}></div>;
  })
);
