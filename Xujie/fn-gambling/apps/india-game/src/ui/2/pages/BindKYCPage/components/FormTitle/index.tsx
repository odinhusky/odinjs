import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';

interface FormTitleProps {
  title: I18NContent;
  classNameObj?: {
    containerClass?: string;
    titleClass?: string;
    titleLineClass?: string;
  };
}

export const FormTitle = ({ title, classNameObj }: FormTitleProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx('title', classNameObj?.containerClass)}>
      <div
        className={cx(
          'text-lg bgi-text-[var(--grayscale-100)] font-bold text-center mb-1',
          classNameObj?.titleClass
        )}
      >
        {renderI18N(title, t)}
      </div>
      <div
        className={cx(
          'bgi-[var(--title-line)] w-[80%] h-[2px] m-auto mb-4 mobile:mb-5 tablet:mb-6',
          classNameObj?.titleLineClass
        )}
      ></div>
    </div>
  );
};

export default FormTitle;
