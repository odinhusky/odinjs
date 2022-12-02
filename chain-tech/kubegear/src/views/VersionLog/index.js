import React from 'react';

// ? context
import VersionLogContext from './VersionLogContext';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import { VersionLog } from './components';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import versionLogStyles from './versionLogStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...versionLogStyles(theme)
  }});

/**
 * @author odin
 * @level views/Version Route
 * @component Version Route
 * @description Version Route page
*/
const Version = () => {

  // = styles
  const classes = useStyles();

  // & handled data
  const context = {
    classes
  };

  return (
    <VersionLogContext.Provider value={context}>
      <div
        className={`${classes.pos_rel} ${classes.p_20} ${classes.pt_0}`}
      >
        <BreadCrumbs />
        <div
          className={`${classes.versionLogBg} ${classes.borderRadius_4}`}
        >
          <div className={`${classes.versionLogContainer}`}>
            <VersionLog />
          </div>
        </div>
      </div>
    </VersionLogContext.Provider>
  );
};

export default Version;
