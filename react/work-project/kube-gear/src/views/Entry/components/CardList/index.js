import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import BaseTab from 'components/BaseTab';
import { getCustomizedSystemParam } from 'utils/api';
import { find, isEmpty } from 'lodash';
import cookies from 'js-cookie';

export const CardList = () => {
  const { t } = useTranslation();
  const [systemSetting, setSystemSetting] = useState({});
  const [selectedKey, setSelectedKey] = useState('uploadDocument');

  useEffect(() => {
    getCustomizedSystemParam()
      .then(data => {
        setSystemSetting({
          dl: [
            {
              imgUrl: '/assets/img/job/caffe.png',
              repoUrl: !isEmpty(find(data, el => el.key === 'caffeImage')) ? find(data, el => el.key === 'caffeImage').value : 'ufoym/deepo:caffe-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/keras.jpg',
              repoUrl: !isEmpty(find(data, el => el.key === 'kerasImage')) ? find(data, el => el.key === 'kerasImage').value : 'ufoym/deepo:keras-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/mxnet.jpg',
              repoUrl: !isEmpty(find(data, el => el.key === 'mxnetImage')) ? find(data, el => el.key === 'mxnetImage').value : 'ufoym/deepo:mxnet-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/pytorch.png',
              repoUrl: !isEmpty(find(data, el => el.key === 'pytorchImage')) ? find(data, el => el.key === 'pytorchImage').value : 'ufoym/deepo:pytorch-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/tensorflow.png',
              repoUrl: !isEmpty(find(data, el => el.key === 'tensorflowImage')) ? find(data, el => el.key === 'tensorflowImage').value : 'ufoym/deepo:tensorflow-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/custom.png',
              repoUrl: !isEmpty(find(data, el => el.key === 'customDLImage')) ? find(data, el => el.key === 'customDLImage').value : ''
            }
          ],
          ml: [
            {
              imgUrl: '/assets/img/job/rapids.jpg',
              repoUrl: !isEmpty(find(data, el => el.key === 'rapids')) ? find(data, el => el.key === 'rapids').value : 'rapidsai/rapidsai:cuda10.0-runtime-ubuntu18.04-py3.6'
            },
            {
              imgUrl: '/assets/img/job/tensorRt.jpg',
              repoUrl: !isEmpty(find(data, el => el.key === 'tensorrt')) ? find(data, el => el.key === 'tensorrt').value : 'nvcr.io/nvidia/tensorrt:20.06-py3'
            },
            {
              imgUrl: '/assets/img/job/custom.png',
              repoUrl: !isEmpty(find(data, el => el.key === 'customMLImage')) ? find(data, el => el.key === 'customMLImage').value : ''
            }
          ]
        })
      })
      .catch(() => {
        setSystemSetting({
          dl: [
            {
              imgUrl: '/assets/img/job/caffe.png',
              repoUrl: 'ufoym/deepo:caffe-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/keras.jpg',
              repoUrl: 'ufoym/deepo:keras-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/mxnet.jpg',
              repoUrl: 'ufoym/deepo:mxnet-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/pytorch.png',
              repoUrl: 'ufoym/deepo:pytorch-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/tensorflow.png',
              repoUrl: 'ufoym/deepo:tensorflow-py36-cu90'
            },
            {
              imgUrl: '/assets/img/job/custom.png',
              repoUrl: ''
            }
          ],
          ml: [
            {
              imgUrl: '/assets/img/job/rapids.jpg',
              repoUrl: 'rapidsai/rapidsai:cuda10.0-runtime-ubuntu18.04-py3.6'
            },
            {
              imgUrl: '/assets/img/job/tensorRt.jpg',
              repoUrl: 'nvcr.io/nvidia/tensorrt:20.06-py3'
            },
            {
              imgUrl: '/assets/img/job/custom.png',
              repoUrl: ''
            }
          ]
        })
      })
  }, [])

  const handleLinkClick = item => {
    setSelectedKey(item.props.itemKey);
  };

  const renderItem = () => {
    switch (selectedKey) {
      case 'uploadDocument':
      default:
        return (
          <>
            <div className={styles.doc}>
              <Link to={`/fs-item-list/${cookies.get('user')}`}>
                <i className="fa fa-inbox" />
                <span>{t('NFS')}</span>
              </Link>
            </div>
            <div className={styles.doc}>
              <Link to={`/glusterfs-item-list/${cookies.get('user')}`}>
                <i className="fa fa-object-group" />
                <span>{t('glusterfs')}</span>
              </Link>
            </div>
          </>
        );
      case 'DL':
        return (
          systemSetting.dl.map(item =>
            <div key={item.imgUrl}>
              <Link
                style={{ backgroundImage: `url(${item.imgUrl})` }}
                to={`/job-submit?docker_repo=${item.repoUrl}`}
              />
            </div>
          )
        );
      case 'ML':
        return (
          systemSetting.ml.map(item =>
            <div key={item.imgUrl}>
              <Link
                style={{ backgroundImage: `url(${item.imgUrl})` }}
                to={`/job-submit?docker_repo=${item.repoUrl}`}
              />
            </div>
          )
        );
    }
  }

  return (
    <>
      <BaseTab
        items={[
          {
            key: 'uploadDocument', text: `${t('Upload')}${t('enSpace')}${t('Files')}`
          },
          {
            key: 'DL', text: `${t('deep')}${t('enSpace')}${t('learning')}`
          },
          {
            key: 'ML', text: `${t('machine')}${t('enSpace')}${t('learning')}`
          }
        ]}
        onLinkClick={handleLinkClick}
        styles={{ root: { overflowX: 'auto', overflowY: 'hidden' } }}
        withBorder={false}
      />
      <div className={styles.container}>
        {
          renderItem()
        }
      </div>
    </>
  )
}

export default CardList;