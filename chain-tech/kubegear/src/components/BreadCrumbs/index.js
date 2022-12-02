import React from 'react';

// ? Self-packed Components || Functions
import { handleI18NRoutePath } from 'common/commonMethods'

// ? styled
import styles from './index.module.scss';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { last, isNil } from 'lodash';
import { useLocation } from 'react-router-dom';

export const BreadCrumb = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const lang = params.get('lang')
  const titleLang = isNil(lang) ? '' : handleI18NRoutePath(lang);
  let url = location.pathname;

  // console.log('location', location);
  // console.log('lang', lang);

  // console.log('url1', url)
  url = url.split('/');
  // console.log('url2', url)
  url.shift();
  // console.log('url3', url)

  /**
   * @author odin
   * @description 判斷哪些是例外的 route，最後一個的內容也要改用 t(param) 來進行名稱的儲存
   * @returns {boolean}
  */
  const judgeException = () => {
    let result = false;

    switch(url[0]) {
      case 'template-manage':
        result = true;
        break;
    }

    return result;
  };

  /**
   * @author odin
   * @description 判斷哪些是屬於遞迴的連結
   * @returns {boolean}
  */
  const judgeRecursivePath = (pathName) => {
    let result = false;

    switch(pathName) {
      case 'fs-item-list':
      case 'glusterfs-item-list':

        result = true;
        break;
    }

    return result;
  };

  /**
   * @author odin
   * @description 產生遞迴的 path
   * @returns {string}}
  */
  const generateRecursivePath = (arr, i) => {
    const result = arr.reduce((acc, cur, insideIndex) => {
      if(insideIndex > i) return acc;

      return `${acc}/${cur}`
    }, '');

    return result;
  };

  /**
   * @author odin
   * @description 根據 pathname 來產生麵包屑的內容
   * @returns {array}
  */
  const pathArr = url.map(
    (item, index, arr) => {
      // console.log('index', index)
      // console.log('item', item)

      if (index === 0 || judgeException()) {
        return ({
          name: t(`routeName.${item}`),
          path: item
        })
      }

      // 特定的頁面要產生遞迴的結構
      if(judgeRecursivePath(arr[0])) {
        return ({
          name: item,
          path: generateRecursivePath(arr, index)
        })
      }

      return ({
        name: item,
        path: item
      })
    }
  );

  // ?lang=template-manage_aaa 再把 _ 轉換成 .
  // # routeName.template-manage.aaa => t(`routeName.${lang}`)

  // template-manage => 模板管理
  // ? template-manage/form/add?lang=template-manage_add => 新增模板
  // ? template-manage/form/edit?lang=template-manage_edit => 編輯模板

  // 鏡像
  // repository/{repositoryName}/{libraryName}/{activeCategoryName}(/{tagName})
  // ? http://192.168.0.102/repository/6666666/storage/123
  // ? http://192.168.0.102/repository/6666666/member
  // ? http://192.168.0.102/repository/admin/setting

  const totalPath = [
    { name: t('home'), path: '/entry' },
    ...pathArr
  ];

  // console.log('totalPath', totalPath);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        { titleLang ? t(`routeName.${titleLang}`) : last(totalPath).name}
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