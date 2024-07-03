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

/**
 * 信息框
 */
const InfoBox = ({
  className,
  title,
  children,
}: {
  className?: string;
  title?: string;
  children?: any;
}) => {
  return (
    <div className="w-full h-auto flex flex-col justify-center items-left gap-1 text-sm tablet:text-base text-left">
      <div className="font-medium">{title}</div>
      <div
        className={tcx(
          'w-full px-4 py-[10px] tablet:py-3 rounded-lg bg-[var(--grayscale-20)] border-[1.5px] border-[var(--grayscale-50)]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

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
            notification.success({
              message: 'Configurações salvas',
            });
            navigate(PageOrModalPathEnum.MyPage);
          }
        }
      });
    }
  };
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <PageContainer>
      {contextHolder}
      <BackNavigation
        className="mb-4 mobile:mb-8"
        onClick={() => {
          if (isMobile || isTablet) {
            navigate(PageOrModalPathEnum.MyPage);
          } else {
            navigate(PageOrModalPathEnum.IndexPage);
          }
        }}
      />

      {/* 基本信息 */}
      <div
        className="
        relative w-full tablet:w-auto h-auto text-[var(--grayscale-100)] 
        flex justify-center items-center gap-3 tablet:gap-4 flex-col tablet:flex-row"
      >
        {/**個人資訊 */}
        <div
          className="
          flex flex-1 justify-center items-center flex-col gap-3 mobile:gap-5 tablet:gap-3
          w-full tablet:h-[577px] rounded-xl bg-[var(--grayscale-30)]
          py-4 px-5 mobile:py-8 mobile:px-9 tablet:p-12"
        >
          {/**头像名称 */}
          <div className="relative flex justify-left items-center space-x-6 w-full">
            {/*当前头像*/}
            <div className="relative flex-none w-[72px] h-[72px] mobile:w-24 mobile:h-24 tablet:w-40 tablet:h-40 self-start">
              <img
                className="rounded-full w-full h-full"
                alt="avatar"
                src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${userInfo.avatar}.png`}
              />
              <div
                className="
                absolute right-0 bottom-0 rounded-full text-center flex justify-center items-center
                border-2 tablet:border-4 border-[var(--grayscale-25)] bg-linear-3-light-hover 
                w-8 h-8 mobile:w-10 mobile:h-10 tablet:w-16 tablet:h-16"
              >
                <img
                  className="w-7 mobile:w-8 tablet:w-12"
                  src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${vip_level}.png`}
                  alt="VIP"
                />
              </div>
            </div>
            <div className="w-full my-auto">
              {/*修改名称 */}
              <InfoBox
                title="Apelido"
                className={tcx(
                  'flex flex-row space-x-3 text-[var(--grayscale-100)] focus-within:border-[var(--state-info-main)] hover:border-[var(--state-info-light-hover)]',
                  [
                    'border-[var(--state-error-main)] focus-within:border-[var(--state-error-main)] hover:border-[var(--state-error-main)]',
                    errorMessage,
                  ]
                )}
              >
                <input
                  className="w-full bg-transparent focus:outline-none"
                  value={nicknameInput}
                  onChange={(e) => {
                    nickNameValidator(e.target.value);
                    setNicknameInput(e.target.value);
                  }}
                />
                <img
                  className="w-5 h-5 tablet:w-6 tablet:h-6"
                  alt="edit"
                  src={`assets/${environment.uVersion}/icon_pen.png`}
                />
              </InfoBox>
              <div className="">
                <div className="w-full py-1 text-start text-[var(--state-error-main)]">
                  {errorMessage}
                </div>
              </div>
            </div>
          </div>

          <span className="w-full border-[0.5px] border-[var(--grayscale-70)]"></span>

          <div className="flex flex-col justify-center items-center space-y-3 tablet:space-y-6 w-full">
            <InfoBox title="ID" className="text-[var(--grayscale-90)]">
              <div className="flex items-center">
                {userInfo.user_id}
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
            </InfoBox>
            <InfoBox title="Número de telefone">{phone}</InfoBox>
            <InfoBox title="Verifique actualizações">
              {environment.appVersion}
            </InfoBox>
          </div>
        </div>

        {/**选择头像 */}
        <div
          className="
          flex justify-center items-left flex-col gap-3 mobile:gap-5 tablet:gap-3 font-medium
          w-full tablet:w-[616px] h-auto tablet:h-[577px] rounded-xl bg-[var(--grayscale-30)]
          py-4 px-5 mobile:py-8 mobile:px-9 tablet:p-12"
        >
          <span>Alterar apelido favrito</span>

          <span className="w-full border-[0.5px] border-[var(--grayscale-70)]"></span>

          {/* 头像列表 */}
          <AvatarList
            value={selectedAvatar}
            onChange={(value) => setSelectedAvatar(value)}
          />
        </div>
      </div>

      <button
        className={`
          mt-3 mobile:mt-5 mx-auto flex justify-center items-center linear-2-button
          w-full mobile:max-w-[320px] tablet:max-w-[400px] h-9 mobile:h-10 tablet:h-12 
          text-sm tablet:text-base font-medium rounded-lg`}
        onClick={handleSave}
      >
        Salvar
      </button>
    </PageContainer>
  );
};
