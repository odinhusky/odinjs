import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import {
  getResource,
  unbindResourceFromGroup
} from 'utils/api';

// ? context
import GroupManageContext from '../../GroupManageContext';

// ^ Material-ui Componets(Functions)
import { Refresh } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import BaseLink from 'components/BaseLink';
import { DefaultButton, IconButton } from 'components/BaseButton';
// import { BaseTooltip } from 'components/BaseTooltip';
import ConfirmModal from 'components/ConfirmModal';
import Ordering from '../../Ordering'
import { formatBytes } from 'utils';
import { MB } from 'constant';

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, get } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/GroupManage/Resource
 * @component Resource
 * @description Resource component
*/
const Resource = ({ group }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    isMenuLoading,
    getMenuData,
    classes
  } = useContext(GroupManageContext);

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [resourceData, setResourceData] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalShow, setIsModalShow] = useState(false);
  const [modalData, setModalData] = useState({});

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
    Promise.all([...group.resources.map(resource => getResource(resource))])
      .then((data) => {

        const list = data.map((vgInfo) => {

          const { cells, usedCells } = vgInfo;

          // get 是 lodash 的函式，用於取出物件的值，如果為 falsy 則套用第三個參數的預設值
          const totalResource = {
            cpu: get(cells, 'cpu.number', 0),
            gpu: get(cells, 'gpu.number', 0),
            memory: get(cells, 'memory.number', 0)
          };

          const usedResource =  {
            cpuUsed: get(usedCells, 'cpu', 0),
            gpuUsed: get(usedCells, 'gpu', 0),
            memoryUsed: get(usedCells, 'memory', 0)
          };

          return { ...vgInfo, totalResource, usedResource }
        })

        setResourceData(list)
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.message)
      })
      .finally(() => setIsLoading(false))
  }

  // * hooks
  useEffect(() => {
    getResourceData();
  }, [group])

  return (
    <div className={`${classes.groupManageTabContentContainer}`}>
      <div className={`${classes.groupManageTabContentTopBar}`}>
        <DefaultButton
          children={t('refresh')}
          disabled={isMenuLoading}
          onClick={getMenuData}
          startIcon={<Refresh />}
        />
        <MuiAutocomplete
          className={`${classes.mr_10} ${classes.h_auto}`}
          onInputChange={(e, value) => setKeyword(value)}
          placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
          value={keyword}
        />
      </div>
      {
        isEmpty(resourceData)
          ? <p className={`${classes.p_20}`}>{`${t('resource')}${t('enSpace')}${t('isEmpty')}`}</p>
          :
          isLoading
            ? <></>
            :
            <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
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
                  // {
                  //   id: 'unit',
                  //   label: `${t('total')}${t('enSpace')}${t('unit')}`,
                  //   onTableCellRender: (data) => {
                  //     const { usedCells, cells } = data;
                  //     const totalNum = Object.values(cells).reduce((prev, current) => prev + current.number, 0)
                  //     return (
                  //       <BaseTooltip
                  //         title={
                  //           totalNum > 0
                  //             ?
                  //             <div>
                  //               {
                  //                 Object.entries(cells).map(([key, details]) => {
                  //                   const usedNum = usedCells[key] !== undefined ? usedCells[key] : 0;
                  //                   return (
                  //                     <div
                  //                       key={key}
                  //                       style={{ padding: 4 }}
                  //                     >
                  //                       {details.name}: {t('usePcs', { num: usedNum })} - {t('totalPcs', { num: details.number })}
                  //                     </div>
                  //                   )
                  //                 })
                  //               }
                  //             </div>
                  //             : ''
                  //         }
                  //       >
                  //         <div
                  //           className={`
                  //             ${classes.flex_center}
                  //             ${classes.cursorPointer}
                  //             ${classes.text_center}
                  //             ${classes.borderRadius_4}
                  //             ${classes.h_36}
                  //             ${classes.tooltipBgColor}
                  //           `}
                  //         >{totalNum}</div>
                  //       </BaseTooltip>
                  //     )
                  //   }
                  // },
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