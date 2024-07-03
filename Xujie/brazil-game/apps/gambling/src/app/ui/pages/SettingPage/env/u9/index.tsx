import { Input, InputValue } from '../../../../components-bs/Inputs/Input';
import { Avatar } from '../../../../components/Avatar';
import { environment } from '../../../../../../environments/environment';
import './index.scss';
import cx from '../../../../utils/cx';
import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { showChangePasswordModal } from './ChangePassword';
import { showChangePhoneModal } from './ChangePhone';
import { showAvatarModal } from './Avatar';
import { AccountService } from '../../../../../service/AccountService';
import { IUserInfo } from '../../../../../persistant/IUserInfo';

export type TInput = {
  type: string;
  value: string;
  url?: string;
  readonly: boolean;
  suffix?: string;
  path?: string; // 跳轉頁面
  modal?: boolean; // 顯示modal
  className?: string;
  placeholder?: string;
  onClick?: (value: string) => void;
};

const useSettingBase = (props: IUserInfo) => {
  const navigate = useNavigate();
  const accountService = AccountService();

  const [inputs, setInputs] = useState<{
    [key: string]: InputValue<string>;
  }>({
    mail: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    whatsapp: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    fb: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    group: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    x: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    day: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    month: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    year: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
  });
  const validateInput = (data: string, field: string) => {
    let regex;
    let errorMessage = '';

    switch (field) {
      // TODO
      case 'mail':
        // 假設 mail 需要有效的電子郵件地址
        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errorMessage = 'Invalid email address.';
        break;
      case 'whatsapp':
        // 假設 Whatsapp 需要10位數字
        regex = /^\d{10}$/;
        errorMessage = 'Whatsapp number must be 10 digits.';
        break;
      case 'fb':
        // 假設 Facebook
        regex = /^\d{10}$/;
        errorMessage = 'fb number must be 10 digits.';
        break;
      case 'group':
        // 假設 Group 需要字母數字組合，長度在3到15之間
        regex = /^[a-zA-Z0-9]{3,15}$/;
        errorMessage = 'Group must be 3-15 alphanumeric characters.';
        break;
      case 'x':
        // 假設 X 需要有效的電子郵件地址
        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errorMessage = 'Invalid email address.';
        break;
      case 'day':
        regex = /^[1-9]\d$/; // /^\d{4}$/;
        errorMessage = 'Por favor insira a data correta';
        break;
      case 'month':
        regex = /^[1-9]\d$/;
        errorMessage = 'Por favor insira a data correta';
        break;
      case 'year':
        regex = /^[1-9]\d$/;
        errorMessage = 'Por favor insira a data correta';
        break;
      default:
        return true;
    }

    const isValidation = regex.test(data);
    setInputs((prevInputs) => ({
      ...prevInputs,
      [field]: {
        ...prevInputs[field],
        data,
        isValidation: isValidation,
        errorMessage: isValidation ? '' : errorMessage,
      },
    }));

    return !!data;
  };

  const inputList: TInput[] = [
    {
      type: 'usename',
      value: props.nickname,
      url: `assets/${environment.uVersion}/icon_user.png`,
      readonly: true,
      className: 'input-item-1',
    },
    {
      type: 'id',
      value: props.user_id.toString(),
      url: `assets/${environment.uVersion}/icon_id.png`,
      readonly: true,
      className: 'input-item-1',
    },
    {
      type: 'phone',
      value: props.phone,
      url: `assets/${environment.uVersion}/icon_phone.png`,
      readonly: true,
      suffix: `Ir para Vinculação`,
      path: '',
      className: 'input-item-2',
      modal: true,
      placeholder: 'Associe o seu telemóvel',
    },
    {
      type: 'pwd',
      value: '',
      url: `assets/${environment.uVersion}/icon_lock.png`,
      readonly: true,
      className: 'input-item-2',
      placeholder: 'Senha de saque',
      path: '' // TODO 提現密碼頁
    },
    {
      type: 'changePwd',
      value: '******',
      url: `assets/${environment.uVersion}/icon_lock.png`,
      readonly: true,
      suffix: 'Alterarh',
      path: '',
      className: 'input-item-2',
      modal: true,
    },
    {
      type: 'mail',
      value: inputs.mail.data || props.mail || "",
      url: `assets/${environment.uVersion}/icon_mail.png`,
      readonly: false,
      placeholder: 'Email',
      className: 'input-item-2',
      onClick: (value) => validateInput(value, 'mail'),
    },
    {
      type: 'whatsapp',
      value: inputs.whatsapp.data || props.whatsapp_username || "",
      url: `assets/${environment.uVersion}/icon_logo_whatsapp.png`,
      readonly: false,
      className: 'input-item-3',
      placeholder: 'Entre no WhatsApp',
      onClick: (value) => validateInput(value, 'whatsapp'),
    },
    {
      type: 'fb',
      value: inputs.fb.data || props.facebook_username || "",
      url: `assets/${environment.uVersion}/icon_logo_fb.png`,
      readonly: false,
      className: 'input-item-3',
      placeholder: 'Por favor insira suacanta do facebook',
      onClick: (value) => validateInput(value, 'fb'),
    },
    {
      type: 'group',
      value: inputs.group.data || props.telegram_username || "",
      url: `assets/${environment.uVersion}/icon_group.png`,
      readonly: false,
      className: 'input-item-3',
      placeholder: 'Por favor, informe seunome de usúario no Telegram',
      onClick: (value) => validateInput(value, 'group'),
    },
    {
      type: 'x',
      value: inputs.x.data || props.twitter_username || "",
      url: `assets/${environment.uVersion}/icon_logo_x.png`,
      readonly: false,
      className: 'input-item-3',
      placeholder: 'Introduza a conta do Twitter',
      onClick: (value) => validateInput(value, 'x'),
    },
  ];

  // TODO props.birthday 回顯
  const dateList: TInput[] = [
    {
      type: 'year',
      value: inputs.year.data || "",
      readonly: false,
      placeholder: 'Ano',
      onClick: (value) => validateInput(value, 'year'),
    },
    {
      type: 'month',
      value: inputs.month.data || "",
      readonly: false,
      placeholder: 'Mês',
      onClick: (value) => validateInput(value, 'month'),
    },
    {
      type: 'day',
      value: inputs.day.data || "",
      readonly: false,
      placeholder: 'Dia',
      onClick: (value) => validateInput(value, 'day'),
    },
  ];

  const uiState = useMemo(() => {
    return {
      inputList,
      dateList,
      inputs,
      validateInput,
    };
  }, [inputs]);

  const onDetail = (item: TInput) => {
    console.log('onDetail');
    if (item.path) {
      navigate(item.path);
    }
    if (item.modal) {
      if (item.type == 'changePwd') {
        showChangePasswordModal(accountService);
      }
      if (item.type == 'phone') {
        showChangePhoneModal(accountService);
      }
      console.log('show modal');
    }
  };

  const [avatar, setAvatar] = useState(1);
  const onChangeAvatar = (value: number) => {
    console.log('value from Avatar:', value);
    setAvatar(value);
  };

  const onSaveUserinfo = () => {
    const data = {
      nickname: props.nickname,
      avatar: avatar.toString(),
      birthday: `${inputs.year.data}/${inputs.month.data}/${inputs.day.data}`, // TODO 
      mail: inputs.mail.data,
      whatsAppUserName: inputs.whatsapp.data,
      facebookUserName: inputs.fb.data,
      telegramUserName: inputs.group.data,
      twitterUserName: inputs.x.data,
    };
    accountService.doUserUpdate(data);
  };

  const handleClick = (type: number) => {
    console.log('0 avatar 1 Retornar 2 Salvar', type);
    // 0 avatar 1 Retornar 2 Salvar

    switch (type) {
      case 0:
        showAvatarModal({ onData: onChangeAvatar });
        break;

      case 1:
        break;
        // TODO back
      case 2:
        onSaveUserinfo();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    console.log('useSettingBase init');
  }, []);

  return {
    uiState,
    onDetail,
    handleClick,
  };
};

export const SettingPage = (props: IUserInfo) => {
  const { uiState, onDetail, handleClick } = useSettingBase(props);

  return (
    <div className="setting">
      <div className="avatar-box" onClick={() => handleClick(0)}>
        <Avatar className="avatar" />
        <div className="yellow">Configurar</div>
      </div>
      <div className="input-list">
        {uiState.inputList.map((item, index) => {
          return (
            <Input
              isPureContainer={true}
              key={index}
              placeholder={item.placeholder}
              className={cx('!px-0 py-2.5 input-item', item.className)}
              inputClassName="placeholder:text-[var(--grayscale-60)]"
              prefix={<img src={item.url} className="w-4 h-4 mx-2" />}
              value={item.value}
              readonly={item.readonly}
              validation={uiState.inputs[item.type]?.isValidation}
              errorMessage={uiState.inputs[item.type]?.errorMessage}
              errorMessageClassName="errorMessageClassName"
              suffix={
                <div className="yellow mx-2" onClick={() => onDetail(item)}>
                  {item?.suffix}
                </div>
              }
              onChange={(event: any) =>
                item.onClick && item.onClick(event.target.value)
              }
            />
          );
        })}
      </div>
      <div className="desc">
        Selecione a data de nascimento (depois de definida, não pode ser
        modificada)
      </div>

      <div className="date-list">
        {uiState.dateList.map((item, index) => {
          return (
            <Input
              isPureContainer={true}
              key={index}
              className="!px-0 !py-0 input-item"
              inputClassName="placeholder:text-[var(--grayscale-60)]"
              value={item.value}
              readonly={item.readonly}
              placeholder={item.placeholder}
              validation={uiState.inputs[item.type]?.isValidation}
              errorMessage={uiState.inputs[item.type]?.errorMessage}
              errorMessageClassName="errorMessageClassName"
              onChange={(event: any) =>
                item.onClick && item.onClick(event.target.value)
              }
            />
          );
        })}
      </div>

      <div className="btns">
        <button className="btn cancel" onClick={() => handleClick(1)}>
          Retornar
        </button>
        <button className="btn save" onClick={() => handleClick(2)}>
          Salvar
        </button>
      </div>
    </div>
  );
};
