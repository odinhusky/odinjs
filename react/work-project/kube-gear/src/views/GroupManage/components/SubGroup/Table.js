/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import BaseTable from 'components/BaseTable';
import { useTranslation } from 'react-i18next';
import Ordering from '../../Ordering';
import { IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import EditModal from './EditModal';
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint
} from 'office-ui-fabric-react/lib/Tooltip';
import { toast } from 'react-toastify';
import { deleteGroup } from 'utils/api';
import Context from '../../Context';
import GlobalContext from 'layouts/Main/GlobalContext'
import BaseLink from 'components/BaseLink';
import { isEmpty } from 'lodash'
import { mergeStyles, Link } from 'office-ui-fabric-react';

const Table = ({ isLoading, data, ordering, setOrdering }) => {
  const { isMenuLoading, setSelectedItem, getMenuData } = useContext(Context);
  const { userInfo, setUserInfo } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const onDelete = name => {
    deleteGroup(name)
      .then(() => {
        if (userInfo.leaderGroups && userInfo.leaderGroups.includes(name)) {
          setUserInfo(prev => ({ ...prev, leaderGroups: prev.leaderGroups.filter(group => group !== name) }))
        } else {
          getMenuData();
        }
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
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
      minWidth: 10,
      maxWidth: 100,
      isResizable: true
    }),
    applySortProps({
      key: 'leaders',
      name: t('TeamLeader'),
      fieldName: 'leaders',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender(info) {
        return (
          <div className={mergeStyles({ display: 'flex', flexDirection: 'column' })}>
            {info.leaders.map(leader =>
              <span
                className={mergeStyles({ padding: '2px 0' })}
                key={leader}
              >
                {leader}
              </span>
            )}
          </div>
        )
      }
    }),
    applySortProps({
      key: 'users',
      name: t('TeamMember'),
      fieldName: 'users',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender(info) {
        const userData = info.users;
        return (
          <>
            {
              isEmpty(info.users)
                ? <span>{userData.length}</span>
                :
                <TooltipHost
                  delay={TooltipDelay.zero}
                  directionalHint={DirectionalHint.leftCenter}
                  styles={{ root: { display: 'inline-block' } }}
                  tooltipProps={{
                    onRenderContent: () => {
                      return (
                        <>
                          {
                            userData.map(user => <div key={user}>{user}</div>)
                          }
                        </>
                      );
                    }
                  }}
                >
                  <span>
                    {userData.length}
                  </span>
                </TooltipHost>
            }
          </>
        )
      }
    }),
    applySortProps({
      key: 'resources',
      name: t('resourceList'),
      fieldName: 'resources',
      minWidth: 10,
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        return (
          <div className={mergeStyles({ display: 'flex', flexDirection: 'column' })}>
            {
              isEmpty(info.resources)
                ? <span>-</span>
                :
                info.resources.map(resource =>
                  <BaseLink
                    key={resource}
                    style={{ padding: '2px 0 !important' }}
                    to={`/resource-manage?selectedItem=${resource}`}
                  >{resource}</BaseLink>
                )
            }
          </div>
        )
      }
    }),
    applySortProps({
      key: 'children',
      name: t('SubTeamList'),
      fieldName: 'children',
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        return (
          <div className={mergeStyles({ display: 'flex', flexDirection: 'column' })}>
            {
              isEmpty(info.children)
                ? <span>-</span>
                : info.children.map(child =>
                  <Link
                    className={mergeStyles({ padding: '2px 0' })}
                    key={child.name}
                    onClick={() => {
                      setSelectedItem(child.name)
                    }}
                  >
                    {child.name}
                  </Link>
                )
            }
          </div>
        )
      }
    }),
    {
      key: 'edit',
      name: t('Edit'),
      fieldName: 'edit',
      maxWidth: 100,
      isResizable: false,
      onRender(info) {
        return (
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => {
              setIsEditModalShow(true)
              setSelectedGroup(info)
            }}
          />
        )
      }
    },
    {
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      maxWidth: 100,
      isResizable: false,
      onRender(info) {
        return (
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => {
              setIsModalShow(true)
              setModalData({
                title: `${t('delete')}${t('enSpace')}${t('SubTeam')}`,
                content: t('sureDelete', { name: info.name }),
                confrimText: t('delete'),
                method: () => onDelete(info.name)
              })
            }}
          />
        )
      }
    }
  ];
  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading || isMenuLoading}
        items={ordering.apply(data)}
      />
      {
        isModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isModalShow}
          onClose={() => setIsModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
      {
        isEditModalShow &&
        <EditModal
          group={selectedGroup}
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
        />
      }
    </>
  )
}

Table.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func,
  members: PropTypes.array,
  groupName: PropTypes.string,
  getData: PropTypes.func
}

export default Table;