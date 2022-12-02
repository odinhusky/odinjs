import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { getReposTags, getHaborRepoTags, deleteReposTag } from 'utils/api';

// ? context
import RepositoryContext from '../../RepositoryContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { BaseTooltip } from 'components/BaseTooltip';
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import DownloadModalOpen from './components/DownloadModal';
import { formatBytes } from 'utils';
import Ordering from '../../Ordering';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

/**
 * @author elvis
 * @level views/Repository/RepoDetail
 * @component RepoDetail
 * @description RepoDetail content
*/
const RepoDetail = () => {

  // $ init data
  const { t } = useTranslation();
  const { project, repo } = useParams();
  const history = useHistory();

  // ? context
  const {
    currentProject,
    classes
  } = useContext(RepositoryContext);

  // # states
  const [repoTags, setRepoTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordering, setOrdering] = useState(new Ordering());

  const [filename, setFilename] = useState();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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

  const getData = () => {
    const repoName = `${project}/${repo}`

    setIsLoading(true)
    Promise.all([
      getHaborRepoTags(repoName),
      getReposTags(repoName)
    ])
      .then(([res1, res2]) => {
        setRepoTags(res2.map(item => ({
          ...item,
          fullname: res1.find(el => el.tag === item.name) ? res1.find(el => el.tag === item.name).name : item.name
        })))
      })
      .catch((err) => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const handleCopy = command => {
    const tempInput = document.createElement('input');
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
    tempInput.value = command;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  const handleDelete = () => {
    Promise.all(selectedTags.map(tag => {
      const repoName = `${project}/${repo}`

      return deleteReposTag(repoName, tag.name)
    }))
      .then(() => {
        toast.success(t('success'))
        getData();
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }

  // * hooks
  useEffect(() => {
    getData();
  }, [])

  return (
    <>
      <div className={`${classes.flex_justify_between} ${classes.flex_wrap}`}>
        <p>{t('repository')}{t('enSpace')}{t('name')}: {project}/{repo}</p>
        <div>
          {
            currentProject &&
            currentProject.current_user_role_id === 1 &&
            (
              selectedTags.length === 0 ? (
                <BaseTooltip
                  title={t('pleaseSelectTags')}
                >
                  <div>
                    <PrimaryButton
                      children={`${t('delete')}${t('enSpace')}${t('tag')}`}
                      classes={{ root: classes.mr_10 }}
                      disabled={selectedTags.length === 0}
                      onClick={() => {}}
                      startIcon={<Icon>delete_outline</Icon>}
                    />
                  </div>
                </BaseTooltip>
              ) : (
                <PrimaryButton
                  children={`${t('delete')}${t('enSpace')}${t('tag')}`}
                  classes={{ root:classes.mr_10 }}
                  disabled={selectedTags.length === 0}
                  onClick={() => setIsDeleteModalShow(true)}
                  startIcon={<Icon>delete_outline</Icon>}
                />
              )
            )
          }
          <DefaultButton
            children={t('refresh')}
            disabled={isLoading}
            onClick={() => {
              getData();
            }}
            startIcon={<Refresh />}
          />
        </div>
        <div>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('tag')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
          <DefaultButton
            children={t('back')}
            onClick={() => history.push(`/repository/${project}`)}
            startIcon={<Icon>arrow_back</Icon>}
          />
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', overflow: 'hidden', flex: 1 }}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name')
            }),
            applySortProps({
              id: 'size',
              key: 'size',
              label: t('size'),
              onTableCellRender: (data) => formatBytes(data.size)
            }),
            {
              id: 'operations',
              key: 'operations',
              label: `${t('Operations')}`,
              onTableCellRender: (repoData) => {
                const commandString = `docker pull ${repoData.fullname}`;
                return (
                  <div className={`${classes.d_flex}`}>
                    <BaseTooltip title={`Pull${t('command')}`}>
                      <div>
                        <IconButton
                          children={<Icon>content_copy</Icon>}
                          onClick={() => handleCopy(commandString)}
                        />
                      </div>
                    </BaseTooltip>
                    <IconButton
                      children={<Icon>download</Icon>}
                      onClick={() => {
                        setFilename(repoData.fullname)
                        setIsDownloadModalOpen(true)
                      }}
                    />
                  </div>
                );
              }
            },
            applySortProps({
              id: 'created',
              key: 'created',
              label: t('createTime'),
              onTableCellRender: (data) => {
                return <div>{moment(data.created).format('YYYY/MM/DD HH:mm:ss')}</div>;
              }
            })
          ]}
          itemChecked
          itemCheckedAllChange={(e, checked, rows) => {
            if (checked) {
              setSelectedTags(rows)
            } else {
              setSelectedTags([])
            }
          }}
          itemCheckedChange={(e, checked, row) => {
            if (checked) {
              setSelectedTags(prev => ([...prev, row]))
            } else {
              setSelectedTags(prev => ([...prev].filter(selected => selected.name !== row.name)))
            }
          }}
          itemCheckedData={selectedTags}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(repoTags.filter(tag => tag.name.includes(keyword)))}
          rowsPerPage={rowsPerPage}
          selectionMode={0}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        isDeleteModalShow &&
        <ConfirmModal
          confrimText={`${t('delete')}`}
          content={t('sureDelete', { name: selectedTags.map(tag => tag.name).join(', ') })}
          isOpen={isDeleteModalShow}
          onClose={() => setIsDeleteModalShow(false)}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('tag')}`}
        />
      }
      {
        isDownloadModalOpen &&
        <DownloadModalOpen
          filename={filename}
          isOpen={isDownloadModalOpen}
          onClose={() => {
            setIsDownloadModalOpen(false)
            setFilename();
          }}
        />
      }
    </>
  );
};


export default RepoDetail;
