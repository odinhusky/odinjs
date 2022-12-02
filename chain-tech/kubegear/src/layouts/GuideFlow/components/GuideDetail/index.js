import React, {
  // useState,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { useDispatch } from 'react-redux';
import { changeGuideStep, closeGuide } from 'layouts/Main/features/guide/guideSlice';

// ? context
import GuideFlowContext from '../../GuideFlowContext'

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { DefaultButton } from 'components/BaseButton';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import guideFlowStyle from '../../guideFlowStyle'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...guideFlowStyle(theme)
  }});

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author Odin
 * @level layouts/GuideDetail
 * @prop {boolean} isCloseIcon -- 是否要顯示關閉的按鈕
 * @component GuideDetail
 * @description GuideDetail Component
*/
export const GuideDetail = ({
  isCloseIcon = true,
  hasPrev,
  haxNext,
  classesNameObj,
  title,
  detailHeadNode,
  children,
  setCurrentStep,
  arrowType
}) => {

  // $init data
  const { t } = useTranslation();

  // ^ Redux
  const dispatch = useDispatch();

  // % context
  const { isSmallTablet } = useContext(GuideFlowContext)

  // # states
  // const [localeString, setLocaleString] = useState('cn');

  // = styles
  const classes = useStyles();

  // - methods
  const renderDetailArrow = (arrowType) => {
    switch(arrowType) {
      case 'top':
        return (
          <div className={`${classes.detailTopArrow}`} />
        );
      case 'left':
        return (
          <div className={`${classes.detailLeftArrow}`} />
        );
      case 'right':
        return (
          <div className={`${classes.detailRightArrow}`} />
        );
      case 'bottom':
        return (
          <div className={`${classes.detailBottomArrow}`} />
        );
      default:
        return (
          <></>
        );
    }
  }

  // * hooks
  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    // initData();
  }, [])

  return (
    <div className={`${classes.detailContainer}`}>
      {/* Detail Icon */}
      {
        // 如果沒有低於 1024 才要顯示
        !isSmallTablet &&
        renderDetailArrow(arrowType)
      }

      {/* Detail Head */}
      <div className={`${classes.detailHead} ${classesNameObj?.detailHead}`}>
        <div
          className={`${classes.detailTitle} ${classesNameObj?.detailTitle}`}
        >
          {!isSmallTablet ? title : t('hint')}
        </div>
        <div className={`${classes.detailHeadNode} ${classesNameObj?.detailHeadNode}`}>
          {detailHeadNode}
        </div>
        {
        // 關閉按鈕
          isCloseIcon && (
            <div
              className={`${classes.detailIconContainer} ${classesNameObj?.detailIconContainer}`}
              onClick={() => {
                dispatch(closeGuide())
              }}
            >
              <Icon className={`${classes.detailCloseBtn} ${classesNameObj?.detailCloseBtn}`}>close</Icon>
            </div>
          )
        }
      </div>

      {/* Detail Body */}
      <div className={`${classes.detailBody} ${classesNameObj?.detailBody}`}>
        {!isSmallTablet ? children : t('guide.guideAdvice')}
      </div>

      {/* Detail Foot */}
      <div
        className={`
          ${classes.detailFoot}
          ${classesNameObj?.detailFoot}
          ${isSmallTablet && classes.d_none}
        `}
      >
        <DefaultButton
          children={t('Back')}
          classNameProps={`${classes.mr_20}`}
          disabled={!hasPrev}
          onClick={() => {
            setCurrentStep(prev => {
              const newCurrentStep = prev - 1

              dispatch(changeGuideStep(newCurrentStep))
              return newCurrentStep
            })
          }}
        />

        {/* 最後一步的時候會變成結束 */}
        <DefaultButton
          children={haxNext ? t('Next') : t('guide.completeGuide')}
          onClick={() => {
            setCurrentStep(prev => {
              if(haxNext) {
                const newCurrentStep = prev + 1

                dispatch(changeGuideStep(newCurrentStep))
                return newCurrentStep
              } else {
                dispatch(closeGuide())
              }
            })
          }}
        />
      </div>
    </div>
  );
};

GuideDetail.propTypes = {
  isCloseIcon: PropTypes.bool,
  hasPrev: PropTypes.bool,
  haxNext: PropTypes.bool,
  classesNameObj: PropTypes.object,
  title: PropTypes.string,
  modalHeadNode: PropTypes.node,
  detailHeadNode: PropTypes.node,
  children: PropTypes.node,
  setCurrentStep: PropTypes.func,
  arrowType: PropTypes.string
};

export default GuideDetail;
