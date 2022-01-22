import React, { useState, useEffect, useContext } from 'react';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BasePaper from 'components/BaseMuiPaper';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import ConfirmModal from 'components/ConfirmModal';
import Ordering from './Ordering';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

import Context from '../../../../Context';
import style from './index.module.scss';

import { MB } from 'constant';
import { formatBytes } from 'utils';
import { deleteResource } from 'utils/api';

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

const SubResource = ({ data, setIsCreateResourceModalShow, resourceUnits }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { getData, isLoading, setIsModifyResourceModalShow, setModifyResourceSelectedItem } = useContext(Context);

  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDeleting, setIsDeleting] = useState(false);
  const [clickedData, setClickedData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    deleteResource(clickedData.name)
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
      id: 'gpuUsed',
      label: `${t('used')}${t('enSpace')}${t('GPU')}`,
      onTableCellRender: data => (<div>{data.usedResource.gpuUsed}</div>)
    }),
    applySortProps({
      id: 'gpu',
      label: `${t('total')}${t('enSpace')}${t('GPU')}`,
      onTableCellRender: data => (<div>{data.totalResource.gpu}</div>)
    }),
    applySortProps({
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
                          style={{ padding:4 }}
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
    }),
    applySortProps({
      id: 'groupName',
      label: `${t('group2')}`,
      onTableCellRender: data => (<div>{data.group}</div>)
    }),
    applySortProps({
      id: 'subResource',
      label: t('subResource'),
      onTableCellRender: data => (
        <div>
          { data.children.map(item => (<div key={item.name}>{item.name}</div>)) }
        </div>
      )
    }),
    applySortProps({
      id: 'virtualGroups',
      label: t('group'),
      onTableCellRender: data => (
        <div>
          {data.virtualGroups.map(item => (<div key={item}>{item}</div>))}
        </div>
      )
    }),
    {
      id: 'action',
      label: t('Operations'),
      onTableCellRender: (data) => {
        const options = [
          {
            id: 'delete',
            label: t('delete'),
            handleItemclick: () => {
              setClickedData(data);
              setShowDeleteModal(true);
            },
            icon: <Icon style={{ marginRight: '10px' }}>delete</Icon>
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
                      setIsModifyResourceModalShow(true)
                      setModifyResourceSelectedItem(data.name)
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
    if (!isEmpty(data) && !isEmpty(resourceUnits)) {
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

      setList(list)
    } else if (isEmpty(data) && !isEmpty(resourceUnits)) {
      setList([])
    }
  }, [data, resourceUnits])

  return (
    <div className={style.container}>
      <div
        className={style.topBar}
        style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}
      >
        <div>
          <PrimaryButton
            children={`${t('resourceAllocation')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setIsCreateResourceModalShow(true)}
            startIcon={<Icon>widgets</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            disabled={isLoading}
            onClick={() => getData()}
            startIcon={<Refresh />}
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
        !isEmpty(list)
          ?
          <div style={{ flex:1, overflow: 'hidden' }}>
            <BasePaper
              columns={columns}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(list.filter(item => item.name.includes(keyword)))}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
          : <div style={{ padding: 20 }}>{t('noCreateAnySubResource')}</div>
      }
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: clickedData.name })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('resource')}`}
      />
    </div>
  );
};

SubResource.propTypes = {
  data: PropTypes.array,
  setIsCreateResourceModalShow: PropTypes.func,
  resourceUnits: PropTypes.object
}

export default SubResource;