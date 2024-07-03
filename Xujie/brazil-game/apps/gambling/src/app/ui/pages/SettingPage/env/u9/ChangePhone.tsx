import { Input, InputValue } from '../../../../components-bs/Inputs/Input';
import { environment } from '../../../../../../environments/environment';
import { Modal } from 'antd';
import './index.scss';
import { useState } from 'react';
import onValidatePhoneInput from '../../../../components-bs/UserLoginStatusSection/forms/UserLoginForm/OnValidatePhoneInput';

interface IProps {
  accountService: {
    doChangePhone: (data: { phone: string }) => void;
  };
}

interface TProps extends IProps {
  onClose: () => void;
}

const useChangePhone = (props: TProps) => {
  const [changePhone, setChangePhone] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });

  const onChangePhone = () => {
    props.accountService.doChangePhone({phone: changePhone.data})
    props.onClose()
  };

  return {
    changePhone,
    setChangePhone,
    onChangePhone,
  };
};

// TODO 沒有這個路由，暫時用modal
export const ChangePhone = (props: TProps) => {
  const { changePhone, setChangePhone, onChangePhone } = useChangePhone(props);

  return (
    <div className="change-phone-page">
      <img
        src={`assets/${environment.uVersion}/icon_x.png`}
        alt="icon-close"
        className="icon-close"
        onClick={props.onClose}
      />
      <div className="title">Verifica a senha</div>
      <div className="desc">
        O número de telemóvel pode ser vinculado após verificação da
        palavra-passe de início de sessão
      </div>

      <Input
        isPureContainer={true}
        className="!px-0 py-2 input-item"
        placeholder="Inserir Senha"
        inputClassName="placeholder:text-[var(--grayscale-60)]"
        value={changePhone.data}
        validation={changePhone.isValidation}
        errorMessage={changePhone.errorMessage}
        errorMessageClassName="errorMessageClassName"
        prefix={
          <img
            src={`assets/${environment.uVersion}/icon_lock.png`}
            className="w-4 h-4 mx-2"
          />
        }
        suffix={
          <img
            className="w-4 h-4 mx-2"
            src={`assets/${environment.uVersion}/icon_eyes_closed.png`}
            alt="toggle"
          />
        }
        onChange={(event: any) => onValidatePhoneInput(event.target.value, setChangePhone)}
      />

      <button className="change-phone-btn" onClick={onChangePhone}>
        Seguintes
      </button>
    </div>
  );
};

export const showChangePhoneModal = (accountService: {
  doChangePhone: (data: { phone: string }) => void;
}) => {
  const modal = Modal.info({
    className: '!max-w-[564px] !w-[80vw]',
    maskClosable: true,
    modalRender: () => (
      <div style={{ pointerEvents: 'auto' }}>
        <ChangePhone
          onClose={() => modal.destroy()}
          accountService={accountService}
        />
      </div>
    ),
  });
};
