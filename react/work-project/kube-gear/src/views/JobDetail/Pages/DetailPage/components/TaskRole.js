/* eslint-disable react/no-multi-comp */
import React, {
  useState
} from 'react';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// ? Self-packed Components || Functions
import MonacoCallout from './MonacoCallout';
import { IconButton } from 'components/BaseButton';
import TaskRoleList from './TaskRoleList';

// ? styles
import styles from './TaskRole.module.scss';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author elvis
 * @level views/JobDetail/Page/DetailPage/TaskRole
 * @component TaskRole
 * @description TaskRole content
*/
const TaskRole = ({
  key,
  data,
  taskConfig,
  jobInfo
}) => {

  // $ init data
  const { t } = useTranslation();

  // # states
  const [isExpand, setIsExpand] = useState(true);

  // - methods
  const renderTaskRoleCount = () => {
    const count = {
      running: 0,
      succeeded: 0,
      failed: 0,
      unknown: 0
    };
    if (data && data.taskStatuses) {
      for (const item of data.taskStatuses) {
        switch (item.taskState) {
          case 'RUNNING':
          case 'WAITING':
            count.running += 1;
            break;
          case 'SUCCEEDED':
            count.succeeded += 1;
            break;
          case 'FAILED':
            count.failed += 1;
            break;
          default:
            count.unknown += 1;
            break;
        }
      }
    } else if (taskConfig && taskConfig.taskNumber) {
      count.unknown = taskConfig.taskNumber;
    } else {
      // task status info not available
      return;
    }

    return (
      <div className={styles.count}>
        {t('task')}{t('enSpace')}{t('instance')}
        {Object.keys(count).filter(x => count[x] > 0).map(x => (
          <div key={x}>
            {/* <div className={c(t.br100, t.h1, t.w1)} style={{ backgroundColor: statusColorMapping[x] }}>
            </div> */}
            <div>{count[x]}</div>
          </div>
        ))}
      </div>
    );
  }

  const countGpuFromTaskConfig = (taskConfig) => {
    if (taskConfig === null) return 0
    const { instances, resourcePerInstance } = taskConfig
    const { gpu } = resourcePerInstance
    return instances * gpu
  }

  return (
    <div
      className={styles.container}
      key={key}
    >
      <div className={styles.header}>
        <span>{t('task')}{t('enSpace')}{t('role')}:</span>
        <span className={styles.ml20}>{data.taskRoleStatus.name}</span>
        {
          taskConfig &&
          <MonacoCallout
            language="json"
            value={JSON.stringify(taskConfig, null, 2)}
          >
            <IconButton children={<InfoOutlinedIcon />} />
          </MonacoCallout>
        }
        {renderTaskRoleCount()}
        <IconButton
          children={<Icon>{isExpand ? 'expand_less' : 'expand_more'}</Icon>}
          onClick={() => setIsExpand(prev => !prev)}
          style={{ position: 'absolute', right: '30px' }}
        />
      </div>
      {
        isExpand &&
          <div className={styles.content}>
            <TaskRoleList
              data={data.taskStatuses}
              gpu={countGpuFromTaskConfig(taskConfig)}
              jobInfo={jobInfo}
              taskRoleName={data.taskRoleStatus.name ? data.taskRoleStatus.name : ''}
            />
          </div>
      }
    </div>
  );
};

TaskRole.propTypes = {
  key: PropTypes.string,
  data: PropTypes.object,
  jobInfo: PropTypes.object,
  taskConfig: PropTypes.object
};

export default TaskRole;
