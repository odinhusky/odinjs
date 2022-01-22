import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import styles from './Progress.module.scss';

const useStyles = makeStyles((theme) => ({
  marginRight10: {
    marginRight: 10
  },
  palette: {
    backgroundColor: theme.palette.customColor.themePrimary
  }
}));

const Progress = ({ value }) => {
  const classes = useStyles();
  return (
    <div className={styles.progress}>
      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressBar} ${classes.palette}`}
          style={{
            minWidth: '2rem',
            width: `${value}%`
          }}
        />
      </div>
      <p
        className={styles.progressValue}
      >{value}%</p>
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number
};

export default Progress;
