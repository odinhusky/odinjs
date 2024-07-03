import cx from '../../../../utils/cx';
import { environment } from '../../../../../../environments/environment';
import useAnimation from '../../../../hooks/useAnimation';
import { BaseModal } from '../../../BaseModal';
import { useDispatch } from 'react-redux';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { userLogout } from '../../../../../usecase/userLogout';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import createNotification from '../../../../components-bs/ProgressBarNotification';
import { useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

export const U2LogoutModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isDesktop } = useBreakpoint();
  const [notify, setNotify] = useState(false);

  const onClose = () => {
    dispatch(appSlice.actions.showMobileLogoutModal(false));
  };
  const onHandleLogout = () => {
    createNotification({
      message: 'Desconectado com sucesso',
      isOpen: notify,
      onClose() {
        setNotify(!notify);
      },
      isDesktop: isDesktop,
    });
    setTimeout(() => {
      userLogout();
      dispatch(appSlice.actions.showMobileLogoutModal(false));
      dispatch(uiSlice.actions.closeUserInfoStatusPopover());
      navigate(PageOrModalPathEnum.IndexPage);
    }, 1000);
  };
  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(onClose);

  return (
    <BaseModal>
      <div
        className={cx(
          'relative bg-[var(--grayscale-20)] text-center p-4 rounded-2xl w-[272px] sm:px-6 sm:py-8 sm:w-[380px] lg:w-[428px] pt-0 sm:pt-0',
          'animate__animated animate__faster animate__backInDown',
          isCloseAnimation ? 'animate__bounceOut' : ''
        )}
      >
        <div className="flex flex-col gap-8 text-white">
          <img
            alt="close"
            className="cursor-pointer absolute top-2 right-2 sm:right-6 sm:top-5 w-12 sm:w-10"
            src={`assets/${environment.uVersion}/WXCircle.png`}
            onClick={() => setIsCloseAnimation(true)}
          />
          <div className="mt-[56px] sm:mt-[60px] text-sm sm:text-xl">
            Tem certeza que deseja sair?
          </div>

          <div className="flex justify-between gap-3 sm:gap-4 text-sm sm:text-lg">
            <button
              className="w-full py-[10px] sm:py-[6px] bg-[var(--grayscale-60)] rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
              onClick={() => setIsCloseAnimation(true)}
            >
              Cancelar
            </button>
            <button
              className="w-full py-[10px] sm:py-[6px] bg-[var(--secondary-main)] rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
              onClick={onHandleLogout}
            >
              Confirme
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default U2LogoutModal;
