import { Modal } from 'antd';
import { environment } from '../../../../../../environments/environment';
import cx from '../../../../utils/cx';
import { Input, InputValue } from '../../../../components-bs/Inputs/Input';
import './index.scss';
import { useState } from 'react';
import { TInput } from '.';

interface TProps {
  onClose: () => void;
  accountService: {
    doChangePassword: (data: {
      oldPassword: string;
      newPassword: string;
    }) => void;
  };
}

const useChangePassword = (props: TProps) => {
  console.log(props, 'props');
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({
    0: false,
    1: false,
    2: false,
  });

  const onTogglePassword = (index: number) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [index]: !passwordVisibility[index],
    });
  };

  const [passwords, setPasswords] = useState<{
    [key: string]: InputValue<string>;
  }>({
    oldPassword: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    newPassword: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
    confirmPassword: {
      data: '',
      isValidation: true,
      errorMessage: '',
    },
  });

  const onValidatePassword = (
    data: string,
    field: 'oldPassword' | 'newPassword' | 'confirmPassword'
  ) => {
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    const valid = regex.test(data);
    if (valid) {
      setPasswords((prevState) => ({
        ...prevState,
        [field]: {
          data,
          isValidation: true,
          errorMessage: '',
        },
      }));
    } else {
      setPasswords((prevState) => ({
        ...prevState,
        [field]: {
          data,
          isValidation: false,
          errorMessage: '4-20 caracteres, apenas letras / números',
        },
      }));
    }

    return !!data;
  };

  const passwordList: TInput[] = [
    {
      type: 'oldPassword',
      value: passwords.oldPassword.data || "",
      url: `assets/${environment.uVersion}/icon_lock.png`,
      readonly: true,
      placeholder: 'Por favor, ingrese contraseña',
      onClick: (value: string) => onValidatePassword(value, 'oldPassword'),
    },
    {
      type: 'newPassword',
      value: passwords.newPassword.data || "",
      url: `assets/${environment.uVersion}/icon_lock.png`,
      readonly: true,
      placeholder: 'Por favor insira uma nova senha',
      onClick: (value: string) => onValidatePassword(value, 'newPassword'),
    },
    {
      type: 'confirmPassword',
      value: passwords.confirmPassword.data || "",
      url: `assets/${environment.uVersion}/icon_lock.png`,
      readonly: true,
      placeholder: 'Por favor digite novamente a nova',
      onClick: (value: string) => onValidatePassword(value, 'confirmPassword'),
    },
  ];

  const onChangePassword = () => {
    const data = {
      oldPassword: passwords.oldPassword.data,
      newPassword: passwords.newPassword.data,
    };
    props.accountService.doChangePassword(data);
    props.onClose()
  };

  return {
    passwordList,
    passwords,
    passwordVisibility,
    onTogglePassword,
    onChangePassword,
  };
};

export const ChangePassword = (props: TProps) => {
  const {
    passwordList,
    passwords,
    passwordVisibility,
    onTogglePassword,
    onChangePassword,
  } = useChangePassword(props);

  return (
    <div className="password-modal">
      <img
        src={`assets/${environment.uVersion}/icon_x.png`}
        alt="icon-close"
        className="icon-close"
        onClick={props.onClose}
      />
      <div className="title">Palavra-passe de início de sessão</div>
      <div className="desc">
        Mantenha o hábito de alterar sua senha regularmente e sua conta ficará
        mais segura
      </div>
      <div className="input-list">
        {passwordList.map((item, index) => {
          return (
            <Input
              isPureContainer={true}
              type={passwordVisibility[index] ? 'text' : 'password'}
              className={cx('!px-0 py-2 input-item', item.className)}
              inputClassName="placeholder:text-[var(--grayscale-60)]"
              key={index}
              placeholder={item.placeholder}
              prefix={<img src={item.url} className="w-4 h-4 mx-2" />}
              value={item.value}
              validation={passwords[item.type].isValidation}
              errorMessage={passwords[item.type].errorMessage}
              errorMessageClassName="errorMessageClassName"
              suffix={
                <img
                  className="w-4 h-4 mx-2"
                  src={`assets/${environment.uVersion}/icon_eyes_${
                    passwordVisibility[index] ? 'open' : 'closed'
                  }.png`}
                  alt="toggle"
                  onClick={() => onTogglePassword(index)}
                />
              }
              onChange={(event: any) =>
                item.onClick && item.onClick(event.target.value)
              }
            />
          );
        })}
      </div>

      <button className="change-password" onClick={() => onChangePassword()}>
        Comfirme
      </button>
    </div>
  );
};

export const showChangePasswordModal = (accountService: {
  doChangePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }) => void;
}) => {
  const modal = Modal.info({
    className: '!max-w-[564px] !w-[80vw]',
    maskClosable: true,
    modalRender: () => (
      <div style={{ pointerEvents: 'auto' }}>
        <ChangePassword
          onClose={() => modal.destroy()}
          accountService={accountService}
        />
      </div>
    ),
  });
};
