
// import {isNil, isEqual, isEmpty, cloneDeep} from 'lodash';
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import styles from './header.module.scss';

import Breadcrumb from './breadcrumb';
import { useTranslation } from 'react-i18next';

const homePathForRole = '/entry';

const Header = ({ headerPath }) => {
  const { t } = useTranslation();
  const [pathArr, setPathArr] = useState([new PathInfo(t('home'), homePathForRole)]);
  const [title, setTitle] = useState('');
  useEffect(( )=> {
    setPathArr(prev => {
      if (!headerPath) {
        return [...prev, new PathInfo(title, '#')];
      }
      const result = [new PathInfo(t('home'), homePathForRole)];
      headerPath.forEach(path=>{
        result.push(new PathInfo(path.title, path.link) );
      });
      return [...result];
    });
    setTitle(headerPath[headerPath.length - 1].title);
  }, [headerPath]);
  return (
    <div className={styles.header}>
      <h2 >{title}</h2>
      <Breadcrumb path={pathArr}/>
    </div>
  );
};
Header.propTypes = {
  headerPath: PropTypes.array
};

class PathInfo {
  constructor(path, link) {
    this.path = path;
    this.link = link;
  }
}

export default Header;
