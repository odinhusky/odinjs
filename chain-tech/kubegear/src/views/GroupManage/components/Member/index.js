import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getGroupMembers, getGroupApplyList, getResource, inviteGroupMember, getGroupVirtualGroup } from 'utils/api';

// ? context
import GroupManageContext from '../../GroupManageContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton, IconButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import Ordering from '../../Ordering';
import InviteModal from './InviteModal';
import ConfirmModal from 'components/ConfirmModal';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import EditModal from './EditModal';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/GroupManage/Member
 * @component Member
 * @description Member component
*/
const Member = ({ group, queryParamName }) => {

  // ? context
  const {
    isMenuLoading,
    getMenuData,
    classes
  } = useContext(GroupManageContext);
  const { useSelector } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);
  const isAdmin = userInfo.admin === 'true';

  // $ init data
  const { t } = useTranslation();

  // # states
  const [isLoading, setIsLoading] = useState(true);
  const [resourceData, setResourceData] = useState([]);
  const [groupVg, setGroupVg] = useState();
  const [members, setMembers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [isModalShow, setIsModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [modalData, setModalData] = useState({});
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

  const getData = () => {
    setIsLoading(true);
    Promise.all([
      getGroupMembers(group.name),
      getGroupApplyList({ group: group.name }),
      getGroupVirtualGroup(group.name),
      ...group.resources.map(resource => getResource(resource))
    ])
      .then(([added, applied, groupVg, ...resource]) => {
        const addedUsers = added.map(user => ({
          ...user,
          applyState: 1,
          inviteState: 1
        }))
        const applyUsers = applied.map(user => ({
          ...user,
          roles: [],
          virtualGroups: [],
          jobLifeHour: '',
          state: null,
          username: user.user
        }))

        setMembers([...addedUsers, ...applyUsers])
        setResourceData([...resource])
        setGroupVg(groupVg)
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const onPass = (user) => {
    inviteGroupMember({
      user,
      group: group.name,
      inviteState: 1
    }, isAdmin)
      .then(() => {
        getData()
        getMenuData()
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }

  const onDelete = (user) => {
    inviteGroupMember({
      user,
      group: group.name,
      inviteState: -1
    })
      .then(() => {
        getData()
        getMenuData()
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }


  // * hooks
  useEffect(() => {
    if (group.name) getData()
    if (queryParamName) {
      setKeyword(queryParamName)
    }
  }, [group])

  return (
    <div className={`${classes.groupManageTabContentContainer}`}>
      <div className={`${classes.groupManageTabContentTopBar}`}>
        <div>
          <PrimaryButton
            children={`${t('invite')}${t('enSpace')}${t('TeamMember')}`}
            className={classes.mr_10}
            onClick={() => setIsModalShow(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            onClick={getData}
            startIcon={<Refresh />}
          />
        </div>
        <div>
          <MuiAutocomplete
            className={`${classes.mr_10} ${classes.h_auto}`}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        isLoading || isMenuLoading
          ? <></>
          :
          <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
            <BasePaper
              columns={[
                applySortProps({
                  id: 'username',
                  key: 'username',
                  label: t('name')
                }),
                applySortProps({
                  id: 'role',
                  key: 'role',
                  label: t('role'),
                  onTableCellRender: (info) => {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                          info.roles.map(role => <span key={role}>{role}</span>)
                        }
                      </div>
                    )
                  }
                }),
                applySortProps({
                  id: 'virtualGroups',
                  key: 'virtualGroups',
                  label: t('virtualCluster'),
                  onTableCellRender: (info) => info.virtualGroups.join(', ')
                }),
                applySortProps({
                  id: 'state',
                  key: 'state',
                  label: t('status'),
                  onTableCellRender: (info) => {
                    const convertStateToText = (state) => {
                      switch (state) {
                        case -1:
                          return 'denied';
                        case 0:
                          return 'verifying';
                        case 1:
                          return 'verified';
                        default:
                          return '';
                      }
                    }
                    const defineStatus = ['verified', 'verifying', 'denied'];
                    const defineStyles = {
                      verified: { color: 'green', backgroundColor: '#D6F8C5' },
                      verifying: { color: 'orange', backgroundColor: '#FFF8EA' },
                      denied: { color: 'red', backgroundColor: '#FDE7E9' }
                      // none: {}
                    }
                    return (
                      <BaseStatusBadge
                        children={
                          info.state === null
                            ? null
                            : info.state === 1 ? t('verified') : info.state === 0 ? t('verifying') : t('denied')
                        }
                        customStatus={defineStatus}
                        customStyles={defineStyles}
                        status={convertStateToText(info.state)}
                      />
                    )
                  }
                }),
                applySortProps({
                  id: 'groupState',
                  key: 'groupState',
                  label: `${t('group2')}${t('enSpace')}${t('status')}`,
                  onTableCellRender: (info) => {
                    const defineStatus = ['joined', 'applied', 'invited'];
                    const defineStyles = {
                      joined: { color: '#0070C6', backgroundColor: '#C9F1FC' },
                      applied: { color: '#FFA500', backgroundColor: '#FFF8EA' },
                      invited: { color: '#FF5974', backgroundColor: '#FFE4DD' }
                    }
                    const state = (() => {
                      const { applyState, inviteState } = info
                      if (applyState === 1 && inviteState === 1) {
                        return 'joined'
                      } else if (applyState === 1 && inviteState === 0) {
                        return 'applied'
                      } else if (applyState === 0 && inviteState === 1) {
                        return 'invited'
                      } else {
                        return ''
                      }
                    })()
                    return (
                      <BaseStatusBadge
                        children={
                          state === 'joined'
                            ? t('joined')
                            : state === 'applied' ? t('applied') : t('invited')
                        }
                        customStatus={defineStatus}
                        customStyles={defineStyles}
                        status={state}
                      />
                    )
                  }
                }),
                {
                  id: 'editVirtualGroup',
                  key: 'editVirtualGroup',
                  label: t('edit'),
                  onTableCellRender: (info) => {
                    const state = (() => {
                      const { applyState, inviteState } = info
                      if (applyState === 1 && inviteState === 1) {
                        return 0
                      } else if (applyState === 1 && inviteState === 0) {
                        return 1
                      } else {
                        return 2
                      }
                    })()
                    return (
                      <IconButton
                        children={<Icon>drive_file_rename_outline</Icon>}
                        disabled={state === 1 || state === 2}
                        onClick={() => {
                          setIsEditModalShow(true)
                          setSelectedUser(info)
                        }}
                      />
                    )
                  }
                },
                {
                  id: 'pass',
                  key: 'pass',
                  label: t('passed'),
                  onTableCellRender: (info) => {
                    return (
                      <IconButton
                        children={<Icon>how_to_reg</Icon>}
                        disabled={!(info.applyState === 1 && info.inviteState === 0)}
                        onClick={() => {
                          setIsConfirmModalShow(true)
                          setModalData({
                            title: `${t('passed')}${t('enSpace')}${t('TeamMember')}`,
                            content: t('surePassGroupMember', { name: info.username }),
                            confrimText: t('passed'),
                            method: () => onPass(info.username)
                          })
                        }}
                      />
                    )
                  }
                },
                {
                  id: 'delete',
                  key: 'delete',
                  label: t('delete'),
                  onTableCellRender: (info) => {
                    return (
                      <IconButton
                        children={<Icon>delete_outline</Icon>}
                        onClick={() => {
                          setIsConfirmModalShow(true)
                          setModalData({
                            title: `${t('delete')}${t('enSpace')}${t('TeamMember')}`,
                            content: t('sureDelete', { name: info.username }),
                            confrimText: t('delete'),
                            method: () => onDelete(info.username)
                          })
                        }}
                      />
                    )
                  }
                }
              ]}
              getKey={(row) => row.username}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(members.filter(item => item.username.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
      }
      {
        isModalShow &&
        <InviteModal
          getData={getData}
          groupName={group.name}
          isAdmin={isAdmin}
          isOpen={isModalShow}
          members={members}
          onClose={() => setIsModalShow(false)}
        />
      }
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
      {
        isEditModalShow &&
        <EditModal
          getData={getData}
          groupName={group.name}
          groupVg={groupVg}
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
          resourceData={resourceData}
          selectedUser={selectedUser}
        />
      }
    </div>
  );
};

Member.propTypes = {
  group: PropTypes.object,
  queryParamName: PropTypes.string
};

export default Member;