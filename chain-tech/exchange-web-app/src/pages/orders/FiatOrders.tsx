import React, { useState, useEffect } from "react";

// # API
import api from "@/common/api";

// ? Self-packed Components || Functions
import Footer from "@/components/footer/HomeFooter";
import { COLORS } from "@/constants/colors";
import Drawer from "@/components/UI/Drawer";
import { OrderHead } from '@/pages/orders/components/OrderHead';

// - Images
import cancel from "@/assets/icon/cancel.png";
import noItemIcon from "@/assets/icon/illustration.png";

// ^ Plugins
import { useNavigate, useParams } from "react-router-dom";
import Moment from "moment";
import { useTranslation } from "react-i18next";

// = Styled Component
import {
  PageContainer,
  CurrencyContainer,
  CurrencyTitleContainer,
  CurrencyTitleButtonContainer,
  CurrencyTitleButton,
  CurrencyListContainer,
  NoDealContainer,
  CurrencyListCard,
  CurrencyListCardTitle,
  CurrencyCardContentContainer,
  CurrencyCardContentName,
  CurrencyCardKey,
  CurrencyCardKeyDescription,
  CurrencyCardTotalAmount,
  CurrencyCardContentDescription,
  CardFooterPayStatusComplete,
  CardFooterPayTime,
  CardFooterButton,
  CardSplit,
  DrawerContainer,
  DepthTitle,
  DrawerTitleContainer,
  CancelIcon,
  PayContentDesContainerItem,
  PayContentItemName,
  PayContentItemContent,
  PayContentItemSplit,
  PayStatusText,
  NoItemIcon,
  NoItemStatus,
  NoItemDes,
  PayConfirmButton
} from '@/styled-components/order';

const FiatOrders = () => {

  // $ init data
  const { t } = useTranslation();
  const params = useParams();
  const status = !!params.status ? params.status : "process";
  const navigation = useNavigate();

  // # states
  const [currencyOption, setCurrencyOption] = useState(status);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [completeDrawerVisible, setCompleteDrawerVisible] = useState(false);
  const [itemDetail, setItemDetail] = useState("buy");
  const [processList, setProcessList] = useState([]);
  const [order, setOrder] = useState({
    id: "",
    amount: 0,
    price: 0,
    quantity: 0,
    status: 0,
    createDate: 0,
    sellUser: "",
    buyUser: ""
  });
  const [user, setUser] = useState("");

  const [completeList, setCompleteList] = useState([]);

  // - methods
  const handlerDrawer = () => {
    setDrawerVisible(v => !v);
  };

  const handlerCompleteDrawer = (status: string) => {
    setItemDetail(status);
    setCompleteDrawerVisible(v => !v);
  };

  const getList = () => {
    api
      .get("/otc/api/otcOrder/?all=false&my=false&status=0,1,-2,3,4,5")
      .then(x => {
        setProcessList(x);
      });
    api.get("/otc/api/otcOrder/?status=2").then(x => {
      setCompleteList(x);
    });
  };

  // * hooks
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")!).account);
    }
    if (localStorage.getItem("token")) {
      getList();
      const interval = setInterval(() => {
        getList();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);
  return (
    <PageContainer>
      {/* 共同的上半部 */}
      <OrderHead activeTagIdx={1} />

      <CurrencyContainer>
        <CurrencyTitleContainer>
          <CurrencyTitleButtonContainer>
            <CurrencyTitleButton
              status={currencyOption}
              detail={"process"}
              onClick={() => setCurrencyOption("process")}
            >
              進行中
            </CurrencyTitleButton>
            <div
              style={{
                width: 1.5,
                height: 16,
                background: COLORS.EXLight_gray
              }}
            />
            <CurrencyTitleButton
              status={currencyOption}
              detail={"complete"}
              onClick={() => setCurrencyOption("complete")}
            >
              {t("referralCompleted")}
            </CurrencyTitleButton>
          </CurrencyTitleButtonContainer>
        </CurrencyTitleContainer>
      </CurrencyContainer>
      {processList.length === 0 ? (
        <NoDealContainer>
          <NoItemIcon src={noItemIcon} alt="no deal" />
          <NoItemStatus>尚無法幣訂單</NoItemStatus>
          <NoItemDes>尚無法幣訂單，請於法幣交易新增訂單。</NoItemDes>
          <PayConfirmButton
            onClick={() => {
              navigation("/fiat-deal");
            }}
          >
            {"開始交易"}
          </PayConfirmButton>
        </NoDealContainer>
      ) : currencyOption === "process" ? (
        <CurrencyListContainer>
          {processList.map((item: any, i) => {
            return (
              <>
                {
                  <CurrencyListCard
                    key={item.id}
                    onClick={() => {
                      console.log(user);
                      console.log(item.sellUser);
                      if (user === item.sellUser) {
                        localStorage.setItem("sellItem", JSON.stringify(item));
                        navigation("/orders/FiatSellPage");
                      } else {
                        localStorage.setItem("buyItem", JSON.stringify(item));
                        navigation("/orders/FiatBuyPage");
                      }
                    }}
                  >
                    <CurrencyListCardTitle
                      index={i}
                      isBuy={user === item.sellUser}
                    >
                      {user === item.sellUser ? t("fiatOrderSell") : t("fiatOrderBuy")} USDT/TWD
                    </CurrencyListCardTitle>
                    <CurrencyCardContentContainer style={{ marginTop: 10 }}>
                      <CurrencyCardContentName>
                        <CurrencyCardKey>{t("fiatTrader")}</CurrencyCardKey>
                        <CurrencyCardKeyDescription>
                          {user === item.sellUser
                            ? item.buyUser
                            : item.sellUser}
                        </CurrencyCardKeyDescription>
                      </CurrencyCardContentName>
                      <CurrencyCardContentDescription></CurrencyCardContentDescription>
                    </CurrencyCardContentContainer>
                    <CurrencyCardContentContainer style={{ marginTop: 0 }}>
                      <CurrencyCardContentName>
                        <CurrencyCardKey>{t("amount")}</CurrencyCardKey>
                        <CurrencyCardKeyDescription>
                          {item.quantity}
                        </CurrencyCardKeyDescription>
                      </CurrencyCardContentName>
                      <CurrencyCardContentDescription>
                        <CurrencyCardKey>{t("fiatTotal")}</CurrencyCardKey>
                      </CurrencyCardContentDescription>
                    </CurrencyCardContentContainer>
                    <CurrencyCardContentContainer style={{ marginTop: 0 }}>
                      <CurrencyCardContentName>
                        <CurrencyCardKey>{t("unitPrice")}</CurrencyCardKey>
                        <CurrencyCardKeyDescription>
                          {item.price}
                        </CurrencyCardKeyDescription>
                      </CurrencyCardContentName>
                      <CurrencyCardContentDescription>
                        <CurrencyCardKeyDescription>
                          NT$
                        </CurrencyCardKeyDescription>
                        <CurrencyCardTotalAmount>
                          {item.amount}
                        </CurrencyCardTotalAmount>
                      </CurrencyCardContentDescription>
                    </CurrencyCardContentContainer>
                    <CurrencyCardContentContainer style={{ marginTop: 10 }}>
                      {/* <CardFooterPayStatus>{item.status === 0 ? "請付款" : item.status === -1 ? "已取消" :"已付款"}</CardFooterPayStatus> */}
                      <CardFooterPayTime>{item.createDate}</CardFooterPayTime>
                      <CardFooterButton
                        status={item.status}
                        onClick={() => {
                          console.log(user);
                          console.log(item.sellUser);
                          if (user === item.sellUser) {
                            localStorage.setItem(
                              "sellItem",
                              JSON.stringify(item)
                            );
                            navigation("/orders/FiatSellPage");
                          } else {
                            localStorage.setItem(
                              "buyItem",
                              JSON.stringify(item)
                            );
                            navigation("/orders/FiatBuyPage");
                          }
                        }}
                      >
                        {item.status === 0 &&
                          user === item.sellUser &&
                          "等待賣家付款"}
                        {item.status === 0 &&
                          user !== item.sellUser &&
                          "通知付款"}
                        {item.status === 1 && user === item.sellUser && "放行"}
                        {item.status === 1 &&
                          user !== item.sellUser &&
                          "等待放行"}
                        {item.status === 3 &&
                          user === item.sellUser &&
                          t("fiatBuyerCheck")}
                        {item.status === 3 &&
                          user !== item.sellUser &&
                          "確認交易"}
                        {item.status === 4 &&
                          user === item.sellUser &&
                          "確認交易"}
                        {item.status === 4 &&
                          user !== item.sellUser &&
                          t("waitSellerConfirm")}
                        {item.status === -2 && t("apealing")}
                        {/* {item.status === 0 && user === item.sellUser ? "等待付款" : item.status === 1 && user === item.sellUser ? "放行" : item.status === 0 && user !== item.sellUser ?  "付款": "等待放行" } */}
                      </CardFooterButton>
                    </CurrencyCardContentContainer>
                  </CurrencyListCard>
                }
              </>
            );
          })}
        </CurrencyListContainer>
      ) : (
        <CurrencyListContainer>
          {completeList.map((item: any, i, array) => {
            return (
              <div key={item.id}>
                <CurrencyListCard>
                  <CurrencyListCardTitle
                    index={i}
                    isBuy={user === item.sellUser}
                  >
                    {user === item.sellUser ? t("fiatOrderSell") : t("fiatOrderBuy")} USDT/TWD
                  </CurrencyListCardTitle>
                  <CurrencyCardContentContainer style={{ marginTop: 10 }}>
                    <CurrencyCardContentName>
                      <CurrencyCardKey>{t("fiatTrader")}</CurrencyCardKey>
                      <CurrencyCardKeyDescription>
                        {user === item.sellUser ? item.buyUser : item.sellUser}
                      </CurrencyCardKeyDescription>
                    </CurrencyCardContentName>
                    <CurrencyCardContentDescription></CurrencyCardContentDescription>
                  </CurrencyCardContentContainer>
                  <CurrencyCardContentContainer style={{ marginTop: 0 }}>
                    <CurrencyCardContentName>
                      <CurrencyCardKey>{t("amount")}</CurrencyCardKey>
                      <CurrencyCardKeyDescription>
                        {item.quantity}
                      </CurrencyCardKeyDescription>
                    </CurrencyCardContentName>
                    <CurrencyCardContentDescription>
                      <CurrencyCardKey>{t("fiatTotal")}</CurrencyCardKey>
                    </CurrencyCardContentDescription>
                  </CurrencyCardContentContainer>
                  <CurrencyCardContentContainer style={{ marginTop: 0 }}>
                    <CurrencyCardContentName>
                      <CurrencyCardKey>{t("unitPrice")}</CurrencyCardKey>
                      <CurrencyCardKeyDescription>
                        {item.price}
                      </CurrencyCardKeyDescription>
                    </CurrencyCardContentName>
                    <CurrencyCardContentDescription>
                      <CurrencyCardKeyDescription>
                        NT$
                      </CurrencyCardKeyDescription>
                      <CurrencyCardTotalAmount>
                        {item.amount}
                      </CurrencyCardTotalAmount>
                    </CurrencyCardContentDescription>
                  </CurrencyCardContentContainer>
                  <CurrencyCardContentContainer style={{ marginTop: 10 }}>
                    <CardFooterPayStatusComplete>
                      {t("orderFinished")}
                    </CardFooterPayStatusComplete>
                    <CardFooterButton
                      status={1}
                      onClick={() => {
                        handlerCompleteDrawer(
                          item.status === 0 ? "buy" : "sell"
                        );
                        setOrder(item);
                      }}
                    >
                      {"詳情"}
                    </CardFooterButton>
                  </CurrencyCardContentContainer>
                </CurrencyListCard>
                {i !== array.length && <CardSplit />}
              </div>
            );
          })}
        </CurrencyListContainer>
      )}
      <Drawer
        isVisible={drawerVisible}
        selectVisible={handlerDrawer}
        height={358}
      >
        <DrawerContainer>
          <DrawerTitleContainer>
            <div style={{ width: "5%" }}></div>
            <DepthTitle>{t("orderType")}</DepthTitle>
            <CancelIcon src={cancel} alt="cancel" onClick={handlerDrawer} />
          </DrawerTitleContainer>
          <PayContentDesContainerItem>
            <PayContentItemName>{t("fiatTotal")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Red }}>
              NT$
              <p
                style={{
                  marginLeft: 4,
                  fontSize: 24,
                  fontFamily: "Open Sans",
                  fontWeight: 500
                }}
              >
                {order.amount}
              </p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 18 }}>
            <PayContentItemName>{t("amount")}</PayContentItemName>
            <PayContentItemContent
              style={{
                color: COLORS.Dark_gray,
                fontFamily: "Open Sans",
                fontWeight: 500
              }}
            >
              {order.quantity} USDT
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("unitPrice")}</PayContentItemName>
            <PayContentItemContent
              style={{
                color: COLORS.Dark_gray,
                fontFamily: "Open Sans",
                fontWeight: 500
              }}
            >
              NT$
              <p
                style={{
                  marginLeft: 4,
                  fontFamily: "Open Sans",
                  fontWeight: 500
                }}
              >
                {order.price}
              </p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentItemSplit />
          <PayContentDesContainerItem>
            <PayContentItemName>{t("payments")}</PayContentItemName>
            <PayStatusText>{t("fiatOrderNum")}</PayStatusText>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 18 }}>
            <PayContentItemName>{t("fiatOrderNum")}</PayContentItemName>
            <PayStatusText>{order.id}</PayStatusText>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("fiatOrderTime")}</PayContentItemName>
            <PayStatusText>
              {Moment(order.createDate).format("YYYY-MM-DD hh:mm:ss")}
            </PayStatusText>
          </PayContentDesContainerItem>
        </DrawerContainer>
      </Drawer>
      <Drawer
        isVisible={completeDrawerVisible}
        selectVisible={handlerCompleteDrawer.bind(null, itemDetail)}
        height={358}
      >
        <DrawerContainer>
          <DrawerTitleContainer>
            <div style={{ width: "5%" }}></div>
            <DepthTitle>{t("orderType")}</DepthTitle>
            <CancelIcon
              src={cancel}
              alt="cancel"
              onClick={handlerCompleteDrawer.bind(null, itemDetail)}
            />
          </DrawerTitleContainer>
          <PayContentDesContainerItem>
            <PayContentItemName>{t("fiatTotal")}</PayContentItemName>
            <PayContentItemContent
              style={{
                color:
                  itemDetail === "buy" ? COLORS.Red : COLORS.Green
              }}
            >
              NT$<p style={{ marginLeft: 4, fontSize: 24 }}>{order.amount}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 18 }}>
            <PayContentItemName>{t("amount")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
              {order.quantity} USDT
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("unitPrice")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
              NT$<p style={{ marginLeft: 4 }}>{order.price}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentItemSplit />
          <PayContentDesContainerItem>
            <PayContentItemName>{t("payments")}</PayContentItemName>
            <PayStatusText>{t("fiatOrderNum")}</PayStatusText>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 18 }}>
            <PayContentItemName>{t("fiatOrderNum")}</PayContentItemName>
            <PayStatusText>{order.id.slice(0, 20)}</PayStatusText>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("fiatOrderTime")}</PayContentItemName>
            <PayStatusText>
              {Moment(order.createDate).format("YYYY-MM-DD hh:mm:ss")}
            </PayStatusText>
          </PayContentDesContainerItem>
        </DrawerContainer>
      </Drawer>
      <Footer locationPage={"/orders"} />
    </PageContainer>
  );
};

export default FiatOrders;
