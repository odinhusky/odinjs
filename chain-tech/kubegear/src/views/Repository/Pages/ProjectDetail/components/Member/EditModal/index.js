import React, {
  useState,
  useContext
} from 'react';

// # API
import { updateProjectMember } from 'utils/api';

// ? context
import RepositoryContext from '../../../../../RepositoryContext';

// ^ Material-ui Componets(Functions)
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Repository/ProjectDetail/Member/EditModal
 * @component EditModal
 * @description EditModal
*/
const EditModal = ({
  memberList,
  getMemberList,
  isOpen,
  onClose
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { currentProject, classes } = useContext(RepositoryContext);

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(1);

  // - methods
  const handleSubmit = () => {
    setIsLoading(true);
    Promise.all(
      memberList.map(member => {
        return updateProjectMember(currentProject.project_id, member.id, role);
      })
    )
      .then(() => {
        toast.success(t('success'))
        getMemberList();
        onClose(false);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.mr_10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isLoading}
            onClick={handleSubmit}
          />
        </>
      }
      onClose={onClose}
      title={`${t('modify')}${t('enSpace')}${t('member')}`}
    >
      <ul className={`${classes.projectDetailMemberEditModalSelectedMemberList}`}>
        <li>{t('member')}</li>
        {
          memberList.map((member, index) => {
            return (
              <li key={index}>
                {member.entity_name}
              </li>
            )
          })
        }
      </ul>
      <FormControl>
        <FormLabel>{t('role')}</FormLabel>
        <RadioGroup
          aria-label="role"
          name="role"
          onChange={(e) => {
            const value = e.target.value;
            setRole(Number(value))
          }}
          value={role}
        >
          <FormControlLabel
            control={<Radio />}
            label={`${t('project')}${t('enSpace')}${t('admin')}`}
            value={1}
          />
          <FormControlLabel
            control={<Radio />}
            label={t('maintainer')}
            value={2}
          />
          <FormControlLabel
            control={<Radio />}
            label={t('Guest')}
            value={3}
          />
        </RadioGroup>
      </FormControl>
    </BaseModalNew>
  );
};

EditModal.propTypes = {
  getMemberList: PropTypes.func,
  isOpen: PropTypes.bool,
  memberList: PropTypes.array,
  onClose: PropTypes.func
};

export default EditModal;
