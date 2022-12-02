import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getHuborStatistics,
  getHarborVolumeInfo,
  deleteHarborProject,
  getHarborQuotas,
  getHarborConfiguration
} from 'utils/api';

// ? context
import RepositoryContext from '../../RepositoryContext';

// ^ Material-ui Componets(Functions)
import { Refresh } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import Ordering from '../../Ordering';
import ConfirmModal from 'components/ConfirmModal';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import StorageChart from './components/StorageChart';
import ProjectInfo from './components/ProjectInfo';
import EditProjectModal from './components/EditProjectModal';
import EditDefaultQuotaModal from './components/EditDefaultQuotaModal';
import { DefaultButton, IconButton, PrimaryButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';
import BaseLink from 'components/BaseLink';
import { formatBytes } from 'utils';
import { formatIntegerBytes } from 'common/commonMethods';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, isNil, cloneDeep } from 'lodash';
import moment from 'moment';

/**
 * @author odin
 * @level views/Repository/ProjectList
 * @component ProjectList
 * @description ProjectList to show projects
*/
const ProjectList = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { isLoading, setIsLoading, projectList, getProjectList, classes, userInfo, isAdmin } = useContext(RepositoryContext)

  // # states
  const [projectInfo, setProjectInfo] = useState({});
  const [harborInfo, setHarborInfo] = useState({});
  const [harborQuotasObj, setHarborQuotasObj] = useState({});
  const [showProjectList, setShowProjectList] = useState([]);

  const [ordering, setOrdering] = useState(new Ordering());
  const [keyword, setKeyword] = useState('');

  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 設置項目默認配額的 Modal
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);
  const [defaultQuotas, setDefaultQuotas] = useState({});

  // 修改 XXX 項目配額的 Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [thisProjectName, setThisProjectName] = useState('');
  const [thisQuotatId, setThisQuotatId] = useState(null);
  const [thisProjectLimitedCount, setThisProjectLimitedCount] = useState(-1);
  const [thisProjectLimitedStorage, setThisProjectLimitedStorage] = useState(-1);
  const [thisProjectUsedCount, setThisProjectUsedCount] = useState(0);
  const [thisProjectUsedStorage, setThisProjectUsedStorage] = useState(0);

  // - methods
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

  const handleDelete = () => {
    deleteHarborProject(selectedProjects.project_id)
      .then(() => {
        getProjectInfo();
        getProjectList();
        setSelectedProjects([]);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }

  const getProjectInfo = async() => {
    setIsLoading(true)
    try {
      const projectRes = await getHuborStatistics();
      setProjectInfo(projectRes);

      if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN')) {
        const harborRes = await getHarborVolumeInfo();
        setHarborInfo(harborRes);
      }
    } catch (err) {
      toast.error(err.data ? err.data.message : err.message)
    }
    setIsLoading(false)
  }

  /**
   * @author odin
   * @description 取得每一個 project 的 quota 資訊
  */
  const getDefaultQuotas = async() => {
    setIsLoading(true)
    try {
      const res = await getHarborConfiguration();

      if(!isEmpty(res) && !isNil(res)) {
        const { count_per_project, storage_per_project } = res
        const { value: storageValue } = storage_per_project
        const isUnlimited = storageValue === -1
        const storageObj = isUnlimited ? (
          {
            unit: 'MB',
            value: -1,
            bytes: 0
          }
        ) : formatIntegerBytes(storage_per_project.value)

        setDefaultQuotas({
          count: count_per_project.value,
          storage: storageObj,
          storageString: isUnlimited ? 'Unlimited' : `${storageObj.value} ${storageObj.unit}`
        })
      }

    } catch (err) {
      toast.error(err.data ? err.data.message : err.message)
    }
    setIsLoading(false)
  }

  /**
   * @author odin
   * @description 取得每一個 project 的 quota 資訊
  */
  const getProjectQuotas = async() => {
    setIsLoading(true)
    try {
      const projectQuotasRes = await getHarborQuotas();

      if(!isEmpty(projectQuotasRes) && !isNil(projectQuotasRes)) {
        // 做資料型態轉換
        const harborQuotasObj = projectQuotasRes.reduce((acc, cur) => ({ ...acc, [cur.ref.id]: cur
        }), {})

        setHarborQuotasObj(harborQuotasObj)
      }

    } catch (err) {
      toast.error(err.data ? err.data.message : err.message)
    }
    setIsLoading(false)
  }

  /**
   * @author odin
   * @param {number} s -- 使用者輸入的內容，我們預期他再經過轉換後應該要是數字
   * @param {string} unit -- 目前選擇的單位
   * @description 判斷是否有錯誤，並且針對 storage 的 error 做 setState
   */
  const handleStorageErr = (s, unit, setError) => {
    if(
      s === ''
        || typeof s === 'string'
        || s === 0
        || s < -1
        || s > 1024 && unit === 'TB'
        || s > Math.pow(1024, 2) && unit === 'GB'
        || s > Math.pow(1024, 3) && unit === 'MB'
    ){
      setError(t('itemSizeError'))
    } else {
      setError('')
    }
  }

  /**
   * @author odin
   * @param {number} c -- 使用者輸入的內容，我們預期他再經過轉換後應該要是 -1 或是 1~100000000 的數字
   * @param {function} setError -- 改變該內部 Error state 的 setState
   * @description 判斷是否有錯誤，並且針對 count 的 error 做 setState
   */
  const handleCountErr = (c, setError) => {
    if(
      c === ''
        || typeof c === 'string'
        || c === 0
        || c < -1
        || c > 100000000
    ){
      setError(t('mirrorNumberError'))
    } else {
      setError('')
    }
  }

  // & handled data
  const defaultColumn = [
    applySortProps({
      id: 'name',
      key: 'name',
      label: `${t('project')}${t('enSpace')}${t('name')}`,
      onTableCellRender: (repoData) => {
        return (
          <BaseLink
            to={`${location.pathname}/${repoData.name}`}
          >
            {repoData.name}
          </BaseLink>
        );
      }
    }),
    applySortProps({
      id: 'public',
      key: 'public',
      label: t('isPublic'),
      onTableCellRender: (repoData) => {
        return repoData.metadata.public === 'true' ? <div>{t('public')}</div> : <div>{t('private')}</div>;
      }
    }),
    applySortProps({
      id: 'repo_count',
      key: 'repo_count',
      label: `${t('RepositoriesCount')}`,
      onTableCellRender: data => data.repo_count
    }),
    applySortProps({
      id: 'current_user_role_id',
      key: 'current_user_role_id',
      label: t('role'),
      onTableCellRender: (data) => {
        switch (data.current_user_role_id) {
          case 0:
            return <div>-</div>;
          case 1:
            return <div>{t('project')}{t('enSpace')}{t('admin')}</div>;
          case 2:
            return <div>{t('maintainer')}</div>;
          case 3:
            return <div>{t('Guest')}</div>
        }
      }
    }),
    applySortProps({
      id: 'creation_time',
      key: 'creation_time',
      label: t('createTime'),
      onTableCellRender: (repoData) => {
        return <div>{moment(repoData.creation_time).format('YYYY/MM/DD HH:mm:ss')}</div>;
      }
    }),
    // 數量
    {
      id: 'amount',
      key: 'amount',
      label: t('amount'),
      onTableCellRender: (projectData) => {
        const { hard: limit, used } = projectData
        const { count: limitedCount } = limit
        const { count: usedCount } = used
        return (
          <div> {usedCount} / {limitedCount === -1 ? t('Unlimited') : limitedCount} </div>
        )
      }
    },
    // 大小
    {
      id: 'size',
      key: 'size',
      label: t('size'),
      onTableCellRender: (projectData) => {
        const { hard: limit, used } = projectData
        const { storage: limitedStorage } = limit
        const { storage: usedStorage } = used
        const formatedUsedStorage = formatBytes(usedStorage)

        let formatedLimitedStorage = ''

        if(limitedStorage === -1) {
          formatedLimitedStorage = 'Unlimited'
        } else {
          const formatedObj = formatIntegerBytes(limitedStorage)

          formatedLimitedStorage = `${formatedObj.value} ${formatedObj.unit}`
        }

        return (
          <div> {formatedUsedStorage} / {
            t(formatedLimitedStorage)
              ? t(formatedLimitedStorage)
              : formatedLimitedStorage
          } </div>
        )
      }
    },
    // 修改配額
    {
      id: 'modify_quota',
      key: 'modify_quota',
      label: `${t('modify')}${t('enSpace')}${t('quota')}`,
      onTableCellRender: (projectData) => {
        const {
          project_id,
          name,
          hard: limit,
          used
        } = projectData

        const {
          count: limitedCount,
          storage: limitedStorage
        } = limit

        const {
          count: usedCount,
          storage: usedStorage
        } = used

        const quotaId = harborQuotasObj[project_id].id

        return (
          <IconButton
            children={<Icon>app_registration</Icon>}
            onClick={() => {
              setThisQuotatId(quotaId)
              setThisProjectName(name)

              // limited
              setThisProjectLimitedCount(limitedCount)
              setThisProjectLimitedStorage(limitedStorage)

              // used
              setThisProjectUsedCount(usedCount)
              setThisProjectUsedStorage(usedStorage)

              setIsProjectModalOpen(true);
            }}
          />
        )
      }
    },
    // 刪除
    {
      id: 'delete',
      key: 'delete',
      label: t('delete'),
      onTableCellRender: (projectData) => {
        const canDeleteProject = projectData.repo_count === 0 ? true : false;
        return (
          <IconButton
            children={<Icon>delete_outline</Icon>}
            disabled={!canDeleteProject}
            onClick={() => {
              setSelectedProjects(projectData)
              setIsDeleteModalShow(true)
            }}
          />
        )
      }
    }
  ];

  // 依照登入者權限判斷目前的表頭有哪些欄位
  let finalColumn = [];

  if(isAdmin) {
    finalColumn = [ ...defaultColumn ]
  } else {
    finalColumn = [ ...defaultColumn ].filter(item => item.id !== 'modify_quota')
  }

  // * hooks
  useEffect(() => {
    if(!isEmpty(userInfo)) {
      getProjectInfo();
      getProjectQuotas();

      if(isAdmin) {
        getDefaultQuotas();
      }

    }
  }, [userInfo])

  useEffect(() => {
    if(!isEmpty(projectList) && !isNil(projectList) && !isEmpty(harborQuotasObj) && !isNil(harborQuotasObj)) {
      // 合併資料格式
      const newProjectList = projectList.map(item => {
        const projectId = item.project_id

        const { hard, used } = harborQuotasObj[projectId]
        return {
          ...cloneDeep(item),
          hard,
          used
        }
      })

      setShowProjectList(newProjectList)
    }

  }, [projectList, harborQuotasObj])

  return (
    <>
      {/* 存儲詳細資訊 */}
      <div className={`${classes.d_flex} ${classes.mb_16}`}>
        {
          userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN') &&
          <StorageChart info={harborInfo} />
        }
        <ProjectInfo
          defaultQuotas={defaultQuotas}
          info={projectInfo}
        />
      </div>

      {/* 按鈕 + 過濾的 Input */}
      <div className={`${classes.d_flex} ${classes.mb_16}`}>
        <DefaultButton
          children={t('refresh')}
          classNameProps={`${classes.mr_10} ${!isAdmin && classes.mr_auto}`}
          disabled={isLoading}
          onClick={() => {
            getProjectInfo();
            getProjectList();
            getProjectQuotas();

            if(isAdmin) {
              getDefaultQuotas();
            }
          }}
          startIcon={<Refresh />}
        />

        {
          isAdmin &&
          <PrimaryButton
            children={t('projectQuota')}
            classNameProps={`${classes.mr_auto}`}
            onClick={() => {
              setIsDefaultModalOpen(true)
            }}
            startIcon={<Icon>app_registration</Icon>}
          />
        }

        <MuiAutocomplete
          classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
          onInputChange={(e, value) => setKeyword(value)}
          placeholder={`${t('search')}${t('enSpace')}${t('project')}${t('enSpace')}${t('name')}`}
          value={keyword}
        />
      </div>

      {/* 表格內容 */}
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
        <BasePaper
          columns={finalColumn}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(showProjectList.filter(project => project.name.includes(keyword)))}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {/* Modal */}
      {
        // 確認是否刪除的燈箱
        isDeleteModalShow &&
        <ConfirmModal
          confrimText={`${t('delete')}`}
          content={t('sureDelete', { name: selectedProjects.name })}
          isOpen={isDeleteModalShow}
          onClose={() => {
            setIsDeleteModalShow(false)
            setSelectedProjects([])
          }}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('project')}`}
        />
      }

      {
        // 修改預設值的 Modal
        (isDefaultModalOpen && isAdmin) &&
        <EditDefaultQuotaModal
          defaultQuotas={defaultQuotas}
          getDefaultQuotas={getDefaultQuotas}
          handleCountErr={handleCountErr}
          handleStorageErr={handleStorageErr}
          isDefaultModalOpen={isDefaultModalOpen}
          onClose={() => {setIsDefaultModalOpen(false)}}
        />
      }

      {
        // 單一個專案修改的 Modal
        (isProjectModalOpen && isAdmin) &&
        <EditProjectModal
          getProjectQuotas={getProjectQuotas}
          handleCountErr={handleCountErr}
          handleStorageErr={handleStorageErr}
          isProjectModalOpen={isProjectModalOpen}
          limitedCount={thisProjectLimitedCount}
          limitedStorage={thisProjectLimitedStorage}
          onClose={() => {setIsProjectModalOpen(false)}}
          projectName={thisProjectName}
          quotaId={thisQuotatId}
          usedCount={thisProjectUsedCount}
          usedStorage={thisProjectUsedStorage}
        />
      }
    </>
  );
};

export default ProjectList;
