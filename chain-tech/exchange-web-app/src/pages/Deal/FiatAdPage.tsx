import { useState } from "react";
import Footer from "../../components/footer/HomeFooter";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import BackIcon from "../../assets/icon/Deal/backArrow.png";
import arrowRight from "../../assets/icon/Deal/arrowRight.png";
// import funds from "../../assets/icon/Deal/funds.png";
import Drawer from "../../components/UI/Drawer";
import usdt from "../../assets/icon/Deal/USDT.png";
import btc from "../../assets/icon/Deal/BTC.png";
import etc from "../../assets/icon/Deal/ETC.png";
import check from "../../assets/profile/Tick.png";
import ChangeCurrency from "../../components/fund/ChangeCurrency";
import Increment from "../../assets/icon/Deal/add.png";
import decrement from "../../assets/icon/Deal/decreasement.png";
import cancel from "../../assets/icon/cancel.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow:scroll;
  padding-bottom:100px;
  background: ${COLORS.EXLight_gray};
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
`;

const NavImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 12px;
`;

const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
  margin-left: 11%;
`;

const NextButton = styled.button<{ isValid: boolean }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  letter-spacing: 0.4px;
  color: ${COLORS.Red};
  opacity: ${(props) => (props.isValid ? 1 : 0.24)};
  background: ${COLORS.EXLight_gray};
  border: none;
`;
const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-top: 8px;
  position: relative;
`;
const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const StatusIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 4px solid #dedde3;
  border-radius: 8px;
`;
const StatusDes = styled.p`
  font-weight: 700;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  color: #dedde3;
  margin-top: 6px;
`;
const StatusSplit = styled.div`
  height: 2px;
  width: 32%;
  background: #dedde3;
  border-radius: 3px;
  margin-bottom: 8%;
  position: absolute;
  bottom: 9%;
  left: 14.7%;
`;
const DealContainer = styled.div`
  width: 100%;
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 16px;
`;
const DealTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${COLORS.EXLight_gray};
`;
const DealTitle = styled.div<{ status: string; dealStatus: string }>`
  width: 100%;
  height: 52px;
  font-weight: ${(props) => (props.dealStatus === props.status ? 700 : 500)};
  font-size: 14px;
  line-height: 52px;
  letter-spacing: 0.012em;
  color: ${COLORS.Dark_gray};
  border-bottom: ${(props) =>
    props.dealStatus === props.status
      ? `2px solid
    ${props.status === "buy" ? COLORS.Red : COLORS.Green}`
      : "none"};
  text-align: center;
`;
const DealActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin: 16px 0 24px 0;
`;
const DealAction = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const DealActionTitle = styled.p`
  width: 100%;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;
const DealActionButton = styled.button`
  width: 164px;
  height: 48px;
  background: rgb(244, 244, 246, 0.6);
  border-radius: 4px;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
  margin-top: 4px;
  text-align: left;
  position: relative;
  border: none;
`;
const DealActionButtonIcon = styled.img`
  width: 7.41px;
  height: 12px;
  position: absolute;
  right: 22px;
  top: 18px;
`;
const AmountContainer = styled.div`
  width: 100%;
  height: 336px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const AmountTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${COLORS.Dark_gray};
`;
const AmountLabel = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;
const AmountInputType = styled.div`
  width: 100%;
  height: 48px;
  color: ${COLORS.Dark_gray};
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 52px 12px 16px;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
`;
const AmountInputContainer = styled.div`
  width: 100%;
  position: relative;
`;
// const AmountAlarm = styled.p`
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: 0.004em;
//   color: ${COLORS.Red};
// `;
const AmountInput = styled.input`
  width: 100%;
  height: 48px;
  color: ${COLORS.Dark_gray};
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 52px 12px 16px;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  border: none;
  margin-top: 4px;
  border-radius: 4px;
`;
const AmountInputLabel = styled.p`
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Mid_gray};
  position: absolute;
  right: 16px;
  bottom: 15px;
`;
const AmountDesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AmountTitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const AmountDesTitle = styled.div`
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;
// const AmountDesTitleHint = styled.p`
//   font-size: 12px;
//   line-height: 15px;
//   display: flex;
//   align-items: center;
//   letter-spacing: 0.004em;
//   color: ${COLORS.Dark_gray};
//   font-weight: 700;
//   margin-left: 4px;
// `;
const AmountDesContent = styled.p`
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
  color: ${COLORS.Dark_gray};
`;
const DealAmountContainer = styled.div`
  width: 100%;
  height: 344px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const DealAmountTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;
// const DealAmountTitleContainer = styled.div`
//   font-size: 15px;
//   line-height: 24px;
//   letter-spacing: 0.004em;
//   color: ${COLORS.Gray};
//   display: flex;
//   align-items: center;
//   font-size: 12px;
//   line-height: 18px;
// `;
const DealAmountDesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const DealAmountInputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;
const DealAmountInput = styled.input`
  width: 164px;
  height: 48px;
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 16px 12px 16px;
  border-radius: 4px;
  border: none;
`;
const DealAmountInputLabel = styled.p`
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Mid_gray};
  position: absolute;
`;
const DealAmountInputSplit = styled.p`
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;
const AmountInputIcon = styled.img`
  height: 12px;
  width: 7.5px;
  position: absolute;
  bottom: 18px;
  right: 22px;
`;
// const FooterContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding-top: 12px;
//   background: #f4f4f6;
// `;
// const CommissionHintContainer = styled.div`
//   width: 343px;
//   height: 56px;
//   background: rgb(255, 120, 107, 0.07);
//   border: 1px solid rgb(166, 0, 8, 0.07);
//   border-radius: 8px;
//   margin-bottom: 22%;
//   display: flex;
//   align-items: center;
//   padding: 16px 12px;
// `;
// const CommissionHintIcon = styled.img`
//   width: 24px;
//   height: 24px;
// `;
// const CommissionHintContent = styled.p`
//   font-weight: 500;
//   font-size: 13px;
//   line-height: 20px;
//   letter-spacing: 0.4px;
//   color: ${COLORS.Dark_gray};
// `;
const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;
const DepthUnitItem = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #f4f4f6;
  height: 55px;
  line-height: 55px;
  color: ${COLORS.Dark_gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
`;
const UnitImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;
const UnitCheck = styled.img`
  width: 17.6px;
  height: 13.4px;
`;
const FloatPriceIncrement = styled.div`
  width: 100%;
  height: 49px;
  border-radius: 4px;
  background: ${COLORS.EXLight_gray};
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FloatPriceTitle = styled.p`
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
`;
const FloatPriceIcon = styled.img`
  width: 28px;
  height: 28px;
`;
const DrawerFullWarehouseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;

const DrawerFullWarehouseTitle = styled.p`
  flex: 1;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;
const CancelButton = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #8f8da2;
`;
const DrawerDeadTimeContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: scroll;
`;

const FiatDeal = () => {
  const navigation = useNavigate();
  const [dealStatus, setDealStatus] = useState("buy");
  const [unit, setUnit] = useState("USDT");
  const [currencyUnit, setCurrencyUnit] = useState("TWD");
  const [fixPriceStatus, setFixPriceStatus] = useState("固定價格");
  const [fixPrice, setFixPrice] = useState("");
  const [floatPrice, setFloatPrice] = useState(50);
  const [dealAmount, setDealAmount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deadTimePay, setDeadTimePay] = useState(15);

  const [currencyDrawer, setCurrencyDrawer] = useState(false);
  const [changeUnit, setChangeUnit] = useState(false);
  const [fixPriceDrawer, setFixPriceDrawer] = useState(false);
  const [deadTimePayDrawer, setDeadTimePayDrawer] = useState(false);
  const { t } = useTranslation();
  const currencyDrawerHandler = () => {
    setCurrencyDrawer((v) => !v);
  };
  const currencyFixPriceHandler = () => {
    setFixPriceDrawer((v) => !v);
  };
  const deadTimePayDrawerHandler = () => {
    setDeadTimePayDrawer((v) => !v);
  };
  const selectHandler = (select: string) => {
    setUnit(select);
    setCurrencyDrawer((v) => !v);
  };
  return changeUnit ? (
    <ChangeCurrency
      currencyUnit={currencyUnit}
      setCurrencyUnit={setCurrencyUnit}
      setChangeUnit={setChangeUnit}
    />
  ) : (
    <PageContainer>
      <TitleContainer>
        <Link to="/deal">
          <NavImage src={BackIcon} alt="language" />
        </Link>
        <LogoImage>{t("placeAds")}</LogoImage>
        <NextButton
          isValid={
            (!!fixPrice) &&
            !!dealAmount &&
            !!minPrice &&
            !!maxPrice
          }
          onClick={() => {
            (!!fixPrice || !!floatPrice) &&
              !!dealAmount &&
              !!minPrice &&
              !!maxPrice &&
              localStorage.setItem("ad", JSON.stringify({
                type: dealStatus === "buy" ? 0 : 1,
                cryptoAsset: unit,
                fiatCurrency: currencyUnit,
                priceType: fixPriceStatus === "固定價格" ? 0 : 1,
                price: parseFloat(fixPrice),
                totalTradingAmount: parseFloat(dealAmount),
                orderLimitMin: parseFloat(minPrice),
                orderLimitMax: parseFloat(maxPrice),
                paymentTimeLimit: deadTimePay * 60 * 1000,
                conditionCompleteOrders: "",
                conditionRegisteredDays: ""
              }))
            navigation("/deal/FiatAdDealHint");
          }}
        >
          {t("next")}
        </NextButton>
      </TitleContainer>
      <StatusContainer>
        <StatusItem>
          <StatusIcon style={{ border: `4px solid ${COLORS.Red}` }} />
          <StatusDes style={{ color: `${COLORS.Dark_gray}` }}>
            {t("priceNQty")}
          </StatusDes>
        </StatusItem>
        <StatusSplit />
        <StatusItem>
          <StatusIcon />
          <StatusDes>{t("fiatTradeType")}</StatusDes>
        </StatusItem>
        <StatusSplit style={{ left: "53.3%" }} />
        <StatusItem>
          <StatusIcon />
          <StatusDes>{t("adsConfirm")}</StatusDes>
        </StatusItem>
      </StatusContainer>
      <DealContainer>
        <DealTitleContainer>
          <DealTitle
            dealStatus={dealStatus}
            status={"buy"}
            style={{ marginLeft: "5%" }}
            onClick={() => {
              setDealStatus("buy");
            }}
          >
            我想購買
          </DealTitle>
          <DealTitle
            dealStatus={dealStatus}
            status={"sell"}
            style={{ marginRight: "5%" }}
            onClick={() => {
              setDealStatus("sell");
            }}
          >
            {t("wantSell")}
          </DealTitle>
        </DealTitleContainer>
        <DealActionContainer>
          <DealAction>
            <DealActionTitle>{t("tokenType")}</DealActionTitle>
            <DealActionButton onClick={currencyDrawerHandler}>
              {unit} <DealActionButtonIcon src={arrowRight} alt="select" />
            </DealActionButton>
          </DealAction>
          <DealAction>
            <DealActionTitle>{t("fundFiat")}</DealActionTitle>
            <DealActionButton onClick={() => setChangeUnit((v) => !v)}>
              {currencyUnit}
              <DealActionButtonIcon src={arrowRight} alt="select" />
            </DealActionButton>
          </DealAction>
        </DealActionContainer>
      </DealContainer>
      <AmountContainer>
        <AmountTitle>{t("price")}</AmountTitle>
        <AmountLabel style={{ marginTop: 16 }}>{t("priceMethod")}</AmountLabel>
        <AmountInputContainer
          style={{ marginTop: 4, position: "relative" }}
        // onClick={currencyFixPriceHandler}
        >
          <AmountInputType>{fixPriceStatus}</AmountInputType>
          {/* <AmountInputIcon src={arrowRight} alt="select" /> */}
        </AmountInputContainer>
        <AmountInputContainer style={{ marginTop: 24 }}>
          {fixPriceStatus === "固定價格" ? (
            <>
              <AmountLabel>{t("FixedPrice")}</AmountLabel>
              <AmountInput
                placeholder={t("FixedPrice")}
                onChange={(e) => setFixPrice(e.target.value)}
                value={fixPrice}
              />
              <AmountInputLabel>{currencyUnit}</AmountInputLabel>
            </>
          ) : (
            <>
              <AmountLabel>浮動價格</AmountLabel>
              <FloatPriceIncrement>
                <FloatPriceIcon
                  src={decrement}
                  alt="select"
                  onClick={() => {
                    setFloatPrice((prev) => (prev <= 0 ? 0 : prev - 10));
                  }}
                />
                <FloatPriceTitle>{`${floatPrice}.00%`}</FloatPriceTitle>
                <FloatPriceIcon
                  src={Increment}
                  alt="select"
                  onClick={() => {
                    setFloatPrice((prev) => (prev >= 100 ? 100 : prev + 10));
                  }}
                />
              </FloatPriceIncrement>
            </>
          )}
        </AmountInputContainer>
        <AmountDesContainer style={{ marginTop: 24 }}>
          <AmountDesTitle>市場參考價</AmountDesTitle>
          <AmountDesTitle>{`${fixPrice} ${currencyUnit}/${unit}`}</AmountDesTitle>
        </AmountDesContainer>
        <AmountDesContainer style={{ marginTop: 16 }}>
          <AmountDesTitle>交易價格</AmountDesTitle>
          <AmountDesContent>{`${fixPrice} ${currencyUnit}/${unit}`}</AmountDesContent>
        </AmountDesContainer>
      </AmountContainer>
      <DealAmountContainer>
        <AmountTitle>{t("amount")}</AmountTitle>
        <DealAmountDesContainer style={{ marginTop: 16 }}>
          <AmountTitleContainer>
            <DealAmountTitle
              style={{
                color:
                  parseInt(dealAmount) > 6000
                    ? COLORS.Red
                    : COLORS.Gray,
              }}
            >
              {t("tradeAmount")}
            </DealAmountTitle>
            {/* <DealAmountTitleContainer>
              可用資產
              <AmountDesTitleHint>57,649.86 USDT</AmountDesTitleHint>
            </DealAmountTitleContainer> */}
          </AmountTitleContainer>
          <AmountInputContainer style={{ marginTop: 4 }}>
            <AmountInput
              placeholder={t("enterTradeAmount")}
              onChange={(e) => setDealAmount(e.target.value)}
              value={dealAmount}
            />
            <AmountInputLabel>USDT</AmountInputLabel>
            {/* {parseInt(dealAmount) > 6000 && (
              <AmountAlarm>超過您的可用資產</AmountAlarm>
            )} */}
          </AmountInputContainer>
        </DealAmountDesContainer>
        <DealAmountDesContainer style={{ marginTop: 24 }}>
          <AmountTitleContainer>
            <DealAmountTitle>單筆限額</DealAmountTitle>
          </AmountTitleContainer>
          <DealAmountInputContainer style={{ marginTop: 4 }}>
            <DealAmountInput
              placeholder={t("min")}
              onChange={(e) => setMinPrice(e.target.value)}
              value={minPrice}
            />
            <DealAmountInputLabel style={{ left: 112, bottom: 15 }}>
              TWD
            </DealAmountInputLabel>
            <DealAmountInputSplit>~</DealAmountInputSplit>
            <DealAmountInputLabel style={{ right: 16, bottom: 15 }}>
              TWD
            </DealAmountInputLabel>
            <DealAmountInput
              placeholder={t("max")}
              onChange={(e) => setMaxPrice(e.target.value)}
              value={maxPrice}
            />
          </DealAmountInputContainer>
        </DealAmountDesContainer>
        <DealAmountDesContainer style={{ marginTop: 24 }}>
          <AmountTitleContainer>
            <DealAmountTitle>放行時限</DealAmountTitle>
          </AmountTitleContainer>
          <AmountInputContainer
            style={{ marginTop: 4, position: "relative" }}
            onClick={deadTimePayDrawerHandler}
          >
            <AmountInputType>{`${deadTimePay}`}{t("minutes")}</AmountInputType>
            <AmountInputIcon src={arrowRight} alt="select" />
          </AmountInputContainer>
        </DealAmountDesContainer>
      </DealAmountContainer>
      {/* <FooterContainer>
        <CommissionHintContainer>
          <CommissionHintIcon src={funds} alt="dollar" />
          <CommissionHintContent>廣告預估手續費</CommissionHintContent>
          <CommissionHintContent
            style={{ marginLeft: 6, fontSize: 13, lineHeight: "16px" }}
          >
            30 USDT
          </CommissionHintContent>
        </CommissionHintContainer>
      </FooterContainer> */}
      <Footer locationPage={"/deal"} />
      <Drawer
        isVisible={currencyDrawer}
        selectVisible={currencyDrawerHandler}
        height={252}
      >
        <DepthTitle>{t("tokenType")}</DepthTitle>
        <DepthUnitItem onClick={selectHandler.bind(null, "USDT")}>
          <UnitImage src={usdt} alt="USDT" />
          <p style={{ flex: 1, textAlign: "left" }}>USDT</p>
          {unit === "USDT" && <UnitCheck src={check} alt="USDT" />}
        </DepthUnitItem>
        <DepthUnitItem onClick={selectHandler.bind(null, "BTC")}>
          <UnitImage src={btc} alt="USDT" />
          <p style={{ flex: 1, textAlign: "left" }}>BTC</p>
          {unit === "BTC" && <UnitCheck src={check} alt="USDT" />}
        </DepthUnitItem>
        <DepthUnitItem onClick={selectHandler.bind(null, "ETH")}>
          <UnitImage src={etc} alt="USDT" />
          <p style={{ flex: 1, textAlign: "left" }}>ETH</p>
          {unit === "ETH" && <UnitCheck src={check} alt="USDT" />}
        </DepthUnitItem>
      </Drawer>
      <Drawer
        isVisible={fixPriceDrawer}
        selectVisible={currencyFixPriceHandler}
        height={196}
      >
        <DepthTitle>{t("priceMethod")}</DepthTitle>
        <DepthUnitItem
          onClick={() => {
            setFixPriceStatus(t("FixedPrice"));
            currencyFixPriceHandler();
          }}
        >
          <p
            style={{
              flex: 1,
              textAlign: "center",
              color:
                fixPriceStatus === "固定價格"
                  ? COLORS.Red
                  : COLORS.Gray,
            }}
          >
            {t("FixedPrice")}
          </p>
        </DepthUnitItem>
        <DepthUnitItem
          onClick={() => {
            setFixPriceStatus("浮動價格");
            currencyFixPriceHandler();
          }}
        >
          <p
            style={{
              flex: 1,
              textAlign: "center",
              color:
                fixPriceStatus === "浮動價格"
                  ? COLORS.Red
                  : COLORS.Gray,
            }}
          >
            浮動價格
          </p>
        </DepthUnitItem>
      </Drawer>
      <Drawer
        isVisible={deadTimePayDrawer}
        selectVisible={deadTimePayDrawerHandler}
        height={309}
      >
        <DrawerFullWarehouseTitleContainer>
          <DrawerFullWarehouseImage
            src={cancel}
            alt="cancel"
            onClick={deadTimePayDrawerHandler}
          />
          <DrawerFullWarehouseTitle>{"旅行時限"}</DrawerFullWarehouseTitle>
          <CancelButton
            onClick={deadTimePayDrawerHandler}
          >{t("OK")}</CancelButton>
        </DrawerFullWarehouseTitleContainer>
        <DrawerDeadTimeContainer>
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ].map((item, i) => {
            return (
              <DepthUnitItem
                onClick={() => {
                  setDeadTimePay(item);
                }}
              >
                <p
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color:
                      deadTimePay === item
                        ? COLORS.Red
                        : COLORS.Gray,
                  }}
                >
                  {item}
                </p>
              </DepthUnitItem>
            );
          })}
        </DrawerDeadTimeContainer>
      </Drawer>
    </PageContainer>
  );
};

export default FiatDeal;
