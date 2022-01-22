import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { BaseTooltip } from 'components/BaseTooltip';

const useStyles = makeStyles(() => ({
  formlabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  },
  iconButton: {
    padding: 0,
    fontSize: 18,
    cursor: 'pointer'
    // paddingRight: theme.spacing(1)
  },
  icon: {
    fontSize: 18
  }
}));

export const BasicSection = ({
  sectionLabel,
  sectionOptional,
  sectionTooltip,
  onIconClick,
  children,
  containerItem = false,
  customChildren = false,
  titleOptions,
  titleGrid = 3,
  childrenGrid = 9,
  style,
  className,
  classNameObj
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid
      className={`${className} ${classNameObj?.container}`}
      container
      item={containerItem}
      style={style}
    >
      <Grid
        alignItems={'center'}
        container
        item
        justify={'flex-end'}
        lg={titleGrid}
        md={titleGrid}
        sm={titleGrid}
        spacing={1}
        xl={titleGrid}
        xs={titleGrid}
        {...titleOptions}
        className={`${classNameObj?.labelSection}`}
      >
        <Grid
          className={`${classNameObj?.formlabeGrid}`}
          item
        >
          <FormLabel className={`${classes.formlabel} ${classNameObj?.formlabel}`}>{sectionLabel}</FormLabel>
        </Grid>
        {sectionOptional && <Grid item>{t('optional')}</Grid>}
        <Grid item>
          {(sectionTooltip || onIconClick) && (
            <BaseTooltip
              arrow
              onClick={onIconClick}
              style={{ display: 'flex' }}
              title={sectionTooltip}
            >
              <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
            </BaseTooltip>
          )}
        </Grid>
        {(sectionTooltip || onIconClick) && <Grid item />}
      </Grid>
      {
        customChildren
          ?
          !sectionOptional && children
          :
          childrenGrid === 9
            ?
            <Grid
              className={`${classNameObj?.content}`}
              item
              lg={9}
              md={9}
              sm={9}
              xl={9}
              xs={9}
            >
              {(!sectionOptional) && children}
            </Grid>
            :
            <>
              <Grid
                className={`${classNameObj?.content}`}
                item
                lg={childrenGrid}
                md={childrenGrid}
                sm={childrenGrid}
                xl={childrenGrid}
                xs={childrenGrid}
              >
                {(!sectionOptional) && children}
              </Grid>
              <Grid
                className={`${classNameObj?.blank}`}
                item
                lg={9 - childrenGrid}
                md={9 - childrenGrid}
                sm={9 - childrenGrid}
                xl={9 - childrenGrid}
                xs={9 - childrenGrid}
              />
            </>
      }

    </Grid>
  );
};

BasicSection.defaultProps = {
  sectionLabel: ''
};

BasicSection.propTypes = {
  sectionLabel: PropTypes.string,
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
  children: PropTypes.node,
  sectionOptional: PropTypes.bool,
  onIconClick: PropTypes.func,
  containerItem: PropTypes.bool,
  childrenGrid: PropTypes.number,
  customChildren: PropTypes.bool,
  style: PropTypes.object,
  titleGrid: PropTypes.number,
  titleOptions: PropTypes.object,
  className: PropTypes.string,
  classNameObj: PropTypes.object
  // iconRef: PropTypes.oneOfType([
  //   // Either a function
  //   PropTypes.func,
  //   // Or the instance of a DOM native element (see the note about SSR)
  //   PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  // ])
};
