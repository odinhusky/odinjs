import React, {
  useState,
  useEffect
} from 'react';

// ^ Redux
// import { useDispatch } from 'react-redux';

// ? context
import GuideFlowContext from './GuideFlowContext';

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { GuideEntryAdmin } from './components/GuideEntryAdmin'
import { GuideEntryGeneral } from './components/GuideEntryGeneral'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import guideFlowStyle from './guideFlowStyle'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...guideFlowStyle(theme)
  }});

// ^ plugins
import PropTypes from 'prop-types';
// import { isEmpty, find, isNull } from 'lodash';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'

/**
 * @author Odin
 * @level layouts/GuideFlow
//  * @prop {boolean} isShow -- 是否要顯示
 * @prop {boolean} isAdmin -- 是否為管理者帳號
 * @prop {string} locale -- 語系的字串
 * @component GuideFlow
 * @description GuideFlow Component
*/
export const GuideFlow = ({
  // isShow,
  isAdmin,
  locale
}) => {

  // $init data
  // const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;
  const isSmallTablet = useMediaQuery('(max-width: 1024px)');
  const localeObj = {
    'zh-TW': 'tw',
    'zh-CN': 'cn',
    'en': 'en',
    'jp': 'jp'
  }

  // console.log('path', path)
  // console.log('locale', locale)

  // ^ Redux
  // const dispatch = useDispatch();


  // # states
  const [localeString, setLocaleString] = useState('cn');
  // console.log('localeString', localeString);

  // = styles
  const classes = useStyles();

  // - methods
  const getCurrentGuideComponent = () => {
    switch(path) {
      case '/entry':
        if(isAdmin) {
          return <GuideEntryAdmin />
        } else {
          return <GuideEntryGeneral />
        }
      default:
        break;
    }
  }

  // & handled data
  const contextValue = {
    classes,
    localeString,
    isSmallTablet
  }

  // * hooks
  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    // initData();
  }, [])

  useEffect(() => {
    setLocaleString(localeObj[locale])
  }, [locale])

  return (
    <GuideFlowContext.Provider value={contextValue}>
      <div className={`${classes.guideContainer}`}>
        <div className={`${classes.mask}`} />

        <div className={`${classes.guideComponent}`}>
          {getCurrentGuideComponent()}
        </div>

      </div>
    </GuideFlowContext.Provider>
  );
};

GuideFlow.propTypes = {
  // isShow: PropTypes.bool,
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func,
  locale: PropTypes.string
};

export default GuideFlow;
