import React from 'react';

// ^ Material-ui Componets(Functions)
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';

// % styles
// import styleScss from  './index.module.scss';
import commonStyle from 'common/commonStyles'

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author elvis
 * @prop {string} title -- 要顯示的提示文字
 * @prop {boolean} isRequired -- 是否要顯示紅色的 * 字號
 * @prop {number} activeStep -- 目前在哪一個步驟
 * 0 => step1
 * 1 => step2
 * ...
 * 4 => step5
 * @prop {array} steps -- 步驟對應的說明文字
 * @prop {object} classNameObj -- 給予內部各個標籤不同 className 的物件
 * @level views/Schedule/CreateSchedule/BaseStepper
 * @component BaseStepper
 * @description 包含步驟的整個容器
*/
export const BaseStepper = ({
  title,
  isRequired,
  activeStep,
  steps,
  classNameObj
}) => {

  // = styles
  const QontoConnector = withStyles({
    alternativeLabel: {
      top: 8,
      left: 'calc(-50% + 20px)',
      right: 'calc(50% + 20px)'
    },
    lineHorizontal: {
      borderTopWidth: '1px'
    }
  })(StepConnector);

  const useStyles = makeStyles((theme) => ({
    ...commonStyle(theme),
    iconContainer: {
      // define styles for icon container
      transform: 'scale(1.6)'
    }
  }));

  const classes = useStyles();

  return (
    <div className={`${classNameObj?.outDiv}`}>
      {/* 標題區域 */}
      {
        title &&
          <div className={`${classes.py_5}`}>
            {title}
            { isRequired && (
              <span
                className={`${classes.textRed}`}
              > *</span>
            ) }
          </div>
      }

      {/* 步驟內容 */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={`${classNameObj?.stepper}`}
        connector={<QontoConnector />}
      >
        {
          steps.map((label) => (
            <Step key={label}>
              <StepLabel
                classes={{
                  iconContainer: classes.iconContainer,
                  label: classes.fz_14
                }}
                StepIconProps={{
                  classes: {
                    text: classes.fz_12
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))
        }
      </Stepper>
    </div>
  );
};

BaseStepper.propTypes = {
  title: PropTypes.string,
  isRequired: PropTypes.bool,
  steps: PropTypes.array,
  onChange: PropTypes.func,
  activeStep: PropTypes.number,
  onPreChange: PropTypes.func,
  cancelButton: PropTypes.node,
  openNextBtn: PropTypes.bool,
  onSubmit: PropTypes.func,
  onSubmitInSpecificStep: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  classNameObj: PropTypes.object
};

export default BaseStepper;
