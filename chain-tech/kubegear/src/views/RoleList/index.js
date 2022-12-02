import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

// # API
import { getRole, getPrivilege, deleteRole } from 'utils/api';

// ? context
import RoleListContext from './RoleListContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import ErrorMessageBar from 'components/ErrorMessageBar';
import { PrimaryButton, DefaultButton, IconButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import CreateModal from './components/CreateModal'
import EditModal from './components/EditModal';
import Filter from './Filter';
import Ordering from './Ordering';

// ^ plugins
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';
import roleListStyles from './roleListStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...roleListStyles(theme)
}))

/**
 * @author odin
 * @level views/RoleList
 * @component RoleList
 * @description RoleList component
*/
const RoleList = () => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  // # states
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [rolePrivileges, setRolePrivileges] = useState([]);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isCreateModalShow, setIsCreateModalShow] = useState(false);
  const [designateUpdateUser, setDesignateUpdateUser] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState([]);
  const [filter, setFilter] = useState(new Filter());
  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // & handled data
  const isTablet = useMediaQuery('(max-width: 960px)');

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

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

  const getData = useCallback(() => {
    setIsLoading(true);
    Promise.all([getPrivilege(), getRole()])
      .then(([privilege, role]) => {
        setRolePrivileges(privilege);
        setRoleList(role);
      })
      .catch(err => {
        setError(err?.message ? err.data?.message : err?.message)
      })
      .finally(() => {
        setIsLoading(false);
      })
  })

  const onEdit = roleInfo => {
    setDesignateUpdateUser(roleInfo);
    setIsEditModalShow(true);
  };

  const onDelete = useCallback(() => {
    setIsLoading(true);
    deleteRole({ name: designateUpdateUser.name })
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        getData();
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.message;
        toast.error(msg);
      })
      .finally(() => setIsLoading(false))
  }, [designateUpdateUser]);

  // * hook
  /**
   * @author odin
   * @description ComponentDidMount ComponentDidUpdate
  */
  useEffect(() => {
    getData();
  }, [])

  /**
   * @author odin
   * @description Watch keyword(state) and selectedRole(state) to Filter data
  */
  useEffect(() => {
    setFilter(new Filter(keyword, selectedRole));
  }, [keyword, selectedRole])

  // ? context
  const context = {
    classes,
    setError,
    isLoading,
    setIsLoading,
    roleList,
    rolePrivileges,
    setRoleList,
    getData,
    designateUpdateUser,
    setDesignateUpdateUser,
    setIsEditModalShow,
    filter,
    ordering,
    setOrdering
  }

  // & handled data
  // table 的 內容
  const columns = [
    applySortProps({ id: 'name', key: 'name', label: t('role'), width: '30%' }),
    applySortProps({ id: 'privileges', key: 'privileges', label: t('privilege'), width: '30%', format: (roles) => (roles.join(', ')) }),
    {
      id: 'edit',
      label: t('Edit'),
      width: '10%',
      onTableCellRender: (data) => {
        return (
          <IconButton
            children={<Icon>drive_file_rename_outline</Icon>}
            onClick={() => onEdit(data)}
          />
        )
      }
    },
    {
      id: 'delete',
      label: t('delete'),
      width: '30%',
      onTableCellRender: (data) => {
        const { id } = data;
        const onlyHasAdmin = id === 1;
        return (
          <IconButton
            children={<Icon>delete_outline</Icon>}
            disabled={onlyHasAdmin}
            onClick={() => {
              if (data.name === 'admin') return;
              setShowDeleteModal(true);
              setDesignateUpdateUser(data)
            }}
          />
        )
      }
    }
  ]

  return (
    <RoleListContext.Provider value={context}>
      <div className={`${classes.roleListWrapper}`}>
        <BreadCrumbs />
        {error ? <ErrorMessageBar error={error} /> : null}
        <div className={`${classes.roleListTopBar}`}>
          {
            isTablet
              ?
              <>
                <PrimaryButton
                  children={t('add')}
                  classes={{
                    startIcon: classes.ml_0
                  }}
                  disabled={error || isLoading ? true : false}
                  onClick={() => setIsCreateModalShow(true)}
                  startIcon={<Icon>person_add_alt_1</Icon>}
                />
                <DefaultButton
                  children={t('refresh')}
                  disabled={isLoading}
                  onClick={() => {
                    getData();
                  }}
                  startIcon={<Refresh />}
                />
                <MuiAutocomplete
                  classes={{ root: classes.muiautoTablet }}
                  onInputChange={(e, value) => setKeyword(value)}
                  placeholder={t('search')}
                  textFieldProps={{
                    InputProps: {
                      style: { height: 42, fontSize: 16 }
                    }
                  }}
                  value={keyword}
                />
              </>
              :
              <>
                <div className={`${classes.d_flex}`}>

                  {/* 左邊 */}
                  <PrimaryButton
                    children={`${t('add')}${t('enSpace')}${t('role')}`}
                    classes={{
                      root: classes.mr_10,
                      startIcon: classes.ml_0
                    }}
                    disabled={error || isLoading ? true : false}
                    onClick={() => setIsCreateModalShow(true)}
                    startIcon={<Icon>person_add_alt_1</Icon>}
                  />

                  <DefaultButton
                    children={t('refresh')}
                    disabled={isLoading}
                    onClick={() => {
                      getData();
                    }}
                    startIcon={<Refresh />}
                  />
                </div>

                {/* 右邊 */}
                <div className={`${classes.d_flex}`}>

                  <MuiAutocomplete
                    classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
                    onInputChange={(e, value) => setKeyword(value)}
                    placeholder={`${t('search')}${t('enSpace')}${t('role')}`}
                    value={keyword}
                  />

                  <MuiDropdown
                    list={addDropDownOptionKeys([
                      ...rolePrivileges,
                      { name: 'divider', text: '-', itemType: 0 },
                      { name: t('clearOption'), type: 'clear', itemType: 1, onClick: () => setSelectedRole([]) }
                    ])}
                    maxWidth={150}
                    multiple
                    onChange={(e, child) => {
                      if (child.props.type === 'clear') {
                        child.props.onClick()
                        return
                      }
                      const result = e.target.value.filter(item => item !== undefined)
                      setSelectedRole(result);
                    }}
                    text={`${t('select')}${t('enSpace')}${t('privilege')}`}
                    value={selectedRole}
                  />
                </div>
              </>
          }
        </div>
        <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
          <BasePaper
            columns={columns}
            labelRowsPerPage={t('labelRowsPerPage')}
            ordering={ordering}
            page={page}
            rows={filter.apply(ordering.apply(roleList))}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>

      {/* Modal */}
      {
        isEditModalShow &&
        <EditModal
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
        />
      }
      {
        isCreateModalShow &&
        <CreateModal
          isOpen={isCreateModalShow}
          onClose={() => setIsCreateModalShow(false)}
        />
      }
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: designateUpdateUser.name })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('role')}`}
      />
    </RoleListContext.Provider>
  );
};

export default RoleList;
