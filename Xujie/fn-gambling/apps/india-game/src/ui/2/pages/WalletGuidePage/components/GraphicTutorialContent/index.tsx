import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import { I18NContent } from '@mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';

interface TutorialItemProps {
  step: number;
  descriptions: I18NContent[];
  imgPath?: string;
}

const TutorialItem = (props: TutorialItemProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 bgi-text-[var(--base-2-variant1)] text-lg font-medium">
      <img
        className="object-contain"
        alt={'step_title'}
        src={getImgUrl(EResourceLevel.V, 'step_title')}
      />

      {props.descriptions.map((item, index) => (
        <p
          key={index}
          className={cx({
            'numbered-item': props.descriptions.length > 1,
          })}
        >
          {/*{item.content}*/}
          {renderI18N(item, t)}
        </p>
      ))}

      {props.imgPath ? (
        <img
          className="object-contain bgi-[var(--linear-2)] rounded-[6px] min-h-[200px]"
          alt={'step_title'}
          src={getImgUrl(EResourceLevel.V, '')}
        />
      ) : null}
    </div>
  );
};

// TODO Evan
// TODO i18n
export const GraphicTutorialContent = () => {
  const steps: TutorialItemProps[] = [
    {
      step: 1,
      descriptions: [
        {
          i18nKey:
            'Enter the amount you want to deposit and select the QR code.',
        },
        { i18nKey: 'Click the deposit button at the bottom.' },
        { i18nKey: 'You will then be directed to our QR code payment page.' },
      ],
      imgPath: 'step_1_img',
    },
    {
      step: 2,
      descriptions: [
        {
          i18nKey: 'Take a screenshot of the page with the QRcode and save it',
        },
      ],
    },
    {
      step: 3,
      descriptions: [
        {
          i18nKey: 'Open your wallet or banking app',
        },
        { i18nKey: 'Select Scan&Pay' },
      ],
      imgPath: 'step_3_img',
    },
    {
      step: 4,
      descriptions: [
        {
          i18nKey: 'Click the button: Scan from Gallery or WhatsApp',
        },
      ],
      imgPath: 'step_4_img',
    },
    {
      step: 5,
      descriptions: [
        {
          i18nKey:
            'Select the screenshot you just saved and complete the payment',
        },
      ],
      imgPath: 'step_5_img',
    },
    {
      step: 6,
      descriptions: [
        {
          i18nKey:
            'Copy the UTR of the order you just paid in your wallet or bank app',
        },
      ],
      imgPath: 'step_6_img',
    },
    {
      step: 7,
      descriptions: [
        {
          i18nKey:
            'Go back to the deposit order page, paste the UTR you copied and click submit.',
        },
        {
          i18nKey:
            'Within 1-5 minutes, the amount you deposit will be deposited into your game balance account.',
        },
        {
          i18nKey:
            'If you have any questions, please contact online customer service in the game.',
        },
      ],
      imgPath: 'step_7_img',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bgi-text-[var(--base-1-main)] text-base font-medium">
        {
          'You can learn about our qrcode deposit by browsing the following content'
        }
      </div>

      {steps.map((item, index) => {
        return <TutorialItem key={`${item.step}_${index}`} {...item} />;
      })}
    </div>
  );
};

export default GraphicTutorialContent;
