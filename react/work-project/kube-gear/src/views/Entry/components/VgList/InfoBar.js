import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './InfoBar.module.scss';
import { getTheme } from 'office-ui-fabric-react';

const theme = getTheme();

InfoBar.propTypes = {
  vgData: PropTypes.object
}

export default function InfoBar({ vgData }) {
  const [vgGpuTotal, setVgGpuTotal] = useState(0);
  const [vgGpuUsed, setVgGpuUsed] = useState(0);

  useEffect(() => {
    const { gpuTotal, gpuUsed } = vgData;

    const vgTotal = gpuTotal.reduce((gpu, next) => {
      return parseInt(gpu) + parseInt(next.number);
    }, 0);
    const vgUsed = gpuUsed.reduce((gpu, next) => {
      return parseInt(gpu) + parseInt(next.number);
    }, 0);
    setVgGpuTotal(vgTotal);
    setVgGpuUsed(vgUsed);
  }, [vgData]);


  const { cpuTotal, cpuUsed, memoryTotal, memoryUsed } = vgData;
  return (
    <ul className={styles.CounterList}>

      <li>
        <div className={styles.CounterTitle} > Memory </div>
        <div className={styles.InfoBar}>

          <span
            className={styles.UtilizationText}
          >
            {memoryUsed} / {memoryTotal} MB
          </span>
          <div
            className={styles.CounterBar}
            style={{
              width: ((memoryUsed * 100) / memoryTotal).toString() + '%',
              backgroundColor: theme.palette.customColor.themeTertiary
            }}
          />
        </div>
      </li>
      <li>
        <div className={styles.CounterTitle} > CPU </div>
        <div className={styles.InfoBar}>
          <span
            className={styles.UtilizationText}
          >
            {cpuUsed} / {cpuTotal}
          </span>
          <div
            className={styles.CounterBar}
            style={{
              width: ((cpuUsed * 100) / cpuTotal).toString() + '%',
              backgroundColor: theme.palette.customColor.themeLight
            }}
          />
        </div>
      </li>
      <li>
        <div className={styles.CounterTitle} > GPU </div>
        <div className={styles.InfoBar}>
          <span
            className={styles.UtilizationText}
          >
            {vgGpuUsed} / {vgGpuTotal}
          </span>
          <div
            className={styles.CounterBar}
            style={{
              width: (vgGpuUsed === 0 ? 0 : (vgGpuUsed * 100) / vgGpuTotal).toString() + '%',
              backgroundColor: theme.palette.customColor.themeLighter
            }}
          />
        </div>
      </li>
    </ul>

  );
}
