import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { deleteResource } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import ConfirmModal from 'components/ConfirmModal';
import Ordering from './Ordering';
// import { BaseTooltip } from 'components/BaseTooltip';
import { MB } from 'constant';
import { formatBytes } from 'utils';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, get } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ResourceManage/SubSource/SubResource
 * @component SubResource
 * @description SubResource component
*/
const SubResource = ({
  data
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getData,
    isLoading,
    setIsModifyResourceModalShow,
    setModifyResourceSelectedItem,
    classes,
    setIsCreateResourceModalShow
  } = useContext(ResourceManageContext);

  // # states
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDeleting, setIsDeleting] = useState(false);
  const [clickedData, setClickedData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // & handled data
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
    // applySortProps({
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
    //                       style={{ padding:4 }}
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
    // }),
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

      setList(list)
    } else {
      setList([])
    }
  }, [data])

  return (
    <div className={`${classes.groupContainer}`}>
      <div
        className={`${classes.groupTopBar}`}
      >
        <div>
          <PrimaryButton
            children={`${t('resourceAllocation')}`}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
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
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('resource')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        !isEmpty(list)
          ?
          <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
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
          : <div className={`${classes.p_20}`}>{t('noCreateAnySubResource')}</div>
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
  data: PropTypes.array
}

export default SubResource;