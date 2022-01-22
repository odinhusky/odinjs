import React, {
  useContext
} from 'react';

// ? context
import Context from './context'

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { FormTextField } from './form-text-field';
import { DockerSection } from './DockerSection';
import { JobTaskRole } from '../models/job-task-role';
import { FormSpinButton } from './form-spin-button';
import { CommandSection } from './command-section';
import { CompletionPolicy } from './task-role/completion-policy';
import { PortsList } from './task-role/ports-list';
import { DebouncedTextField } from './controls/debounced-text-field';
import { BasicSection } from './basic-section';
import { SelectSkuResource } from './SelectSkuResource';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';
// import { ContainerSizeSection } from './container-size-section';
// import { FormPage } from './form-page';

/**
 * @author odin
 * @prop {boolean} advanceFlag -- 是否為高級
 * @prop {function} onContentChange -- 內容變動時觸發的 function
 * @prop {array} dupNames --
 * @prop {instanceOf(JobTaskRole)} jobTaskRole --
 * @level views/JobSubmit/TaskRoles/TabFormMui/TabFormContent
 * @component TabFormContent
 * @description TabFormContent component
*/
export const TabFormContent = ({
  jobTaskRole,
  onContentChange,
  advanceFlag,
  dupNames
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const {
    classes
  } = useContext(Context);

  // - methods
  const _onValueChange = (propertyName, propertyValue) => {
    const udpatedJobTaskRole = new JobTaskRole(jobTaskRole);
    udpatedJobTaskRole[propertyName] = propertyValue;
    if (onContentChange !== undefined) {
      onContentChange(udpatedJobTaskRole);
    }
  };

  const _onValuesChange = (updateProperties) => {
    let updatedJobTaskRole = { ...jobTaskRole, ...updateProperties };
    updatedJobTaskRole = new JobTaskRole(updatedJobTaskRole);
    if (onContentChange !== undefined) {
      onContentChange(updatedJobTaskRole);
    }
  }

  return (
    <Grid
      className={`${classes.directionColumn}`}
      container
      spacing={2}
    >
      <Grid
        className={`${classes.maxH_56}`}
        item
      >
        <FormTextField
          breakpoint={isTablet}
          className={`${classes.unlimitWidthInput} ${classes.w_full}`}
          classNameObj={{
            content: !isTablet ? classes.pr_24 : ''
          }}
          error={dupNames.includes(jobTaskRole.name)}
          helperText={dupNames.includes(jobTaskRole.name) ? t('duplicateName') : ''}
          onChange={value => _onValueChange('name', value)}
          placeholder={t('pleaseEnterTaskRoleName')}
          sectionLabel={t('taskRoleName')}
          sectionTooltip={t('toolTipsTaskRoleName')}
          value={jobTaskRole.name}
        />
      </Grid>

      {/* 高級才會出現的區域 */}
      <Grid item>
        {
          advanceFlag ?
            <CommandSection
              classNameObj={{
                content: !isTablet ? classes.pr_24 : ''
              }}
              onChange={value => _onValueChange('commands', value)}
              value={jobTaskRole.commands}
            />
            :
            <BasicSection
              childrenGrid={isTablet ? 12 : 6}
              classNameObj={{
                content: `${!isTablet ? classes.pr_24 : ''} ${classes.unlimitWidthInput} ${classes.w_full}`
              }}
              sectionLabel={t('command')}
              sectionTooltip={t('toolTipsCommandSection')}
              titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
            >
              <DebouncedTextField
                classes={{ root: classes.w_full }}
                error={!jobTaskRole.commands}
                helperText={!jobTaskRole.commands ? t('commandCannotBeEmpty') : ''}
                multiline
                onChange={value => _onValueChange('commands', value)}
                value={jobTaskRole.commands}
              />
            </BasicSection>
        }
      </Grid>

      {/* Docker 的設定 */}
      <DockerSection
        onValueChange={dockerInfo => _onValueChange('dockerInfo', dockerInfo)}
        sectionTooltip={t('toolTipsDocker')}
        value={jobTaskRole.dockerInfo}
      />

      {/* 選擇資源 */}
      <SelectSkuResource
        hivedScheduler={jobTaskRole.hivedScheduler}
        onChange={_onValuesChange}
      />

      {/* 高級設置 */}
      {
        advanceFlag && (
          <>
            {/* 標題 */}
            <div
              className={`${classes.flex_align_center}`}
            >
              <div
                className={`${classes.fz_16}`}
              >
                {t('Advanced')}{t('enSpace')}{t('setting')}
              </div>

              <div
                className={`${classes.highlevelSettingBorder}`}
              />
            </div>

            {/* 高級設置 內容 */}
            <PortsList
              classNameObj={{
                firstInput: `${isTablet ? classes.pr_10 : classes.pr_8}`,
                secondInputGrid: `${isTablet ? classes.pl_2 : classes.pl_4}`,
                secondInput: `${isTablet ? classes.pr_20 : classes.pr_16}`
              }}
              onChange={ports => _onValueChange('ports', ports)}
              ports={jobTaskRole.ports}
            />

            <FormSpinButton
              className={`${classes.w_full}`}
              onChange={value => _onValueChange('taskRetryCount', value)}
              sectionLabel={`${t('retryCount')}(${t('optional')})`}
              sectionProps={{
                containerItem: true,
                item: true,
                classNameObj: {
                  content: `${!isTablet && classes.pr_24} ${classes.unlimitWidthInput}`
                }
              }}
              value={jobTaskRole.taskRetryCount || 0}
            />

            <CompletionPolicy
              classNameObj={{
                firstInput: `${!isTablet && classes.pr_8}`,
                secondInputGrid: `${!isTablet && classes.pl_4}`,
                secondInput: `${!isTablet && classes.pr_16}`
              }}
              onChange={completion => _onValueChange('completion', completion)}
              value={jobTaskRole.completion}
            />
          </>
        )
      }
    </Grid>
  );
};

TabFormContent.propTypes = {
  jobTaskRole: PropTypes.instanceOf(JobTaskRole).isRequired,
  onContentChange: PropTypes.func,
  advanceFlag: PropTypes.bool,
  dupNames: PropTypes.array
};
