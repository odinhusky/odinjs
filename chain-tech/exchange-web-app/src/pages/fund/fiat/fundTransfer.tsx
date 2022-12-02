import { useState,useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "../../../constants/colors";
import Footer from "../../../components/footer/HomeFooter";
import TransferHeader from "../../../components/header/transferHeader";
import arrowRight from "../../../assets/icon/Deal/arrowRight.png";
import Change from "../../../assets/icon/Deal/change.png";
import Drawer from "../../../components/UI/Drawer";
import check from "../../../assets/profile/Tick.png";
import usdt from "../../../assets/icon/Deal/USDT.png";
// import btc from "../../../assets/icon/Deal/BTC.png";
// import etc from "../../../assets/icon/Deal/ETC.png";
import { useNavigate } from "react-router-dom";
import api from '../../../common/api'
import LoadingOverlay from "react-loading-overlay-ts";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
const BodyContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const SelectTitle = styled.p`
  margin-bottom: 4px;
  height: 20px;
  line-height: 20px;
  font-weight: 500;
  font-size: 13px;
  color: #5f5c70;
`;
const SelectTitleContainer = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  line-height: 20px;
  margin-bottom: 4px;
`;
const SelectInputContainer = styled.div`
  width: 87%;
  height: 24px;
  position: absolute;
  left: 16px;
  top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SelectInput = styled.div`
  width: 283px;
  height: 48px;
  background: #f4f4f6;
  border-radius: 4px;
  margin-bottom: 24px;
  position: relative;
`;
const SelectInputTransfer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SelectInputText = styled.p`
  font-size: 15px;
  line-height: 24px;
  color: #383743;
`;
const SelectInputTextTransfer = styled.p`
  align-self: flex-end;
  font-size: 13px;
  line-height: 24px;
  color: #383743;
`;
const InputTextSplit = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  border:none;
  background:transparent;
`;

const TransferCurrency = styled.input`
  border: none;
  background: ${COLORS.EXLight_gray};
  height: 48px;
  font-size: 15px;
  color: ${COLORS.Dark_gray};
  padding: 12px 16px;
  border-radius: 4px;
`;

const BottomContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  padding-bottom: 80px;
`;
const BottomButton = styled.p`
  width: 100%;
  height: 44px;
  background: ${COLORS.Primary};
  text-align: center;
  line-height: 44px;
  font-weight: 500;
  color: #fff;
  border-radius: 4px;
`;

const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;
const DepthItem = styled.div<{ isSelect: number; index: number }>`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #f4f4f6;
  height: 55px;
  line-height: 55px;
  color: ${(props) =>
    props.isSelect === props.index ? COLORS.Red : "#5f5c70"};
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

const Transfer = () => {
  const navigate = useNavigate();
  const [selectChange, setSelectChange] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(0);

  const [sources, setSources] = useState(0);
  const [transferSource, setTransferSource] = useState(1);
  const [unit, setUnit] = useState(0);
  const [transferCurrency] = useState(false);
  const [transferValue, setTransferValue] = useState("");
  const [futureBalance, setFutureBalance] = useState(0);
  const [spotBalance, setSpotBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [selectStatus, setSelectStatus] = useState("");
  const [, setSubmitData] = useState({
    from:"現貨資金",
    to:"法幣資金",
    count:""
  });
  const selectDrawerHandler = (select: string) => {
    setSelectChange((v) => !v);
    setSelectStatus(select);
    setDrawerHeight(200);
  };
  // const selectSourceHandler = (select: string) => {
  //   setSelectStatus(select);
  // };
  const selectHandler = (source: number, selectStatus: string) => {
    setSelectChange((v) => !v);
    if (selectStatus === "source") {
      setSources(source);
    } else if (selectStatus === "transfer") {
      setTransferSource(source);
    } else {
      setUnit(source);
    }
  };
  // transfer I/O currency from user
  const transferHandler = () => {
    // setTransferCurrency((v) => !v);
    setTransferSource(sources)
    setSources(transferSource)
  };

  const transferTotalHandler = () => {
    setSubmitData({
      from:
        sources === 0 ? "現貨資金" : "法幣資金",
      to:
        transferSource === 0
          ? "現貨資金"
          : "法幣資金",
      // unit: unit === 0 ? "USDT" : unit === 1 ? "BTC" : "ETH",
      count: transferValue,
    });
    if(!localStorage.getItem("token")){
      alert("請先登入")
    }
    else if(!transferValue){
      alert("請輸入劃轉數量")
    }else{
      let account = JSON.parse(localStorage.getItem("user")!).account
      let obj = sources === 0 ? {
        sourceServer: "spot",
        targetServer:  "otc",
        sourceUser:account,
        targetUser:account,
        symbol:"USDT",
        value:parseFloat(transferValue).toFixed(2) 
      } : {
        sourceServer: "otc",
        targetServer: "spot",
        sourceUser:account,
        targetUser:account,
        symbol:"USDT",
        value:parseFloat(transferValue).toFixed(2)  
      } 
      setLoading(true)
      if(sources === 0){
        api.postData("/api/transfer/",obj).then(x=>{
          setLoading(false)
           if(x.status !== 400){
              alert("劃轉成功")
              navigate(-1)
           }else{
              alert(x.data.msg)
           }
       })
      }else{
        api.postData("/otc/api/transfer/",obj).then(x=>{
          setLoading(false)
           if(x.status !== 400){
            alert("劃轉成功")
            navigate(-1)
           }else{
              alert(x.data.msg)
           }
       })
      }
    }

  };

  function getFund(){
    api.get("/investor/property").then(x=>{
      setSpotBalance(x.data.spot.equityValue)
    })
    let user = JSON.parse(localStorage.getItem("user")!)
    api.get("/otc/api/user/"+user.account).then( x=>{
      if(x.status !== 400){
        for(let i =0;i<x.wallet.coins.length;i++){
          if(x.wallet.coins[i].symbol === "USDT"){
            setFutureBalance(x.wallet.coins[i].balance)
          }
        }
      }     
    })
  }

  useEffect(()=>{
    if(localStorage.getItem("token")){
      getFund()
    }
  })

  return (
    <LoadingOverlay active={loading} spinner>

    <PageContainer>
      <TransferHeader />
      <BodyContainer>
        {transferCurrency ? (
          <>
            <SelectTitle>{t("to")}</SelectTitle>
            <SelectInput
              style={{ margin: 0 }}
              onClick={selectDrawerHandler.bind(null, "transfer")}
            >
              <SelectInputContainer>
                <SelectInputText>
                  {transferSource === 0
                    ? t("transferSpot")
                    : t("transferFutures")}
                </SelectInputText>
                <img
                  src={arrowRight}
                  alt="arrow"
                  style={{ width: 7.41, height: 12 }}
                />
              </SelectInputContainer>
            </SelectInput>
            <SelectInputTransfer>
              <SelectInputTextTransfer>{t("from")}</SelectInputTextTransfer>
              <img
                onClick={transferHandler}
                src={Change}
                alt="Change"
                style={{ width: 44, height: 44 }}
              />
            </SelectInputTransfer>
            <SelectInput onClick={selectDrawerHandler.bind(null, "source")}>
              <SelectInputContainer>
                <SelectInputText>
                  {sources === 0
                    ? t("transferSpot")
                    : t("transferFutures")}
                </SelectInputText>
                <img
                  src={arrowRight}
                  alt="arrow"
                  style={{ width: 7.41, height: 12 }}
                />
              </SelectInputContainer>
            </SelectInput>
          </>
        ) : (
          <>
            <SelectTitle>{t("from")}</SelectTitle>
            <SelectInput
              style={{ margin: 0 }}
              onClick={selectDrawerHandler.bind(null, "source")}
            >
              <SelectInputContainer>
                <SelectInputText>
                  {sources === 0
                    ? t("transferSpot")
                    : t("transferFutures")}
                </SelectInputText>
                <img
                  src={arrowRight}
                  alt="arrow"
                  style={{ width: 7.41, height: 12 }}
                />
              </SelectInputContainer>
            </SelectInput>
            <SelectInputTransfer>
              <SelectInputTextTransfer>{t("to")}</SelectInputTextTransfer>
              <img
                onClick={transferHandler}
                src={Change}
                alt="arrow"
                style={{ width: 44, height: 44 }}
              />
            </SelectInputTransfer>
            <SelectInput onClick={selectDrawerHandler.bind(null, "transfer")}>
              <SelectInputContainer>
                <SelectInputText>
                  {transferSource === 0
                    ? t("transferSpot")
                    : t("transferFutures")}
                </SelectInputText>
                <img
                  src={arrowRight}
                  alt="arrow"
                  style={{ width: 7.41, height: 12 }}
                />
              </SelectInputContainer>
            </SelectInput>
          </>
        )}
        <SelectTitle>{t("tokenType")}</SelectTitle>
        <SelectInput
          style={{
            width: "100%",
          }}
          onClick={selectDrawerHandler.bind(null, "unit")}
        >
          <SelectInputContainer>
            <SelectInputText>
              {unit === 0 ? "USDT" : unit === 1 ? "BTC" : "ETH"}
            </SelectInputText>
            <img
              src={arrowRight}
              alt="arrow"
              style={{ width: 7.41, height: 12 }}
            />
          </SelectInputContainer>
        </SelectInput>
        <SelectTitleContainer>
          <SelectTitle style={{ margin: 0 }}>{t("amount")}</SelectTitle>
          <InputTextSplit onClick={()=>{setTransferValue(sources === 0 ? spotBalance.toString() : futureBalance.toString())}}>
            <SelectTitle
              style={{
                margin: 0,
                color: COLORS.Mid_gray,
                marginRight: 4,
              }}
            >
              {t("transferAvailableAmount")}
            </SelectTitle>
            <SelectTitle style={{ margin: 0, color: COLORS.Dark_gray }}>
              {`${sources === 0 ? spotBalance : futureBalance} ${unit === 0 ? "USDT" : unit === 1 ? "BTC" : "ETH"}`}
            </SelectTitle>
          </InputTextSplit>
        </SelectTitleContainer>
        <TransferCurrency
          value={transferValue}
          onChange={(e) => setTransferValue(e.target.value)}
          placeholder={t("enterTransferAmount")}
          // pattern="^(([1-9]{1}\d*)|(0{1}))(\.\d{8})$"
          step="0.000001"
        />
        <BottomContainer>
          <BottomButton onClick={transferTotalHandler}>{t("transfer")}</BottomButton>
        </BottomContainer>
      </BodyContainer>

      <Drawer
        isVisible={selectChange}
        selectVisible={selectDrawerHandler.bind(null, "source")}
        height={selectStatus === "unit" ? 150 : drawerHeight}
      >
        <DepthTitle>{selectStatus === "source" ? t("from") : selectStatus === "transfer" ? t("to") : t("tokenType")}</DepthTitle>
        {selectStatus === "source" ? (
          <DepthItem
            isSelect={sources}
            index={0}
            onClick={selectHandler.bind(null, 0, selectStatus)}
          >
            {t("transferSpot")}
          </DepthItem>
        ) : selectStatus === "transfer" ? (
          <DepthItem
            isSelect={transferSource}
            index={0}
            onClick={selectHandler.bind(null, 0, selectStatus)}
          >
            {t("transferSpot")}
          </DepthItem>
        ) : (
          <DepthUnitItem onClick={selectHandler.bind(null, 0, selectStatus)}>
            <UnitImage src={usdt} alt="USDT" />
            <p style={{ flex: 1, textAlign: "left" }}>USDT</p>
            {unit === 0 && <UnitCheck src={check} alt="USDT" />}
          </DepthUnitItem>
        )}
        {selectStatus === "source" ? (
          <DepthItem
            isSelect={sources}
            index={1}
            onClick={selectHandler.bind(null, 1, selectStatus)}
          >
            {t("transferFutures")}
          </DepthItem>
        ) : selectStatus === "transfer" ? (
          <DepthItem
            isSelect={transferSource}
            index={1}
            onClick={selectHandler.bind(null, 1, selectStatus)}
          >
            {t("transferFutures")}
          </DepthItem>
        ) : (
          <></>
        )}
      </Drawer>
      <Footer locationPage={`/deal`} />
    </PageContainer>
    </LoadingOverlay>
  );
};

export default Transfer;
