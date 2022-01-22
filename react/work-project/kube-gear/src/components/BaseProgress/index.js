import React from 'react';

// ? styles
import { colors } from 'constant';
import styles from './index.module.scss';

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Progress = ({ classNameObj, style, title, keys, total, value, unit, progressColor }) => {

  // $ init data
  const { t } = useTranslation();

  // maximun 100%
  const width = value / total <= 1 ? value / total * 100 : 100
  const progessStyle = {
    width: total ? `${width}%` : 0,
    background: progressColor || colors[(keys % colors.length)]
  }

  return (
    <div
      className={classNameObj?.container}
      style={style}
    >
      <div className={`${styles.header} ${classNameObj?.header}`}>
        <div>{t(title) ? t(title) : title}</div>
        <div>{ total ? `${value} / ${total} ${unit}` : '- / -'}</div>
      </div>
      <div className={`${styles.track} ${classNameObj?.track}`}>
        <div
          className={`${styles.progess} ${classNameObj?.progess}`}
          style={progessStyle}
        />
      </div>
    </div>
  );
};

Progress.propTypes = {
  classNameObj: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  value: PropTypes.number,
  unit: PropTypes.string,
  keys: PropTypes.number,
  progressColor: PropTypes.string
}

export default Progress;