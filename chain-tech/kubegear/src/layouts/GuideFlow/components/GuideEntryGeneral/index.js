import React, {
  useState,
  useContext
} from 'react';

// ? context
import GuideFlowContext from '../../GuideFlowContext';

// ? Self-packed Components || Functions
import { GuideDetail } from '../GuideDetail'

// ^ plugins
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author Odin
 * @level layouts/GuideFlow/GuideEntryGeneral
 * @component GuideEntryGeneral
 * @description GuideEntryGeneral Component
*/
export const GuideEntryGeneral = () => {

  // $init data
  const { t } = useTranslation();
  const minStep = 1;
  const maxStep = 6;

  // # states
  const [currentStep, setCurrentStep] = useState(1);

  // = styles
  // % context
  const { classes, isSmallTablet } = useContext(GuideFlowContext);

  // - methods

  // & handled data
  const titleObj = {
    step1: t('status'),
    step2: `${t('runningjobs')}`,
    step3: `${t('uploadFile')}`,
    step4: `${t('qucikStart')}`,
    step5: `${t('vitualCluster')}${t('status')}`,
    step6: t('language')
  }

  const arrowTypeObj = {
    step1: 'top',
    step2: 'top',
    step3: 'top',
    step4: 'bottom',
    step5: 'right',
    step6: 'top'
  }

  return (
    <div className={`${classes.stepContainer}`}>
      <div
        className={
          `${isSmallTablet
            ? classes.guideAdvice
            : classes[`entryGeneralDetail${currentStep}`]
          }`
        }
      >
        <GuideDetail
          arrowType={arrowTypeObj[`step${currentStep}`]}
          hasPrev={(currentStep > minStep && currentStep <= maxStep)}
          haxNext={(currentStep >= minStep && currentStep < maxStep)}
          setCurrentStep={setCurrentStep}
          title={titleObj[`step${currentStep}`]}
        >
          <div className={`${classes.detailContent}`}>
            {t(`guide.entry.user.step${currentStep}.detail`)}
          </div>
        </GuideDetail>
      </div>
    </div>
  );
};

// GuideEntryGeneral.propTypes = {
//   isShow: PropTypes.bool
// };

export default GuideEntryGeneral;
