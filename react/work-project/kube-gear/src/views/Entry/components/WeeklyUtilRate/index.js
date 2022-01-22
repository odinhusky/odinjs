import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// # API
import {
  // # 取得普羅米修斯的資料API
  getHardwareInfo,
  // # 取得普羅米修斯的資料API(範圍)
  getHardwareInfoRange
} from 'utils/api';

// ^ Material-ui Componets(Functions)
// import Typography from '@material-ui/core/Typography';

// ? Self-packed Components || Functions
import DonutUnit from '../DonutUnit'
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import { theme } from 'theme';
import {
  computeDayRange
} from 'common/commonMethods';

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
// import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry/WeeklyUtilRate
 * @component WeeklyUtilRate
 * @description Weekly utility rate component
*/
export default function WeeklyUtilRate() {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { classes, isAdmin, history } = useContext(EntryContext);

  // # states
  const [weeklyCPUUtilRate, setWeeklyCPUUtilRate] = useState(0)
  const [weeklyGPUUtilRate, setWeeklyGPUUtilRate] = useState(0)
  const [weeklyMemoryUtilRate, setWeeklyMemoryUtilRate] = useState(0)

  // - methods
  /**
   * @author odin
   * @description Get initialization data from API
  */
  const initData = async () => {
    const query = computeDayRange({ key: 'week' });

    try {
      // 取得本週 CPU 的使用率
      const thisWeekCpuReq = await getHardwareInfoRange({
        query: '100 - avg (irate(node_cpu_seconds_total{mode="idle"}[300s])) * 100',
        ...query
      });

      // 取得本週 GPU 的使用率
      const thisWeekGpuReq = await getHardwareInfoRange({
        query: 'avg(gpu_mem_utilization)',
        ...query
      });

      // 取得本週 記憶體 的使用率
      const thisWeekMemoryReq = await getHardwareInfoRange({
        query: 'sum(node_memory_MemTotal_bytes) - sum(node_memory_MemFree_bytes) - sum(node_memory_Buffers_bytes) - sum(node_memory_Cached_bytes)',
        ...query
      });
      const totalMemoryReq = await getHardwareInfo({
        query: 'sum(node_memory_MemTotal_bytes)'
      });

      // CPU
      if(
        thisWeekCpuReq.status === 'success' &&
          !isEmpty(thisWeekCpuReq.data.result)
      ) {
        const cpuRateArr = thisWeekCpuReq.data.result[0].values;
        const weeklyCPURate = avgUseRate(cpuRateArr);

        setWeeklyCPUUtilRate(weeklyCPURate);
      }

      // GPU
      if(
        thisWeekGpuReq.status === 'success' &&
          !isEmpty(thisWeekGpuReq.data.result)
      ) {
        const gpuRateArr = thisWeekGpuReq.data.result[0].values;
        const weeklyGPURate = avgUseRate(gpuRateArr);

        setWeeklyGPUUtilRate(weeklyGPURate);
      }

      // Memory
      if(
        thisWeekMemoryReq.status === 'success' &&
          !isEmpty(thisWeekMemoryReq.data.result) &&
          totalMemoryReq.status === 'success' &&
          !isEmpty(totalMemoryReq.data.result)
      ) {
        const memoryRateArr = thisWeekMemoryReq.data.result[0].values;
        const memoryTotal = +totalMemoryReq.data.result[0].value[1];
        const weeklyMemoryAll = memoryRateArr.reduce((acc, cur) => (
          acc + (+cur[1])
        ), 0)
        const weeklyMemoryAvg = weeklyMemoryAll / memoryRateArr.length;
        const memoryRate = Math.round((weeklyMemoryAvg / memoryTotal) * 100);

        setWeeklyMemoryUtilRate(memoryRate);
      }


    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  const avgUseRate = (arrReq) => {
    const total = arrReq.length;
    const sum = arrReq.reduce((acc, cur) => (
      acc + (+cur[1])
    ), 0)

    return Math.round(sum / total)
  }

  /**
   * @author odin
   * @description Defined the color by percentage
  */
  const definedColorByPercentage = (p) => {
    let color = '';

    if(p < 60) {
      color = theme.donutGreen
    } else if(p < 80 && p >= 60) {
      color = theme.donutOrange
    } else if(p <= 100 && p >= 80) {
      color = theme.donutRed
    }

    return color;
  }

  /**
   * @author odin
   * @description Navigate to cluster report page filter by tab = user time
  */
  const naviToclusterReport = () => {
    history.push('/cluster-report?tab=cluster&duration=week')
  }

  // * hooks
  /**
   * @author odin
   * @description Component Initialization
  */
  useEffect(()=> {
    if(isAdmin) initData()
  }, [])

  return (
    <div className={classes.weeklyUtilRateContainer}>
      <BaseSimpleCard
        cardLinkEvent={naviToclusterReport}
        cardLinkText={`${t('viewCheck')}`}
        cardTitle={`${t('thisWeek')}${t('useRate')}${t('overview')}`}
      >
        <div className={classes.flex_align_center}>
          {/* CPU */}
          <div className={classes.col_4}>
            <DonutUnit
              donutProgressProps={{
                percentage: weeklyCPUUtilRate,
                strokeColor: definedColorByPercentage(weeklyCPUUtilRate),
                strokeWidth: 3
              }}
              labelText={t('CPU')}
            />
          </div>

          {/* GPU */}
          <div className={classes.col_4}>
            <DonutUnit
              donutProgressProps={{
                percentage: weeklyGPUUtilRate,
                strokeColor: definedColorByPercentage(weeklyGPUUtilRate),
                strokeWidth: 3
              }}
              labelText={t('GPU')}
            />
          </div>

          {/* RAM */}
          <div className={classes.col_4}>
            <DonutUnit
              donutProgressProps={{
                percentage: weeklyMemoryUtilRate,
                strokeColor: definedColorByPercentage(weeklyMemoryUtilRate),
                strokeWidth: 3
              }}
              labelText={t('RAM')}
            />
          </div>

        </div>
      </BaseSimpleCard>
    </div>
  )
}

WeeklyUtilRate.propTypes = {
  // history: PropTypes.object
}