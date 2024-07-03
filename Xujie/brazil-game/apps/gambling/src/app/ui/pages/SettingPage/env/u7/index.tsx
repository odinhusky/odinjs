import React from 'react';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useAllowLoginRouterRules } from '../../../../router/hooks/useAllowLoginRouterRules';
import { environment } from '../../../../../../environments/environment';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { notification } from 'antd';
import t from 'apps/gambling/src/assets/constant/lang';
import U7SettingInfoBox from './U7SettingInfoBox';
import cx from '../../../../utils/cx';
import U7Linear1Btn from '../../../../components-bs/Buttons/env/u7/U7Linear1Btn';
import { RightOutlined } from '@ant-design/icons';
import {
  FLEX_COL,
  U7_MT_SPACING,
} from 'apps/gambling/src/assets/constant/style';
import U7EditUserInfoModal from './U7EditUserInfoModal';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';

type U7SettingPageProps = {
  editing: boolean;
  nickname: string;
  phone: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const U7SettingPage = ({
  editing,
  nickname,
  phone,
  setEditing,
}: U7SettingPageProps) => {
  useAllowLoginRouterRules();

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const { isMobile } = useBreakpoint();
  
  const { onClickToPrivacyAgreement } = usePageNavigate()

  return (
    <PageContainer>
      {contextHolder}
      <BackNavigation
        onClick={() => {
          if (isMobile) {
            navigate(PageOrModalPathEnum.MyPage);
          } else {
            navigate(PageOrModalPathEnum.IndexPage);
          }
        }}
        title={
          isMobile ? (
            <div className="absolute left-0 w-full text-center font-bold text-lg">
              {t['Setting']}
            </div>
          ) : null
        }
      />

      <div className={cx(FLEX_COL, 'gap-4', U7_MT_SPACING)}>
        <U7SettingInfoBox title={t['TelephoneNumber']} children={phone} />

        <U7SettingInfoBox
          title={t['NickName']}
          children={
            <div className={cx('flex items-center gap-2')}>
              <div>{nickname}</div>

              <U7Linear1Btn
                className={cx('h-[28px]')}
                children={t['Edit']}
                onClick={() => {
                  setEditing(true);
                }}
              />
            </div>
          }
        />

        <U7SettingInfoBox
          title={t['CheckUpdate']}
          children={environment.appVersion}
        />

        <div
          className="cursor-pointer"
          onClick={() => {
            onClickToPrivacyAgreement();
          }}
        >
          <U7SettingInfoBox
            title={t['privacyPolicy']}
            children={<RightOutlined className={cx('text-base')} />}
          />
        </div>
      </div>

      {editing ? (
        <U7EditUserInfoModal
          nickname={nickname}
          onClose={(done) => {
            setEditing(false);
            if (done) {
              api.success({
                message: t['SavedSuccess'],
              });
              navigate(PageOrModalPathEnum.SettingPage);
            }
          }}
        />
      ) : null}
    </PageContainer>
  );
};

export default U7SettingPage;
