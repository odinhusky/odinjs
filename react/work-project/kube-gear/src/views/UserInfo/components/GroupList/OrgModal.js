import React, { useContext } from 'react';

// ? context
import UserInfoContext from '../../UserInfoContext';

// ? self-packed components || functions
import { DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import { OrgChart } from 'components/BaseChart';

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/UserInfo/MyGroup/GroupList/OrgModal
 * @component OrgModal
 * @description Specific table Organization map
*/
const OrgModal = ({ isOpen, onClose, data }) => {
  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes } = useContext(UserInfoContext);

  // & handled data
  const leaders = isEmpty(data.leaders) ? [{ name: t('groupLeaderEmpty') }] : data.leaders;
  const members = isEmpty(data.members) ? [{ name: t('groupMemberEmpty') }] : data.members;
  const chartData = members.reduce((acc, curr) => {
    const res = leaders.map(leader => [`${leader.name}#l`, `${curr.name}#m`])
    return [...acc, ...res]
  }, [])

  const leaderNodes = leaders.map(member => ({ id: `${member.name}#l`, title: t('TeamLeader'), name: member.name }))
  const memberNodes = members.map(member => ({ id: `${member.name}#m`, title: t('TeamMember'), name: member.name }))

  const chartOption = {
    title: {
      text: data.name
    },
    series: [{
      type: 'organization',
      keys: ['from', 'to'],
      data: chartData,
      levels: [{
        level: 0,
        color: '#434E86',
        dataLabels: {
          color: '#fff'
        }
      }, {
        level: 1,
        color: '#955096',
        dataLabels: {
          color: '#fff'
        }
      }],
      nodes: [
        ...leaderNodes,
        ...memberNodes
      ],
      colorByPoint: false,
      nodeWidth: 65
    }]
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('topologyChart')}
    >
      <div className={classes.w_auto}>
        <OrgChart
          options={chartOption}
        />
        <div className={classes.flex_justify_end}>
          <DefaultButton
            onClick={onClose}
          >
            {t('close')}
          </DefaultButton>
        </div>
      </div>
    </BaseModal>
  );
};

OrgModal.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default OrgModal;