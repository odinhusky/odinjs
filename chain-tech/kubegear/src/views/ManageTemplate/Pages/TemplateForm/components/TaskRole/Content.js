import React, {
  useContext,
  useCallback
} from 'react';

// ? context
import Context from '../../Context';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { TextField, CommandInput } from '../Form';
// import ContainerSize from './ContainerSize';
import DockerInfo from './DockerInfo';
import AdvancedSetting from './AdvancedSetting';
import SelectResource from './SelectResource';

// ^ Plugin
import { isEmpty, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content
 * @component Content
 * @description TaskRole -> Content component
*/
const Content = ({ selectedIdx, dupNames }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { jobTaskRoles, setJobTaskRoles, classes } = useContext(Context);

  // & handled data
  const currentTaskRole = !isEmpty(jobTaskRoles) ? Object.values(jobTaskRoles)[selectedIdx] : {};
  const currentTaskRoleName = currentTaskRole.name;

  // - methods
  /**
   * @author odin
   * @param {string} field -- 要修改的物件 keyName
   * @param {any} value -- 要修改的值
   * @description 選擇了集群以及集群列表不為空的話，計算出 CP GPU Memory 個別可以使用的數值為多少
  */
  const contentOnChange = useCallback((field, value) => {
    setJobTaskRoles(prev => {
      const res = { ...prev }
      res[currentTaskRoleName] = { ...res[currentTaskRoleName], [field]: value };

      return res
    })
  }, [currentTaskRoleName, setJobTaskRoles]);

  // const contentsOnChange = useCallback((updateContents) => {
  //   setJobTaskRoles(prev => {
  //     const res = { ...prev }
  //     res[currentTaskRoleName] = { ...res[currentTaskRoleName], ...updateContents };

  //     return res
  //   })
  // }, [currentTaskRoleName, setJobTaskRoles]);

  return (
    <div className={`${classes.manageTemplateFormContent}`}>
      <Grid
        container
        direction="column"
        spacing={2}
      >
        <TextField
          error={dupNames(currentTaskRoleName) === '' ? false : true}
          helperText={dupNames(currentTaskRoleName)}
          hint={t('toolTipsTaskRoleName')}
          onChange={(text) => {
            setJobTaskRoles(prev => {
              const copy = Object.entries(cloneDeep(prev));
              const copyNames = Object.keys(cloneDeep(prev));
              const currentItem = copy[selectedIdx][1];
              const currentName = copy[selectedIdx][0];
              const keyName = copyNames.includes(text) ? currentName : text;

              currentItem.name = text;
              return {
                ...copy.slice(0, selectedIdx).reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {}),
                [keyName]: currentItem,
                ...copy.slice(selectedIdx + 1).reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {})
              }
            })
          }}
          title={t('taskRoleName')}
          value={currentTaskRoleName}
        />

        <CommandInput
          hint={t('toolTipsCommandSection')}
          onChange={t => {
            contentOnChange('commands', t)
          }}
          title={t('command')}
          value={currentTaskRole.commands}
        />

        {/* <ContainerSize
          data={currentTaskRole.containerSize}
          onChange={contentOnChange}
          shmMB={currentTaskRole.shmMB}
        /> */}

        <DockerInfo
          data={currentTaskRole.dockerInfo}
          hint={t('toolTipsDocker')}
          onChange={contentOnChange}
        />

        <SelectResource
          k8sResource={currentTaskRole.k8sResource}
          onChange={contentOnChange}
          selectedIdx={selectedIdx}
        />

        <AdvancedSetting
          data={currentTaskRole}
          onChange={contentOnChange}
        />
      </Grid>
    </div>
  );
};

Content.propTypes = {
  selectedIdx: PropTypes.number,
  dupNames: PropTypes.func
}

export default Content;