import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import Pagination from 'components/Paginator/pagination';
import { BaseLink } from 'components/BaseLink';
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton, IconButton } from 'components/BaseButton';

import EditModal from './components/EditModal';

import Context from '../../Context';
import GlobalContext from 'layouts/Main/GlobalContext';
import Ordering from '../../Ordering';

import { formatBytes } from 'utils';
import { GB } from 'constant';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const IndexPage = () => {
  const { t } =  useTranslation();
  const { userInfo } = useContext(GlobalContext);
  const classes = useStyles();
  const [pagination, setPagination] = useState(new Pagination());
  const [filteredList, setFilteredList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedNfs, setSelectedNfs] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { ordering, setOrdering, isNFS, fsList, isLoading, getFsList, pathTemp, setPathTemp, isXdfsEnabled } = useContext(Context);

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
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
        <DefaultButton
          children={t('refresh')}
          onClick={getFsList}
          startIcon={<Refresh />}
        />
        <MuiAutocomplete
          classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
          onInputChange={(e, value) => setKeyword(value)}
          placeholder={`${t('SearchForXXName', {
            name: isXdfsEnabled
              ? t('xdfs')
              : (isNFS ? 'NFS' : 'GlusterFS')
          })}`}
          value={keyword}
        />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
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
                      to={`/${
                        isXdfsEnabled
                          ? 'xdfs-item-list'
                          : isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsInfo.name}`}
                    >
                      {nfsInfo.name}
                    </BaseLink>
                  )
                }),
                applySortProps({
                  id: 'nfsDisk',
                  key: 'nfsDisk',
                  label: isXdfsEnabled
                    ? t('volumeGlusterFS')
                    : isNFS ? t('mountArea') : t('volumeGlusterFS'),
                  onTableCellRender: nfsInfo => {
                    return (
                      isXdfsEnabled
                        ? nfsInfo.volume
                        : isNFS ? nfsInfo.nfsDisk : nfsInfo.volume
                    )
                  }
                }),
                applySortProps({
                  id: 'size',
                  key: 'size',
                  label: `${t('space')}`,
                  onTableCellRender: nfsInfo => formatBytes(nfsInfo.size * GB)
                }),
                applySortProps({
                  id: isXdfsEnabled ? 'available3' : (isNFS ? 'available' : 'available2'),
                  key: isXdfsEnabled ? 'available3' : (isNFS ? 'available' : 'available2'),
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
                      isEditable &&
                      <IconButton
                        children={<Icon>settings</Icon>}
                        onClick={() => {
                          setSelectedNfs(item);
                          setIsEditModalOpen(true);
                        }}
                      />
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
      {
        isEditModalOpen &&
        <EditModal
          isOpen={isEditModalOpen}
          nfs={selectedNfs}
          onClose={() => setIsEditModalOpen(false)}
        />
      }
    </>
  )
}

export default IndexPage;