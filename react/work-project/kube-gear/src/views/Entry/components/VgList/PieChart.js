/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './PieChart.module.scss';
import { theme } from 'theme'

PieChart.propTypes = {
  vgData: PropTypes.object
}

export default function PieChart({ vgData }) {
  let [currentUtilRate, setCurrentUtilRate] = useState(0);
  let utilInfo = useRef({});

  useEffect(()=>{
    let { gpuTotal, gpuUsed, cpuTotal, cpuUsed, memoryTotal, memoryUsed } = vgData;

    utilInfo.current = {
      gpuTotal: gpuTotal.reduce((gpu, next)=>{
        return parseInt(gpu) + parseInt(next.number);
      }, 0),
      gpuUsed: gpuUsed.reduce((gpu, next)=>{
        return parseInt(gpu) + parseInt(next.number);
      }, 0),
      cpuTotal: parseInt(cpuTotal),
      cpuUsed: parseInt(cpuUsed),
      memoryTotal: parseInt(memoryTotal),
      memoryUsed: parseInt(memoryUsed)
    };

    pickTheLargestRate();
  }, [vgData]);

  function pickTheLargestRate() {
    let { gpuTotal, gpuUsed } = utilInfo.current;

    let gpuUtilRate = gpuTotal === 0 ? 0 : parseInt(gpuUsed) / parseInt(gpuTotal);
    let res = parseFloat((gpuUtilRate * 100).toFixed(0));
    setCurrentUtilRate(res);
  }
  return (
    <svg viewBox="0 0 80 36" className={styles.circularChart} preserveAspectRatio="xMinYMin meet">
      <path className={styles.circleBg}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      {
        currentUtilRate > 0 &&
          <path
            className={styles.circle}
            strokeDasharray={`${currentUtilRate}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              stroke: theme.themePrimary
            }}
          />
      }
      <text x="18" y="20.35" className={styles.percentage}>{currentUtilRate}%</text>
    </svg>
  );
}
