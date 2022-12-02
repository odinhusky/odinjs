import { useState } from "react";

// ? Self-packed Components || Functions
import Footer from "@/components/footer/HomeFooter";
import OrderPage1 from "./OrderPage1";
import OrderPage2 from "./OrderPage2";
import OrderPage3 from "./OrderPage3";
import OrderPage4 from "./OrderPage4";
import OrderPage5 from "./OrderPage5";
import OrderPage6 from "./OrderPage6";
import { OrderHead } from '@/pages/orders/components/OrderHead';

// ^ Plugins
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// = Styled Component
import {
  PageContainer,
  OperateButtonList,
  OperateCurrencyButton
} from '@/styled-components/order';

/**
 * @author odin
 * @level Layout/Orders
 * @description 交易頁面
*/
const Orders = () => {

  // $ init data
  const location = useLocation().pathname;
  const { t } = useTranslation();

  // # states
  const [currencyOption, setCurrencyOption] = useState(0);

  // - methods
  const handleCurrencyOption = (index: number) => {
    setCurrencyOption(index);
  };

  return (
    <PageContainer>
      {/* 共同的上半部 */}
      <OrderHead activeTagIdx={0} />

      <OperateButtonList>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={0}
          onClick={handleCurrencyOption.bind(null, 0)}
        >
          {t("activePosition")}
        </OperateCurrencyButton>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={1}
          onClick={handleCurrencyOption.bind(null, 1)}
        >
          {t("activeOrder")}
        </OperateCurrencyButton>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={2}
          onClick={handleCurrencyOption.bind(null, 2)}
        >
          {t("historyOrder")}
        </OperateCurrencyButton>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={3}
          onClick={handleCurrencyOption.bind(null, 3)}
        >
          {t("dealHistory")}
        </OperateCurrencyButton>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={4}
          onClick={handleCurrencyOption.bind(null, 4)}
        >
          資產紀錄
        </OperateCurrencyButton>
        <OperateCurrencyButton
          currencyOption={currencyOption}
          index={5}
          onClick={handleCurrencyOption.bind(null, 5)}
        >
          所有持倉
        </OperateCurrencyButton>
      </OperateButtonList>
      {currencyOption === 0 && <OrderPage1 />}
      {currencyOption === 1 && <OrderPage2 />}
      {currencyOption === 2 && <OrderPage3 />}
      {currencyOption === 3 && <OrderPage4 />}
      {currencyOption === 4 && <OrderPage5 />}
      {currencyOption === 5 && <OrderPage6 />}
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default Orders;
