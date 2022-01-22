import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { BaseTextField } from 'components/BaseMuiInput';
import { BaseTooltip } from 'components/BaseTooltip';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Switch from '@material-ui/core/Switch';
import FormHelperText from '@material-ui/core/FormHelperText';
// import { TextField } from '../Form'
import { isEmpty } from 'lodash';
import { getHaborRepoInfo, getHaborRepoTags } from 'utils/api';
// import { DockerInfo as DockerInfoConstructor } from 'views/JobSubmit/models/docker-info';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0,
    marginLeft: 10,
    cursor: 'pointer',
    fontSize: 18
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  },
  formControl: {
    width: '100%',
    '& > div': {
      height: 40
    },
    '& .MuiSvgIcon-root' : {
      top: '30%'
    }
  }
}));

const DockerInfo = ({ data, onChange, hint }) => {

  const { t } = useTranslation();
  const classes = useStyles();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const [toggle, setToggle] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [harborHost, setHarborHost] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [tags, setTags] = useState([]);
  const [dockerImage, setDockerImage] = useState(data);
  const [selectedTags, setSelectedTags] = useState('');
  const [cachedValue, setCachedValue] = useState(data);

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  useEffect(() => {
    if (selectedKey !== '') {
      getHaborRepoTags(selectedKey, false)
        .then(tags => {
          setTags(tags)
        })
    }
  }, [selectedKey])

  useEffect(() => {
    getHaborRepoInfo()
      .then(res => {
        setHarborHost(res.host);
        setRepositories(
          res.repositories.map(repository => {
            const item = {};
            item.key = repository;
            item.text = repository;
            item.componentRef = ref => (item.data = { ref: ref });
            return item;
          })
        );
      })
  }, [data])

  // const _onItemClick = (ev, item) => {
  //   ev.preventDefault();

  //   getHaborRepoTags(item.text, false).then(tags => {
  //     item.subMenuProps = {
  //       items: tags.map(tag => ({
  //         key: tag,
  //         text: tag,
  //         onClick: (tagEv, tagItem) => {
  //           onInfoChange('uri', `${harborHost}/${item.text}:${tagItem.text}`);
  //         }
  //       }))
  //     };
  //     item.data.ref.openSubMenu();
  //   });
  // };

  useEffect(
    () => {
      onChange('dockerInfo', dockerImage)
    },
    [dockerImage]
  );

  useEffect(() => {
    if (cachedValue !== data) {
      setCachedValue(data)
    }
  }, [data])

  return (
    <>
      <Grid
        container
        item
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Grid
          container
          item
          lg={isTablet ? 12 : 3}
          md={isTablet ? 12 : 3}
          sm={isTablet ? 12 : 3}
          style={isTablet ? { marginBottom: 10 } : { marginRight: 10, justifyContent: 'flex-end', alignItems: 'center' }}
          xl={isTablet ? 12 : 3}
          xs={isTablet ? 12 : 3}
        >
          <FormLabel className={classes.formLabel}>{t('dockerMirrors')}</FormLabel>
          {
            hint &&
            <BaseTooltip
              arrow
              title={hint}
            >
              <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
            </BaseTooltip>
          }
        </Grid>
        <Grid
          container
          item
          lg={isTablet ? 12 : 9}
          md={isTablet ? 12 : 9}
          sm={isTablet ? 12 : 9}
          spacing={3}
          xl={isTablet ? 12 : 9}
          xs={isTablet ? 12 : 9}
        >
          <Grid
            item
            lg={isTablet ? 5 : 4}
            md={isTablet ? 5 : 4}
            sm={isTablet ? 5 : 4}
            xl={isTablet ? 5 : 4}
            xs={isTablet ? 5 : 4}
          >
            <FormControl classes={{ root: classes.formControl }}>
              <Select
                disabled={toggle}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedKey(value);
                }}
                value={selectedKey}
                variant="outlined"
              >
                {addDropDownOptionKeys(repositories).map((item) => {
                  return (
                    <MenuItem
                      key={item.key}
                      value={item.text}
                      {...item}
                    >
                      {item.text}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            lg={isTablet ? 5 : 4}
            md={isTablet ? 5 : 4}
            sm={isTablet ? 5 : 4}
            xl={isTablet ? 5 : 4}
            xs={isTablet ? 5 : 4}
          >
            <FormControl classes={{ root: classes.formControl }}>
              <Select
                disabled={toggle}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTags(value);
                  setDockerImage(`${harborHost}/${selectedKey}:${value}`)
                  setCachedValue(`${harborHost}/${selectedKey}:${value}`)
                }}
                value={selectedTags}
                variant="outlined"
              >
                {
                  !isEmpty(tags)
                    ?
                    tags.map((item) => {
                      return (
                        <MenuItem
                          key={item}
                          value={item}
                          {...item}
                        >
                          {item}
                        </MenuItem>
                      )
                    })
                    :
                    <MenuItem />
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            lg={isTablet ? 2 : 4}
            md={isTablet ? 2 : 4}
            sm={isTablet ? 2 : 4}
            style={{
              display: 'flex',
              flexDirection: isTablet ? 'column' : 'row',
              alignItems: 'center',
              padding: isTablet && 0
            }}
            xl={isTablet ? 2 : 4}
            xs={isTablet ? 2 : 4}
          >
            <Switch
              checked={toggle}
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
              onChange={e => {
                const check = e.target.checked;
                setToggle(check)
              }}
            />
            <FormHelperText>{t('customize')}</FormHelperText>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        item
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Grid
          alignItems={'center'}
          container
          item
          justify={'flex-end'}
          lg={3}
          md={3}
          sm={3}
          style={{ marginRight: 10 }}
          xl={3}
          xs={3}
        />
        <Grid
          item
          lg={6}
          md={6}
          sm={6}
          xl={6}
          xs={6}
        >
          {
            isTablet
              ?
              <FormControl style={{ marginTop: 12 }}>
                <BaseTextField
                  disabled={!toggle}
                  error={isEmpty(cachedValue)}
                  helperText={isEmpty(cachedValue) ? t('dockerMirrorsPathCannotBeEmpty') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDockerImage(value);
                    setCachedValue(value)
                  }}
                  required
                  type="text"
                  value={cachedValue}
                  variant="outlined"
                />
              </FormControl>
              :
              <FormControl style={{ paddingRight: 24, width: '100%' }}>
                <BaseTextField
                  disabled={!toggle}
                  error={isEmpty(cachedValue)}
                  helperText={isEmpty(cachedValue) ? t('dockerMirrorsPathCannotBeEmpty') : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDockerImage(value);
                    setCachedValue(value)
                  }}
                  required
                  type="text"
                  value={cachedValue}
                  variant="outlined"
                />
              </FormControl>
          }
        </Grid>
      </Grid>
    </>
    // <TextField
    //   customButton={(
    //     <DefaultButton
    //       menuProps={{
    //         directionalHint: DirectionalHint.rightCenterEdge,
    //         items: repositories,
    //         onItemClick: _onItemClick
    //       }}
    //       styles={{
    //         root: {
    //           background: '#fff',
    //           padding: 0,
    //           width: 30,
    //           minWidth: 30,
    //           height: 20,
    //           position: 'absolute',
    //           right: 10,
    //           top: 5
    //         },
    //         rootHovered: {
    //           background: '#fff'
    //         }
    //       }}
    //     />
    //   )}
    //   errorMessage={isEmpty(data.uri) ? t('dockerMirrorsPathCannotBeEmpty') : null}
    //   hint={t('toolTipsDocker')}
    //   onChange={(e, text) => onInfoChange('uri', text)}
    //   placeholder={t('pleaseEnterDockerMirrorsPath')}
    //   title={t('dockerMirrors')}
    //   value={data.uri}
    // />
  );
};

DockerInfo.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  hint: PropTypes.string
};

export default DockerInfo;