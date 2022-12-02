import React, { useContext } from 'react';

// ? context
import FsItemListContext from 'views/FsItemList/FsItemListContext';

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/NewFolderModal/Progress
 * @component Progress Component
 * @description DetailPage's NewFolderModal's Progress Component
*/
const Progress = ({ value }) => {

  // ? context
  const { classes } = useContext(FsItemListContext);

  return (
    <div className={`${classes.d_flex} ${classes.directionRow}`}>
      <div className={`${classes.progressTrack}`}>
        <div
          className={`${classes.progressBar} ${classes.bg_primary}`}
          style={{
            minWidth: '2rem',
            width: `${value}%`
          }}
        />
      </div>
      <p
        className={`${classes.text_center}`}
      >{value}%</p>
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number
};

export default Progress;
