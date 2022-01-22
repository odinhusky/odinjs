import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getHarborRepositoriesInfo,
  getHarborRepositoriyTags
} from '../utils/conn';

// ? context
import Context from './context'

// ^ Material-ui Componets(Functions)
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty, debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { DockerInfo } from '../models/docker-info';
import { BasicSection } from './basic-section';
import { toast } from 'react-toastify';

export const DockerSection = ({ sectionTooltip, onValueChange, value }) => {
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const { uri } = value;

  // ? context
  const { classes } = useContext(Context);

  // # states
  const [toggle, setToggle] = useState(false);
  const [harborHost, setHarborHost] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [tags, setTags] = useState([]);
  const [dockerImage, setDockerImage] = useState(uri);
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [cachedValue, setCachedValue] = useState(uri);

  // - mothods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  const _onChange = useCallback(
    (keyName, propValue) => {
      const updatedDockerInfo = new DockerInfo(value);
      updatedDockerInfo[keyName] = propValue;
      if (onValueChange !== undefined) {
        onValueChange(updatedDockerInfo);
      }
    },
    [value, onValueChange]
  );

  const debounceOnchange = useMemo(() => debounce(_onChange, 200), [_onChange])

  // * hook
  useEffect(() => {
    getHarborRepositoriesInfo()
      .then(repositoriesInfo => {
        setHarborHost(repositoriesInfo.host);
        setRepositories(
          repositoriesInfo.repositories.map(repository => {
            const item = {};
            item.key = repository;
            item.text = repository;
            item.componentRef = ref => (item.data = { ref: ref });
            return item;
          })
        );
      })
      .catch(err => toast.error(err?.data?.message ? err?.data?.message : err.toString()));
  }, []);

  useEffect(
    () => {
      debounceOnchange('uri', dockerImage)
    },
    [dockerImage]
  );

  useEffect(() => {
    if (selectedKey !== '') {
      getHarborRepositoriyTags(selectedKey)
        .then(tags => {
          setTags(tags)
        })
    }
  }, [selectedKey])

  useEffect(() => {
    const { uri } = value
    if (cachedValue !== uri) {
      setCachedValue(uri)
    }
  }, [value.uri])

  return (
    <>
      <BasicSection
        containerItem
        customChildren
        sectionLabel={t('dockerMirrors')}
        sectionTooltip={sectionTooltip}
        titleGrid={isTablet ? 12 : 3}
        titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
      >
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
            <FormControl
              className={`${classes.unlimitWidthSelect}`}
              fullWidth
            >
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
            <FormControl 
              className={`${classes.unlimitWidthSelect}`}
              fullWidth
            >
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
            className={`${classes.flex_align_center}`}
            item
            lg={isTablet ? 2 : 4}
            md={isTablet ? 2 : 4}
            sm={isTablet ? 2 : 4}
            style={{
              flexDirection: isTablet ? 'column' : 'row',
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
        {
          isTablet
            ?
            <FormControl
              className={`${classes.unlimitWidthInput} ${classes.mt_12}`}
              fullWidth
            >
              <TextField
                className={classes.defaultTextField}
                disabled={!toggle}
                error={isEmpty(uri)}
                helperText={isEmpty(uri) ? t('dockerMirrorsPathCannotBeEmpty') : ''}
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
            <BasicSection
              style={{ marginTop: 12 }}
            >
              <Grid
                item
                lg={8}
                md={8}
                sm={8}
                xl={8}
                xs={8}
              >
                <FormControl
                  className={`${classes.pr_24} ${classes.unlimitWidthInput}`}
                  fullWidth
                  style={{ paddingRight: 24 }}
                >
                  <TextField
                    className={classes.defaultTextField}
                    disabled={!toggle}
                    error={isEmpty(uri)}
                    helperText={isEmpty(uri) ? t('dockerMirrorsPathCannotBeEmpty') : ''}
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
              </Grid>
            </BasicSection>
        }
      </BasicSection>
    </>
  );
};

DockerSection.propTypes = {
  value: PropTypes.instanceOf(DockerInfo).isRequired,
  sectionTooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  auth: PropTypes.object,
  onValueChange: PropTypes.func
};
