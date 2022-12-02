import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { deleteResourceVirtualGroup } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import ConfirmModal from 'components/ConfirmModal';
import BasePaper from 'components/BaseMuiPaper';
// import { BaseTooltip } from 'components/BaseTooltip';
import Ordering from './Ordering';
import { MB } from 'constant';
import { formatBytes } from 'utils';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ResourceManage/SubSource/Group
 * @component Group
 * @description Group container show resource table in Subsource of cluster tab
*/
const Group = ({ data }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getData,
    isLoading,
    setIsCreateGroupModalShow,
    setIsModifyGroupModalShow,
    setIsUserSettingModalShow,
    setModifyGroupSelectedItem,
    setUserSettingGroupSelectedItem,
    setUserSettingVgCells,
    classes
  } = useContext(ResourceManageContext);

  // # states
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [VGInfoList, setVGInfoList] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clickedData, setClickedData] = useState({});

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
    //                       className={`${classes.p_4}`}
    //                       key={key}
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
    //         >
    //           <div>{totalNum}</div>
    //         </div>
    //       </BaseTooltip>
    //     )
    //   }
    // },
    applySortProps({
      id: 'activeJobs',
      label: `${t('Jobs')}`,
      onTableCellRender: data => (<div>{data.activeJobs}</div>)
    }),
    applySortProps({
      id: 'virtualClusterMode',
      label: t('mode'),
      onTableCellRender: data => {
        let showWord = 'immediately';

        if(data.schedulable === true) showWord = 'schedule';
        if(data.queueable === true) showWord = 'queue';

        return (
          <div>{t(showWord)}</div>
        );
      }
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
            icon: <Icon>delete_outline</Icon>
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

  // * hooks
  useEffect(() => {
    if (!isEmpty(data)) {
      const list = []
      for (const vgInfo of data) {
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

        list.push({ ...vgInfo, totalResource, usedResource })
      }
      setVGInfoList(list)
    } else if (isEmpty(data)) {
      setVGInfoList([])
    }
  }, [data])

  return (
    <div className={`${classes.groupContainer}`}>
      <div className={`${classes.groupTopBar}`}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('group')}`}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
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
            classes={{ root: `${classes.mr_20} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('resource')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        !isEmpty(VGInfoList)
          ?
          <div className={`${classes.groupContainer}`}>
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
          : <div className={`${classes.p_20}`}>{t('noCreateAnyGroup')}</div>
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
  data: PropTypes.array
}

export default Group;