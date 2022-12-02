import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  updateNfsPrivilege,
  updateGlusterfsPrivilege
} from 'utils/api';

// ? context
import FsItemListContext from '../../FsItemListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import LinearProgress from '@material-ui/core/LinearProgress';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import Pagination from 'components/Paginator/pagination';
import { BaseLink } from 'components/BaseLink';
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton, IconButton } from 'components/BaseButton';
// import EditModal from './components/EditModal';
import EditNFSUserModal from 'reuseContainers/EditNFSUserModal';
import Ordering from '../../Ordering';
import { formatBytes } from 'utils';
import { GB } from 'constant';

// ^ Plugins
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/FsItemList/IndexPage
 * @component IndexPage Component
 * @description IndexPage to show the table of nfs item list
*/
const IndexPage = () => {

  // $ init data
  const { t } =  useTranslation();

  // ? context
  const { userInfo } = useContext(GlobalContext);
  const {
    ordering,
    setOrdering,
    isNFS,
    fsList,
    isLoading,
    getFsList,
    pathTemp,
    setPathTemp,
    classes
  } = useContext(FsItemListContext);

  // # states
  const [pagination, setPagination] = useState(new Pagination());
  const [filteredList, setFilteredList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedNfs, setSelectedNfs] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // * hooks
  useEffect(() => {
    setFilteredList(fsList.filter(fs => fs.name.includes(keyword)))
  }, [keyword, fsList])

  useEffect(() => {
    if (filteredList.length > 0 && pathTemp) {
      const { itemsPerPage } = pagination;
      const pageIndex = Math.floor(filteredList.findIndex(v => v.name === pathTemp) / itemsPerPage);

      setPagination(new Pagination(itemsPerPage, pageIndex))
      setPathTemp(null);
    }
  }, [filteredList, pathTemp])

  return (
    <>
      <div className={`${classes.mb_20} ${classes.flex_justify_between}`}>
        <DefaultButton
          children={t('refresh')}
          onClick={getFsList}
          startIcon={<Refresh />}
        />
        <MuiAutocomplete
          classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
          onInputChange={(e, value) => setKeyword(value)}
          placeholder={`${t('SearchForXXName', {
            name: (isNFS ? 'NFS' : 'GlusterFS')
          })}`}
          value={keyword}
        />
      </div>
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
        {
          isLoading
            ? <></>
            :
            <BasePaper
              columns={[
                applySortProps({
                  id: 'name',
                  key: 'name',
                  label: t('name'),
                  onTableCellRender: nfsInfo => (
                    <BaseLink
                      to={`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsInfo.name}`}
                    >
                      {nfsInfo.name}
                    </BaseLink>
                  )
                }),
                applySortProps({
                  id: 'nfsDisk',
                  key: 'nfsDisk',
                  label: isNFS ? t('mountArea') : t('volumeGlusterFS'),
                  onTableCellRender: nfsInfo => {
                    return (isNFS ? nfsInfo.nfsDisk : nfsInfo.volume)
                  }
                }),
                applySortProps({
                  id: 'size',
                  key: 'size',
                  label: `${t('space')}`,
                  onTableCellRender: nfsInfo => formatBytes(nfsInfo.size * GB)
                }),
                applySortProps({
                  id: (isNFS ? 'available' : 'available2'),
                  key: (isNFS ? 'available' : 'available2'),
                  label: `${t('allocatable')}`,
                  onTableCellRender: nfs =>
                    nfs.used || nfs.used === 0
                      ? formatBytes((nfs.size - nfs.used / 1048576) * GB)
                      : <LinearProgress />
                }),
                {
                  id: 'setting',
                  key: 'setting',
                  label: t('setting'),
                  fieldName: 'setting',
                  onTableCellRender: item => {
                    const isEditable = (userInfo.privileges && (userInfo.privileges.includes('ADMIN') || userInfo.privileges.includes('NFS')))
                      || item.users.includes(userInfo.username)
                    return (
                      isEditable && (
                        <>
                          {/* 編輯權限 */}
                          <IconButton
                            children={<Icon>settings</Icon>}
                            onClick={() => {
                              setSelectedNfs(item);
                              setIsEditModalOpen(true);
                            }}
                          />
                        </>
                      )
                    )
                  }
                }
              ]}
              getKey={(row) => row.name}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(filteredList)}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
        }
      </div>

      {/* Modal */}
      <EditNFSUserModal
        classes={classes}
        getData={getFsList}
        isOpen={isEditModalOpen}
        nfs={selectedNfs}
        onClose={() => setIsEditModalOpen(false)}
        submitAPI={isNFS ? updateNfsPrivilege : updateGlusterfsPrivilege}
        type={isNFS ? 'nfs' : 'glusterfs'}
      />
    </>
  )
}

export default IndexPage;