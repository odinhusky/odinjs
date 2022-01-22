import React, { useState, useContext } from 'react';

// ? context
import UserInfoContext from '../../UserInfoContext';

// ^ Material UI Component
import Link from '@material-ui/core/Link';

// ? self-packed components || functions
import Table from './Table'
import OrgModal from './OrgModal';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/UserInfo/MyGroup/GroupList
 * @component GroupList
 * @description Contains group tables
*/
const GroupList = ({ data }) => {
  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes } = useContext(UserInfoContext);

  // # states
  const [activeItem, setActiveItem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // & handled data
  const renderTitle = item => {
    return (
      <div className={`${classes.d_flex} ${classes.w_full}`}>
        <div className={classes.groupTableTitle}>{item.name}</div>
        <Link
          className={classes.topologyChartBtn}
          color="primary"
          onClick={() => {
            setActiveItem(item);
            setIsModalOpen(true);
          }}
        >
          {t('topologyChart')}
        </Link>
      </div>
    )
  }

  return (

    <div className={classes.groupListContainer}>
      {
        isEmpty(data) ? <div className={classes.groupListNoData}>{t('haventJoinGroupYet')}</div>
          :
          <>
            {
              data.map(item => {
                const tableData = [
                  ...item.leaders.map(leader => ({ ...leader, isLeader: true  })),
                  ...item.members.map(member => ({ ...member, isLeader: false }))
                ]
                return(
                  <div
                    className={`${classes.mt_20} ${classes.tableContainer}`}
                    key={item.name}
                  >
                    <div className={classes.tableHead}>
                      {renderTitle(item)}
                    </div>
                    <div className={classes.tableBody}>
                      <Table
                        className={classes.customTheadBg}
                        data={tableData}
                      />
                    </div>
                  </div>
                )
              })
            }
          </>
      }
      <OrgModal
        data={activeItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

GroupList.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};

export default GroupList;