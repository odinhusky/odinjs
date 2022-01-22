import React, { useState, useEffect, useContext } from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import ConfirmModal from 'components/ConfirmModal';
import BasePaper from 'components/BaseMuiPaper';

import Ordering from './Ordering';

import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

import Context from '../../../../Context';
import style from './index.module.scss';

import { deleteResourceVirtualGroup } from 'utils/api';
import { MB } from 'constant';
import { formatBytes } from 'utils';

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

const Group = ({ data, resourceUnits }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    getData,
    isLoading,
    setIsCreateGroupModalShow,
    setIsModifyGroupModalShow,
    setIsUserSettingModalShow,
    setModifyGroupSelectedItem,
    setUserSettingGroupSelectedItem,
    setUserSettingVgCells
  } = useContext(Context);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [VGInfoList, setVGInfoList] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clickedData, setClickedData] = useState({});

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

  const onDelete = () => {
    setIsDeleting(true);
    deleteResourceVirtualGroup(clickedData.name)
      .then(() => {
        getData();
        setIsDeleting(false);
      })
      .catch(err => {
        const msg = err.data.message ? err.data.message : err.toString();
        toast.error('Error:' + msg)
        setIsDeleting(false);
      });
  }

  const columns = [
    applySortProps({
      id: 'name',
      label: t('name'),
      onTableCellRender: data => (<div>{data.name}</div>),
      width: 200
    }),
    applySortProps({
      id: 'memoryUsed',
      label: `${t('used')}${t('enSpace')}${t('memory')}`,
      onTableCellRender: data => (<div>{formatBytes(data.usedResource.memoryUsed * MB)}</div>)
    }),
    applySortProps({
      id: 'memory',
      label: `${t('total')}${t('enSpace')}${t('memory')}`,
      onTableCellRender: data => (<div>{formatBytes(data.totalResource.memory * MB)}</div>)
    }),
    applySortProps({
      id: 'cpuUsed',
      label: `${t('used')}${t('enSpace')}${t('CPU')}`,
      onTableCellRender: data => (<div>{data.usedResource.cpuUsed}</div>)
    }),
    applySortProps({
      id: 'cpu',
      label: `${t('total')}${t('enSpace')}${t('CPU')}`,
      onTableCellRender: data => (<div>{data.totalResource.cpu}</div>)
    }),
    applySortProps({
      id: 'storageUsed',
      label: `${t('used')}${t('enSpace')}${t('GPU')}`,
      onTableCellRender: data => (<div>{data.usedResource.gpuUsed}</div>)
    }),
    applySortProps({
      id: 'storage',
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
      id: 'activeJobs',
      label: `${t('Jobs')}`,
      onTableCellRender: data => (<div>{data.activeJobs}</div>)
    }),
    applySortProps({
      id: 'schedulable',
      label: t('schedulable'),
      onTableCellRender: data => (<div>{t(data.schedulable ? 'yes' : 'no')}</div>)
    }),
    {
      id: 'action',
      label: t('Operations'),
      onTableCellRender: (data) => {
        const options = [
          {
            id: 'setting',
            label: `${t('UserConfig')}`,
            handleItemclick: () => {
              setIsUserSettingModalShow(true);
              setUserSettingGroupSelectedItem(data.name)
              setUserSettingVgCells({ vg: data.name, cells: data.cells })
            },
            icon: <Icon>app_registration</Icon>
          },
          {
            id: 'delete',
            label: t('delete'),
            handleItemclick: () => {
              setClickedData(data);
              setShowDeleteModal(true);
            },
            icon: <Icon>delete</Icon>
          }
        ]
        return (
          <>
            {
              isDeleting
                ? <CircularProgress />
                :
                <div>
                  <SplitButton
                    onClick={() => {
                      setIsModifyGroupModalShow(true)
                      setModifyGroupSelectedItem(data.name)
                    }}
                    options={options}
                    startIcon={<Icon>edit</Icon>}
                    text={t('Edit')}
                  />
                </div>
            }
          </>
        )
      }
    }
  ]

  useEffect(() => {
    if (!isEmpty(data)) {
      const list = []
      for (const vgInfo of data) {
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

        list.push({ ...vgInfo, totalResource, usedResource })
      }
      setVGInfoList(list)
    } else if (isEmpty(data)) {
      setVGInfoList([])
    }
  }, [data])

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('group')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setIsCreateGroupModalShow(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            disabled={isLoading}
            onClick={() => getData()}
            startIcon={<Icon>refresh</Icon>}
          />
        </div>
        <div>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('resource')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        !isEmpty(VGInfoList)
          ?
          <div className={style.container}>
            <BasePaper
              columns={columns}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(VGInfoList.filter(item => item.name.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              // TableContainerStyle={{ maxHeight: 200, minHeight: 200 }}
            />
          </div>
          : <div style={{ padding: 20 }}>{t('noCreateAnyGroup')}</div>
      }
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: clickedData.name })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('group')}`}
      />
    </div>
  );
};

Group.propTypes = {
  data: PropTypes.array,
  resourceUnits: PropTypes.object
}

export default Group;