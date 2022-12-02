import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getTotalHostInfo,
  getHardwareInfoRange,
  getHardwareInfo
} from 'utils/api';

// ? context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import BasePanel from 'components/BasePanel';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import CycleBar from './CycleBar';
import UseRate from './UseRate';
import GpuInfo from './GpuInfo';
import { exportCsv } from './utils';
import {
  parseNormalFormat,
  computeDayRange,
  parseGBFormat,
  parseMBFormat,
  parseNormalFormatGreaterthan0
} from '../../../../utils';

// ^ Plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ClusterReport/SingleNode/SingleNodeTab
 * @component SingleNodeTab
 * @description SingleNodeTab
*/
const SingleNodeTab = (props) => {

  // $ init data
  const queryUrlParam = new URLSearchParams(window.location.search);
  const history = useHistory();
  const { setIsIndexPage, isIndexPage } = props
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  // # states
  const [cycle, setCycle] = useState({ key: '15min' });
  const [totalHost, setTotalHost] = useState([]);
  const [useRate, setUseRate] = useState();
  const [gpuInfo, setGpuInfo] = useState();
  const [gpuCount, setGpuCount] = useState('0');
  const [activeInstance, setActiveInstance] = useState(null);

  // - methods
  const getHostname = host => host.split(':', 1)[0];

  const getHostInfo = (activeInstance) => {
    const query = computeDayRange(cycle)
    getTotalHostInfo({
      'match[]': 'node_uname_info',
      ...query
    })
      .then(hostInfo => {
        const getTotaleHost = hostInfo.data.map(host => {
          return (
            {
              key: getHostname(host.instance),
              text: getHostname(host.instance)
            }
          )
        })
        setTotalHost(getTotaleHost)

        if (activeInstance) {
          getUseRate(activeInstance)
          getTotalGpuCount(activeInstance)
          setIsIndexPage({
            index: true,
            host: activeInstance
          })
          setActiveInstance(activeInstance)
        } else {
          const instance = getHostname(hostInfo.data[0].instance)
          getUseRate(instance)
          getTotalGpuCount(instance)
          setIsIndexPage({
            index: true,
            host: instance
          })
        }
      })
      .catch(err => {
        toast.error('Error: ' + err.message)
      })
  }

  const getTotalGpuCount = (hostInstance) => {
    const query = computeDayRange(cycle);
    getHardwareInfo({
      query: `configured_gpu_count{instance=~"${hostInstance}(:[0-9]*)?$"}`,
      time: query.end
    }).then((gpuCountInfo) => {
      const instance = (gpuCountInfo.data.result[0] !== undefined) ? gpuCountInfo.data.result[0].metric.instance : '';
      const gpuCount = (gpuCountInfo.data.result[0] !== undefined) ? gpuCountInfo.data.result[0].value[1] : 0;
      setGpuCount(gpuCount)
      getTotalGpu(instance, gpuCount)
    })
  }

  const getTotalGpu = async(instance, gpuCount) => {
    const query = computeDayRange(cycle);
    const result = [];
    for (let i = 0; i < gpuCount; i++) {
      let [gpu, memory, gpuName, memoryName] = await Promise.all([
        getHardwareInfoRange({
          query: `nvidiasmi_utilization_gpu{instance="${instance}",minor_number="${i}"}`,
          ...query
        }),
        getHardwareInfoRange({
          query: `nvidiasmi_utilization_memory{instance="${instance}",minor_number="${i}"}`,
          ...query
        })
      ])
      gpuName = `GPU Utilization ${!isEmpty(gpu.data.result) && gpu.data.result[0].metric.minor_number}`
      memoryName = `GPU Memory Utilization ${!isEmpty(gpu.data.result) && gpu.data.result[0].metric.minor_number}`
      gpu = !isEmpty(gpu.data.result) && gpu.data.result[0].values.map(value => value.map(parseNormalFormat))
      memory =  !isEmpty(memory.data.result) && memory.data.result[0].values.map(value => value.map(parseNormalFormatGreaterthan0))
      result.push({ gpu, memory, gpuName, memoryName })
    }
    setGpuInfo(result)
  }

  const getUseRate = (hostInstance) => {
    const query = computeDayRange(cycle)
    Promise.all([
      getTotalHostInfo({
        'match[]': 'node_uname_info',
        ...query
      }),
      getHardwareInfoRange({
        query: `100 - (avg by (instance)(irate(node_cpu_seconds_total{mode="idle",instance=~"${hostInstance}(:[0-9]*)?$"}[300s])) * 100)`,
        ...query
      }),
      getHardwareInfoRange({
        query: `node_memory_MemTotal_bytes{instance=~'${hostInstance}(:[0-9]*)?$'} - node_memory_MemFree_bytes - node_memory_Buffers_bytes - node_memory_Cached_bytes`,
        ...query
      }),
      getHardwareInfoRange({
        query: `node_memory_MemFree_bytes{instance=~'${hostInstance}(:[0-9]*)?$'}`,
        ...query
      }),
      getHardwareInfoRange({
        query: `node_memory_Buffers_bytes{instance=~'${hostInstance}(:[0-9]*)?$'} + node_memory_Cached_bytes`,
        ...query
      }),
      getHardwareInfoRange({
        query: `avg(nvidiasmi_utilization_gpu{instance=~"${hostInstance}(:[0-9]*)?$"})`,
        ...query
      }),
      getHardwareInfoRange({
        query: `avg(nvidiasmi_utilization_memory{instance=~"${hostInstance}(:[0-9]*)?$"})`,
        ...query
      }),
      getHardwareInfoRange({
        query: `sum(rate(node_disk_read_bytes_total{instance=~"${hostInstance}(:[0-9]*)?$"}[300s]))`,
        ...query
      }),
      getHardwareInfoRange({
        query: `sum(rate(node_disk_written_bytes_total{instance=~"${hostInstance}(:[0-9]*)?$"}[300s]))`,
        ...query
      }),
      getHardwareInfoRange({
        query: `sum(rate(node_network_receive_bytes_total{instance=~"${hostInstance}(:[0-9]*)?$"}[300s]))`,
        ...query
      }),
      getHardwareInfoRange({
        query: `sum(rate(node_network_transmit_bytes_total{instance=~"${hostInstance}(:[0-9]*)?$"}[300s]))`,
        ...query
      })
    ]).then(([host, cpu, memoryUsed, memoryTotal, memoryBuffer, gpu, gpuMemory, diskRead, diskWritten, networkReceive, networkTransmit]) => {
      cpu = (cpu.data.result[0] !== undefined) ? cpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : [];
      memoryTotal = (memoryTotal.data.result[0] !== undefined) ? memoryTotal.data.result[0].values.map(value => value.map(parseGBFormat)) : [];
      memoryUsed = (memoryUsed.data.result[0] !== undefined) ? memoryUsed.data.result[0].values.map(value => value.map(parseGBFormat)) : [];
      memoryBuffer = (memoryBuffer.data.result[0] !== undefined) ? memoryBuffer.data.result[0].values.map(value => value.map(parseGBFormat)) : [];
      gpu = (gpu.data.result[0] !== undefined) ? gpu.data.result[0].values.map(value => value.map(parseNormalFormat)) : [];
      gpuMemory = (gpuMemory.data.result[0] !== undefined) ? gpuMemory.data.result[0].values.map(value => value.map(parseNormalFormatGreaterthan0)) : [];
      diskRead = (diskRead.data.result[0] !== undefined) ? diskRead.data.result[0].values.map(value => value.map(parseMBFormat)) : [];
      diskWritten = (diskWritten.data.result[0] !== undefined) ? diskWritten.data.result[0].values.map(value => value.map(parseMBFormat)) : [];
      networkReceive = (networkReceive.data.result[0] !== undefined) ? networkReceive.data.result[0].values.map(value => value.map(parseMBFormat)) : [];
      networkTransmit = (networkTransmit.data.result[0] !== undefined) ? networkTransmit.data.result[0].values.map(value => value.map(parseMBFormat)) : [];
      setUseRate({ host, cpu, memoryTotal, memoryUsed, memoryBuffer, gpu, gpuMemory, diskRead, diskWritten, networkReceive, networkTransmit })
    })
  }

  // * hooks
  useEffect(() => {
    const instance = queryUrlParam.get('instance');
    getHostInfo(instance)
  }, [])

  return (
    <div>
      <div>
        <CycleBar
          activeInstance={activeInstance}
          getTotalGpuCount={getTotalGpuCount}
          getUseRate={getUseRate}
          isIndexPage={isIndexPage}
          setActiveInstance={setActiveInstance}
          setCycle={setCycle}
          setIsIndexPage={setIsIndexPage}
          totalHost={totalHost}
        />
      </div>
      <div>
        <PrimaryButton
          children={`${t('Export')}${t('enSpace')}Excel`}
          classes={{
            root: classes.mr_10,
            startIcon: classes.iconClearMarginLeft
          }}
          onClick={() => exportCsv({ gpuInfo, useRate, hostName: isIndexPage.host })}
          startIcon={<Icon>file_download</Icon>}
        />
        <DefaultButton
          children={`${t('view')}${t('enSpace')}${t('Jobs')}`}
          classes={{
            root: classes.mr_10,
            startIcon: classes.iconClearMarginLeft
          }}
          onClick={() => {
            setIsIndexPage({
              index: false,
              host: isIndexPage.host
            })
            if (activeInstance) {
              history.push({ search: `?tab=singleNode&instance=${activeInstance}` })
            }
          }}
          startIcon={<Icon>visibility</Icon>}
        />
        <DefaultButton
          children={t('refresh')}
          onClick={() => {
            getUseRate(isIndexPage.host)
            getTotalGpuCount(isIndexPage.host)
          }}
          startIcon={<Refresh />}
        />
      </div>
      {
        gpuInfo && gpuInfo[0] && gpuInfo[0].gpu &&
        <div>
          <BasePanel
            style={{ paddingTop: 20 }}
            title={`${t('GPU')}${t('enSpace')}${t('info')}`}
          >
            <GpuInfo
              data={gpuInfo}
              gpuCount={gpuCount}
            />
          </BasePanel>
        </div>
      }
      <div className={`${classes.pt_20}`}>
        <BasePanel
          className={`${classes.pt_20}`}
          title={t('Utilization')}
        >
          <UseRate
            data={useRate}
          />
        </BasePanel>
      </div>
    </div>
  );
};

SingleNodeTab.propTypes = {
  setIsIndexPage: PropTypes.func,
  isIndexPage: PropTypes.object
}

export default SingleNodeTab;
