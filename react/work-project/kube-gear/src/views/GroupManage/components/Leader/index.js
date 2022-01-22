import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { PrimaryButton, DefaultButton, IconButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';

import { getGroupLeaders, updateGroup } from 'utils/api';
import Ordering from '../../Ordering';
import CreateModal from './CreateModal';
import GlobalContext from 'layouts/Main/GlobalContext';

import style from '../scss/index.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))

const Leader = ({ group, disabledDeleteBtnList, selectedItem }) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(GlobalContext)
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [isModalShow, setIsModalShow] = useState(false);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState('');

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
    setIsLoading(true)
    getGroupLeaders(group)
      .then(data => setLeaders(data))
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const onDelete = () => {
    const formData = {
      name: group,
      leaders: leaders.filter(item => item.username !== selectedUser).map(item => item.username)
    }
    updateGroup(formData)
      .then(() => getData())
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }

  useEffect(() => {
    if (group) {
      getData()
    }
  }, [group])

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        <div>
          <PrimaryButton
            children={`${t('Assign')}${t('enSpace')}${t('TeamLeader')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
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
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        isLoading
          ? <></>
          :
          <div style={{ flex: 1, overflow: 'hidden' }}>
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
                  onTableCellRender: (info) => (info.roles.join(', '))
                }),
                applySortProps({
                  id: 'virtualGroups',
                  key: 'virtualGroups',
                  label: t('virtualCluster'),
                  onTableCellRender: (info) => (info.virtualGroups.join(', '))
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
                    }
                    return (
                      <BaseStatusBadge
                        children={info.state === 1 ? t('verified') : info.state === 0 ? t('verifying') : t('denied')}
                        customStatus={defineStatus}
                        customStyles={defineStyles}
                        status={convertStateToText(info.state)}
                      />
                    )
                  }
                }),
                {
                  id: 'delete',
                  key: 'delete',
                  label: t('delete'),
                  onTableCellRender: (data) => {
                    const user = userInfo.username;
                    return (
                      <IconButton
                        children={<Icon>delete_outline</Icon>}
                        color={'primary'}
                        disabled={
                          user !== data.username
                            ? false
                            : disabledDeleteBtnList.includes(selectedItem)
                        }
                        onClick={() => {
                          setSelectedUser(data.username);
                          setIsDeleteModalShow(true)
                        }}
                      />
                    )
                  }
                }
              ]}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(leaders.filter(item => item.username.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
      }
      {
        isModalShow &&
        <CreateModal
          getData={getData}
          groupName={group}
          isOpen={isModalShow}
          leaders={leaders}
          onClose={() => setIsModalShow(false)}
        />
      }
      {
        isDeleteModalShow &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectedUser })}
          isOpen={isDeleteModalShow}
          onClose={() => setIsDeleteModalShow(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}${t('TeamLeader')}`}
        />
      }
    </div>
  );
};

Leader.propTypes = {
  group: PropTypes.string,
  disabledDeleteBtnList: PropTypes.array,
  selectedItem: PropTypes.string
};

export default Leader;