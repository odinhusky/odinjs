import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { last } from 'lodash';
import styles from './index.module.scss';

export const BreadCrumb = () => {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  url = url.split('/');
  url.shift();
  const pathArr = url.map(
    (item, index) => {
      if (index === 0) {
        return ({
          name: t(`routeName.${item}`),
          path: item
        })
      }
      return ({
        name: t(`${item}`),
        path: item
      })
    }
  );
  const totalPath = [
    { name: t('home'), path: '/entry' },
    ...pathArr
  ]
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {last(totalPath).name}
      </h2>
      <ul className={styles.breadcrumbs}>
        {
          totalPath.map((path, idx) =>
          { 
            if (idx === totalPath.length - 1) {
              return (
                <li key={idx}>
                  <a
                    disabled
                    href="#"
                  >
                    {path.name}
                  </a>
                </li>
              )
            } else {
              let checkSlash = path.path
              if (checkSlash.charAt(0) !== '/') {
                checkSlash = `/${path.path}`
              }
              return (
                <li key={idx}>
                  <Link
                    to={checkSlash}
                  >
                    {path.name}
                  </Link>
                </li>
              )
            }
          }
          )
        }
      </ul>
    </div>
  )
}

export default BreadCrumb;