import { forwardRef, Ref } from 'react';

export const Footer = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  return <div ref={ref}></div>;
});

export default Footer;
