import * as React from "react";

// ? Self-packed Components || Functions
import Layout from "@/components/Layout";

// ? Pages
import Home from "@/pages/home/Home";
import Member from "@/pages/home/Member";
import MyAD from "@/pages/profile/myAD";
import MyAD2 from "@/pages/profile/myAD2";
import NotFundAD from "@/pages/profile/notfund-AD";
import Profile from "@/pages/profile/profile";
import Setting from "@/pages/profile/setting";
import AccountSetting from "@/pages/profile/account-setting";
import SafeSetting from "@/pages/profile/safe-setting";
import ChangaccountPassword from "@/pages/profile/chang-account-password";
import SetTheFundPassword from "@/pages/profile/set-the-fund-password";
import ChangeTheFundPassword from "@/pages/profile/change-the-fund-password";
import AreaZone from "@/pages/profile/area-zone";
import ResetPhonenumber from "@/pages/profile/reset-phone-number";
import ResetEmail from "@/pages/profile/reset-email";
import EmailVerify from "@/pages/profile/email-verify";
import PhoneNumberVerify from "@/pages/profile/phone-number-verify";
import IdVerify from "@/pages/profile/id-verify";
import IDdocuments from "@/pages/profile/id-documents";
import Chart from "@/pages/Deal/Chart";
import SearchDeal from "@/pages/Deal/SearchDeal";
import SearchDealHome from "@/pages/home/SearchDeal";
import FundTransfer from "@/pages/Deal/fundTransfer";
import Fund from "@/pages/fund";
import Deal from "@/pages/Deal";
import Orders from "@/pages/orders/Orders";
import FiatOrders from "@/pages/orders/FiatOrders";
import Announcement from "@/pages/Navbar/Announcement";
import HomeAnnouncement from "@/pages/home/Announcement";
import Question from "@/pages/Navbar/question";
import Guide from "@/pages/Navbar/guide";
import Privacy from "@/pages/Navbar/privacy";
import About from "@/pages/Navbar/about";
import OnlineSupport from "@/pages/Navbar/onlineSupport";
import FiatDeal from "@/pages/Deal/FiatDeal";
import CreateNewAccount from "@/pages/profile/create-new-account";
import StopLossStopEarning from "@/pages/Deal/StopLoss";
import OrderStopLossStopEarning from "@/pages/orders/StopLoss";
import TransferFiatCurrency from "@/pages/Deal/TransferFiatCurrency";
import FiatBuyPage from "@/pages/Deal/FiatBuyPage";
import FiatSellPage from "@/pages/Deal/FiatSellPage";
import FiatBuyComplete from "@/pages/Deal/FiatBuyComplete";
import OrderFiatBuyComplete from "@/pages/orders/FiatBuyComplete";
import SpotHistory from "@/pages/fund/spot/history";
import FiatHistory from "@/pages/fund/fiat/history";
import ContractHistory from "@/pages/fund/contract/history";
import Recharge from "@/pages/fund/spot/recharge";
import Withdraw from "@/pages/fund/spot/withdraw";
import ContractFundTransfer from "@/pages/fund/contract/fundTransfer";
import OtcFundTransfer from "@/pages/fund/fiat/fundTransfer";
import FiatWithdraw from "@/pages/fund/fiat/withdraw";
import FiatRecharge from "@/pages/fund/fiat/recharge";
import FiatSellComplete from "@/pages/Deal/FiatSellComplete";
import OrderFiatSellComplete from "@/pages/orders/FiatSellComplete";
import FiatAdPage from "@/pages/Deal/FiatAdPage";
import FiatAdDealHint from "@/pages/Deal/FiatAdDealHint";
import FiatAdConfirm from "@/pages/Deal/FiatAdConfirm";
import FiatAdComplete from "@/pages/Deal/FiatAdComplete";
import CurrencyBuyPage from "@/pages/orders/FiatBuyPage";
import CurrencySellPage from "@/pages/orders/FiatSellPage";
import Rebate from "@/pages/profile/rebate";
import Register from "@/pages/home/Register";
import Login from "@/pages/home/Login";
import Forget from "@/pages/home/Forget";
import SendEmail from "@/pages/home/EmailVerify";
import SettingAreaZone from "@/pages/profile/setting-area-zone";
import GoogleVerify from "@/pages/profile/google-verify";
import GoogleCode from "@/pages/profile/google-code";
import Download from "@/pages/profile/download";
import UpdateTheFundPassword from "@/pages/profile/update-the-fund-password";
import UpdateGoogle from "@/pages/profile/update-google";
import ResetPassword from "@/pages/profile/reset-password";
import EditFiatAdPage from "@/pages/profile/EditFiatAdPage";
import EditFiatAdDealHint from "@/pages/profile/EditFiatAdDealHint";
import EditFiatAdConfirm from "@/pages/profile/EditFiatAdConfirm";
import C2c from "@/pages/profile/c2c";
import MemberCenter from "@/pages/profile/memberCenter";
import C2cApply from "@/pages/profile/c2cApply";
import EditName from "@/pages/profile/EditName";
import C2cNotification from "@/pages/profile/c2cNotification";
import C2cHelp from "@/pages/profile/c2cHelp";
import Quote from '@/pages/Quote';
import MissionCenter from "@/pages/home/MissionCenter";
import InstantTrend from "../home/InstantTrend";
// ^ Plugins
import { Routes, Route, Navigate } from "react-router-dom";


function Router() {
  return (
    <Routes>

      {/* Redirection */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Pages */}
      <Route path="/home" element={<Layout children={<Home />} />}/>
      <Route path="/member" element={<Layout children={<Member />} />}/>
      <Route path="/register" element={<Layout children={<Register />} />}/>
      <Route path="/login" element={<Layout children={<Login />} />}/>
      <Route path="/quote" element={<Layout children={<Quote />} />}/>
      <Route path="/forget" element={<Layout children={<Forget />} />}/>
      <Route path="/emailVerify" element={<Layout children={<SendEmail />} />}/>
      <Route path="/missionCenter" element={<Layout children={<MissionCenter />} />}/>
      <Route path="/instantTrend" element={<Layout children={<InstantTrend />} />}/>

      <Route path="/myAD" element={<Layout children={<MyAD />} />}/>
      <Route path="/myAD2" element={<Layout children={<MyAD2 />} />}/>
      <Route path="/notfund-AD" element={<Layout children={<NotFundAD />} />}/>
      <Route path="/profile" element={<Layout children={<Profile />} />}/>

      <Route path="/setting" element={<Layout children={<Setting />} />}/>
      <Route path="/account-setting" element={<Layout children={<AccountSetting />} />}/>
      <Route path="/create-new-account" element={<Layout children={<CreateNewAccount />} />}/>
      <Route path="/safe-setting" element={<Layout children={<SafeSetting />} />}/>

      <Route path="/chang-account-password" element={<Layout children={<ChangaccountPassword />} />}/>
      <Route path="/set-the-fund-password" element={<Layout children={<SetTheFundPassword />} />}/>
      <Route path="/update-the-fund-password" element={<Layout children={<UpdateTheFundPassword />} />}/>
      <Route path="/update-google" element={<Layout children={<UpdateGoogle />} />}/>
      <Route path="/reset-password" element={<Layout children={<ResetPassword />} />}/>
      <Route path="/change-the-fund-password" element={<Layout children={<ChangeTheFundPassword />} />}/>
      <Route path="/chang-account-password" element={<Layout children={<ChangaccountPassword />} />}/>

      <Route path="/setting-area-zone" element={<Layout children={<SettingAreaZone />} />}/>
      <Route path="/area-zone" element={<Layout children={<AreaZone />} />}/>
      <Route path="/reset-phone-number" element={<Layout children={<ResetPhonenumber />} />}/>
      <Route path="/reset-email" element={<Layout children={<ResetEmail />} />}/>
      <Route path="/email-verify" element={<Layout children={<EmailVerify />} />}/>
      <Route path="/Phone-number-verify" element={<Layout children={<PhoneNumberVerify />} />}/>
      <Route path="/id-verify" element={<Layout children={<IdVerify />} />}/>

      <Route path="/id-documents" element={<Layout children={<IDdocuments />} />}/>
      <Route path="/fund" element={<Layout children={<Fund />} />}/>
      <Route path="/deal" element={<Layout children={<Deal />} />}/>

      <Route path="/fiat-deal" element={<Layout children={<FiatDeal />} />}/>
      <Route path="/fiat-deal/change-currency" element={<Layout children={<TransferFiatCurrency />} />}/>
      <Route path="/deal/chart" element={<Layout children={<Chart />} />}/>
      <Route path="/deal/search-deal" element={<Layout children={<SearchDeal />} />}/>
      <Route path="/search-deal" element={<Layout children={<SearchDealHome />} />}/>
      <Route path="/deal/fund-transfer" element={<Layout children={<FundTransfer />} />}/>


      <Route path="/deal/stopLossStopEarning" element={<Layout children={<StopLossStopEarning />} />}/>
      <Route path="/orders/stopLossStopEarning" element={<Layout children={<OrderStopLossStopEarning />} />}/>
      <Route path="/deal/FiatBuyPage" element={<Layout children={<FiatBuyPage />} />}/>
      <Route path="/deal/FiatSellPage" element={<Layout children={<FiatSellPage />} />}/>
      <Route path="/deal/fiatBuyComplete" element={<Layout children={<FiatBuyComplete />} />}/>
      <Route path="/deal/fiatSellComplete" element={<Layout children={<FiatSellComplete />} />}/>
      <Route path="/orders/fiatBuyComplete" element={<Layout children={<OrderFiatBuyComplete />} />}/>
      <Route path="/orders/fiatSellComplete" element={<Layout children={<OrderFiatSellComplete />} />}/>
      <Route path="/deal/FiatAdPage" element={<Layout children={<FiatAdPage />} />}/>
      <Route path="/deal/FiatAdDealHint" element={<Layout children={<FiatAdDealHint />} />}/>
      <Route path="/deal/FiatAdConfirm" element={<Layout children={<FiatAdConfirm />} />}/>
      <Route path="/EditFiatAdPage" element={<Layout children={<EditFiatAdPage />} />}/>
      <Route path="/EditFiatAdDealHint" element={<Layout children={<EditFiatAdDealHint />} />}/>
      <Route path="/EditFiatAdConfirm" element={<Layout children={<EditFiatAdConfirm />} />}/>
      <Route path="/deal/FiatAdComplete" element={<Layout children={<FiatAdComplete />} />}/>

      <Route path="/orders" element={<Layout children={<Orders />} />}/>
      <Route path="/orders/FiatBuyPage" element={<Layout children={<CurrencyBuyPage />} />}/>
      <Route path="/orders/FiatSellPage" element={<Layout children={<CurrencySellPage />} />}/>
      <Route path="/fiat-orders" element={<Layout children={<FiatOrders />} />}/>

      <Route path="/fiat-orders/:status" element={<Layout children={<FiatOrders />} />}/>
      <Route path="/announcement" element={<Layout children={<Announcement />} />}/>
      <Route path="/announcement/:id" element={<Layout children={<HomeAnnouncement />} />}/>
      <Route path="/user-guide" element={<Layout children={<Guide />} />}/>
      <Route path="/question" element={<Layout children={<Question />} />}/>
      <Route path="/privacy" element={<Layout children={<Privacy />} />}/>
      <Route path="/about" element={<Layout children={<About />} />}/>
      <Route path="/online-support" element={<Layout children={<OnlineSupport />} />}/>

      <Route path="/spot-history" element={<Layout children={<SpotHistory />} />}/>
      <Route path="/fiat-history" element={<Layout children={<FiatHistory />} />}/>
      <Route path="/contract-history" element={<Layout children={<ContractHistory />} />}/>
      <Route path="/fundTransfer" element={<Layout children={<ContractFundTransfer />} />}/>
      <Route path="/otcFundTransfer" element={<Layout children={<OtcFundTransfer />} />}/>
      <Route path="/withdraw" element={<Layout children={<Withdraw />} />}/>
      <Route path="/recharge" element={<Layout children={<Recharge />} />}/>
      <Route path="/fiat-withdraw" element={<Layout children={<FiatWithdraw />} />}/>
      <Route path="/fiat-recharge" element={<Layout children={<FiatRecharge />} />}/>
      <Route path="/profile/Rebate" element={<Layout children={<Rebate />} />}/>
      <Route path="/google-verify" element={<Layout children={<GoogleVerify />} />}/>
      <Route path="/google-code" element={<Layout children={<GoogleCode />} />}/>
      <Route path="/download" element={<Layout children={<Download />} />}/>
      <Route path="/c2c" element={<Layout children={<C2c />} />}/>
      <Route path="/memberCenter" element={<Layout children={<MemberCenter />} />}/>

      <Route path="/c2cApply" element={<Layout children={<C2cApply />} />}/>
      <Route path="/editName" element={<Layout children={<EditName />} />}/>
      <Route path="/c2cNotification" element={<Layout children={<C2cNotification />} />}/>
      <Route path="/c2cHelp" element={<Layout children={<C2cHelp />} />}/>
    </Routes>
  );
}

export default Router;
