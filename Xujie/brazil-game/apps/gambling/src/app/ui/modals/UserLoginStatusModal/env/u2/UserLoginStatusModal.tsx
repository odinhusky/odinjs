import { useEffect, useState } from 'react';
import { UserLoginStatusSection } from '../../../../components-bs/UserLoginStatusSection';
import { CloseICON } from '../../../../components-bs/env/u1/CloseICON';
import cx from '../../../../utils/cx';
import { Container } from '../../Container';
import { IUserLoginStatusModal } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {
  const uILoading = useSelector((state: RootState) => state.app.uILoading);
  const isShowLoginModal = useSelector(
    (state: RootState) => state.app.isShowLoginModal
  );

  const [show, setShow] = useState(isShowLoginModal);

  useEffect(() => {
    if (show) return;
    const timer = setTimeout(() => {
      props.close();
    }, 500);
    return () => clearTimeout(timer);
  }, [show]);

  const closeModal = () => {
    setShow(false);
  };

  return (
    <div
      className={
        'z-[1100] bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center px-5 w-full h-full'
      }
      // NOTE: onclick 改用，避免拖拉文字到modal外層會直接關閉
      onMouseDown={() => {
        // NOTE: 手機版用戶會誤點
        // !isMobile && props.close()
      }}
    >
      <Container
        className={cx(
          'w-full sm:w-[396px] px-4 pb-4 rounded-2xl animate__animated animate__faster',
          {
            animate__backInDown: !uILoading.isLoading && show,
            animate__bounceOut: !show,
          }
        )}
        onMouseDown={(event: any) => {
          event.stopPropagation();
        }}
      >
        <section className={'w-full flex flex-row justify-end items-center'}>
          <button onClick={closeModal}>
            <CloseICON />
          </button>
        </section>

        <UserLoginStatusSection
          confirmToLogin={() => {
            props.setIsLogin(true);
            props.close();
          }}
          confirmToRegister={() => {
            props.setIsLogin(false);
            props.close();
          }}
          openNotificationWithIcon={props.openNotificationWithIcon}
        />
      </Container>
    </div>
  );
};
