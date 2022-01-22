import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { isEmpty, last } from 'lodash';

import { LineChart } from 'components/BaseChart';

import styles from './index.module.scss';

const SpeedBox = ({ className, data, dataName, title, unit }) => {
  const { t } = useTranslation();
  return (
    <section className={classNames(className, styles.container)}>
      {
        data && !isEmpty(data[0]) &&
        <>
          <div className={styles.left}>
            <p>{t('current')}{t('enSpace')}{title}{t('enSpace')}{t('speed')}</p>
            <div className={styles.splitBox}>
              <div>
                <p>{last(data[0])[1].toFixed(2)} {unit}</p>
                <span>{dataName[0]}</span>
              </div>
              <div>
                <p>{last(data[1])[1].toFixed(2)} {unit}</p>
                <span>{dataName[1]}</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <LineChart
              options={{
                title: {
                  text: title
                },
                series: [
                  {
                    name: dataName[0],
                    data: data[0]
                  },
                  {
                    name: dataName[1],
                    data: data[1]
                  }
                ],
                tooltip: {
                  valueDecimals: 2,
                  useHTML: true,
                  formatter: function () {
                    return ['<b>' + moment(this.x).format('MM/DD HH:mm') + '</b>'].concat(
                      this.points ?
                        this.points.map(function (point) {
                          return `${point.series.name}: ${point.y.toFixed(2)} MB/s`;
                        }) : []
                    );
                  }
                },
                yAxis: {
                  opposite: false,
                  labels: {
                    format: '{value} MB/s'
                  }
                }
              }}
            />
          </div>
        </>
      }
    </section>
  );
};

SpeedBox.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  dataName: PropTypes.array,
  title: PropTypes.string,
  unit: PropTypes.string
};

export default SpeedBox;
