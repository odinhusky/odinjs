/* eslint-disable react/no-multi-comp */
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getTheme } from 'office-ui-fabric-react';
import BaseTable from 'components/BaseTable';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Context from '../Context';
import { useTranslation } from 'react-i18next';
import { deleteJobTemplate } from 'utils/api';
import { toast } from 'react-toastify';
import Ordering from '../Ordering';

const UITheme = getTheme();

function Table() {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    userInfo,
    isLoading,
    setIsLoading,
    pagination,
    getData,
    templateList,
    designateUpdateUser,
    setViewTemplate,
    setDesignateUpdateUser,
    setIsEditModalShow,
    setIsViewModalShow,
    filter,
    ordering,
    setOrdering
  } = useContext(Context);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        const msg = err.data ? err.data.message : err.message;
        toast.error(msg);
      })
      .finally(() => setIsLoading(false))
  };

  const disabledStyles = (disabled) => {
    if (disabled) {
      return {
        root: {
          color: '#A19F9D',
          cursor: 'default'
        },
        iconHovered: {
          color: '#A19F9D'
        }
      }
    } else {
      return {
        root: {
          color: UITheme.palette.themePrimary
        },
        iconHovered: {
          color: UITheme.palette.themePrimary,
          transform: 'scale(1.25,1.25)',
          transition: 'transform 0.25s ease'
        }
      }
    }
  }

  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
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
    return column;
  }

  const columns = [
    applySortProps({
      key: 'name',
      name: t('name'),
      fieldName: 'name',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      onRender: templateInfo => (
        <Label
          onClick={() => onView(templateInfo)}
          style={{
            padding: '5px 0',
            display: 'inline-block',
            color: UITheme.palette.themePrimary,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {templateInfo.name}
        </Label>
      )
    }),
    {
      key: 'creator',
      name: t('Creator'),
      fieldName: 'creator',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: templateInfo => (
        <Label>
          {templateInfo.owner}
        </Label>
      )
    },
    {
      key: 'description',
      name: t('description'),
      fieldName: 'description',
      minWidth: 300,
      maxWidth: 300,
      isResizable: true,
      onRender: templateInfo => (
        <Label>
          {templateInfo.description}
        </Label>
      )
    },
    {
      key: 'editTemplate',
      name: `${t('Edit')}`,
      fieldName: 'editTemplate',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: templateInfo => {
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
          <Stack horizontalAlign="space-between">
            <Stack.Item>
              <IconButton
                iconProps={{ iconName: 'Edit' }}
                onClick={() => {
                  if (hasEditPrivilege) {
                    history.push(`/template-manage/form?name=${templateInfo.name}&owner=${templateInfo.owner}`)
                  }
                }}
                styles={disabledStyles(!hasEditPrivilege)}
              />
            </Stack.Item>
          </Stack>
        )}
    },
    {
      key: 'setting',
      name: t('setting'),
      fieldName: 'setting',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: templateInfo => (
        <Stack horizontalAlign="space-between">
          <Stack.Item>
            <IconButton
              iconProps={{ iconName: 'Settings' }}
              onClick={() => {
                if (userInfo.username === templateInfo.owner) {
                  onEdit(templateInfo);
                }
              }}
              styles={disabledStyles(userInfo.username !== templateInfo.owner)}
            />
          </Stack.Item>
        </Stack>
      )
    },
    {
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: templateInfo => {
        let hasDeletePrivilege = false;
        if (userInfo.username === templateInfo.owner || userInfo.admin === 'true' ) {
          hasDeletePrivilege = true
        }
        return (
          <Stack horizontalAlign="space-between">
            <Stack.Item>
              <IconButton
                iconProps={{ iconName: 'Delete' }}
                onClick={() => {
                  if (hasDeletePrivilege) {
                    setShowDeleteModal(true);
                    setDesignateUpdateUser(templateInfo)
                  }
                }}
                styles={disabledStyles(!hasDeletePrivilege)}
              />
            </Stack.Item>
          </Stack>
        )}
    }
  ];

  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={pagination.apply(filter.apply(ordering.apply(templateList)))}
        setKey="roleInfo"
        shimmerLines={10}
      />
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: designateUpdateUser.name })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('template')}`}
      />
    </>
  );
}

export default Table;
