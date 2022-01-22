import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { theme } from 'theme';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { isEmpty } from 'lodash';
import { getNotificationAddress } from 'utils/api';
import { useMomentWithLocale } from 'utils/hooks/useMomentWithLocale';
import { uuidGenerator, isUUID } from 'utils';
import { toast } from 'react-toastify';
import GlobalContext from 'layouts/Main/GlobalContext';
import cookies from 'js-cookie';

const styles = {
  root: {
    color: theme.themePrimary,
    background: 'none'
  },
  iconHovered: {
    color: theme.themePrimary,
    transform: 'scale(1.25,1.25)',
    transition: 'transform 0.25s ease'
  }
}

const Notification = ({ isNotifycationDropdownOpen, userInfo, setHasNoRead, setLostConnect, closeDropDown }) => {
  const moment = useMomentWithLocale();
  const { t } = useTranslation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isSocketConnect, setIsSocketConnect] = useState(false);
  const {
    locale,
    noticeList,
    setNoticeList,
    socketClient,
    setSocketClient
  } = useContext(GlobalContext);

  const getAddressAndNotices = async () => {
    try {
      const address = await getNotificationAddress(userInfo.username)

      subscribeChannel(address)
    } catch (err) {
      toast.error(err)
    }
  }

  const subscribeChannel = (addressList) => {

    if (socketClient === null) return
    addressList.forEach(address => {

      socketClient.subscribe(address, function (responseBody) {
        const data = JSON.parse(responseBody.body)
        const id = data.id === 0 ? uuidGenerator() : data.id
        setNoticeList(prev => [
          { ...data, isRead: false, id  },
          ...prev
        ])
      });
    })
  }

  function socketConnect() {
    const client = new Client({
      connectHeaders: {
        Authorization: `Bearer ${cookies.get('token')}`,
        'Accept-Language': locale
      },
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 3000
    });

    setSocketClient(client);

    client.webSocketFactory = function () {
      return new SockJS(`${window.ENV.javaRestServerUri}/websocket`);
    };

    client.beforeConnect = () => {}

    client.onConnect = (state) => {
      if (state.command === 'CONNECTED') {
        setIsSocketConnect(true)
      }
    }

    client.onStompError = (frame) => {
      if (frame?.headers?.message?.endsWith('Invalid token.')) {
        client.deactivate()
      }
    }

    client.onWebSocketClose = (frame) => {
      if (frame.type === 'close') {
        setIsSocketConnect(false)
      }
    }

    client.activate()
  }

  useEffect(() => {
    if (isEmpty(userInfo)) return
    if (!isEmpty(userInfo)) {
      socketConnect()
    }
  }, [userInfo])

  useEffect(() => {
    setHasNoRead(noticeList.some(notice => !notice.isRead))
  }, [noticeList])

  useEffect(() => {
    if (locale && isSocketConnect) {
      handleLanguage(locale)
    }
  }, [locale])

  useEffect(() => {
    if (isSocketConnect) {
      getAddressAndNotices()
      setLostConnect(false)
    } else {
      setLostConnect(true)
    }
  }, [isSocketConnect])

  const handleLanguage = (locale) => {
    socketClient.publish({ destination: `/app/notice/acceptLanguage/${locale}` })
  }

  const handleRead = (id) => {
    setNoticeList(prev => {
      const copy = [...prev]
      const item = copy.find(el => el.id === id)

      item.isRead = true

      return copy
    })
    if (!isUUID(id)) {
      if (socketClient !== null) {
        socketClient.publish({ destination: `/app/notice/${id}/read` })
      }
    }
  }

  const handleReadAll = () => {
    setNoticeList(prev => {
      const copy = [...prev]
      copy.forEach(item => item.isRead = true)
      return copy
    })
    socketClient.publish({ destination: '/app/notice/readAll' })
  }

  const handleDelete = id => {
    setNoticeList(prev => prev.filter(item => item.id !== id))
    socketClient.publish({ destination: `/app/notice/${id}/delete` })
  }

  return (
    <>
      <ul className={`notification-dropdown ${isNotifycationDropdownOpen ? '' : 'hidden'}`}>
        <li className="notification-head">
          {t('notification')}
          <div>
            <IconButton
              aria-controls="long-menu"
              aria-haspopup="true"
              aria-label="more"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="long-menu"
              keepMounted
              onClose={() => setAnchorEl(null)}
              open={open}
            >
              <MenuItem
                onClick={() => {
                  handleReadAll(true)
                  setAnchorEl(null)
                }}
              >
                {t('markAllAsRead')}
              </MenuItem>
            </Menu>
          </div>
        </li>
        {
          noticeList.length === 0 &&
        <li className="notification-none">{t('no2')}{t('enSpace')}{t('notification')}</li>
        }
        {
          noticeList.map((notice) => {
            return (
              <li
                className="notification-content"
                key={notice.id}
                onClick={() => {
                  handleRead(notice.id)
                  if (notice.link) {
                    closeDropDown()
                    history.push(notice.link)
                  }
                }}
                style={{
                  borderLeft: notice.isRead ? '3px solid transparent' : `3px solid ${theme.themePrimary}`
                }}
              >
                <div className={`${notice.isRead ? 'isRead' : ''}`}>
                  <p className="message">{notice.content}</p>
                  <p className="duration">{moment(notice.createdDate).fromNow()}</p>
                </div>
                <IconButton
                  children={<Icon>delete_outline</Icon>}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notice.id)
                  }}
                  styles={styles}
                />
              </li>
            )}
          )
        }
      </ul>
    </>
  );
};

Notification.propTypes = {
  isNotifycationDropdownOpen: PropTypes.bool,
  userInfo: PropTypes.object,
  setHasNoRead: PropTypes.func,
  setLostConnect: PropTypes.func,
  closeDropDown: PropTypes.func
};

export default Notification;