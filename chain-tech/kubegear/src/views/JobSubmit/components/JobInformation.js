import React, {
  useCallback,
  useContext
  // useState
} from 'react';

// % context
import Context from './context';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { FormTextField } from './form-text-field';
// 移除重試次數
// import { FormSpinButton } from './form-spin-button';
import { VirtualCluster } from './virtual-cluster';
import { JobBasicInfo } from '../models/job-basic-info';
import Card from 'components/Card';
// import BaseLink from 'components/BaseLink';
// import { BasicSection } from './basic-section';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/JobSubmit/JobInformation
 * @param
 * @component JobInformation
 * @description JobInformation component
*/
export const JobInformation = React.memo(
  ({
    jobInformation,
    sectionTooltip,
    sectionShowUnderVg,
    onChange,
    setIsCopy
    // advanceFlag
  }) => {

    // $ init data
    const { t } = useTranslation();
    const isTablet = useMediaQuery('(max-width: 1280px)');
    const {
      name,
      virtualCluster
      // jobRetryCount // 移除重試次數
    } = jobInformation;

    // = styles
    const { classes } = useContext(Context)

    // # states
    // const [isModalOpen, setIsModalOpen] = useState(false);

    // - methods
    const onChangeProp = useCallback(
      (type, value) => {
        const updatedJobInfo = new JobBasicInfo({
          ...jobInformation,
          [type]: value
        });
        onChange(updatedJobInfo);
      },
      [onChange, jobInformation]
    );

    const onNameChange = useCallback(name => onChangeProp('name', name), [
      onChangeProp
    ]);

    const onVirtualClusterChange = useCallback(
      virtualCluster => {
        onChangeProp('virtualCluster', virtualCluster);
        setIsCopy(false);
      }, [onChangeProp]);

    // 移除重試次數
    // const onRetryCountChange = useCallback(
    //   val => onChangeProp('jobRetryCount', val),
    //   [onChangeProp]
    // );

    return (
      <>
        <div className={`${classes.tabFormContainer} ${classes.fz_18}`}>
          {t('basic')}{t('enSpace')}{t('setting')}
        </div>
        <Card>
          <Grid
            container
            direction="column"
            spacing={1}
          >
            <Grid item>
              <FormTextField
                breakpoint={isTablet}
                className={`${classes.unlimitWidthInput} ${classes.w_full}`}
                classNameObj={{
                  content: !isTablet ? classes.pr_24 : ''
                }}
                onChange={onNameChange}
                placeholder={`${t('pleaseEnterTaskName')}`}
                sectionLabel={`${t('job')}${t('enSpace')}${t('name')}`}
                sectionTooltip={t('toolTipsJobName')}
                value={name}
              />
            </Grid>
            <Grid
              container
              item
            >
              <VirtualCluster
                breakpoint={isTablet}
                classNameObj={{
                  content: `${!isTablet ? classes.pr_24 : ''} ${classes.unlimitWidthSelect} ${classes.w_full}`
                }}
                onChange={onVirtualClusterChange}
                sectionShowUnderVg={sectionShowUnderVg}
                sectionTooltip={sectionTooltip}
                virtualCluster={virtualCluster}
              />
            </Grid>
            {
              // advanceFlag &&
              //   <Grid item>
              //     <BasicSection sectionLabel={`${t('quickConfiguration')}`}>
              //       <div style={{ width: 250 }}>
              //         <BaseLink
              //           onClick={() => setIsModalOpen(true)}
              //         >
              //           {t('chooseTemplate')}
              //         </BaseLink>
              //       </div>
              //     </BasicSection>
              //   </Grid>
            }
            {
              // 移除重試次數
              // <Grid item>
              //   <FormSpinButton
              //     InputProps={{ inputProps: { min: 0 } }}
              //     onChange={onRetryCountChange}
              //     sectionLabel={`${t('retryCount')}(${t('optional')})`}
              //     value={jobRetryCount}
              //   />
              // </Grid>
            }
          </Grid>
        </Card>
      </>
    );
  }
);

JobInformation.propTypes = {
  jobInformation: PropTypes.instanceOf(JobBasicInfo).isRequired,
  vgInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sectionShowUnderVg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  setIsCopy: PropTypes.func
  // advanceFlag: PropTypes.bool
};
