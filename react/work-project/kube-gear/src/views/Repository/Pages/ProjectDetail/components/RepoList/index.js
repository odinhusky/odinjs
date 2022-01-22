/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import BasePaper from 'components/BaseMuiPaper';
import { PrimaryButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import { deleteProjectRepositories } from 'utils/api';
import { toast } from 'react-toastify';
import Context from '../../../../Context';
import BaseLink from 'components/BaseLink';
import Ordering from '../../../../Ordering';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
`

const RepoList = React.memo(({ repoList, keyword, getData, currentUserId }) => {
  const { t } = useTranslation();
  const { isLoading } = useContext(Context);
  const [ordering, setOrdering] = useState(new Ordering());
  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);

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
    Promise.all(selectedRepositories.map(repositories => {
      const encodeName = encodeURIComponent(repositories.name)
      return deleteProjectRepositories(encodeName)
    }))
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`)
        getData();
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }

  const columns = [
    applySortProps({
      id: 'name',
      key: 'name',
      label: t('name'),
      onTableCellRender: (repoData) => {
        return (
          <BaseLink to={`/repository/${repoData.name}`}>
            {repoData.name}
          </BaseLink>
        )
      }
    }),
    applySortProps({
      id: 'tags_count',
      key: 'tags_count',
      label: `${t('Tags')}`,
      onTableCellRender: (repoData) => repoData.tags_count
    }),
    applySortProps({
      id: 'pull_count',
      key: 'pull_count',
      label: `${t('Pulls')}`,
      onTableCellRender: (repoData) => repoData.pull_count
    })
  ];

  return (
    <>
      {
        currentUserId === 1 &&
        <Wrapper style={{ padding: 20 }}>
          <PrimaryButton
            children={`${t('delete')}${t('enSpace')}${t('Repositories')}`}
            disabled={selectedRepositories.length === 0}
            onClick={() => setIsDeleteModalShow(true)}
          />
        </Wrapper>
      }
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {
          isLoading
            ? <></>
            :
            <BasePaper
              columns={columns}
              itemChecked
              itemCheckedAllChange={(e, checked, rows) => {
                if (checked) {
                  setSelectedRepositories(rows)
                } else {
                  setSelectedRepositories([])
                }
              }}
              itemCheckedChange={(e, checked, row) => {
                if (checked) {
                  setSelectedRepositories(prev => ([...prev, row]))
                } else {
                  setSelectedRepositories(prev => ([...prev].filter(selected => selected.name !== row.name)))
                }
              }}
              itemCheckedData={selectedRepositories}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(repoList.filter(repo => repo.name.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              selectionMode={0}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
        }
      </div>
      {
        isDeleteModalShow &&
        <ConfirmModal
          confrimText={`${t('delete')}`}
          content={t('sureDelete', { name: selectedRepositories.map(repositories => repositories.name).join(', ') })}
          isOpen={isDeleteModalShow}
          onClose={() => setIsDeleteModalShow(false)}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('tag')}`}
        />
      }
    </>
  );
});

RepoList.propTypes = {
  repoList: PropTypes.array,
  keyword: PropTypes.string,
  getData: PropTypes.func,
  currentUserId: PropTypes.number
}

export default RepoList;