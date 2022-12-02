
import React, { useContext } from 'react';

// ? context
import FsItemListContext from 'views/FsItemList/FsItemListContext';

// ^ Material-ui Componets(Functions)
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/PreviewImageModal
 * @component PreviewImageModal Component
 * @description PreviewImageModal
*/
function PreviewImageModal({
  isOpen,
  onClose,
  isLoading,
  url
}) {
  const { classes } = useContext(FsItemListContext);
  return (
    <Modal
      className={`${classes.flex_center}`}
      onClose={onClose}
      open={isOpen}
    >
      <div className={`${classes.maxW_600px}`}>
        {
          isLoading ?
            <CircularProgress />
            :
            <img
              alt="previewImage"
              className={`${classes.w_full}`}
              src={url}
            />
        }
      </div>
    </Modal>
  );
}

PreviewImageModal.propTypes = {
  url: PropTypes.string,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  name: PropTypes.string
}

export default PreviewImageModal;
