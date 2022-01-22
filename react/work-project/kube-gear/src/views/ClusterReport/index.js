import React, {
  useState,
  useEffect
} from 'react';

// ? context
import Context from './Context';

// ^ Material-ui Componets(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import Cluster from  './components/Cluster';
import SingleNode from  './components/SingleNode';
import User from './components/User';
import Job from './components/Job';
import UsedTime from './components/UsedTime';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

// ? styles
import indexStyle from './index.module.scss';
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
import clusterReportStyle from './clusterReportStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...clusterReportStyle(theme)
}));

// ^ plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ClusterReport
 * @component ClusterReport
 * @description 包含 '叢集' | '用戶' | '單節點' | '作業' 以及 '使用時長' 5 個頁面
*/
function ClusterReport() {

  // $ init data
  const { t } = useTranslation();
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();
  const query = new URLSearchParams(window.location.search);

  // = styles
  const classes = useStyles();

  // % context
  const context = {
    classes
  }

  // # states
  const [activeTab, setActiveTab] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState('');


  // * hooks
  useEffect(() => {
    const tabs = ['cluster', 'user', 'singleNode', 'job', 'usedTime']
    const tab = query.get('tab');
    const duration = query.get('duration');

    if (!tabs.includes(tab)) setActiveTab('cluster');
    else setActiveTab(tab)

    const checkUrlQueryHasCorrectFormat = () => {
      const durationTextsArray = ['today', 'week', 'month']
      const duration = query.get('duration');
      return !durationTextsArray.includes(duration) ? '' : duration
    }

    // 如果有傳 duration 的話 則要設定 duration 的參數
    if (
      duration
      && (checkUrlQueryHasCorrectFormat(duration) !== '')
    ) {
      setDefaultDuration(duration)
    }
  }, [])

  return (
    <Context.Provider value={context}>
      <div className={indexStyle.container}>
        <BreadCrumbs />
        <Toolbar
          className={classes.toolbar}
          disableGutters
        >
          <Tabs
            aria-label="tabs"
            className={classes.tabs}
            indicatorColor="primary"
            onChange={(e, value) => {
              history.push({ search: `?tab=${value}` })
              setActiveTab(value)
            }}
            scrollButtons="on"
            value={activeTab}
            variant="scrollable"
          >
            {
              permission &&
              <Tab
                label={`${t('group')}`}
                value={'cluster'}
              />
            }
            {
              permission &&
              <Tab
                label={`${t('User')}`}
                value={'user'}
              />
            }
            {
              permission &&
              <Tab
                label={`${t('Node')}`}
                value={'singleNode'}
              />
            }
            <Tab
              label={`${t('job')}`}
              value={'job'}
            />
            {
              permission &&
              <Tab
                label={t('usageTime')}
                value={'usedTime'}
              />
            }
          </Tabs>
        </Toolbar>
        <div className={`${indexStyle.wrapper} ${activeTab === 'usedTime' ? indexStyle.usedTime : ''}`}>
          {
            activeTab === 'cluster' &&
              <Cluster
                duration={defaultDuration}
              />
          }
          {
            activeTab === 'user' &&
              <User />
          }
          {
            activeTab === 'singleNode' &&
              <SingleNode />
          }
          {
            activeTab === 'job' &&
              <Job />
          }
          {
            activeTab === 'usedTime' &&
              <UsedTime
                duration={defaultDuration}
              />
          }
        </div>
      </div>
    </Context.Provider>
  )
}

export default ClusterReport;