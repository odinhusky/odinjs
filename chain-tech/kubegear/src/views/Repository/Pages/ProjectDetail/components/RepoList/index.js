/* eslint-disable react/no-multi-comp */
import React, {
  useState,
  useContext
} from 'react';

// # API
import { deleteProjectRepositories } from 'utils/api';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Context
import RepositoryContext from '../../../../RepositoryContext';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import BaseLink from 'components/BaseLink';
import Ordering from '../../../../Ordering';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/BaseButton';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
`
/**
 * @author odin
 * @level views/Repository/ProjectDetail/RepoList
 * @component RepoList
 * @description RepoList
*/
const RepoList = React.memo(({
  repoList,
  keyword,
  getData,
  currentUserId
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { isLoading, classes } = useContext(RepositoryContext);

  // # states
  const [ordering, setOrdering] = useState(new Ordering());
  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);

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
        <Wrapper className={`${classes.p_20}`}>
          <PrimaryButton
            children={`${t('delete')}${t('enSpace')}${t('Repositories')}`}
            disabled={selectedRepositories.length === 0}
            onClick={() => setIsDeleteModalShow(true)}
            startIcon={<Icon>delete_outline</Icon>}
          />
        </Wrapper>
      }
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
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