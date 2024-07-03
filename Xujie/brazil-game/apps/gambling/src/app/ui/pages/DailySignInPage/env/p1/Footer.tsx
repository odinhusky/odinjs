import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { notification } from 'antd';
import cx from 'classnames';
import { environment } from '../../../../../../environments/environment';

const DailySignInButton = styled.button<{
  disable: boolean;
}>`
  ${(props) =>
    props.disable
      ? 'background: linear-gradient(180deg, #C8F568 0%, #16FF8F 100%)'
      : 'background: linear-gradient(180deg, #C8F568 0%, #16FF8F 100%)'};
  //background-size: 100% 100%;
  //background-position: 0 5px;
  width: 250px;
`;

type IFooter = {
  onClickToSignIn: () => void;
  todayIsSignIn: boolean;
  vipLevel: number;
  setCurrentSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
};
export const Footer = (props: IFooter) => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  // const user: IUserInfo = AppLocalStorage.getItem("userInfo") ? JSON.parse(AppLocalStorage.getItem("userInfo") || ""): {};

  const disableButton = props.vipLevel === 0 || props.todayIsSignIn;

  return (
    <>
      {contextHolder}
      <div className={'flex flex-col justify-center items-center mt-10'}>
        <DailySignInButton
          disable={disableButton}
          className={cx('text-lg text-[498D68] rounded-full p-4', {
            '!bg-[gray] !bg-none': disableButton,
          })}
          onClick={() => {
            props.setCurrentSelectedLevel(props.vipLevel || 0);
            if (props.todayIsSignIn) {
              api.error({
                message: 'Você concluiu o check-in hoje',
              });
              return;
            }
            if (disableButton) {
              api.error({
                message: 'O VIP 0 temporariamente não suporta',
              });
              return;
            } else {
              props.onClickToSignIn();
            }
          }}
        >
          {props.todayIsSignIn ? 'Recebido' : 'Coletar cupons'}
        </DailySignInButton>
      </div>

      <section
        className={'flex flex-row justify-end bg-orange cursor-pointer'}
        onClick={() => {
          navigate(PageOrModalPathEnum.DailySingInRecordPage);
        }}
      >
        <div className={'text-white text-lg text-center md:text-right'}>
          visualizar registros {'>'}
        </div>
      </section>
    </>
  );
};
