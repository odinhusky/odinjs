import React, {
  useState,
  useEffect
} from 'react';

// ? Self-packed Components || Functions
import { theme } from 'theme';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  container: {
    position: 'absolute',
    minWidth: '100%'
  },
  menu: {
    listStyle: 'none',
    color: '#333333',
    boxSizing: 'border-box',
    position: 'relative',
    padding: 0,

    '& li': {
      whiteSpace: 'nowrap'
    },

    '& li:first-child': {
      padding: '10px 0',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'display 1s',
      borderLeft: '3px solid #fff'
    },
    '& svg': {
      fontSize: 16,
      marginRight: 10
    }
  },
  active: {
    background: theme.palette.customColor.themePrimaryLightBg,
    color: theme.palette.customColor.themePrimary
  }
}));

// ^ Plugins
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';


function BaseMenu(props) {

  // = styles
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <RecursiveRender {...props}/>
    </div>
  )
}

function RecursiveRender(props) {

  // $ init data
  const {
    data,
    selectedItem,
    setSelectedItem,
    depth = 0
  } = props;

  // = styles
  const classes = useStyles();

  // # states
  const [renderData, setRenderData] = useState([])

  // * hooks
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
            className={classes.menu}
            key={item.name}
          >
            <li
              className={selectedItem === item.name ? classes.active : null}
              onClick={() => setSelectedItem(item.name)}
              style={{ borderColor: selectedItem === item.name ? theme.themePrimary : 'transparent' }}
            >
              <div
                className={`${classes.pl_10}`}
                style={{ marginLeft: depth * 20 }}
              >
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
              <li className={`${item.isExpend ? classes.d_block : classes.d_none}`}>
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