import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Refresh } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import BaseLink from 'components/BaseLink';
import { DefaultButton, IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Tooltip from '@material-ui/core/Tooltip';

import Context from '../../Context';
import Ordering from '../../Ordering'
import { formatBytes } from 'utils';
import { MB } from 'constant';
import { getResource, unbindResourceFromGroup, getHivedResourceUnit } from 'utils/api';

import style from '../scss/index.module.scss';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

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

const Resource = ({ group }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { isMenuLoading, getMenuData } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [resourceData, setResourceData] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalShow, setIsModalShow] = useState(false);
  const [modalData, setModalData] = useState({});

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

  const onDelete = (groupName, resourceName) => {
    unbindResourceFromGroup(groupName, resourceName)
      .then(() => {
        getMenuData();
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }

  const getResourceData = () => {
    if (isEmpty(group.resources)) {
      setResourceData([]);
      return;
    }
    setIsLoading(true)
    Promise.all([...group.resources.map(resource => getResource(resource)), getHivedResourceUnit()])
      .then((data) => {
        const resourceUnits = data.pop()
        const list = data.map((vgInfo) => {
          const { cells, usedCells } = vgInfo;
          const perTotalResource = []
          const perUsedResource = []
          // caculate pre resource and pre unit
          for (const key in cells) {
            const { resourceUnit: unit, number } = cells[key];
            perTotalResource.push({
              cpu: resourceUnits[unit].cpu * number,
              memory: resourceUnits[unit].memory * number,
              gpu: resourceUnits[unit].gpu === null ? 0 : resourceUnits[unit].gpu * number
            })
            if (usedCells[key] !== undefined) {
              perUsedResource.push({
                cpuUsed: resourceUnits[unit].cpu * usedCells[key],
                memoryUsed: resourceUnits[unit].memory * usedCells[key],
                gpuUsed: resourceUnits[unit].gpu === null ? 0 : resourceUnits[unit].gpu * usedCells[key]
              })
            }
          }

          const totalResource = perTotalResource.reduce((acc, cur) => {
            return {
              cpu: acc.cpu + cur.cpu,
              memory: acc.memory + cur.memory,
              gpu: acc.gpu + (cur.gpu === null ? 0 : cur.gpu)
            }
          }, { cpu: 0, memory: 0, gpu: 0 })

          const usedResource = perUsedResource.reduce((acc, cur) => {
            return {
              cpuUsed: acc.cpuUsed + cur.cpuUsed,
              memoryUsed: acc.memoryUsed + cur.memoryUsed,
              gpuUsed: acc.gpuUsed + cur.gpuUsed
            }
          }, { cpuUsed: 0, memoryUsed: 0, gpuUsed: 0 })

          return { ...vgInfo, totalResource, usedResource }
        })
        setResourceData(list)
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getResourceData();
  }, [group])

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        <DefaultButton
          children={t('refresh')}
          disabled={isMenuLoading}
          onClick={getMenuData}
          startIcon={<Refresh />}
        />
        <MuiAutocomplete
          classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
          onInputChange={(e, value) => setKeyword(value)}
          placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
          value={keyword}
        />
      </div>
      {
        isEmpty(resourceData)
          ? <p style={{ padding: 20 }}>{`${t('resource')}${t('enSpace')}${t('isEmpty')}`}</p>
          :
          isLoading
            ? <></>
            :
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <BasePaper
                columns={[
                  applySortProps({
                    id: 'name',
                    key: 'name',
                    label: t('name'),
                    onTableCellRender: (info) => {
                      return (
                        <BaseLink
                          to={`resource-manage?selectedItem=${info.name}`}
                        >
                          {info.name}
                        </BaseLink>
                      )
                    }
                  }),
                  applySortProps({
                    id: 'memoryUsed',
                    key: 'memoryUsed',
                    label: `${t('used')}${t('enSpace')}${t('memory')}`,
                    onTableCellRender: (info) => {
                      return formatBytes(info.usedResource.memoryUsed * MB)
                    }
                  }),
                  applySortProps({
                    id: 'memoryTotal',
                    key: 'memoryTotal',
                    label: `${t('total')}${t('enSpace')}${t('memory')}`,
                    onTableCellRender: (info) => {
                      return formatBytes(info.totalResource.memory * MB)
                    }
                  }),
                  applySortProps({
                    id: 'cpuUsed',
                    key: 'cpuUsed',
                    label: `${t('used')}${t('enSpace')}${t('CPU')}`,
                    onTableCellRender: (info) => {
                      return `${info.usedResource.cpuUsed}`
                    }
                  }),
                  applySortProps({
                    id: 'cpu',
                    key: 'cpu',
                    label: `${t('total')}${t('enSpace')}${t('CPU')}`,
                    onTableCellRender: (info) => {
                      return `${info.totalResource.cpu}`
                    }
                  }),
                  applySortProps({
                    id: 'gpuUsed',
                    label: `${t('used')}${t('enSpace')}${t('GPU')}`,
                    onTableCellRender: data => (<div>{data.usedResource.gpuUsed}</div>)
                  }),
                  applySortProps({
                    id: 'gpu',
                    label: `${t('total')}${t('enSpace')}${t('GPU')}`,
                    onTableCellRender: data => (<div>{data.totalResource.gpu}</div>)
                  }),
                  {
                    id: 'unit',
                    label: `${t('total')}${t('enSpace')}${t('unit')}`,
                    onTableCellRender: (data) => {
                      const { usedCells, cells } = data;
                      const totalNum = Object.values(cells).reduce((prev, current) => prev + current.number, 0)
                      return (
                        <Tooltip
                          title={
                            totalNum > 0
                              ?
                              <div>
                                {
                                  Object.entries(cells).map(([key, details]) => {
                                    const usedNum = usedCells[key] !== undefined ? usedCells[key] : 0;
                                    return (
                                      <div
                                        key={key}
                                        style={{ padding: 4 }}
                                      >
                                        {details.name}: {t('usePcs', { num: usedNum })} - {t('totalPcs', { num: details.number })}
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              : ''
                          }
                        >
                          <div style={{ backgroundColor: '#c6ecde', textAlign: 'center', cursor: 'pointer' }}>{totalNum}</div>
                        </Tooltip>
                      )
                    }
                  },
                  applySortProps({
                    id: 'subResource',
                    key: 'subResource',
                    label: t('subResource'),
                    onTableCellRender: (info) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {
                            isEmpty(info.children)
                              ? '-'
                              : info.children.map((child, idx) => (<span key={`${info?.name}${idx}`}>{child.name}</span>))
                          }
                        </div>
                      )
                    }
                  }),
                  applySortProps({
                    id: 'virtualGroups',
                    key: 'virtualGroups',
                    label: t('group'),
                    onTableCellRender: (info) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {
                            isEmpty(info.virtualGroups)
                              ? '-'
                              : info.virtualGroups.map((vg, idx) => <span key={`${info?.name}${idx}`}>{vg}</span>)
                          }
                        </div>
                      )
                    }
                  }),
                  {
                    id: 'delete',
                    key: 'delete',
                    label: t('delete'),
                    onTableCellRender: (info) => {
                      return (
                        <>
                          {
                            info.name !== 'system' &&
                            <IconButton
                              children={<Icon>delete_outline</Icon>}
                              onClick={() => {
                                setIsModalShow(true)
                                setModalData({
                                  title: `${t('delete')}${t('enSpace')}${t('SubTeam')}`,
                                  content: t('sureDelete', { name: info.name }),
                                  confrimText: t('delete'),
                                  method: () => onDelete( info.group, info.name)
                                })
                              }}
                            />
                          }
                        </>
                      )
                    }
                  }
                ]}
                labelRowsPerPage={t('labelRowsPerPage')}
                ordering={ordering}
                page={page}
                rows={ordering.apply(resourceData.filter(item => item.name.includes(keyword)))}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
      }
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
    </div>
  );
};

Resource.propTypes = {
  group: PropTypes.object
};

export default Resource;