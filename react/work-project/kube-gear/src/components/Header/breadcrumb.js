import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './breadcrum.module.scss';

const Breadcrumb = ({ path }) => {
  return (<ul className={styles.breadcrum} >
    {
      path.map((item, index)=> (
        <li key={index}>
          {
            (item.link !== '#' && index !== path.length - 1) ?
              <Link to={item.link}>
                {item.path}
              </Link>
              :
              <a
                className={styles.disabled}
                href="#"
              >
                {item.path}
              </a>
          }
        </li>
      ))
    }
  </ul>);
};

Breadcrumb.propTypes = {
  path: PropTypes.array
};

export default Breadcrumb;
