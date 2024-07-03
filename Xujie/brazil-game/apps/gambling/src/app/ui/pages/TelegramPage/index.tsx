import styled from "styled-components";
import {AppLocalStorage} from "../../../persistant/localstorage";
import {useAllowLoginRouterRules} from "../../router/hooks/useAllowLoginRouterRules";
import {usePageNavigate} from "../../router/hooks/usePageNavigate";
import {AppLocalStorageKey} from "../../../persistant/AppLocalStorageKey";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {appSlice} from "../../../reduxStore/appSlice";
import useBreakpoint from "../../pageTemplate/hooks/useBreakpoint";
import {TelegramPage as CTelegramPage} from "./env/u1/TelegramPage";
import {TelegramPage as WTelegramPage} from "./env/wild/TelegramPage";
import {TelegramPage as RTelegramPage} from "./env/u2/TelegramPage";
import {TelegramPage as PTelegramPage} from "./env/pernambucana/TelegramPage";
import {TelegramPage as P1TelegramPage} from "./env/p1/TelegramPage";
import {TelegramPage as U5TelegramPage} from "./env/u5/TelegramPage";
import {TelegramPage as U6TelegramPage} from "./env/u6/TelegramPage";
import {TelegramPage as U7TelegramPage} from "./env/u7/TelegramPage";


export interface ITelegramPage {
  handleClickToTelegram: ()=>void;
}

const GoToTelegram = styled.div`
  cursor: pointer;
  background: linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 100%);
  border-radius: 8px;
  /* width: 300px; */
  /* height: 60px; */
  padding: 14px 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px auto 64px;
`


export const TelegramPage = () => {
  useAllowLoginRouterRules();

  const { isMobile } = useBreakpoint();

  const telegramId = AppLocalStorage.getItem(AppLocalStorageKey.telegramGroup);
  const userInfoString = AppLocalStorage.getItem(AppLocalStorageKey.userInfo);
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const user_id = userInfo?.user_id || '';
  const telegramUrl = `https://t.me/${telegramId}?start=${user_id}`

  const { onClickToIndex } = usePageNavigate();



  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(appSlice.actions.setShowTelegramModal(true))
    }, 5000);

    return () => {
      clearTimeout(timer);
    }
  }, []);

  const handleClickToTelegram = () => {
    window.open(telegramUrl, '_blank')
  }

  return renderByUVersion(
    {
      "u1": <CTelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "wild777bet": <WTelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "u2": <RTelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "p1":<P1TelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "u5":<U5TelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "u6":<U6TelegramPage handleClickToTelegram={handleClickToTelegram} />,
      "u7":<U7TelegramPage />,
    },
    <PTelegramPage handleClickToTelegram={handleClickToTelegram} />,
  );
}
