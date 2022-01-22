import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import csvParser from 'papaparse';
import stripBom from 'strip-bom-string';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import en from 'assets/lang/en.json';
import cn from 'assets/lang/cn.json';
import jp from 'assets/lang/jp.json';
import tw from 'assets/lang/tw.json';

// # API
import { createUser, getUserList, getCustomizedSystemParam } from 'utils/api';

// % context
import GlobalContext from 'layouts/Main/GlobalContext';
import Context from './utils/Context';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';

// ? Self-packed Components || Functions
import { addDropDownOptionKeys, selectColor } from './utils';
import Ordering from './utils/Ordering';
import BreadCrumbs from 'components/BreadCrumbs';
import ErrorMessageBar from 'components/ErrorMessageBar';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import Pagination from 'components/Paginator/pagination';
import Table from './components/Table';
import CreateUserModal from './components/CreateUserModal';
import CreateNfsGlusterfsModal from './components/CreateNfsGlusterfsModal';
import EditUserModal from './components/EditUserModal';
import ViewUserModal from './components/ViewUserModal';
import ApproveUserModal from './components/ApproveUserModal';

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}))

const checkUserInfoCSVFormat = (csvResult, t) => {
  const fields = csvResult.meta.fields;

  const checkInputItems = (column) => {
    if (
      fields.find(item => (
        item === tw.userConfig[column] || item === cn.userConfig[column] || item === en.userConfig[column] || item === jp.userConfig[column]
      ))
    ) {
      return false;
    } else {
      return true
    }
  };

  if (checkInputItems('columnUsername')){
    toast.error(t('csvNoUsername'))
    return false
  }

  if (checkInputItems('columnPassword')) {
    toast.error(t('csvNoPassword'));
    return false;
  }

  if (csvResult.errors.length > 0) {
    toast.error(
      `${t('Row')} ${csvResult.errors[0].row + 2}: ${csvResult.errors[0].message}`
    );
    return false;
  }

  if (csvResult.data.length == 0) {
    toast.error(t('csvIsEmpty'));
    return false;
  }
  return true;
};

/**
 * @author odin
 * @level views/UserManage
 * @component UserManage
 * @description UserManage component
*/
const UserManage = () => {
  // $ init data
  const { t } = useTranslation();
  const classes = useStyles();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // ? context
  const { userInfo: currentUser, isXdfsEnabled } = useContext(GlobalContext);

  // # states
  const [userInfoList, setUserInfoList] = useState([]);
  const [filterUserInfoList, setFilterUserInfoList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userCode: '',
    name: '',
    phone: '',
    email: '',
    description: '',
    jobLifeHour: '',
    roles: [],
    nfsList: [],
    privileges: [],
    virtualGroups: [],
    totalUsedTime: 0,
    state: 0
  });
  const [error, setError] = useState(null);
  const [filterUsername, setFilterUsername] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateNfsGlusterfsModal, setShowCreateNfsGlusterfsModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showApproveUserModal, setShowApproveUserModal] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [pagination, setPagination] = useState(new Pagination());
  const [ordering, setOrdering] = useState(new Ordering());
  const [selectedKey, setSelectedKey] = useState(0);
  const [selectedOption, setSelectedOption] = useState();
  const [systemParams, setSystemParams] = useState([]);
  const [searchState, setSearchState] = useState({
    approveName: null,
    approveNameChange: false
  });

  const [isUserCreateSuc, setIsUserCreatSuc] = useState(false);
  const [userCreateSucName, setUserCreatSucName] = useState('');
  const [whichStorageSetting, setWhichStorageSetting] = useState({ nfs: false, glusterfs: false, xdfs: false });

  const downloadTemplate = () => {
    const template = {
      [t('userConfig', { returnObjects: true })['columnUsername']]: 'user01',
      [t('userConfig', { returnObjects: true })['columnPassword']]: 'Aa123456',
      [t('userConfig', { returnObjects: true })['columnUsercode']]: 'a12345678',
      [t('userConfig', { returnObjects: true })['columnName']]: 'YourName',
      [t('userConfig', { returnObjects: true })['columnPhone']]: '1334567890',
      [t('userConfig', { returnObjects: true })['columnEmail']]: 'test@example.com',
      [t('userConfig', { returnObjects: true })['columnDescription']]: 'description',
      [t('userConfig', { returnObjects: true })['columnRoles']]: 'Job,User',
      [t('userConfig', { returnObjects: true })['columnVGs']]: 'test'
    };

    const csvString = csvParser.unparse([template]);
    const universalBOM = '\uFEFF';
    const filename = 'userinfo.csv';
    const file = new Blob([universalBOM + csvString], {
      type: 'text/csv;charset=utf-8'
    });
    if (window.navigator.msSaveOrOpenBlob) {
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };

  const importFromCSV = () => {
    const readFile = function(e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const contents = e.target.result;
        if (contents) {
          const csvResult = csvParser.parse(stripBom(contents), {
            header: true,
            skipEmptyLines: true,
            encoding: 'UTF-8'
          });
          if (checkUserInfoCSVFormat(csvResult, t)) {
            const resultObj = {
              success: [],
              fail: []
            };
            addUserRecursively(csvResult.data, 0, resultObj);
          }
        }
        document.body.removeChild(fileInput);
      };
      reader.readAsText(file);
    };
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.onchange = readFile;
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const addUser = (
    username,
    password,
    userCode,
    name,
    email,
    phone,
    virtualGroups,
    description,
    roles,
    state = 1
  ) => {
    // Create new user.
    return createUser({
      username,
      password,
      userCode,
      name,
      email,
      phone,
      virtualGroups,
      description,
      roles,
      state
    })
      .then(() => (['success', `${t('add')}${t('enSpace')}${t('User')}${t('enSpace')}${t('success')}: ${username}`]))
      .catch((err) => (['fail', `${t('add')}${t('enSpace')}${t('User')}${t('enSpace')}${t('fail')}: ${username} / ${err?.data?.message}`]));
  };

  const addUserRecursively = (userInfos, index, resultObj) => {
    if (index == 0) {
      setIsDataLoading(true);
    }
    if (index >= userInfos.length) {
      setIsDataLoading(false);
      const { success, fail } = resultObj;
      const totalSuccessUsers = success.length;
      const totalFailUsers = fail.length;
      if (totalSuccessUsers > 0) {
        toast.success(<>{t('numOfUserAddSuccess', { number: totalSuccessUsers })}</>, { autoClose: 10000 })
      }
      if (totalFailUsers > 0) {
        toast.error(<>{fail.map(item => <div key={item}>{item}</div>)}</>, { autoClose: 10000 });
      }
      getUserInfoList();
      return;
    } else {
      const userInfo = userInfos[index];
      addUser(
        userInfo[tw.userConfig.columnUsername] || userInfo[cn.userConfig.columnUsername] || userInfo[en.userConfig.columnUsername] || userInfo[jp.userConfig.columnUsername],
        userInfo[tw.userConfig.columnPassword] || userInfo[cn.userConfig.columnPassword] || userInfo[en.userConfig.columnPassword] || userInfo[jp.userConfig.columnPassword],
        userInfo[tw.userConfig.columnUsercode] || userInfo[cn.userConfig.columnUsercode] || userInfo[en.userConfig.columnUsercode] || userInfo[jp.userConfig.columnUsercode],
        userInfo[tw.userConfig.columnName] || userInfo[cn.userConfig.columnName] || userInfo[en.userConfig.columnName] || userInfo[jp.userConfig.columnName],
        userInfo[tw.userConfig.columnEmail] || userInfo[cn.userConfig.columnEmail] || userInfo[en.userConfig.columnEmail] || userInfo[jp.userConfig.columnEmail],
        userInfo[tw.userConfig.columnPhone] || userInfo[cn.userConfig.columnPhone] || userInfo[en.userConfig.columnPhone] || userInfo[jp.userConfig.columnPhone],
        (userInfo[tw.userConfig.columnVGs] || userInfo[cn.userConfig.columnVGs] || userInfo[en.userConfig.columnVGs] || userInfo[jp.userConfig.columnVGs])
          .split(',').map(vg => vg.trim()),
        userInfo[tw.userConfig.columnDescription] || userInfo[cn.userConfig.columnDescription] || userInfo[en.userConfig.columnDescription] || userInfo[jp.userConfig.columnDescription],
        (userInfo[tw.userConfig.columnRoles] || userInfo[cn.userConfig.columnRoles] || userInfo[en.userConfig.columnRoles] || userInfo[jp.userConfig.columnRoles])
          .split(',').map((role) => role.trim())
      ).then(result => {
        const [status, description] = result;
        if (status === 'success') {
          resultObj.success.push(description)
        } else if (status === 'fail') {
          resultObj.fail.push(description);
        }
        addUserRecursively(userInfos, ++index, resultObj);
      });
    }
  };

  // - methods
  const getUserInfoList = useCallback(() => {
    setIsDataLoading(true);
    Promise.all([
      getUserList(),
      getCustomizedSystemParam()
    ])
      .then(([userData, paramData]) => {
        setUserInfoList(userData);
        setSystemParams(paramData);
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.toString();
        setError(msg);
      })
      .finally(() => {
        setIsDataLoading(false);
      })
  }, []);

  // * hook
  useEffect(
    () => {
      setFilterUserInfoList(() => {
        const filterUserInfoList = userInfoList.filter(userInfo =>
          userInfo.username.includes(filterUsername)
        );
        switch(selectedKey) {
          case 'all':
          default:
            return filterUserInfoList;
          case 'accept':
            return filterUserInfoList.filter(info => info.state === 1);
          case 'pending':
            return filterUserInfoList.filter(info => info.state === 0);
          case 'deny':
            return filterUserInfoList.filter(info => info.state === -1);
        }
      });
    },
    [userInfoList, filterUsername, selectedKey]
  );

  useEffect(getUserInfoList, []);
  useEffect(
    () => {
      setPagination(new Pagination(pagination.itemsPerPage, 0));
    },
    [filterUserInfoList]
  );

  useEffect(() => {
    if (searchState.approveNameChange) {
      const data = userInfoList.find(item => item.username === query.get('approveModal'));
      if (!data) {
        toast.error(`${t('User')}${t('enSpace')}${t('notExist')}`)
        return
      }
      if (data.state !== 0) {
        toast.error(`${t('isExist', { name: query.get('approveModal') })}`)
        return
      }
      setUserInfo(data)
      setShowApproveUserModal(true);
      setSearchState(prev => ({ ...prev, approveNameChange: false }))
    }
  }, [searchState])

  useEffect(() => {
    if (!isEmpty(userInfoList) && query.get('approveModal')) {
      if (searchState.approveName !== query.get('approveModal')) {
        setSearchState(prev => ({ ...prev, approveNameChange: true, approveName: query.get('approveModal') }))
      }
    }
  }, [search, userInfoList])

  useEffect(() => {
    if (isUserCreateSuc) {
      if (whichStorageSetting.nfs || whichStorageSetting.glusterfs || whichStorageSetting.xdfs) {
        setShowCreateNfsGlusterfsModal(true)
      }
      setIsUserCreatSuc(false)
    }
  }, [isUserCreateSuc])

  // & handled data
  const rules = {
    bypass: () => null,
    required: value => (value ? '' : t('fieldRequired')),
    passwordFormat(password) {
      const passwordValidation = RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/,
        'g'
      );
      return passwordValidation.test(password) ? '' : t('passwordInvalid');
    },
    userNameFormat(username) {
      const usernameValidation = RegExp(/^[a-z][a-z0-9]{1,254}$/, 'g');
      return usernameValidation.test(username) ? '' : t('userNameInvalid');
    },
    emailFormat(email) {
      const emailValidation = RegExp(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
        'g'
      );
      return emailValidation.test(email) ? '' : t('emailInValid');
    },
    matchPassword: (password, confirmPassword) => confirmPassword === password ? '' : t('confirmPasswordInvalid'),
    mustBeNumber: value => isNaN(value) ? t('mustInputNumber') : '',
    mustBeText: value => !isNaN(value) ? t('mustInputText') : '',
    mustBeNumberOrEmptyValue: value => {
      // bypass the empty value.
      if (!value) return '';
      return isNaN(value) ? t('mustBeNumberOrEmpty') : '';
    },
    mustBiggerThanMinusOneOrEmptyValue: value =>
      value >= -1 || !value ? '' : t('mustBiggerThanMinusOne'),
    mustBeNumberPositive: value => (value > 0 ? '' : t('mustBeNumberPositive'))
  };

  const importUserOptions = [
    {
      id: 'importUsers',
      label: `${t('batch')}${t('enSpace')}${t('import')}`,
      icon: <Icon style={{ marginRight: 10 }}>group_add</Icon>,
      handleItemclick: importFromCSV
    },
    {
      id: 'usersTemplate',
      label: `${t('download')}${t('enSpace')}${t('template')}`,
      icon: <Icon style={{ marginRight: 10 }}>download</Icon>,
      handleItemclick: downloadTemplate
    }
  ]

  // ? context
  const context = {
    userInfo,
    userInfoList,
    setUserInfo,
    setUserInfoList,
    getUserInfoList,
    filterUserInfoList,
    setFilterUserInfoList,
    showCreateUserModal,
    showViewUserModal,
    showEditUserModal,
    showApproveUserModal,
    setShowCreateUserModal,
    setShowViewUserModal,
    setShowEditUserModal,
    setShowApproveUserModal,
    isDataLoading,
    pagination,
    setPagination,
    ordering,
    setOrdering,
    addDropDownOptionKeys,
    rules,
    systemParams,
    currentUser,
    isXdfsEnabled
  };

  return (
    <Context.Provider value={context}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '0 20px 20px',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <BreadCrumbs />
        { error && <ErrorMessageBar error={error} /> }
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              // 權限的判斷
              (
                !isEmpty(currentUser) &&
                (
                  currentUser.admin === 'true'
                  || (
                    !isXdfsEnabled &&
                    currentUser.privileges.includes('USER') &&
                    currentUser.privileges.includes('NFS') &&
                    currentUser.privileges.includes('GLUSTERFS')
                  )
                  || (
                    isXdfsEnabled &&
                    currentUser.privileges.includes('USER') &&
                    currentUser.privileges.includes('NFS')
                  )
                )
              ) &&
              <>
                {/* 新增用褲 */}
                <PrimaryButton
                  children={`${t('add')}${t('enSpace')}${t('User')}`}
                  classNameProps={classes.mr_20}
                  disabled={isDataLoading}
                  onClick={() => setShowCreateUserModal(true)}
                  startIcon={<Icon>person_add_alt</Icon>}
                />

                {/* 批次匯入 */}
                <SplitButton
                  classNameObj={{
                    btnGroup: classes.mr_20
                  }}
                  disabled={isDataLoading}
                  onClick={importFromCSV}
                  options={importUserOptions}
                  startIcon={<Icon>group_add</Icon>}
                  text={`${t('batch')}${t('enSpace')}${t('import')}`}
                />
              </>
            }
            <DefaultButton
              children={t('refresh')}
              classNameProps={
                clsx({
                  [classes.mr_20]: (
                    !isEmpty(currentUser) &&
                    (
                      currentUser.admin === 'true'
                      || (
                        currentUser.privileges.includes('USER') &&
                        currentUser.privileges.includes('NFS') &&
                        currentUser.privileges.includes('GLUSTERFS')
                      )
                      || (
                        isXdfsEnabled &&
                        currentUser.privileges.includes('USER') &&
                        currentUser.privileges.includes('NFS')
                      )
                    )
                  )
                })
              }
              disabled={isDataLoading}
              onClick={getUserInfoList}
              startIcon={<Refresh />}
            />
          </div>
          <div className={`${classes.d_flex}`}>

            <MuiAutocomplete
              classes={{ root: `${classes.mr_20} ${classes.h_auto}` }}
              disabled={isDataLoading}
              onInputChange={(e, value) => setFilterUsername(value)}
              placeholder={`${t('search')}${t('enSpace')}${t('User')}`}
              value={filterUsername}
            />

            <MuiDropdown
              disabled={isDataLoading}
              list={addDropDownOptionKeys([
                { name: t('allShow'), data: { icon: '6PointStar' }, key: 'all', optionkey: 'all', style: { color: selectColor('all') } },
                { name: t('verified'), data: { icon: 'Accept' }, key: 'accept', optionkey: 'accept', style: { color: selectColor('accept') } },
                { name: t('verifying'), data: { icon: 'HourGlass' }, key: 'pending', optionkey: 'pending', style: { color: selectColor('pending') } },
                { name: t('denied'), data: { icon: 'Cancel' }, key: 'deny', optionkey: 'deny', style: { color: selectColor('deny') } }
              ])}
              onChange={(e, child) => {
                const result = e.target.value;
                setSelectedOption(result)
                setSelectedKey(child.props.optionkey);
              }}
              text={`${t('select')}${t('enSpace')}${t('status')}`}
              value={selectedOption}
            />
          </div>
        </div>

        {/* 表單 */}
        <div style={{ flex: 1, overflow: 'hidden', marginTop: 10 }}>
          <Table />
        </div>

      </div>
      {/* Modal */}
      {
        showCreateUserModal &&
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          setIsUserCreatSuc={setIsUserCreatSuc}
          setUserCreatSucName={setUserCreatSucName}
          setWhichStorageSetting={setWhichStorageSetting}
        />
      }
      {
        showCreateNfsGlusterfsModal &&
        <CreateNfsGlusterfsModal
          isOpen={showCreateNfsGlusterfsModal}
          onClose={() => setShowCreateNfsGlusterfsModal(false)}
          user={userCreateSucName}
          whichStorageSetting={whichStorageSetting}
        />
      }
      <ViewUserModal />
      {
        showEditUserModal &&
        <EditUserModal
          isOpen={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
        />
      }
      {
        showApproveUserModal &&
        <ApproveUserModal
          isOpen={showApproveUserModal}
          onClose={() => setShowApproveUserModal(false)}
          setIsUserCreatSuc={setIsUserCreatSuc}
          setUserInfo={setUserInfo}
          setWhichStorageSetting={setWhichStorageSetting}
          userInfo={userInfo}
        />
      }
    </Context.Provider>
  );
};

export default UserManage;
