import React, { useState } from 'react';
import PropTypes from 'prop-types';

import style from './index.module.scss';
import { theme } from 'theme';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function BaseMenu(props) {
  return (
    <div className={style.container}>
      <RecursiveRender {...props}/>
    </div>
  )
}

function RecursiveRender(props) {
  const {
    data,
    selectedItem,
    setSelectedItem,
    depth = 0
  } = props;
  const [renderData, setRenderData] = useState([])

  useEffect(() => {
    if (!isEmpty(data)) {
      setRenderData(data.map(item => ({ ...item, isExpend: true })))
    }
  }, [data])

  return(
    <>
      {
        renderData.map(item => (
          <ul
            className={style.menu}
            key={item.name}
          >
            <li
              className={selectedItem === item.name ? style.active : null}
              onClick={() => setSelectedItem(item.name)}
              style={{ borderColor: selectedItem === item.name ? theme.themePrimary : 'transparent' }}
            >
              <div style={{ marginLeft: depth * 20, paddingLeft: 10 }}>
                {
                  !isEmpty(item.children) &&
                  <FontAwesomeIcon
                    icon={'chevron-right'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenderData(prev => prev.map(pre =>
                        pre.name === item.name
                          ? { ...pre, isExpend: !pre.isExpend }
                          : { ...pre }
                      ))}
                    }
                    style={{
                      transform: item.isExpend ? 'rotate(90deg)' : 'none',
                      transition: 'all .3s'
                    }}
                  />
                }
                <span>
                  {item.name}
                </span>
              </div>
            </li>
            {
              !isEmpty(item.children) &&
              <li style={{ display: item.isExpend ? 'block' : 'none' }}>
                <RecursiveRender
                  {...props}
                  data={item.children}
                  depth={depth + 1}
                />
              </li>
            }
          </ul>
        ))
      }
    </>
  );
}

RecursiveRender.propTypes = {
  data: PropTypes.array,
  selectedItem: PropTypes.string,
  setSelectedItem: PropTypes.func,
  depth: PropTypes.number
};

export default BaseMenu;