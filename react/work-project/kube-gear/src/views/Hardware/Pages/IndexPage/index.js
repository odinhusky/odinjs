import React, { useState, useEffect } from 'react';

// # API
import { getHardwareInfo, getHardwareInfoRange, getNodeState, shutdownNode, rebootNode } from 'utils/api';

// % context
import Context from './Context';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import Header from 'components/Header';
import { DefaultButton, IconButton } from 'components/BaseButton';
import BaseLink from 'components/BaseLink';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import ConfirmModal from 'components/ConfirmModal';
import Ordering from './Ordering';
import { MB } from 'constant';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  formControl: {
    minWidth: 120,
    maxWidth: 150,
    fullWidth: true,
    '& .Mui-focused':{
      top: 0
    }
  },
  selectIcon: {
    top: '25%'
  },
  labelChange: {
    top: -10
  },
  labelChangeHasValue: {
    top: 0
  }
}))

/**
 * @author odin
 * @level views/Hardware/Pages/IndexPage
 * @component Hardware
 * @description Hardware component
*/
export default function Hardware() {

  // $ init data
  const { t } = useTranslation();

  const defaultInfo = {
    hardwareList: [],
    loadData: {},
    currentEpochTimeInSeconds: ''
  };

  // = styles
  const classes = useStyles();

  // # states
  const [hardwareInfo, setHardwareInfo] = useState(defaultInfo);
  const [filterIpAddress, setFilterIpAddress] = useState('');
  const [filterHarewareInfoList, setFilterHardwareInfoList] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [isLoadDataGet, setIsLoadDataGet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [modalData, setModalData] = useState({});

  // -methods
  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column));
      }
    }
    return column;
  }

  function toPercent(point) {
    const number = Number(point);
    return isNaN(number) ? 'N/A' : number.toFixed(0) + '%';
  }

  function circleStyle(point) {
    const percent = Number(point).toFixed(2);
    if (percent < 60) {
      return { color: 'hsl(120, 100%, 40%)', display: 'flex', alignItems: 'center' };
    } else if (percent >= 60 && percent < 80) {
      return { color: 'hsl(35, 100%, 50%)', display: 'flex', alignItems: 'center' };
    } else if (percent >= 80) {
      return { color: 'hsl(0, 100%, 45%)', display: 'flex', alignItems: 'center' };
    }
    return { display: 'none', backgroundColor: '#A19F9D' };
  }

  const loadCpuUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    const metricGranularity = window.ENV.promScrapeTime;
    getHardwareInfoRange({
      query: `100 - (avg by (instance)(irate(node_cpu_seconds_total{mode="idle"}[${metricGranularity}])) * 100)`,
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(data => {
        setHardwareInfo(defaultInfo => {
          const result = data.data.result;
          defaultInfo.hardwareList.forEach(hostInfo => {
            const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
            hostInfo.cpuPercentage = promData ? promData.values[0][1] : 'N/A';
          });
          return { ...defaultInfo };
        });
      })
      .catch(err => toast.error(err.error));
  };

  const loadMemUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    getHardwareInfoRange({
      query: 'node_memory_MemTotal_bytes+-+node_memory_MemFree_bytes+-+node_memory_Buffers_bytes+-+node_memory_Cached_bytes',
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(dataOfMemUsed => {
        const dictOfMemUsed = {};
        const result = dataOfMemUsed.data.result;
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          dictOfMemUsed[item.metric.instance] = item.values[0][1];
        }

        getHardwareInfoRange({
          query: 'node_memory_MemTotal_bytes',
          start: currentEpochTimeInSeconds,
          end: currentEpochTimeInSeconds,
          step: '1'
        }).then(dataOfMemTotal => {
          setHardwareInfo(defaultInfo => {
            const result = dataOfMemTotal.data.result;
            defaultInfo.hardwareList.forEach(hostInfo => {
              const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
              hostInfo.cpuMemoPercentage = promData ? dictOfMemUsed[promData.metric.instance] / promData.values[0][1] * 100 : 'N/A';
            });
            return { ...defaultInfo };
          });
        }).catch(err => toast.error(err.error));
      });
  };

  const loadGpuUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    getHardwareInfoRange({
      query: 'avg by (instance)(gpu_utilization)',
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(data => {
        setHardwareInfo(defaultInfo => {
          const result = data.data.result;
          defaultInfo.hardwareList.forEach(hostInfo => {
            const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
            hostInfo.gpuMemoPercentage = promData ? promData.values[0][1] : 'N/A';
          });
          return { ...defaultInfo };
        });
      })
      .catch(() => toast.error('Error when loading GPU utilization data.'));
  };

  const loadGpuMemUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    getHardwareInfoRange({
      query: 'avg by (instance)(gpu_mem_utilization)',
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(data => {
        setHardwareInfo(defaultInfo => {
          const result = data.data.result;
          defaultInfo.hardwareList.forEach(hostInfo => {
            const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
            hostInfo.gpuMemoUsedPercentage = promData ? promData.values[0][1] : 'N/A';
          });
          return { ...defaultInfo };
        });
      })
      .catch(() => toast.error('读取GPU內存使用相关资料错误'));
  };

  const loadDiskUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    const metricGranularity = window.ENV.promScrapeTime;
    getHardwareInfoRange({
      query: `sum by (instance)(rate(node_disk_read_bytes_total[${metricGranularity}]))`,
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(dataOfDiskBytesRead => {
        const dictOfDiskBytesRead = {};
        const result = dataOfDiskBytesRead.data.result;
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          dictOfDiskBytesRead[item.metric.instance] = item.values[0][1];
        }

        getHardwareInfoRange({
          query: `sum by (instance)(rate(node_disk_written_bytes_total[${metricGranularity}]))`,
          start: currentEpochTimeInSeconds,
          end: currentEpochTimeInSeconds,
          step: '1'
        })
          .then(dataOfDiskBytesWritten => {
            setHardwareInfo(defaultInfo => {
              const result = dataOfDiskBytesWritten.data.result;
              defaultInfo.hardwareList.forEach(hostInfo => {
                const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
                if (promData) {
                  const diskBytesRead = dictOfDiskBytesRead[promData.metric.instance];
                  const diskBytesWritten = promData.values[0][1];
                  const p1 = Math.min(1, diskBytesRead / MB / 500) * 100;
                  const p2 = Math.min(1, diskBytesWritten / MB / 500) * 100;
                  hostInfo.diskPercentage = Math.max(p1, p2);
                } else {
                  hostInfo.diskPercentage = 'N/A';
                }
              });
              return { ...defaultInfo };
            });
          })
          .catch(err => toast.error(err));
      })
      .catch(err => toast.error(err));
  };

  const loadEthUtilData = (
    currentEpochTimeInSeconds,
  ) => {
    const metricGranularity = window.ENV.promScrapeTime;
    getHardwareInfoRange({
      query: `sum by (instance)(rate(node_network_receive_bytes_total[${metricGranularity}]))`,
      start: currentEpochTimeInSeconds,
      end: currentEpochTimeInSeconds,
      step: '1'
    })
      .then(dataOfEthBytesRecieved =>{
        const dictOfEthBytesRecieved = {};
        const result = dataOfEthBytesRecieved.data.result;
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          dictOfEthBytesRecieved[item.metric.instance] = item.values[0][1];
        }

        getHardwareInfoRange({
          query: `sum by (instance)(rate(node_disk_written_bytes_total[${metricGranularity}]))`,
          start: currentEpochTimeInSeconds,
          end: currentEpochTimeInSeconds,
          step: '1'
        })
          .then(dataOfEthBytesSent => {
            setHardwareInfo(defaultInfo => {
              const result = dataOfEthBytesSent.data.result;
              defaultInfo.hardwareList.forEach(hostInfo => {
                const promData = result.find(item => hostInfo.ipAddress === getHostname(item.metric.instance));
                if (promData) {
                  const ethBytesReceived = dictOfEthBytesRecieved[promData.metric.instance];
                  const ethBytesSent = promData.values[0][1];
                  const p1 = Math.min(1, ethBytesReceived / MB / 100) * 100;
                  const p2 = Math.min(1, ethBytesSent / MB / 100) * 100;
                  hostInfo.ethPercentage = Math.max(p1, p2);
                } else {
                  hostInfo.ethPercentage = 'N/A';
                }
              });
              return { ...defaultInfo };
            });
          })
          .catch(err => toast.error(err.error));
      })
      .catch(err => toast.error(err.error));
  };

  const getHostname = host => host.split(':', 1)[0];

  const loadData = () => {
    const currentEpochTimeInSeconds = new Date().getTime() / 1000;
    setIsLoading(true)

    Promise.all([
      getHardwareInfo({
        query: 'node_uname_info',
        time: currentEpochTimeInSeconds
      }),
      getNodeState()
    ])
      .then(([hardware, nodeList]) => {
        setHardwareInfo(defaultInfos => {
          defaultInfos.loadData = hardware;
          defaultInfo.currentEpochTimeInSeconds = currentEpochTimeInSeconds;
          const instanceList = [];
          hardware.data.result.forEach(item => {
            const obj = {};
            obj.ipAddress = getHostname(item.metric.instance);
            obj.nodename = item.metric.nodename;
            instanceList.push(obj);
          })

          const adjustNodeList = nodeList.items.map(item => {
            const { status } = item;
            const { addresses, conditions } = status;
            return {
              InternalIP: addresses.find(item => item.type === 'InternalIP').address,
              Hostname: addresses.find(item => item.type === 'Hostname').address,
              status: conditions.find(item => item.type === 'Ready').status === 'True' ? 'RUNNING' : 'offline'
            }
          })

          const newList = instanceList.map(node => {
            const find = adjustNodeList.find(item => item.InternalIP === node.ipAddress)
            return { ...node, state: find && find.state ? find.state : 'RUNNING' }
          })

          adjustNodeList.forEach(item => {
            const find = instanceList.find(node => item.InternalIP === node.ipAddress)
            if (!find) newList.push({
              ipAddress: item.InternalIP,
              nodename: '',
              state: 'offline'
            })
          })

          defaultInfo.hardwareList = newList;
          return { ...defaultInfos };
        });

        setIsLoadDataGet(true);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.statusText))
      .finally(() => setIsLoading(false))
  };

  /**
   * @author odin
   * @description Reload all data
  */
  const reloadData = () => {
    setIsLoadDataGet(false);
    loadData();
  }

  // * hook
  /**
   * @author odin
   * @description ComponentDidMount ComponentDidUpdate
  */
  useEffect(loadData, []);

  /**
   * @author odin
   * @description Watch isLoadDataGet(state) to get API data
  */
  useEffect(() => {
    if (isLoadDataGet) {
      const currentEpochTimeInSeconds = hardwareInfo.currentEpochTimeInSeconds;
      loadCpuUtilData(
        currentEpochTimeInSeconds,
      );
      loadMemUtilData(
        currentEpochTimeInSeconds,
      );
      loadGpuUtilData(
        currentEpochTimeInSeconds,
      );
      loadGpuMemUtilData(
        currentEpochTimeInSeconds,
      );
      loadDiskUtilData(
        currentEpochTimeInSeconds,
      );
      loadEthUtilData(
        currentEpochTimeInSeconds,
      );
      setIsLoadDataGet(false);
    }
  }, [isLoadDataGet]);

  /**
   * @author odin
   * @description Watch filterIpAddress(state) and hardwareInfo(state) to filter data contains [filterIpAddress]
  */
  useEffect(
    () => {
      setFilterHardwareInfoList(() => {
        return filterIpAddress ? hardwareInfo.hardwareList.filter(info => info.ipAddress.includes(filterIpAddress))
          : hardwareInfo.hardwareList
      });
    },
    [filterIpAddress, hardwareInfo]
  );

  // ? context
  const context = {
    hardwareInfo,
    filterHarewareInfoList,
    ordering,
    setOrdering,
    isLoading,
    reloadData
  };

  // & handled data
  const columns = [
    // IP
    applySortProps({
      id: 'address',
      key: 'address',
      label: 'IP',
      onTableCellRender: HardwareInfoList => {
        return (
          HardwareInfoList.ipAddress !== undefined
            ?
            <BaseLink to={`/cluster-report?tab=singleNode&instance=${HardwareInfoList.ipAddress}`}>
              {HardwareInfoList.ipAddress}
            </BaseLink>
            :
            <CircularProgress />
        );
      }
    }),
    // 機器名稱
    applySortProps({
      id: 'nodename',
      key: 'nodename',
      label: `${t('machine')}${t('enSpace')}${t('name')}`,
      onTableCellRender: HardwareInfoList => {
        return (
          HardwareInfoList.nodename !== undefined
            ? <div>{HardwareInfoList.nodename}</div>
            : <CircularProgress />
        );
      }
    }),
    // CPU
    applySortProps({
      id: 'cpuPercentage',
      key: 'cpuPercentage',
      label: t('CPU'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.cpuPercentage);
        const style = circleStyle(HardwareInfoList.cpuPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.cpuPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
              &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // 記憶體
    applySortProps({
      id: 'cpuMemoPercentage',
      key: 'cpuMemoPercentage',
      label: t('memory'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.cpuMemoPercentage);
        const style = circleStyle(HardwareInfoList.cpuMemoPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.cpuMemoPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
                  &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // GPU
    applySortProps({
      id: 'storageUsed',
      key: 'storageUsed',
      label: t('VGA'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.gpuMemoPercentage);
        const style = circleStyle(HardwareInfoList.gpuMemoPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.gpuMemoPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
                  &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // GPU 記憶體
    applySortProps({
      id: 'storageTotal',
      key: 'storageTotal',
      label: t('VGAMemory'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.gpuMemoUsedPercentage);
        const style = circleStyle(HardwareInfoList.gpuMemoUsedPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.gpuMemoUsedPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
                  &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // 硬碟
    applySortProps({
      id: 'diskPercentage',
      key: 'diskPercentage',
      label: t('disk'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.diskPercentage);
        const style = circleStyle(HardwareInfoList.diskPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.diskPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
                  &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // 乙太網
    applySortProps({
      id: 'ethPercentage',
      key: 'ethPercentage',
      label: t('ethernet'),
      onTableCellRender: HardwareInfoList => {
        const percent = toPercent(HardwareInfoList.ethPercentage);
        const style = circleStyle(HardwareInfoList.ethPercentage);
        const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

        if (HardwareInfoList.state !== 'RUNNING')
          return (<div styles={{ root: { color: '#8A8886' } }}>N/A</div>)

        return (
          HardwareInfoList.ethPercentage !== undefined
            ?
            <div
              className={`${classes.flex_align_center}`}
            >
              <Icon style={style}>circle</Icon>
                  &nbsp;
              <div styles={labelStyle}>
                {percent}
              </div>
            </div>
            : <CircularProgress />
        );
      }
    }),
    // 狀態
    applySortProps({
      id: 'state',
      key: 'state',
      label: t('status'),
      onTableCellRender: info => {
        const isRunning = info.state === 'RUNNING'
        return (
          <BaseStatusBadge
            maxW={85}
            status={isRunning ? 'success' : 'gray'}
          >
            {isRunning ? t('online') : t('offline')}
          </BaseStatusBadge>
        );
      }
    }),
    // 操作
    {
      id: 'nodeImage',
      key: 'nodeImage',
      label: t('nodeImage'),
      onTableCellRender: data => {
        const { ipAddress } = data;
        return (
          <BaseLink
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0' }}
            to={`/cluster-view/hardware/image/?ip=${ipAddress}`}
          >
            <IconButton
              children={<Icon>view_in_ar</Icon>}
            />
          </BaseLink>
        )
      }
    },
    {
      id: 'reboot',
      key: 'reboot',
      label: t('reboot'),
      onTableCellRender: data => {
        return (
          <IconButton
            children={<Icon>repeat</Icon>}
            onClick={() => {
              setModalData({
                title: t('reboot'),
                confrimText: t('reboot'),
                content: t('sureRebootNode', { name: data.ipAddress }),
                method: () => {
                  rebootNode({
                    ip: data.ipAddress
                  })
                    .then(() => {
                      toast.success('Success')
                      reloadData();
                    })
                    .catch(err => {
                      const msg = err.data ? err.data.message : err.toString();
                      toast.error(msg);
                    })
                }
              })
              setIsConfirmModalShow(true)
            }}
          />
        )
      }
    },
    {
      id: 'shutdown',
      key: 'shutdown',
      label: t('shutdown'),
      onTableCellRender: data => {
        const { state } = data;
        return (
          <IconButton
            children={<Icon>power_settings_new</Icon>}
            disabled={state !== 'RUNNING'}
            onClick={() => {
              setModalData({
                title: t('shutdown'),
                confrimText: t('shutdown'),
                content: t('sureShutdownNode', { name: data.ipAddress }),
                method: () => {
                  shutdownNode({
                    ip: data.ipAddress
                  })
                    .then(() => {
                      toast.success('Success')
                      reloadData();
                    })
                    .catch(err => {
                      const msg = err.data ? err.data.message : err.toString();
                      toast.error(msg);
                    })
                }
              })
              setIsConfirmModalShow(true)
            }}
          />
        )
      }
    }
  ]

  return (
    <Context.Provider value={context}>
      <Header
        headerPath={[
          {
            title: t('routeName.hardware'),
            link: 'hardware'
          }
        ]}
      />
      <div
        className={`
        ${classes.d_flex} ${classes.justify_between} ${classes.alignItems} ${classes.mb_16}`}
      >
        {/* 左邊 */}
        <DefaultButton
          children={t('refresh')}
          disabled={isLoading}
          onClick={reloadData}
          startIcon={<Refresh />}
        />

        {/* 右方 */}
        <div className={`${classes.d_flex}`}>
          {/* Icons */}
          <div
            className={`${classes.flex_align_center} ${classes.justify_around} ${classes.mr_10}`}
          >
            <Icon style={{ color: 'hsl(120, 100%, 40%)', marginRight: 8 }}>circle</Icon>
            <span>0% - 59%</span>

            <span style={{ margin: '0 10px' }}>|</span>

            <Icon style={{ color: 'hsl(35, 100%, 50%)', marginRight: 8 }}>circle</Icon>
            <span>60% - 79%</span>

            <span style={{ margin: '0 10px' }}>|</span>

            <Icon style={{ color: 'hsl(0, 100%, 45%)', marginRight: 8 }}>circle</Icon>
            <span>80% - 100%</span>
          </div>

          {/* 搜尋IP */}
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto} ${classes.ml_20}` }}
            onInputChange={(e, value) => setFilterIpAddress(value)}
            placeholder={`${t('search')} IP`}
            value={filterIpAddress}
          />
        </div>
      </div>

      {/* 表單 */}
      <BasePaper
        columns={columns}
        labelRowsPerPage={t('labelRowsPerPage')}
        ordering={ordering}
        page={page}
        rows={ordering.apply(filterHarewareInfoList)}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />

      {/* Modal */}
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
    </Context.Provider>
  );
}
