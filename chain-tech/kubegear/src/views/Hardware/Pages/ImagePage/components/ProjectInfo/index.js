import React, { useContext } from 'react';

// ? context
import HardwareContext from 'views/Hardware/HardwareContext';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Hardware/ImagePage/ProjectInfo
 * @component ProjectInfo
 * @description ProjectInfo
*/
const ProjectInfo = ({ info }) => {

  // $ init data
  const { t } = useTranslation();
  const { total, unused, using } = info;

  // ? context
  const { classes } = useContext(HardwareContext);

  return (
    <div className={`${classes.projectInfoContainer}`}>
      <div className={`${classes.projectInfoRow}`}>
        <div className={`${classes.projectInfoInfo}`}>
          <span>{t('image')}</span>
        </div>
        <div className={`${classes.projectInfoInfo}`}>
          <span>{unused}</span>
          <span>{t('unused')}</span>
        </div>
        <div className={`${classes.projectInfoInfo}`}>
          <span>{using}</span>
          <span>{t('using')}</span>
        </div>
        <div className={`${classes.projectInfoInfo}`}>
          <span>{total}</span>
          <span>{t('total2')}</span>
        </div>
      </div>
    </div>
  );
};

ProjectInfo.propTypes = {
  info: PropTypes.object
};

export default ProjectInfo;
