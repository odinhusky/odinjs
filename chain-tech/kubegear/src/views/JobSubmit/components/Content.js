import React, {
  useContext
} from 'react';

// ? context
import Context from './context';

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
import { SelectResource } from './SelectResource';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import { isFunction, isNil } from 'lodash';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';
// import { ContainerSizeSection } from './container-size-section';
// import { FormPage } from './form-page';

/**
 * @author odin
 * @prop {instanceOf(JobTaskRole) Object} currentTaskRole -- 當前的 taskRole 物件
 * @prop {function} onContentChange -- 修改特定 jobTaskRole 的特定屬性的 function
 * @level views/JobSubmit/TaskRoles/Content
 * @component Content
 * @description Content component
*/
export const Content = ({
  currentTaskRole,
  onContentChange
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const {
    advanceFlag,
    classes,
    dupNames,
    selectedIdx
  } = useContext(Context);

  // & handled data
  const taskRoleNameValidationMsg = dupNames(currentTaskRole.name);

  // - methods
  /**
   * @author odin
   * @param {object} itemContent -- 單一個 jobTaskRole 物件
   * @param {number} index -- 該 jobTaskRole index
   * @description 更新單一個 jobTaskRole 的屬性
  */
  const onValueChange = (propertyName, propertyValue) => {
    const updatedJobTaskRole = new JobTaskRole(currentTaskRole);
    updatedJobTaskRole[propertyName] = propertyValue;
    if (onContentChange !== undefined) {
      onContentChange(updatedJobTaskRole);
    }
  };

  /**
   * @author odin
   * @param {object} itemContent -- 單一個 jobTaskRole 物件
   * @param {number} index -- 該 jobTaskRole index
   * @description 更新多個 jobTaskRole 的屬性
  */
  // const _onValuesChange = (updateProperties) => {
  //   const updatedJobTaskRole = { ...currentTaskRole, ...updateProperties };
  //   const willUpdatedJobTaskRoles = new JobTaskRole(updatedJobTaskRole);

  //   if (!isNil(onContentChange) && isFunction(onContentChange)) {
  //     onContentChange(willUpdatedJobTaskRoles);
  //   }
  // }

  return (
    <Grid
      className={`${classes.directionColumn}`}
      container
      spacing={2}
    >
      <Grid
        className={`${
          !isTablet
            ? (taskRoleNameValidationMsg ? classes.maxH_90px : classes.maxH_56px)
            : ''}
        `}
        item
      >
        <FormTextField
          breakpoint={isTablet}
          className={`${classes.unlimitWidthInput} ${classes.w_full}`}
          classNameObj={{
            content: !isTablet ? classes.pr_24 : '',
            labelSection: !isTablet ? `${classes.alignItemsStart} ${classes.pt_12}` : ''
          }}
          error={taskRoleNameValidationMsg}
          helperText={taskRoleNameValidationMsg}
          onChange={value => onValueChange('name', value)}
          placeholder={t('pleaseEnterTaskRoleName')}
          sectionLabel={t('taskRoleName')}
          sectionTooltip={t('toolTipsTaskRoleName')}
          value={currentTaskRole.name}
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
              onChange={value => onValueChange('commands', value)}
              value={currentTaskRole.commands}
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
                error={!currentTaskRole.commands}
                helperText={!currentTaskRole.commands ? t('commandCannotBeEmpty') : ''}
                multiline
                onChange={value => onValueChange('commands', value)}
                value={currentTaskRole.commands}
              />
            </BasicSection>
        }
      </Grid>

      {/* Docker 的設定 */}
      <DockerSection
        onValueChange={dockerInfo => onValueChange('dockerInfo', dockerInfo)}
        sectionTooltip={t('toolTipsDocker')}
        value={currentTaskRole.dockerInfo}
      />

      {/* 選擇資源 */}
      <SelectResource
        k8sResource={currentTaskRole.k8sResource}
        onChange={resourceObj => onValueChange('k8sResource', resourceObj)}
        selectedIdx={selectedIdx}
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
              onChange={ports => onValueChange('ports', ports)}
              ports={currentTaskRole.ports}
            />

            <FormSpinButton
              className={`${classes.w_full}`}
              onChange={value => onValueChange('taskRetryCount', value)}
              sectionLabel={`${t('retryCount')}(${t('optional')})`}
              sectionProps={{
                containerItem: true,
                item: true,
                classNameObj: {
                  content: `${!isTablet && classes.pr_24} ${classes.unlimitWidthInput}`
                }
              }}
              value={currentTaskRole.taskRetryCount || 0}
            />

            <CompletionPolicy
              classNameObj={{
                firstInput: `${!isTablet && classes.pr_8}`,
                secondInputGrid: `${!isTablet && classes.pl_4}`,
                secondInput: `${!isTablet && classes.pr_16}`
              }}
              onChange={completion => onValueChange('completion', completion)}
              value={currentTaskRole.completion}
            />
          </>
        )
      }
    </Grid>
  );
};

Content.propTypes = {
  currentTaskRole: PropTypes.instanceOf(JobTaskRole).isRequired,
  onContentChange: PropTypes.func
};
