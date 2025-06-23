import { InnerHtmlWrapperProps } from './InnerHtmlWrapperProps';

export const InnerHtmlWrapper = (props: InnerHtmlWrapperProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: props.__html,
      }}
    ></div>
  );
};

export default InnerHtmlWrapper;
