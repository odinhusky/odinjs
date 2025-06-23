import { InnerHtmlWrapperProps } from '../InnerHtmlWrapperProps';
import { cx } from '@libs/commonUtils';
import './quill.core.css';
import './quill.snow.css';
import './quill.bubble.css';
export const InnerHtmlWrapper = (props: InnerHtmlWrapperProps) => {
  return (
    <div
      className={cx(
        'bgi-text-[var(--grayscale-100)]', // 先預設基礎色，剩餘由文本編輯器調整
        'ql-editor', // Evan 需要支援 後端文本編輯器 預載入需要的css
        props.className
      )}
      dangerouslySetInnerHTML={{
        __html: props.__html,
      }}
    />
  );
};

export default InnerHtmlWrapper;
