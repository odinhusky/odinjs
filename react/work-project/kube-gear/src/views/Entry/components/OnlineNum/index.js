import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// # API
import {
  // # 取得在線人數以及總用戶
  getOnlineUser
} from 'utils/api';


// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';
import { Icon } from '@material-ui/core';


// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import { BaseNumAnimation } from 'components/BaseAnimation'

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
// import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry/OnlineNum
 * @component OnlineNum
 * @description Online number component
*/
export default function OnlineNum() {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { classes } = useContext(EntryContext);

  // # states
  const [online, setOnline] = useState(0)
  const [total, setTotal] = useState(0)

  // - methods
  /**
   * @author odin
   * @description Get initialization data from API
  */
  const initData = async () => {
    try {
      // 取得子資源的資源分佈以及使用狀況
      const onlineNumReq = await getOnlineUser();

      if(onlineNumReq && !isEmpty(onlineNumReq)){
        // console.log('onlineNumReq', onlineNumReq)
        setOnline(onlineNumReq.online)
        setTotal(onlineNumReq.total)
      }

    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  // * hooks
  /**
   * @author odin
   * @description Component Initialization
  */
  useEffect(()=> {
    initData();
  }, [])

  return (
    <div className={classes.onlineNumContainer}>

      <BaseSimpleCard
        cardTitle={`${t('onlineUsers')}`}
      >
        <div className={classes.onlineNumContent}>

          <div className={classes.iconWrapper}>
            <Icon
              color="primary"
              style={{ fontSize: 45 }}
            >
              groups
            </Icon>
          </div>

          <Typography
            className={classes.baseSimpleCardHeaderText}
            component="div"
            variant="h4"
          >
            <BaseNumAnimation
              num={online}
            />
          </Typography>

          <Typography
            className={classes.baseSimpleCardHeaderSubText}
            component="div"
            variant="body2"
          >
            {`${t('total')}${t('user')}`} {total}
          </Typography>

        </div>
      </BaseSimpleCard>

    </div>
  )
}

OnlineNum.propTypes = {
  // containerClass: PropTypes.string,
}