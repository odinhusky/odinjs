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
 * @level layouts/GuideFlow/GuideEntryAdmin
 * @component GuideEntryAdmin
 * @description GuideEntryAdmin Component
*/
export const GuideEntryAdmin = () => {

  // $init data
  const { t } = useTranslation();
  const minStep = 1;
  const maxStep = 7;

  // # states
  const [currentStep, setCurrentStep] = useState(1);

  // = styles
  // % context
  const { classes, isSmallTablet } = useContext(GuideFlowContext);

  // - methods

  // & handled data
  const titleObj = {
    step1: t('status'),
    step2: `${t('thisWeek')}${t('useRate')}${t('overview')}`,
    step3: t('onlineUsers'),
    step4: `${t('job')}${t('status')}`,
    step5: t('weeklyUsageTime'),
    step6: `${t('vitualCluster')}${t('status')}`,
    step7: t(`guide.entry.admin.step${currentStep}.title`)
  }

  const arrowTypeObj = {
    step1: 'top',
    step2: 'top',
    step3: 'top',
    step4: 'left',
    step5: 'left',
    step6: 'right',
    step7: 'top'
  }

  return (
    <div className={`${classes.stepContainer}`}>
      <div className={`${isSmallTablet ? classes.guideAdvice : classes[`entryAdminDetail${currentStep}`]}`}>
        <GuideDetail
          arrowType={arrowTypeObj[`step${currentStep}`]}
          hasPrev={(currentStep > minStep && currentStep <= maxStep)}
          haxNext={(currentStep >= minStep && currentStep < maxStep)}
          setCurrentStep={setCurrentStep}
          title={titleObj[`step${currentStep}`]}
        >
          <div className={`${classes.detailContent}`}>
            {t(`guide.entry.admin.step${currentStep}.detail`)}
          </div>
        </GuideDetail>
      </div>
    </div>
  );
};

// GuideEntryAdmin.propTypes = {
//   isShow: PropTypes.bool
// };

export default GuideEntryAdmin;
