import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

// # API
import {
  getVg,
  getHardwareInfoRange,
  getResource
} from 'utils/api';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BasePanel from 'components/BasePanel';
import ClusterOverview from './ClusterOverview';
import UseRate from './UseRate';
import CycleBar from './CycleBar'
import { computeVgOverviewData, computeVgOverviewDataForExportCsv, exportCsv } from './utils';
import { parseNormalFormat, parseGBFormat, parseMBFormat, computeDayRange } from '../../utils';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

// ^ plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ClusterReport/Cluster
 * @component Cluster
 * @description Cluster content component
*/
const ClusterTab = ({ duration }) => {

  // $ init data
  const { t } = useTranslation();
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  // # states
  const [vgInfo, setVgInfo] = useState({});
  const [vgRawData, setVgRawData] = useState([]);
  const [useRate, setUseRate] = useState();
  const [cycle, setCycle] = useState({ key: '15min' });

  // - methods
  const getVgInfo = (param = 'system') => {
    Promise.all([getVg(), getResource(param)])
      .then(([vgData, resource]) => {
        setVgInfo(computeVgOverviewData(vgData, resource, t))
        setVgRawData(computeVgOverviewDataForExportCsv(vgData));
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.toString())
      })
  }

  const getUseRate = useCallback(() => {
    const query = computeDayRange(cycle);
    Promise.all([
      getHardwareInfoRange({
        query: '100 - avg (irate(node_cpu_seconds_total{mode="idle"}[300s])) * 100',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(node_memory_MemTotal_bytes) - sum(node_memory_MemFree_bytes) - sum(node_memory_Buffers_bytes) - sum(node_memory_Cached_bytes)',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(node_memory_MemFree_bytes)',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(node_memory_Buffers_bytes) + sum(node_memory_Cached_bytes)',
        ...query
      }),
      getHardwareInfoRange({
        query: 'avg(gpu_mem_utilization)',
        ...query
      }),
      getHardwareInfoRange({
        query: 'avg(gpu_utilization)',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(rate(node_network_receive_bytes_total{device!~"lo"}[300s]))',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(rate(node_network_transmit_bytes_total{device!~"lo"}[300s]))',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(rate(node_disk_read_bytes_total[300s]))',
        ...query
      }),
      getHardwareInfoRange({
        query: 'sum(rate(node_disk_written_bytes_total[300s]))',
        ...query
      })
    ]).then(([cpu, memoryUsed, memoryTotal, memoryBuffer, gpu, gpuMemory, networkReceive, networkTransmit, diskRead, diskWritten]) => {
      cpu = !isEmpty(cpu.data.result[0]) ? cpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : []
      memoryTotal = !isEmpty(memoryTotal.data.result[0]) ? memoryTotal.data.result[0].values.map(value => value.map(parseGBFormat)) : []
      memoryUsed = !isEmpty(memoryUsed.data.result[0]) ? memoryUsed.data.result[0].values.map(value => value.map(parseGBFormat)) : []
      memoryBuffer = !isEmpty(memoryBuffer.data.result[0]) ? memoryBuffer.data.result[0].values.map(value => value.map(parseGBFormat)) : []
      gpu = !isEmpty(gpu.data.result[0]) ? gpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : []
      gpuMemory = !isEmpty(gpuMemory.data.result[0]) ? gpuMemory.data.result[0].values.map(value => value.map(parseNormalFormat)) : []
      networkReceive = !isEmpty(networkReceive.data.result[0]) ? networkReceive.data.result[0].values.map(value => value.map(parseMBFormat)) : []
      networkTransmit = !isEmpty(networkTransmit.data.result[0]) ? networkTransmit.data.result[0].values.map(value => value.map(parseMBFormat)) : []
      diskRead = !isEmpty(diskRead.data.result[0]) ? diskRead.data.result[0].values.map(value => value.map(parseMBFormat)) : []
      diskWritten = !isEmpty(diskWritten.data.result[0]) ? diskWritten.data.result[0].values.map(value => value.map(parseMBFormat)) : []

      setUseRate({ cpu, memoryTotal, memoryUsed, memoryBuffer, gpu, gpuMemory, networkReceive, networkTransmit, diskRead, diskWritten })
    })
  }, [cycle])

  // * hook
  useEffect(() => {
    getVgInfo()
    getUseRate()

    // 選自訂就不自動更新
    if (cycle.key !== 'custom') {
      const timer = setInterval(() => {
        getVgInfo()
        getUseRate()
      }, 30000);

      return () => clearInterval(timer)
    }

  }, [cycle])

  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  /**
   * @author elvis
   * @description
   * 初始化時執行 initialUrlQueryFilter 透過其回傳 duration 決定是否要給初始值
   * cycle，藉此獲得不同期間的資料
   * @author odin
   * @description 有傳duration的 props 的話，則要判斷是否要設定 duration 的cycle，藉此獲得不同期間的資料
  */
  useEffect(() => {
    if (duration && duration !== '') {
      setCycle({ key: duration });
    }
  }, [duration])

  return (
    <>
      <div>
        <PrimaryButton
          children={`${t('Export')}${t('enSpace')}Excel`}
          classes={{
            root: classes.mr_10,
            startIcon: classes.iconClearMarginLeft
          }}
          onClick={() => exportCsv(vgRawData, useRate)}
          startIcon={<Icon>file_download</Icon>}
        />
        <DefaultButton
          children={t('refresh')}
          onClick={() => {
            getVgInfo()
            getUseRate()
          }}
          startIcon={<Refresh />}
        />
      </div>
      <div className={`${classes.pt_20}`}>
        <BasePanel
          title={`${t('resource')}${t('enSpace')}${t('status')}`}
        >
          <ClusterOverview
            data={vgInfo}
          />
        </BasePanel>
        <BasePanel
          style={{ paddingTop: 20 }}
          title={t('Utilization')}
        >
          <CycleBar
            duration={duration}
            onChange={setCycle}
          />
          <UseRate
            data={useRate}
          />
        </BasePanel>
      </div>
    </>
  );
};

export default ClusterTab;

ClusterTab.propTypes = {
  duration: PropTypes.string
}
