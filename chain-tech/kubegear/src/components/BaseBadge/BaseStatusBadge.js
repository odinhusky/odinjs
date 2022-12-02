
/* eslint-disable */
import React, {
  useState,
  useEffect
} from 'react';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    baseStatusBadge: {
      display: 'flex',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 4,
      maxHeight: 36
    },
    baseStatusBadgeText: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center'
    },
    success: {
      color: 'green',
      backgroundColor: '#D6F8C5'
    },
    pend: {
      color: 'orange',
      backgroundColor: '#FFF8EA'
    },
    fail: {
      color: 'red',
      backgroundColor: '#FDE7E9'
    },
    gray: {
      color: 'white',
      backgroundColor: '#B1B5B8'
    },
    leader: {
      color: 'white',
      backgroundColor: '#424e86'
    },
    member: {
      color: 'white',
      backgroundColor: '#954f96'
    }
  }
});


// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level Any/BaseStatusBadge
 * @prop {Any} children -- children node
 * @prop {String} status --
 * success | default === 綠色
 * pend === 橘黃色
 * fail === 紅色
 * @prop {Object} classNameObj -- 客製化的className
 * classNameObj: {
 *  container: 控制外層 container 的 class
 *  text: 控制內層文字的 class
 * }
 * @prop {array} customStats -- 客製化的狀態 ex.['verified', 'verifying', 'denied']
 * @prop {object} customStats -- 客製化的狀態 ex.
 * {
      verified: { color: 'green', backgroundColor: '#D6F8C5' },
      verifying: { color: 'orange', backgroundColor: '#FFF8EA' },
      denied: { color: 'red', backgroundColor: '#FDE7E9' }
    }
 * @component BaseStatusBadge
 * @description Status Badge component
*/
export const BaseStatusBadge = ({
  children,
  customStatus = [],
  customStyles = {},
  status,
  classNameObj,
  maxW,
  minW
 }) => {

  // # states
  const [statusClass, setStatusClass] = useState('');
  const [statusStyle, setStatusStyle] = useState({});

  // = styles
  const classes = useStyles();

  // & handled data
  // const statusClass = ()

  // * hook
  useEffect(() => {
    if (isEmpty(customStatus)) {
      switch(status) {
        case 'pend':
          setStatusClass(classes.pend);
          break;
        case 'fail':
          setStatusClass(classes.fail);
          break;
        case 'gray':
          setStatusClass(classes.gray);
          break;
        case 'leader':
          setStatusClass(classes.leader);
          break;
        case 'member':
          setStatusClass(classes.member);
          break;
        case 'success':
        default:
          setStatusClass(classes.success);
          break;
      }
    } else {
      for (const item of customStatus) {
        if (status === item) {
          setStatusStyle(customStyles[status])
        }
      }
    }
  }, [status])

  return (
    <div
      className={`${classes.baseStatusBadge} ${statusClass} ${classNameObj?.container}`}
      style={{maxWidth: maxW ? maxW : 'initial', minWidth: minW ? minW : 'initial', ...statusStyle}}>
      <span className={`baseStatusBadgeText ${classes.baseStatusBadgeText} ${classNameObj?.text}`}>
        {children}
      </span>
    </div>
  );
}

BaseStatusBadge.propTypes = {
  children: PropTypes.any,
  customStatus: PropTypes.array,
  status: PropTypes.string,
  classNameObj: PropTypes.object,
  maxW: PropTypes.number,
  minW: PropTypes.number
}

export default BaseStatusBadge;
