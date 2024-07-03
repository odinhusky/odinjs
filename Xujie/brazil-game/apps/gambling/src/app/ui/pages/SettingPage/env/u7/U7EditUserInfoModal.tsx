import cx from 'apps/gambling/src/app/ui/utils/cx';
import { U7Modal } from '../../../../modals/UModal/u7/U7Modal';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { Input as DesktopInput } from '../../../../components-bs/Inputs/Input';
import { environment } from 'apps/gambling/src/environments/environment';
import { useState } from 'react';
import { MobileInput } from '../../../../components-bs/Inputs/MobileInput';
import { ENV_AVATAR_COUNT } from 'apps/gambling/src/assets/constant/uVersionTable';
import { AppLocalStorage } from 'apps/gambling/src/app/persistant/localstorage';
import { AppLocalStorageKey } from 'apps/gambling/src/app/persistant/AppLocalStorageKey';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import U7Linear1Btn from '../../../../components-bs/Buttons/env/u7/U7Linear1Btn';
import { usePostUserUpdateMutation } from 'apps/gambling/src/app/external';
import { promiseHandler } from 'apps/gambling/src/app/gateway/promiseHanlder';
import { notification } from 'antd';
import { IOpenNotificationWithIcon } from '../../../../pageTemplate';
import {
  FLEX_COL,
  U7_MODAL_TITLE_FONT,
} from 'apps/gambling/src/assets/constant/style';
import t from 'apps/gambling/src/assets/constant/lang';
import U7Input from '../../../../components-bs/Inputs/env/u7/U7Input';

interface U7EditUserInfoModalProps {
  nickname: string;
  onClose: (done?: boolean) => void;
}

export const U7EditUserInfoModal = ({
  nickname,
  onClose,
}: U7EditUserInfoModalProps) => {
  // $ init
  const { isMobile } = useBreakpoint();
  const userInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
  );
  const [api, contextHolder] = notification.useNotification();

  // # API
  const [triggerUpdateUserInfo, { isLoading }] = usePostUserUpdateMutation({});

  // # states
  const [userNickname, setUserNickname] = useState(nickname);
  const [nickNameInvalidatedMessage, setNickNameInvalidatedMessage] =
    useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    Number(userInfo.avatar) || 1
  );

  // & handled data
  const Input = isMobile ? MobileInput : DesktopInput;
  const avatarNumArray = Array.from(
    { length: ENV_AVATAR_COUNT[environment.uVersion] },
    (_, index) => index + 1
  );

  // - methods
  const openNotificationWithIcon = (props: IOpenNotificationWithIcon) => {
    const type = props.type || 'error';
    const msg = props.message || 'Message';
    api[type]({
      message: msg,
      description: props.description,
    });
  };

  const nickNameValidator = (nickName: string) => {
    if (nickName === '') {
      setNickNameInvalidatedMessage(t['enterNickname']);
      return;
    }

    if (/[^0-9a-zA-Z]/.test(nickName)) {
      setNickNameInvalidatedMessage(t['onlyEnglishAndNumber']);
      return;
    }

    if (nickName.length < 4 || nickName.length > 16) {
      setNickNameInvalidatedMessage(t['nicknameLimit']);
      return;
    }

    setNickNameInvalidatedMessage('');
  };

  const handleConfirm = () => {
    if (nickNameInvalidatedMessage === '') {
      triggerUpdateUserInfo({
        token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
        nickname: userNickname,
        avatar: `${selectedAvatar}`,
        birthday: '',
        mail: '',
        whatsAppUserName: '',
        facebookUserName: '',
        telegramUserName: '',
        twitterUserName: '',
      }).then((response) => {
        promiseHandler.then(
          response,
          () => {
            if ((response as any).data.code === 200) {
              AppLocalStorage.setItem(
                AppLocalStorageKey.userInfo,
                JSON.stringify((response as any).data.data.user_info || '{}')
              );
              onClose(true);
            }
          },
          openNotificationWithIcon
        );
      });
    }
  };

  console.log(
    userInfo,
    selectedAvatar,
    '_________________________________________________'
  );

  return (
    <>
      {contextHolder}

      <U7Modal
        onClose={() => {
          onClose();
        }}
      >
        <div
          className={cx(FLEX_COL, 'gap-5', 'items-center', 'text-white')}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="flex justify-between w-full">
            <div className={cx('w-full', 'text-center', U7_MODAL_TITLE_FONT)}>
              {t['EditNickName']}
            </div>
          </div>

          <div className="w-full">
            <U7Input
              prefix={
                <img
                  alt="user"
                  src={`assets/${environment.uVersion}/icon_user.png`}
                  className="h-[14px] w-[14px] mr-2"
                />
              }
              value={userNickname}
              onChange={(event: any) => {
                setUserNickname(event.target.value);
                nickNameValidator(event.target.value);
              }}
              validation={nickNameInvalidatedMessage === ''}
              errorMessage={nickNameInvalidatedMessage}
            />
          </div>

          <div className={cx('w-full grid grid-cols-4 gap-2 md:gap-4 mb-4')}>
            {avatarNumArray.map((item) => (
              <div
                key={item}
                className={cx('relative')}
                onClick={() => {
                  setSelectedAvatar(item);
                }}
              >
                <img
                  className={cx('w-full rounded-lg bg-transparent')}
                  alt={`avatar${item}`}
                  src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${item}.png`}
                />
                {selectedAvatar == item && (
                  <div
                    className={cx(
                      'absolute -top-[4%] -left-[4%] z-10',
                      'h-[109%] w-[109%]',
                      'rounded-full',
                      'border-[4px] border-[var(--state-success-main)]'
                    )}
                  />
                )}
                {userInfo.avatar == item && (
                  <div
                    className={cx(
                      'absolute -top-[4%] -left-[4%] z-10',
                      'h-[109%] w-[109%]',
                      'rounded-full',
                      'border-[4px] border-[var(--transparent-white-10)]' //
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex w-full gap-3">
            <U7OutlinedBtn
              onClick={() => {
                onClose();
              }}
            >
              {t['Cancel']}
            </U7OutlinedBtn>

            <U7Linear1Btn onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? t['Loading'] : t['Confirm']}
            </U7Linear1Btn>
          </div>
        </div>
      </U7Modal>
    </>
  );
};

export default U7EditUserInfoModal;
