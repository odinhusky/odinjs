import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';

// # API
import { deleteJobTemplate } from 'utils/api';

// ? context
import ManageTemplateContext from '../../Context';
import Context from './Context';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import BasePaper from 'components/BaseMuiPaper';
import { PrimaryButton, DefaultButton, IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import { ViewTemplateModal } from 'reuseContainers/ViewTemplateModal';
import EditModal from './components/EditModal';
import Filter from './Filter';
import Ordering from './Ordering';

// ^ Plugin
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/IndexPage
 * @component IndexPage
 * @description IndexPage component
*/
const ManageTemplate = () => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  // ? context
  const {
    templateList,
    userList,
    userInfo,
    getData,
    isLoading,
    setIsLoading,
    userPrivileges,
    classes
  } = useContext(ManageTemplateContext);
  const { locale } = useContext(GlobalContext);

  // # states
  const [designateUpdateUser, setDesignateUpdateUser] = useState({});
  const [viewTemplate, setViewTemplate] = useState({});
  const [isViewModalShow, setIsViewModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [filter, setFilter] = useState(new Filter());
  const [ordering, setOrdering] = useState(new Ordering());
  const [selectedOwner, setSelectedOwner] = useState(filter.owner);
  const [selectedPrivilege, setSelectedPrivilege] = useState(filter.privilege);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const { users } = useMemo(() => {
    const users = Object.create(null);
    if (templateList) {
      templateList.forEach(function(job) {
        users[job.owner] = true;
      });
    }
    return { users }
  }, [templateList])

  const filterOption = () => {
    const userList = [];
    if (!isEmpty(templateList)) {
      userList.push({
        key: 'user-' + userInfo.username,
        text: `@${t('self')}`,
        type: 'user',
        optionName: userInfo.username
      });
    }
    userList.push(...Object.keys(users)
      .filter(user => (user !== userInfo.username))
      .map(user => ({
        key: 'user-' + user,
        text: user,
        type: 'user'
      })));

    return [
      { key: 'privilege', text: `${t('Use')}${t('enSpace')}${t('privilege')}`, itemType: 2  },
      { key: 'hasEditPrivilege', text: t('canEdit'), type: 'privilege', optionkey: 'hasEditPrivilege' },
      { key: 'notHasEditPrivilege', text: t('canNotEdit'), type: 'privilege', optionkey: 'notHasEditPrivilege' },
      { key: 'divider_1', text: '-',  itemType: 0 },
      { key: 'creator', text: t('Creator'), itemType: 2 },
      ...userList,
      { key: 'divider_2', text: '-', itemType: 0 },
      { key: 'clear', text: t('clearOption'), type: 'clear', itemType: 1, onClick: clearFilter }
    ]
  }

  const clearFilter = () => {
    setSelectedKeys([])
    setSelectedPrivilege(new Set())
    setSelectedOwner(new Set())
  }

  const onView = templateInfo => {
    setViewTemplate(templateInfo);
    setIsViewModalShow(true)
  }

  const onEdit = templateInfo => {
    setDesignateUpdateUser(templateInfo);
    setIsEditModalShow(true);
  };

  const onDelete = () => {
    setIsLoading(true);
    deleteJobTemplate(designateUpdateUser.id)
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        getData();
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.message);
      })
      .finally(() => setIsLoading(false))
  };

  // * hooks
  useEffect(() => {
    const { keyword } = filter;
    const { username } = userInfo;
    setFilter(new Filter(keyword, selectedOwner, selectedPrivilege, username));
  }, [selectedOwner, selectedPrivilege])

  useEffect(() => {
    setFilter(new Filter(keyword));
  }, [keyword])

  useEffect(clearFilter, [locale])

  // & handled data
  const context = {
    templateList,
    isLoading,
    setIsLoading,
    getData,
    designateUpdateUser,
    setDesignateUpdateUser,
    viewTemplate,
    setViewTemplate,
    setIsEditModalShow,
    setIsViewModalShow,
    filter,
    ordering,
    setOrdering,
    userPrivileges,
    userList,
    userInfo
  }

  return (
    <Context.Provider value={context}>
      <div className={`${classes.mb_16} ${classes.flex_justify_between}`}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('template')}`}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
            }}
            disabled={isLoading ? true : false}
            onClick={() => history.push('/template-manage/template-add')}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            disabled={isLoading}
            onClick={() => getData()}
            startIcon={<Refresh />}
          />
        </div>
        <div
          className={`${classes.d_flex}`}
        >
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
          <MuiDropdown
            list={filterOption()}
            maxWidth={150}
            multiple
            onChange={(e, child) => {
              if (child.props.type === 'clear') {
                child.props.onClick()
                return
              }

              if (child.props.type === 'privilege') {
                const privilege = new Set(selectedPrivilege);
                if (privilege.has(child.props.optionkey))
                  privilege.delete(child.props.optionkey)
                else
                  privilege.add(child.props.optionkey)
                setSelectedPrivilege(privilege)
              }

              if (child.props.type === 'user') {
                if (child.props.optionName) {
                  const owners = new Set(selectedOwner);
                  if (owners.has(child.props.optionName))
                    owners.delete(child.props.optionName)
                  else
                    owners.add(child.props.optionName)
                  setSelectedOwner(owners)
                } else {
                  const owners = new Set(selectedOwner);
                  if (owners.has(child.props.text))
                    owners.delete(child.props.text)
                  else
                    owners.add(child.props.text)

                  setSelectedOwner(owners)
                }
              }

              const result = e.target.value
              setSelectedKeys(result)
            }}
            text={t('filter')}
            value={selectedKeys}
          />
        </div>
      </div>
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name'),
              onTableCellRender: templateInfo => (
                <div
                  className={classes.textPrimary}
                  onClick={() => onView(templateInfo)}
                  style={{
                    padding: '5px 0',
                    display: 'inline-block',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {templateInfo.name}
                </div>
              )
            }),
            {
              id: 'creator',
              key: 'creator',
              label: t('Creator'),
              onTableCellRender: templateInfo => (templateInfo.owner)
            },
            {
              id: 'description',
              key: 'description',
              label: t('description'),
              onTableCellRender: templateInfo => (templateInfo.description)
            },
            {
              id: 'editTemplate',
              key: 'editTemplate',
              label: `${t('Edit')}`,
              onTableCellRender: templateInfo => {
                const { owner, publicMode, canWriteUsers } = templateInfo;
                let hasEditPrivilege = false;
                if (userInfo.username === owner ) {
                  hasEditPrivilege = true
                } else {
                  if (
                    publicMode === 2
                    || publicMode === 1 && canWriteUsers.includes(userInfo.username)
                    || publicMode === 0 && canWriteUsers.includes(userInfo.username)
                  ) {
                    hasEditPrivilege = true
                  }
                }
                return (
                  <IconButton
                    children={<Icon>drive_file_rename_outline</Icon>}
                    disabled={!hasEditPrivilege}
                    onClick={() => {
                      if (hasEditPrivilege) {
                        history.push(`/template-manage/template-edit?name=${templateInfo.name}&owner=${templateInfo.owner}`)
                      }
                    }}
                  />
                )}
            },
            {
              id: 'setting',
              key: 'setting',
              label: t('setting'),
              onTableCellRender: templateInfo => (
                <IconButton
                  children={<Icon>settings</Icon>}
                  disabled={userInfo.username !== templateInfo.owner}
                  onClick={() => {
                    if (userInfo.username === templateInfo.owner) {
                      onEdit(templateInfo);
                    }
                  }}
                />
              )
            },
            {
              id: 'delete',
              key: 'delete',
              label: t('delete'),
              onTableCellRender: templateInfo => {
                let hasDeletePrivilege = false;
                if (userInfo.username === templateInfo.owner || userInfo.admin === 'true' ) {
                  hasDeletePrivilege = true
                }
                return (
                  <IconButton
                    children={<Icon>delete_outline</Icon>}
                    disabled={!hasDeletePrivilege}
                    onClick={() => {
                      if (hasDeletePrivilege) {
                        setShowDeleteModal(true);
                        setDesignateUpdateUser(templateInfo)
                      }
                    }}
                  />
                )}
            }
          ]}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={filter.apply(ordering.apply(templateList))}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        isEditModalShow &&
        <EditModal
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
        />
      }
      {
        isViewModalShow &&
        <ViewTemplateModal
          isOpen={isViewModalShow}
          onClose={() => setIsViewModalShow(false)}
          templateInfo={viewTemplate}
        />
      }
      {
        showDeleteModal &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: designateUpdateUser.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}${t('template')}`}
        />
      }
    </Context.Provider>
  );
};

export default ManageTemplate;
