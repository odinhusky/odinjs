import {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  // useMemo
} from "react";

// ? Types & Interfaces
import { FiatRate } from "@/constants/type";

// # API
import { getFiatRate } from "api";

// % context
import { GlobalCtxProvider } from "./GlobalContext";

// ? Self-packed Components || Functions
import ChangeCurrencyModal from "@/components/modal/ChangeCurrencyModal";
import ChangeLangModal from "@/components/modal/ChangeLangModal";
import NoticeModal from "@/components/modal/NoticeModal";

// ^ Plugins
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isNil, isEmpty, get } from "lodash";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // $ init data
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // # state
  const [isLogin, setIsLogin] = useState(false);

  // 當前選擇的幣別
  const [currencyUnit, setCurrencyUnit] = useState<string>("USD");

  // 改變幣別的 Modal 要不要打開
  const [isOpenCurrency, setIsOpenCurrency] = useState(false);

  // 本站所有幣別的匯率
  const [rateObj, setRateObj] = useState<FiatRate | {}>({});

  // 當前匯率
  const [nowRate, setNowRate] = useState<number>(1);

  // 語系開關控制
  const [isOpenLangModal, setIsOpenLangModal] = useState(false);

  // 通知開關控制
  const [isOpenNotice, setIsOpenNotice] = useState(false);

  // 當前選擇的通知
  const [currentNotice, setCurrentNotice] = useState<string>("");

  const [currentLang, setCurrentLang] = useState("tw");

  // - methods
  const handleCurrencyUnitChange = (currency: string) => {
    localStorage.setItem("currencyUnit", currency);
    setCurrencyUnit(currency);
  };

  const handleCurrentLang = useCallback(
    (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.changeLanguage(lang);
      setCurrentLang(lang);
    },
    [i18n]
  );

  const handleCurrentNotice = (notice: string) => {
    localStorage.setItem("currentNotice", notice);
    setCurrentNotice(notice);
  };

  /**
   * @author odin
   * @param {object} err - 錯誤的回傳 response
   * @param {object} t - 語系
   * @description 處理 API 的錯誤訊息以及導頁
   */
  const handleAPIErr = useCallback(
    (err: object | any) => {
      const statusCode = get(err, "status", 0);

      switch (statusCode) {
        case 401:
          alert(t("tokenExpired"));
          navigate("/login");
          break;
      }

      console.log("API ERROR", err);
    },
    [t, navigate]
  );

  /**
   * @author odin
   * @description 取得本站所有的匯率
   */
  const handleGetFiatRate = useCallback(async () => {
    try {
      const rateRes: any = await getFiatRate();
      // console.log('getFiatRate res', rateRes);

      setRateObj(rateRes);
    } catch (e) {
      console.log("getFiatRate Error", e);
      handleAPIErr(e);
    }
  }, [handleAPIErr]);

  // & handled data
  const globalContextValue = {
    isLogin,
    setIsLogin,
    currencyUnit,
    handleCurrencyUnitChange,
    nowRate,
    rateObj,
    handleAPIErr,
    setIsOpenCurrency,
    currentLang,
    setIsOpenLangModal,
    setIsOpenNotice,
    currentNotice,
    handleCurrentNotice,
  };

  /**
   * @author odin
   * @description 檢查是否登入
   * @return {Promise}
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!isNil(token));
  }, []);

  /**
   * @author odin
   * @description 檢查當前的 currency
   */
  useEffect(() => {
    const currencyUnit = localStorage.getItem("currencyUnit");
    const unit: any = !isNil(currencyUnit) ? currencyUnit : "USD";

    localStorage.setItem("currencyUnit", unit);
    setCurrencyUnit(unit);
  }, []);

  /**
   * @author odin
   * @description 取得當前的語系
   */
  useEffect(() => {
    const localStorageLang = localStorage.getItem("lang");
    const lang = localStorageLang ? localStorageLang : "tw";
    handleCurrentLang(lang);
  }, [handleCurrentLang]);

  /**
   * @author odin
   * @description 取得當前的匯率
   */
  useEffect(() => {
    handleGetFiatRate();
  }, [handleGetFiatRate]);

  useEffect(() => {
    if (isEmpty(rateObj)) return;
    const nowRate = get(rateObj, currencyUnit, 1);

    setNowRate(nowRate);
  }, [rateObj, currencyUnit]);

  return (
    <GlobalCtxProvider value={globalContextValue}>
      {/* Route 決定的節點 */}
      {isOpenCurrency === false &&
        isOpenLangModal === false &&
        isOpenNotice === false &&
        children}

      {/* Modal */}
      {isOpenCurrency && (
        <ChangeCurrencyModal
          currencyUnit={currencyUnit}
          onClose={() => {
            setIsOpenCurrency(false);
          }}
          changeUnit={handleCurrencyUnitChange}
          rateObj={rateObj}
        />
      )}

      {isOpenLangModal && (
        <ChangeLangModal
          handleCurrentLang={handleCurrentLang}
          currentLang={currentLang}
          onClose={() => {
            setIsOpenLangModal(false);
          }}
        />
      )}

      {isOpenNotice && (
        <NoticeModal
          handleCurrentNotice={handleCurrentNotice}
          currentNotice={currentNotice}
          onClose={() => {
            setIsOpenNotice(false);
          }}
        />
      )}
    </GlobalCtxProvider>
  );
};

export default Layout;
