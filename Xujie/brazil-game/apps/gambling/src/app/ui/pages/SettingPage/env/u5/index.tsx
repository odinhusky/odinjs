import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { useState } from 'react';
import { environment } from '../../../../../../environments/environment';
import { tcx } from '../../../../utils/tcx';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { notification } from 'antd';
import { usePostUserUpdateMutation } from '../../../../../external';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import AvatarList from './AvatarList';

interface ISettingPageProps {
  nickname: string;
  phone: string;
}

export const SettingPage = ({ nickname, phone }: ISettingPageProps) => {
  const userInfo: IUserInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    Number(userInfo.avatar) || 1
  );
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [errorMessage, setErrorMessage] = useState('');

  const [triggerUpdateUserInfo] = usePostUserUpdateMutation({});
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate();

  const vip_level = useSelector((state: RootState) => state.app?.vip_level);

  const nickNameValidator = (nickname: string) => {
    if (nickname === '') {
      setErrorMessage('Insira um apelido');
      return;
    }
    if (/[^0-9a-zA-Z]/.test(nickname)) {
      setErrorMessage('Apenas inglês ou números são suportados');
      return;
    }
    if (nickname.length < 4 || nickname.length > 16) {
      setErrorMessage('nome de usuário (4-16 letras e números)');
      return;
    }

    setErrorMessage('');
  };

  const handleSave = () => {
    if (errorMessage === '') {
      triggerUpdateUserInfo({
        token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
        nickname: nicknameInput,
        avatar: `${selectedAvatar}`,
        birthday: '',
        mail: '',
        whatsAppUserName: '',
        facebookUserName: '',
        telegramUserName: '',
        twitterUserName: '',
      }).then((response) => {
        if ('data' in response) {
          if (response?.data?.code === 200) {
            AppLocalStorage.setItem(
              AppLocalStorageKey.userInfo,
              JSON.stringify(response.data.data?.user_info || '{}')
            );
            api.success({
              message: 'Configurações salvas',
            });
            navigate(PageOrModalPathEnum.MyPage);
          }
        }
      });
    }
  };
  const { isMobile } = useBreakpoint();
  return (
    <PageContainer>
      {contextHolder}
      <BackNavigation
        className="mb-4 mobile:mb-8"
        onClick={() => {
          if (isMobile) {
            navigate(PageOrModalPathEnum.MyPage);
          } else {
            navigate(PageOrModalPathEnum.IndexPage);
          }
        }}
      />
      {/* 基本信息 */}
      {isMobile ? (
        <div className="py-4 flex flex-col items-center rounded-2xl bg-[var(--grayscale-20)]">
          <div className="flex">
            <img
              className="w-12 h-12 rounded-full mr-3"
              alt="avatar"
              src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${userInfo.avatar}.png`}
            />
            <img
              className="w-12 h-12"
              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${vip_level}.png`}
              alt="VIP"
            />
          </div>
          <div className="mt-3 flex items-center text-sm leading-5">
            <span className="text-[var(--grayscale-80)]">ID:</span>
            <span className="ml-1 font-bold text-white">
              {userInfo.user_id}
            </span>
            <CopyIcon
              copyText={userInfo.user_id}
              icon={
                <img
                  alt="cooy"
                  className="w-5 h-5 ml-1"
                  src={`assets/${environment.uVersion}/icon_copy.png`}
                />
              }
            />
          </div>
          <div className="text-sm leading-5">
            <span className="text-[var(--grayscale-80)]">
              Número de telefone:
            </span>
            <span className="ml-1 font-bold text-white">{phone}</span>
          </div>
          <div className="text-sm leading-5">
            <span className="text-[var(--grayscale-80)]">
              Verifique actualizações:
            </span>
            <span className="ml-1 font-bold text-white">
              {environment.appVersion}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 flex justify-between items-center rounded-2xl bg-[var(--grayscale-20)]">
          <div className="flex ">
            <img
              className="w-24 h-24 rounded-full mr-8"
              alt="avatar"
              src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${userInfo.avatar}.png`}
            />
            <div className="text-lg leading-7">
              <div className="flex items-center">
                <span className="text-[var(--grayscale-80)]">ID:</span>
                <span className="ml-1 font-bold text-white">
                  {userInfo.user_id}
                </span>
                <CopyIcon
                  copyText={userInfo.user_id}
                  icon={
                    <img
                      alt="cooy"
                      className="w-5 h-5 ml-1"
                      src={`assets/${environment.uVersion}/icon_copy.png`}
                    />
                  }
                />
              </div>
              <div className="mt-2">
                <span className="text-[var(--grayscale-80)]">
                  Número de telefone:
                </span>
                <span className="ml-1 font-bold text-white">{phone}</span>
              </div>
              <div className="mt-2">
                <span className="text-[var(--grayscale-80)]">
                  Verifique actualizações:
                </span>
                <span className="ml-1 font-bold text-white">
                  {environment.appVersion}
                </span>
              </div>
            </div>
          </div>
          <img
            className="w-24 h-24"
            src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${vip_level}.png`}
            alt="VIP"
          />
        </div>
      )}
      {/* 修改名称 */}
      <div className="mt-3 p-4 rounded-2xl bg-[var(--grayscale-20)]">
        <div className="text-base leading-6 font-bold text-white">Apelido</div>
        <input
          className={tcx(
            'w-full mt-1 text-base text-[var(--grayscale-80)] p-[10px] rounded-lg bg-[var(--grayscale-30)] border border-[var(--grayscale-50)] focus:border-[var(--state-warn-main)] text-[var(--grayscale-100)] focus:outline-none',
            ['border-red-500 focus:border-red-500', errorMessage]
          )}
          value={nicknameInput}
          onChange={(e) => {
            nickNameValidator(e.target.value);
            setNicknameInput(e.target.value);
          }}
        />
        <div
          className={`h-8 max-sm:h-6 text-[var(--state-error-main)] text-sm pt-1`}
        >
          {errorMessage}
        </div>
        {/* 头像列表 */}
        <AvatarList
          value={selectedAvatar}
          onChange={(value) => setSelectedAvatar(value)}
        />
      </div>
      <button
        className={`w-full sm:w-80 lg:w-[480px] h-10 lg:h-12 mt-8 mx-auto  flex justify-center items-center text-sm text-white font-extrabold linear-2-button`}
        onClick={handleSave}
      >
        Retirar
      </button>
    </PageContainer>
  );
};
