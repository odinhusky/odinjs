/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import BaseTable from 'components/BaseTable';
import BaseLink from 'components/BaseLink';
import { IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { Label } from 'office-ui-fabric-react';
import { deleteHarborProject } from 'utils/api';
import moment from 'utils/moment';
import { toast } from 'react-toastify';
import Ordering from '../../../Ordering';
import RepositoryContext from '../../../RepositoryContext';

const Table = ({ data, isLoading, ordering, setOrdering, getProjectInfo }) => {
  const { t } = useTranslation();
  const { getProjectList } = useContext(RepositoryContext)
  const location = useLocation();
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const onColumnClick = (event, column) => {
    const { field, descending } = ordering;
    if (field === column.key) {
      if (descending) {
        setOrdering(new Ordering());
      } else {
        setOrdering(new Ordering(field, true));
      }
    } else {
      setOrdering(new Ordering(column.key));
    }
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

  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = onColumnClick;
    return column;
  }

  const columns = [
    applySortProps({ key: 'name',
      name: `${t('project')}${t('enSpace')}${t('name')}`,
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(repoData) {
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
      key: 'public',
      name: t('isPublic'),
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(repoData) {
        return repoData.metadata.public === 'true' ? <Label>{t('public')}</Label> : <Label>{t('private')}</Label>;
      }
    }),
    applySortProps({
      key: 'repo_count',
      name: `${t('RepositoriesCount')}`,
      fieldName: 'repo_count',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: data => <Label>{data.repo_count}</Label>
    }),
    applySortProps({
      key: 'current_user_role_id',
      name: t('role'),
      fieldName: 'current_user_role_id',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(data) {
        switch (data.current_user_role_id) {
          case 0:
            return <Label>-</Label>;
          case 1:
            return <Label>{t('project')}{t('enSpace')}{t('admin')}</Label>;
          case 2:
            return <Label>{t('maintainer')}</Label>;
          case 3:
            return <Label>{t('Guest')}</Label>
        }
      }
    }),
    applySortProps({
      key: 'creation_time',
      name: t('createTime'),
      fieldName: 'creation_time',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(repoData) {
        return <Label>{moment(repoData.creation_time).format('YYYY/MM/DD HH:mm:ss')}</Label>;
      }
    }),
    applySortProps({
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender(projectData) {
        const canDeleteProject = projectData.repo_count === 0 ? true : false;
        return (
          <IconButton
            disabled={!canDeleteProject}
            iconProps={{ iconName: 'Delete' }}
            onClick={() => {
              setSelectedProjects(projectData)
              setIsDeleteModalShow(true)
            }}
          />
        )
      }
    })
  ];

  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={data}
      />
      {
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
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func,
  getProjectInfo: PropTypes.func
};

export default Table;