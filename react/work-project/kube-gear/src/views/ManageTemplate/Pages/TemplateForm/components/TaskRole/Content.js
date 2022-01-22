import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { TextField, CommandInput } from '../Form';

import Grid from '@material-ui/core/Grid';

import Context from '../../Context';
// import ContainerSize from './ContainerSize';
import DockerInfo from './DockerInfo';
import AdvancedSetting from './AdvancedSetting';
import SelectSkuResource from './SelectSkuResource';

import styles from '../../index.module.scss';

import { isEmpty } from 'lodash';

const Content = ({ selectedIdx, checkDupName }) => {
  const { jobTaskRoles, setJobTaskRoles } = useContext(Context);

  const { t } = useTranslation();

  const currentTaskRole = !isEmpty(jobTaskRoles) ? Object.values(jobTaskRoles)[selectedIdx] : {}

  const currentTaskRoleName = !isEmpty(jobTaskRoles) ? Object.keys(jobTaskRoles)[selectedIdx] : ''

  const contentOnChange = (field, value) => {
    setJobTaskRoles(prev => {
      const res = { ...prev }
      res[currentTaskRoleName] = { ...res[currentTaskRoleName], [field]: value };

      return res
    })
  }

  const contentsOnChange = (updateContents) => {
    setJobTaskRoles(prev => {
      const res = { ...prev }
      res[currentTaskRoleName] = { ...res[currentTaskRoleName], ...updateContents };

      return res
    })
  }

  return (
    <div className={styles.formContent}>
      <Grid
        container
        direction="column"
        spacing={2}
      >
        <TextField
          error={checkDupName() === '' ? false : true}
          helperText={checkDupName()}
          hint={t('toolTipsTaskRoleName')}
          onChange={(text) => {
            setJobTaskRoles(prev => {
              const copy = Object.entries({ ...prev })
              return {
                ...copy.slice(0, selectedIdx).reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {}),
                [text]: copy[selectedIdx][1],
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
        <SelectSkuResource
          containerSize={currentTaskRole.containerSize}
          hivedScheduler={currentTaskRole.hivedScheduler}
          onChange={contentsOnChange}
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
  checkDupName: PropTypes.func
}

export default Content;