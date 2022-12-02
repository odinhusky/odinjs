import React from 'react';
import PropTypes from 'prop-types';

import { BaseTooltip } from 'components/BaseTooltip';

import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0
  }
}));

export const TooltipIcon = ({ content, ...props }) => {
  const classes = useStyles();
  return (
    <BaseTooltip
      arrow
      title={content}
      {...props}
    >
      <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
    </BaseTooltip>
  );
};

TooltipIcon.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node])
};

export default TooltipIcon
