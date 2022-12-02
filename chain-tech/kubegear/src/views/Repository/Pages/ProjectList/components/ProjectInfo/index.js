import React, {
  useContext
} from 'react';

// ? context
import RepositoryContext from '../../../../RepositoryContext';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Repository/ProjectList/ProjectInfo
 * @component ProjectInfo
 * @prop {object} info -- 要顯示的資訊內容
 * @prop {object} defaultQuotas -- 預設要顯示的鏡像默認大小以及數量
 * @description ProjectInfo section
*/
const ProjectInfo = ({ info, defaultQuotas }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes, isAdmin } = useContext(RepositoryContext);

  return (
    <>
      <div className={`${classes.infoContainer}`}>
        <div className={`${classes.infoRow}`}>
          <div className={`${classes.infoInfo}`}>
            <span>{t('project')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.private_project_count}</span>
            <span>{t('private')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.public_project_count}</span>
            <span>{t('public')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.total_project_count}</span>
            <span>{t('total2')}</span>
          </div>
        </div>
        <div className={`${classes.infoRow}`}>
          <div className={`${classes.infoInfo}`}>
            <span>{t('Repositories')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.private_repo_count}</span>
            <span>{t('private')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.public_repo_count}</span>
            <span>{t('public')}</span>
          </div>
          <div className={`${classes.infoInfo}`}>
            <span>{info.total_repo_count}</span>
            <span>{t('total2')}</span>
          </div>
        </div>
      </div>

      {
        isAdmin &&
          <div className={`${classes.infoContainer} ${classes.quotaContainer}`}>
            {/* 項目默認標籤數量 */}
            <div className={`${classes.infoRow}`}>
              <div className={`${classes.infoInfo} ${classes.justify_start}`}>
                <span>{t('defaultCount')}</span>
                <span>{defaultQuotas.count === -1 ? t('Unlimited') : defaultQuotas.count}</span>
              </div>
            </div>

            {/* 項目默認大小 */}
            <div className={`${classes.infoRow}`}>
              <div className={`${classes.infoInfo} ${classes.justify_start}`}>
                <span>{t('defaultStorage')}</span>
                <span>{
                  t(defaultQuotas.storageString)
                    ? t(defaultQuotas.storageString)
                    : defaultQuotas.storageString
                }</span>
              </div>
            </div>
          </div>
      }
    </>
  );
};

ProjectInfo.propTypes = {
  info: PropTypes.object,
  defaultQuotas: PropTypes.object
};

export default ProjectInfo;
