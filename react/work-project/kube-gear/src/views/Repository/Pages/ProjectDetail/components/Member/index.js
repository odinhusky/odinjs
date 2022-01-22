import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';

import AddModal from './AddModal';
import EditModal from './EditModal';
import ConfirmModal from 'components/ConfirmModal';

import { deleteProjectMember } from 'utils/api';

import GlobalContext from 'layouts/Main/GlobalContext';
import Context from '../../../../Context';

import Ordering from '../../../../Ordering';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const Member = ({ data, getData, isLoading, keyword }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { userInfo } = useContext(GlobalContext)
  const { getProjectList } = useContext(Context);
  const [isAddModalShow, setIsAddModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isComfrimModalShow, setIsConfrimShow] = useState(false);
  const [selectionDetail, setSelectionDetail] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    if (selectionDetail.length === 0) {
      toast.error(t('pleaseSelectMember'));
      return;
    }

    Promise.all(
      selectionDetail.map(member => deleteProjectMember(member.project_id, member.id))
    )
      .then(() => {
        if (selectionDetail.find(member => member.entity_name === userInfo.username)) {
          history.push('/repository')
          getProjectList();
        } else {
          toast.success(t('success'))
          getData();
        }
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }
  const currentUserData = data && data.find(item => item.entity_name === userInfo.username)

  return (
    <>
      {
        ((currentUserData && currentUserData.role_id === 1) || userInfo.admin === 'true') &&
          <div style={{ backgroundColor: '#fff', padding: 15 }}>
            <PrimaryButton
              children={`${t('add')}${t('enSpace')}${t('member')}`}
              classes={{ root: classes.marginRight10 }}
              onClick={() => setIsAddModalShow(true)}
              startIcon={<Icon>person_add_alt</Icon>}
            />
            <DefaultButton
              children={`${t('edit')}${t('enSpace')}${t('member')}`}
              classes={{ root: classes.marginRight10 }}
              disabled={selectionDetail.length === 0}
              onClick={() => {
                if (selectionDetail.length === 0)
                  return toast.error(t('pleaseSelectMember'));

                setIsEditModalShow(true)
              }}
              startIcon={<Icon>edit</Icon>}
            />
            <DefaultButton
              children={`${t('delete')}${t('enSpace')}${t('member')}`}
              disabled={selectionDetail.length === 0}
              onClick={() => {
                if (selectionDetail.length === 0) {
                  toast.error(t('pleaseSelectMember'));
                  return;
                }
                setIsConfrimShow(true)
              }}
              startIcon={<Icon>delete</Icon>}
            />
          </div>
      }
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {
          isLoading
            ? <></>
            :
            <BasePaper
              columns={[
                applySortProps({
                  id: 'entity_name',
                  key: 'entity_name',
                  label: t('name')
                }),
                applySortProps({
                  id: 'role_name',
                  key: 'role_name',
                  label: t('role'),
                  onTableCellRender: data => {
                    switch (data.role_id) {
                      case 1:
                        return <div>{t('project')}{t('enSpace')}{t('admin')}</div>;
                      case 2:
                        return <div>{t('maintainer')}</div>;
                      case 3:
                        return <div>{t('Guest')}</div>
                    }
                  }
                })
              ]}
              itemChecked
              itemCheckedAllChange={(e, checked, rows) => {
                if (checked) {
                  setSelectionDetail(rows)
                } else {
                  setSelectionDetail([])
                }
              }}
              itemCheckedChange={(e, checked, row) => {
                if (checked) {
                  setSelectionDetail(prev => ([...prev, row]))
                } else {
                  setSelectionDetail(prev => ([...prev].filter(selected => selected.name !== row.name)))
                }
              }}
              itemCheckedData={selectionDetail}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(data.filter(item => item.entity_name.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              selectionMode={0}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
        }
      </div>
      {
        isAddModalShow &&
        <AddModal
          getMemberList={getData}
          isOpen={isAddModalShow}
          memberList={data}
          onClose={() => {
            setSelectionDetail([])
            setIsAddModalShow(false)
          }}
        />
      }
      {
        isEditModalShow &&
        <EditModal
          getMemberList={getData}
          isOpen={isEditModalShow}
          memberList={selectionDetail}
          onClose={() => {
            setSelectionDetail([])
            setIsEditModalShow(false)
          }}
        />
      }
      {
        isComfrimModalShow &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectionDetail.map(member => member.entity_name).join(', ') })}
          isOpen={isComfrimModalShow}
          onClose={() => setIsConfrimShow(false)}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('member')}`}
        />
      }
    </>
  );
};

Member.propTypes = {
  data: PropTypes.array,
  getData: PropTypes.func,
  keyword: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Member;