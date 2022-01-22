import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { getHaborRepoInfo, getHaborRepoTags } from 'utils/api';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Components(Functions)
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import FormHelperText from '@material-ui/core/FormHelperText';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';

// ^ Plugins
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole/DockerInfo
 * @component DockerInfo
 * @prop {object} data -- 從該 taskRole 中得到的 dockerInfo
 * @prop {function} onChange -- 外層的 contentOnChange function
 * @prop {boolean} isTablet -- 是否為平板的 Material Ui Boolean(max-width: 1280px)
 * @description Step3 From Component 中，經由排版包裝的 BaseTextFiled
*/
const DockerInfo = ({
  data,
  onChange,
  isTablet
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext);

  // # states
  const [toggle, setToggle] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [harborHost, setHarborHost] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [tags, setTags] = useState([]);
  const [dockerImage, setDockerImage] = useState(data);
  const [selectedTags, setSelectedTags] = useState('');
  const [cachedValue, setCachedValue] = useState(data);

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  // * hooks
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
            return item;
          })
        );
      })
  }, [data])

  useEffect(
    () => {
      onChange('dockerInfo', dockerImage)
    },
    [dockerImage]
  );

  useEffect(() => {
    if (cachedValue !== data) {
      setCachedValue(data)
      setSelectedKey('')
      setSelectedTags('')
    }
  }, [data])

  return (
    <>
      <div className={`${classes.flex_align_center} ${classes.w_full}`}>
        {/* repositories */}
        <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
          <FormControl
            classes={{ root: classes.formControl }}
            fullWidth
          >
            <Select
              disabled={toggle || repositories.length === 0}
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
        </div>
        {/* 子項目包含的規格(tags) */}
        <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
          <FormControl
            classes={{ root: classes.formControl }}
            fullWidth
          >
            <Select
              disabled={toggle || repositories.length === 0}
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
        </div>

        {/* 是否要自定義 */}
        <div className={`${classes.flex_align_center} ${classes.flexEndSection} ${classes.pl_20} ${classes.pos_rel}`}>
          <div className={`${classes.switchBox}`}>
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
          </div>
        </div>
      </div>

      {/* 最後組出來的映像路徑 */}
      <div className={`${classes['width_6/7']} ${classes.mt_20}`}>
        <FormControl
          className={`${isTablet && classes.mt_12} `}
          fullWidth
        >
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
      </div>
    </>
  );
};

DockerInfo.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  isTablet: PropTypes.bool
};

export default DockerInfo;