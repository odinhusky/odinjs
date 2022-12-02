import React from 'react';

// ? Self-packed Components || Functions
import TooltipIcon from '../TooltipIcon';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  spanClass: {
    marginLeft: 10,
    flex: 2,
    borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
  }
}));

// ^ Plugin
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content/AdvancedSetting/TitleDivider
 * @component TitleDivider
 * @description TitleDivider component
*/
const TitleDivider = ({ title, hint }) => {

  // = styles
  const classes = useStyles();

  return (
    <div className={`${classes.flex_align_center} ${classes.px_20}`}>
      <p className={`${classes.black_87} ${classes.fz_18} ${classes.m_0} ${classes.mr_10}`}>{title}</p>
      {
        hint &&
        <TooltipIcon content={hint} />
      }
      <span className={`${classes.spanClass}`} />
    </div>
  );
};

TitleDivider.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
};

export default TitleDivider;