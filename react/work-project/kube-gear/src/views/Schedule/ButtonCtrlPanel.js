import React, {
  useContext
} from 'react';

// % context
import ScheduleContext from './ScheduleContext';

// ? Self-packed Components || Functions
import {
  DefaultButton,
  PrimaryButton
} from 'components/BaseButton';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/ButtonCtrlPanel
 * @prop {number} activeStep -- 目前在步驟幾 0 - step1 ~ 4 - step5
 * @prop {function} setActiveStep -- 修改 activeStep 的 function
 * @prop {function} handleBackToCalendar -- 回到選擇日期的 function
 * @prop {function} resetDefault -- 將 step1State 以及 step2State 恢復成預設值
 * @component ButtonCtrlPanel
 * @description 下方的 Button Panel
*/
export const ButtonCtrlPanel = ({
  activeStep,
  setActiveStep,
  handleBackToCalendar,
  resetDefault,
  // # step1
  setIsStep1SubmitClicked,
  isStep1BtnOpen,
  isPreScheduledJob,
  // # step2
  isStep2BtnOpen,
  // # step3
  isStep3BtnOpen,
  step3BackNum,
  // # step4
  step4BackNum,
  // # step5
  setIsStep5SubmitClicked,
  step5BackNum
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext);

  return (
    <div className={`${classes.stepCtrlPanel}`}>

      {
        // 步驟1
        activeStep === 0 && (
          <>
            <div className={`${classes.flex_left}`}>
              <DefaultButton
                children={t('cancel')}
                onClick={() => {
                  resetDefault()
                  handleBackToCalendar()
                }}
              />
            </div>
            <div className={`${classes.flex_right}`}>
              <PrimaryButton
                children={!isPreScheduledJob ? t('submit') : t('Next')}
                disabled={!isStep1BtnOpen}
                onClick={() => {setIsStep1SubmitClicked(true)}}
              />
            </div>
          </>
        )
      }

      {
        // 步驟2
        activeStep === 1 && (
          <>
            <div className={`${classes.flex_left}`}>
              <DefaultButton
                children={t('cancel')}
                onClick={() => {
                  resetDefault()
                  handleBackToCalendar()
                }}
              />
            </div>
            <div className={`${classes.flex_right}`}>
              <DefaultButton
                children={t('Back')}
                classNameProps={`${classes.mr_20}`}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
              />

              <PrimaryButton
                children={t('Next')}
                disabled={!isStep2BtnOpen}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
              />
            </div>
          </>
        )
      }

      {
        // 步驟3
        activeStep === 2 && (
          <>
            <div className={`${classes.flex_left}`}>
              <DefaultButton
                children={t('cancel')}
                onClick={() => {
                  resetDefault()
                  handleBackToCalendar()
                }}
              />
            </div>
            <div className={`${classes.flex_right}`}>
              <DefaultButton
                children={t('Back')}
                classNameProps={`${classes.mr_20}`}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + step3BackNum)}
              />

              <PrimaryButton
                children={t('Next')}
                disabled={!isStep3BtnOpen}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
              />
            </div>
          </>
        )
      }

      {
        // 步驟4
        activeStep === 3 && (
          <>
            <div className={`${classes.flex_left}`}>
              <DefaultButton
                children={t('cancel')}
                onClick={() => {
                  resetDefault()
                  handleBackToCalendar()
                }}
              />
            </div>
            <div className={`${classes.flex_right}`}>
              <DefaultButton
                children={t('Back')}
                classNameProps={`${classes.mr_20}`}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + step4BackNum)}
              />

              <PrimaryButton
                children={t('Next')}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
              />
            </div>
          </>
        )
      }

      {
        // 步驟5
        activeStep === 4 && (
          <>
            <div className={`${classes.flex_left}`}>
              <DefaultButton
                children={t('cancel')}
                onClick={() => {
                  resetDefault()
                  handleBackToCalendar()
                }}
              />
            </div>
            <div className={`${classes.flex_right}`}>
              <DefaultButton
                children={t('Back')}
                classNameProps={`${classes.mr_20}`}
                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + step5BackNum)}
              />

              <PrimaryButton
                children={t('submit')}
                onClick={() => setIsStep5SubmitClicked(true)}
              />
            </div>
          </>
        )
      }
    </div>
  );
}

ButtonCtrlPanel.propTypes = {
  activeStep: PropTypes.number,
  setActiveStep: PropTypes.func,
  setIsStep1SubmitClicked: PropTypes.func,
  isStep1BtnOpen: PropTypes.bool,
  isPreScheduledJob: PropTypes.bool,
  handleBackToCalendar: PropTypes.func,
  resetDefault: PropTypes.func,
  setIsStep2SubmitClicked: PropTypes.func,
  isStep2BtnOpen: PropTypes.bool,
  step3BackNum: PropTypes.number,
  isStep3BtnOpen: PropTypes.bool,
  step4BackNum: PropTypes.number,
  setIsStep5SubmitClicked: PropTypes.func,
  step5BackNum: PropTypes.number
}

export default ButtonCtrlPanel;