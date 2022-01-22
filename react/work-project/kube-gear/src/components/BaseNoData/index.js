import React, {
  useState,
  useEffect
} from 'react'

// ^ Material UI
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    noDataContainer: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    noDataIcon: {
      fontSize: 36,
      display: 'block',
      color: 'rgba(0, 0, 0, 0.38)',
      marginBottom: 10
    },
    noDataText: {
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.38)'
    }
  }});

// ^ Plugins
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';


/**
 * @author odin
 * @level views/BaseNoData
 * @component BaseNoData
 * @description BaseNoData component
*/
export default function BaseNoData({ type, text }) {

  // = styles
  const classes = useStyles();

  // & handled data
  const iconProps = {
    className: classes.noDataIcon
  }

  // # states(順序不能移動！)
  const [icon, setIcon] = useState(<FindInPageOutlinedIcon {...iconProps} />);

  // * hooks
  useEffect(() => {

    switch(type) {
      case 'find':
        setIcon(<FindInPageOutlinedIcon {...iconProps}/>)
        break;
      case 'noti':
        setIcon(<NotificationsNoneOutlinedIcon {...iconProps}/>)
        break;
      default:
        setIcon(<FindInPageOutlinedIcon {...iconProps}/>)
        break;
    }

  }, [type])

  return (
    <div className={classes.noDataContainer}>
      <Icon
        className={classes.noDataIcon}
        component="div"
      >
        {icon}
      </Icon>

      <div className={classes.noDataText}>{text}</div>
    </div>
  )
}

BaseNoData.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string
}
