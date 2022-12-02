import React from 'react'

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

// ^ plugins
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    baseSimpleCard: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.customColor.white,
      borderRadius: 4
    },
    baseSimpleCardHeader: {
      width: '100%',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
    },
    baseSimpleCardHeaderText: {
      flex: '1 1 auto',
      marginRight: 'auto',
      fontSize: 16,
      color: theme.palette.customColor.black_87
    },
    baseSimpleCardHeaderLink: {
      display: 'block',
      fontSize: 14,
      flex: '0 0 auto',
      cursor: 'pointer'
    },
    baseSimpleCardContent: {
      width: '100%',
      // height: '100%',
      padding: 20
    }
  }});


/**
 * @author odin
 * @level Any/BaseSimpleCard
 * @component BaseSimpleCard
 * @description BaseSimpleCard Component
*/
export default function BaseSimpleCard({
  children,
  cardTitle,
  cardLinkText,
  cardLinkEvent,
  contentClass
}) {

  // = styles
  const classes = useStyles();

  return (
    <div className={classes.baseSimpleCard}>

      <div className={classes.baseSimpleCardHeader}>

        <Typography
          className={classes.baseSimpleCardHeaderText}
          component="div"
          variant="h6"
        >
          {cardTitle}
        </Typography>

        {
          cardLinkText && (
            <Link
              className={classes.baseSimpleCardHeaderLink}
              color="primary"
              onClick={cardLinkEvent}
            >
              {cardLinkText}
            </Link>
          )
        }
        

      </div>

      <div className={`${classes.baseSimpleCardContent} ${contentClass}`} >

        {children}

      </div>
    </div>
  )
}

BaseSimpleCard.propTypes = {
  children: PropTypes.any,
  cardTitle: PropTypes.string,
  cardLinkText: PropTypes.string,
  cardLinkEvent: PropTypes.func,
  contentClass: PropTypes.string
};
