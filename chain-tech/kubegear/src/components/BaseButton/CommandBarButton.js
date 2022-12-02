import React from 'react';
import PropTypes from 'prop-types';
import { CommandBarButton as UIButton, getTheme } from 'office-ui-fabric-react';

const UITheme = getTheme()

export const CommandBarButton = ({ children, primary = false, ...props }) => {

  const styles = {
    root: {
      borderRadius: '3px 0px 0px 3px',
      backgroundColor: primary ? UITheme.palette.themePrimary : UITheme.palette.white,
      color: primary ? UITheme.palette.white : '#333',
      border: '1px solid',
      borderColor: primary ? UITheme.palette.themePrimary : UITheme.palette.borderColor,
      borderRight: `1px solid ${primary ? UITheme.palette.white : UITheme.palette.borderColor}`,
      height: '32px',
      selectors: {
        '& + .ms-Button': {
          backgroundColor: primary ? UITheme.palette.themePrimary : UITheme.palette.white,
          borderColor: primary ? UITheme.palette.themePrimary : UITheme.palette.borderColor
        },
        '& + .ms-Button:hover': {
          backgroundColor: primary ? UITheme.palette.themeDark : UITheme.palette.neutralLight
        },
        '& + .ms-Button i': {
          color: primary ? UITheme.palette.white : '#333'
        },
        '&+ .ms-Button:disabled': {
          background: '#f3f2f1'
        }
      }
    },
    rootHovered: {
      backgroundColor: primary ? UITheme.palette.themeDark : UITheme.palette.neutralLight,
      color: primary ? UITheme.palette.white : '#333'
    },
    rootDisabled: {
      borderRight: `1px solid ${UITheme.palette.borderColor}`
    },
    splitButtonDivider: { height: '0px' },
    splitButtonMenuButton: {
      borderRadius: '0px 3px 3px 0px',
      backgroundColor: UITheme.palette.white,
      border: '1px solid',
      borderColor: UITheme.palette.borderColor,
      height: '32px'
    },
    toolTipHostStyle: {
      display: 'flex',
      // fontFamily: 'Tahoma',
      fontSize: '14px',
      fontWeight: 'bold',
      justifyContent: 'flex-start'
    }
  }

  return (
    <UIButton
      primary
      styles={styles}
      {...props}
    >
      {children}
    </UIButton>
  )
}

CommandBarButton.propTypes = {
  children: PropTypes.node,
  primary: PropTypes.bool
}

export default CommandBarButton