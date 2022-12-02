/* eslint-disable react/no-multi-comp */
import React, {
  useState,
  useContext
} from 'react';

// # API
import { getContainerLog } from 'utils/api'

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import JobDetailContext from '../../../JobDetailContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton, SplitButton } from 'components/BaseButton';
import MonacoPanel from './MonacoPanel';
import RepoUploadModal from './RepoUploadModal';
import SshModal from './SshModal';
import { BaseTooltip } from 'components/BaseTooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BaseMuiIcon from 'components/BaseMuiIcon';

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNil } from 'lodash';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @author elvis
 * @level views/JobDetail/Page/DetailPage/TaskRole/TaskList
 * @component TaskList
 * @description TaskList content
*/
const TaskRoleList = ({
  data,
  jobInfo,
  taskRoleName,
  gpu
}) => {
  // $ init data
  const { t } = useTranslation();

  // ? context
  const { locale } = useContext(GlobalContext);

  // # states
  const [monacoProps, setMonacoProps] = useState(null);
  const [monacoFooterButton, setMonacoFooterButton] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
  // const [logUrl, setLogUrl] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal switch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSshModalOpen, setIsSshModalOpen] = useState(false);
  const [containerItem, setContainerItem] = useState({
    containerIp: '192.168.0.103',
    containerPorts: '36309'
  });


  // = styles
  const { classes } = useContext(JobDetailContext);

  // - methods
  const onDismiss = () => {
    setMonacoProps(null);
    setModalTitle('');
    setMonacoFooterButton(null);
  }

  /**
   * @author odin
   * @param {boolean} ssh -- Icon 的類型
   * @param {number} idx -- item index
   * @description 組出要顯示的 網頁 SSH 按鈕
   * @returns {node}
  */
  const getWebSsh = (ssh, idx) => {
    if (!ssh) {
      return (
        <DefaultButton
          children={`${t('openWeb')} SSH`}
          classes={{ root: classes.mr_10 }}
          component={'a'}
          disabled
          iconProps={{ iconName: 'CommandPrompt' }}
          startIcon={<FontAwesomeIcon icon={'terminal'} />}
        />
      );
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const buttonHref = `/term?user=${urlParams.get('username')}&job=${urlParams.get('jobName')}&taskRole=${taskRoleName}&taskRoleIndex=${idx}`;
      return (
        <DefaultButton
          children={`${t('openWeb')} SSH`}
          classes={{ root: classes.mr_10 }}
          component={'a'}
          href={buttonHref}
          startIcon={<FontAwesomeIcon icon={'terminal'} />}
          target="_blank"
        />
      );
    }
  }

  const logAutoRefresh = (url) => {
    getContainerLog(url)
      .then((data) => {
        setMonacoProps({
          value: data
        })
        // setMonacoFooterButton(
        //   <PrimaryButton
        //     children={t('checkFullLog')}
        //     href={data.fullLogLink}
        //     target="_blank"
        //   />
        // )
      })
      .catch(() => {
        setMonacoProps({ value: t('noContent') })
      });
  }

  const showContainerLog = async (url, title) => {
    setModalTitle(title);
    setMonacoProps({
      value: 'Loading...'
    })
    try {
      // const statusList = await getContainerLogUrlBeforeShow(url)
      // const findUriByType = statusList['locations'].find(item => item.name === type)
      logAutoRefresh(`${url}`);
    } catch (err) {
      const msg = err.data ? err.data.message : err.toString();
      toast.error(msg);
    }
  }

  // const showSshInfo = (id, containerIp, containerPorts) => {
  //   setModalTitle(`${t('useSSHConnectContainer')} ${id}`);
  //   const res = [];
  //   res.push('You can connect to this container by one of the following commands if SSH is set up properly: ')
  //   res.push('')
  //   res.push(`# ${t('step')}1 Use your default SSH private key: `);
  //   res.push('')
  //   res.push(`ssh -p ${containerPorts?.ssh} root@${containerIp}`)
  //   res.push('')
  //   res.push(`# ${t('step')}2 Use a pre-downloaded SSH private key:`);
  //   res.push('')
  //   res.push('On Windows:')
  //   res.push(`ssh -p ${containerPorts?.ssh} -i <your-private-key-file-path> root@${containerIp}`)
  //   res.push('')
  //   res.push('On Unix-like System: ')
  //   res.push(`chmod 400 <your-private-key-file-path> && ssh -p root@${containerIp} -i <your-private-key-file-path> ${containerPorts?.ssh}`)
  //   res.push('')
  //   res.push('')
  //   res.push('If you are using a different username in your docker, please change "root" to your pre-defined username.')
  //   setMonacoProps({
  //     value: res.join('\n'),
  //     options: {
  //       wordWrap: 'off',
  //       readOnly: true
  //     }
  //   })
  // }

  return (
    <>
      <BasePaper
        columns={[
          {
            id: 'number',
            key: 'number',
            label: t('number'),
            onTableCellRender: (item) => item.taskIndex
          },
          {
            id: 'container',
            key: 'container',
            label: `${t('container')}${t('enSpace')}${t('name')}`,
            onTableCellRender: item => item.containerId
          },
          {
            id: 'ip',
            key: 'ip',
            label: `IP${t('enSpace')}${t('address')}`,
            onTableCellRender: item => item.containerIp
          },
          {
            id: 'ports',
            key: 'ports',
            label: t('port'),
            onTableCellRender: item => {
              const ports = item.containerPorts;

              // 新建一個 PortTable Component ===========
              const PortTable = ({ columns, data }) => {
                return (
                  <div
                    className={`
                    ${classes.d_flex}
                    ${classes.directionColumn}
                    ${classes.p_10}
                  `}
                  >
                    <div
                      className={`
                      ${classes.d_flex}
                      ${classes.justify_around}
                      ${classes.mb_10}
                    `}
                    >
                      {columns.map(item => (
                        <div
                          className={`${classes.minW_80} ${classes.w_full} ${classes.px_8}`}
                          key={item.id}
                          style={{ width: 100 }}
                        >{item.label}</div>
                      ))}
                    </div>
                    {Object.entries(data).map(([name, port], index, arr) => {
                      const isLast = index + 1 === arr.length;
                      return (
                        <div
                          className={`
                            ${classes.d_flex}
                            ${classes.justify_around}
                            ${!isLast && classes.mb_10}
                          `}
                        >
                          <div className={`${classes.minW_80} ${classes.w_full} ${classes.px_8}`}>{name}</div>
                          <div className={`${classes.minW_80} ${classes.w_full} ${classes.px_8}`}>{port}</div>
                        </div>
                      );
                    })}
                  </div>
                )
              }

              PortTable.propTypes = {
                data: PropTypes.object,
                columns: PropTypes.array
              };
              // PortTable Component End ===========

              return (
                !isNil(ports) &&
                <BaseTooltip
                  // open={1} // 檢查用
                  title={
                    <PortTable
                      columns={[
                        {
                          id: 'name',
                          label: t('name')
                        },
                        {
                          id: 'port',
                          label: t('port')
                        }
                      ]}
                      data={ports}
                    />
                  }
                >
                  <div
                    className={`
                    ${classes.maxW_200px}
                    ${classes.cursorHelp}
                    ${classes.overflowHidden}
                    ${classes.whiteSpaceNowrap}
                    ${classes.whiteSpaceNowrap}
                    ${classes.textOverflowEllipsis}
                  `}
                  >
                    {Object.keys(ports).map((key) => (`${key}:${ports[key]}`)).join(' ')}
                  </div>
                </BaseTooltip>
              );
            }
          },
          {
            id: 'gpu',
            key: 'gpu',
            label: t('GPU'),
            onTableCellRender: () => (gpu)
          },
          {
            id: 'info',
            key: 'info',
            label: (
              <div className={`${classes.d_flex}`}>
                {t('Operations')}
                <BaseTooltip
                  arrow
                  className={`${classes.flex_align_center}`}
                  title={
                    <>
                      <p>{t('packageContainerDes')}</p>
                      <p>{t('vncDes')}</p>
                      <p>{t('jupyterDes')}</p>
                      <p>{t('tensorboardDes')}</p>
                    </>
                  }
                >
                  <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
                </BaseTooltip>
              </div>
            ),
            onTableCellRender: (item) => {
              const { containerIp, containerId, containerPorts, containerPortsTest,  containerLog, taskIndex } = item;
              const { ssh } = containerPortsTest
              const jobState = jobInfo.jobStatus.state;

              return (
                <div className={`${classes.d_flex}`}>
                  {/* Our elegant web ssh*/}
                  {getWebSsh(ssh, taskIndex)}
                  <SplitButton
                    ButtonGroupProps={{
                      classes: { root: classes.mr_10 }
                    }}
                    disabled={jobState !== 'RUNNING'}
                    onClick={() => {
                      if (jobState !== 'RUNNING') return;

                      setCurrentRoleIdx(taskIndex);
                      setIsModalOpen(true);
                    }}
                    options={[
                      {
                        id: 'vnc_http',
                        key: 'vnc_http',
                        label: t('vnc'),
                        icon: <Icon style={{ display: 'flex', justifyContent: 'space-around', margin: '0 4px' }}>desktop_windows</Icon>,
                        component: 'a',
                        target: '_blank',
                        linkButton: true,
                        disabled: jobState !== 'STOPPED'
                          ? containerPorts ? (containerPorts.vnc_http ? false : true) : true
                          : true,
                        href: containerPorts ? `http://${containerIp}:${containerPorts.vnc_http}/vnc.html` : ''
                      },
                      {
                        id: 'jupyter_http',
                        key: 'jupyter_http',
                        label: `${t('jupyterHttp')}(v1)`,
                        target: '_blank',
                        component: 'a',
                        icon:
                        <img
                          className={`${classes.splitButtonOptionImg}`}
                          src="/assets/img/icons/Jupyter.svg"
                        />,
                        disabled: jobState !== 'STOPPED'
                          ? containerPorts ? (containerPorts.jupyter_http ? false : true) : true
                          : true,
                        href: containerPorts ? `http://${containerIp}:${containerPorts.jupyter_http}/` : ''
                      },
                      {
                        id: 'jupyter_lab_http',
                        key: 'jupyter_lab_http',
                        label: `${t('jupyterHttp')}(v2)`,
                        target: '_blank',
                        icon:
                        <img
                          className={`${classes.splitButtonOptionImg}`}
                          src="/assets/img/icons/Jupyter_lab.jpg"
                        />,
                        component: 'a',
                        disabled: jobState !== 'STOPPED'
                          ? containerPorts ? (containerPorts.jupyter_lab_http ? false : true) : true
                          : true,
                        href: containerPorts ? `http://${containerIp}:${containerPorts.jupyter_lab_http}/lab` : ''
                      },
                      {
                        id: 'tensorboard_http',
                        key: 'tensorboard_http',
                        label: 'Tensorboard',
                        iconProps: { iconName: 'Link', styles: { root: { color: '#333333' } } },
                        target: '_blank',
                        icon:
                        <img
                          src="/assets/img/icons/Tensorflow.svg"
                          style={{ width: 14, margin: '0 4px' }}
                        />,
                        component: 'a',
                        disabled: jobState !== 'STOPPED'
                          ? containerPorts ? (containerPorts.tensorboard_http ? false : true) : true
                          : true,
                        href: containerPorts ? `http://${containerIp}:${containerPorts.tensorboard_http}/` : ''
                      }
                    ]}
                    startIcon={<Icon>upload</Icon>}
                    text={`${t('encapsulateImageButtonText')}`}
                  />
                  <SplitButton
                    classNameObj={locale === 'en' ? { menuPaper: classes.splitButton } : {}}
                    disabled={isNil(containerId)}
                    onClick={() => {
                      if (isNil(containerId)) return
                      showContainerLog(
                        `${containerLog}/stdout?tail-mode=false`,
                        `${t('standard')}${t('enSpace')}${t('output')} (${t('lastWord', { num: '4096' })})`
                      )
                    }}
                    options={[
                      {
                        id: 'standardError',
                        key: 'standardError',
                        label: `${t('standard')}${t('enSpace')}${t('error')}`,
                        icon: <BaseMuiIcon>report</BaseMuiIcon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/stderr?tail-mode=false`,
                            `${t('standard')}${t('enSpace')}${t('error')} (${t('lastWord', { num: '4096' })})`
                          )
                        }
                      },
                      {
                        id: 'runtimelog',
                        key: 'runtimelog',
                        label: `${t('duration')}${t('enSpace')}${t('log')}`,
                        icon: <Icon>donut_large</Icon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/runtime.log?tail-mode=false`,
                            `${t('duration')}${t('enSpace')}${t('log')}`
                          )
                        }
                      },
                      {
                        id: 'initlog',
                        key: 'initlog',
                        label: `${t('init')}${t('enSpace')}${t('log')}`,
                        icon: <BaseMuiIcon>text_snippet</BaseMuiIcon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/init.log?tail-mode=false`,
                            `${t('init')}${t('enSpace')}${t('log')}`
                          )
                        }
                      },
                      {
                        id: 'terminationlog',
                        key: 'terminationlog',
                        label: `${t('termination')}${t('enSpace')}${t('log')}`,
                        icon: <BaseMuiIcon>text_snippet</BaseMuiIcon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/pai-termination-log?tail-mode=false`,
                            `${t('termination')}${t('enSpace')}${t('log')}`
                          )
                        }
                      },
                      {
                        id: 'barrierlog',
                        key: 'barrierlog',
                        label: `${t('barrier')}${t('enSpace')}${t('log')}`,
                        icon: <BaseMuiIcon>text_snippet</BaseMuiIcon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/barrier.log?tail-mode=false`,
                            `${t('barrier')}${t('enSpace')}${t('log')}`
                          )
                        }
                      },
                      {
                        id: 'alluser',
                        key: 'alluser',
                        label: `${t('standard')}${t('enSpace')}${t('output')} / ${t('error')}`,
                        icon: <BaseMuiIcon>text_snippet</BaseMuiIcon>,
                        handleItemclick: () => {
                          showContainerLog(
                            `${containerLog}/all?tail-mode=false`,
                            `${t('standard')}${t('enSpace')}${t('output')} / ${t('error')} `
                          )
                        }
                      },
                      {
                        id: 'sshInfo',
                        key: 'sshInfo',
                        label: 'SSH',
                        icon: <Icon>open_in_browser</Icon>,
                        target: '_blank',
                        disabled: jobState !== 'RUNNING',
                        handleItemclick: () => {
                          const { containerIp, containerPorts: containerPortsObj } = item
                          const { ssh } = containerPortsObj
                          const data = {
                            containerIp,
                            containerPorts: ssh
                          }

                          setContainerItem(prev => ({
                            ...prev,
                            ...data
                          }))
                          setIsSshModalOpen(true)
                        }
                      }
                    ]}
                    startIcon={<BaseMuiIcon>text_snippet</BaseMuiIcon>}
                    text={`${t('standard')}${t('enSpace')}${t('output')}`}
                  />
                </div>
              );
            }
          }
        ]}
        labelRowsPerPage={t('labelRowsPerPage')}
        page={page}
        PaperStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        rows={data}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
      <MonacoPanel
        footerPrimaryButton={monacoFooterButton}
        isOpen={!isNil(monacoProps)}
        monacoProps={monacoProps}
        onDismiss={onDismiss}
        title={modalTitle}
      />
      {
        isModalOpen &&
        <RepoUploadModal
          isOpen={isModalOpen}
          jobInfo={jobInfo}
          onClose={() => setIsModalOpen(false)}
          taskRoleIndex={currentRoleIdx}
          taskRoleName={taskRoleName}
        />
      }

      {
        isSshModalOpen &&
        <SshModal
          containerItem={containerItem}
          isOpen={isSshModalOpen}
          jobInfo={jobInfo}
          onClose={() => setIsSshModalOpen(false)}
          taskRoleIndex={currentRoleIdx}
          taskRoleName={taskRoleName}
        />
      }
    </>
  );
};

TaskRoleList.propTypes = {
  data: PropTypes.array,
  jobInfo: PropTypes.object,
  sshInfo: PropTypes.object,
  taskRoleName: PropTypes.string,
  gpu: PropTypes.number
};

export default TaskRoleList;