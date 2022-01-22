import React, {
} from 'react'
import { Link } from 'react-router-dom';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    iconBtnOuter: {
      border: '1px solid #e0e0e0',
      borderRadius: 4,
      cursor: 'pointer',
      padding: '12px',
      '&:hover': {
        backgroundColor: theme.palette.customColor.themePrimaryLightBg
      }
    },
    iconBtnOuterWithoutHover: {
      border: '1px solid #e0e0e0',
      borderRadius: 4,
      padding: '12px'
    },
    iconBtnDisabled: {
      backgroundColor: theme.palette.customColor.black_12,
      color: theme.palette.customColor.black_38,

      '& .iconBtnContainer svg': {
        color: theme.palette.customColor.black_38

      },
      '& .iconBtnText': {
        color: theme.palette.customColor.black_38

      }
    },
    iconBtnContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // '&:hover': {
      //   opacity: 0.6
      // },

      '& svg': {
        fontSize: 24,
        color: theme.palette.customColor.black
      },
      '& i': {
        fontSize: 24,
        color: theme.palette.customColor.black
      }
    },
    iconClass: {
      fontSize: 24,
      color: theme.palette.customColor.black
    },
    iconBtnText: {
      display: 'block',
      marginTop: 12,
      color: theme.palette.customColor.black
    }
  }});

// ^ plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry/UploadFiles/IconBtn
 * @component IconBtn
 * @prop {string} href -- 要連去的連結(非必要)
 * @prop {string} text -- 要顯示的文字
 * @prop {node} icon - 包含 icon 的 <i>
 * @prop {string} iconType -- <Icon>iconType</Icon>
 * @prop {boolean} disabled -- 背景變灰，且沒有連結的版本
 * @description Icon button component
*/
export default function IconBtn({
  href,
  text,
  icon,
  iconType,
  classNameProps,
  disabled
}) {

  // = styles
  const classes = useStyles();

  // # states

  // & handled data
  const showIcon = icon ? icon : (
    <Icon
      className={classes.iconClass}
    >
      {iconType}
    </Icon>
  )

  return (
    <>
      {
        (href && disabled === false) ? (
          <div className={classes.iconBtnOuter}>
            <Link
              className={`${classes.iconBtnContainer} ${classNameProps}`}
              to={href}
            >
              {showIcon}
              <span
                className={classes.iconBtnText}
              >
                {text}
              </span>
            </Link>
          </div>
        ) : (
          <div
            className={`
            ${classes.iconBtnOuterWithoutHover}
            ${classes.iconBtnDisabled}
          `}
          >
            <div
              className={`iconBtnContainer  ${classes.iconBtnContainer} ${classNameProps}`}
            >
              {showIcon}
              <span
                className={`iconBtnText ${classes.iconBtnText}`}
              >
                {text}
              </span>
            </div>
          </div>
        )
      }
    </>
  )
}

IconBtn.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.node,
  iconType: PropTypes.string,
  classNameProps: PropTypes.string,
  disabled: PropTypes.bool
}