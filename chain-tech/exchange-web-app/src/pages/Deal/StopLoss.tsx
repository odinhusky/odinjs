import React, { useState,useEffect } from "react";
import Commonheader from "../../components/header/Commonheader";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Drawer from "../../components/UI/Drawer";
import { Select } from 'antd';
import api from "../../common/api";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
const SelectInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const SelectInput = styled.input`
  height: 32px;
  width: 70%;
  border: none;
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 16px;
  color: ${COLORS.Dark_gray};
  border-radius: 4px;
  /* padding-right: 18%; */
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
const SubmitButton = styled.button`
  margin-top: 50px;
  border: none;
  width: 100%;
  height: 44px;
  color: #fff;
  background: ${COLORS.Red};
  border-radius: 4px;
`;

const SelectContainer = styled(Select)`
  width:10%;
`

const StopLoss = () => {
  const [stopEarning, setStopEarning] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [selectAmount, setSelectAmount] = useState(0.1);
  const [salePriceDrawer, setSalePriceDrawer] = useState(false);
  const [selectItem, setSelectItem] = useState(0.1);
  const [position, setPosition] = useState({
    avgPrice:"",
    forceClose:""
  });
  const [price, setPrice] = useState("");
  const [predictEarning, setPredictEarning] = useState(0);
  const [predictLoss, setPredictLoss] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lossError, setLossError] = useState("");
  const [earnError, setEarnError] = useState("");
  const [symbol, setSymbol] = useState("");

  const navigation = useNavigate()
  const { t } = useTranslation();
  const handleIsVisible = () => {
    setSalePriceDrawer((v) => !v);
  };
  const handleMount = (index: number) => {
    setSelectItem(index);
    setSelectAmount(index);
    setSalePriceDrawer((v) => !v);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
    console.log(stopEarning)
    console.log(selectAmount)
  }
  const getPosition = () => {
    api.get("/investor/position").then((x) => {
      console.log(x)
      // setPosition(x.data[0]);
      let symbol = JSON.parse(localStorage.getItem("position")!).position.symbol
      setSymbol(JSON.parse(localStorage.getItem("position")!).position.symbol)
      if(JSON.parse(localStorage.getItem("position")!).position.lossPrice){
        setStopLoss(JSON.parse(localStorage.getItem("position")!).position.lossPrice)
        api.getData(`/order/position/stop-price?symbol=${symbol}&lossPrice=`+JSON.parse(localStorage.getItem("position")!).position.lossPrice).then(x=>{
          if(x.status !== 400 ){
            setPredictLoss(x.data)
            setLossError("")
          }else{
            setLossError(x.data.msg)
          }
       })
      }
      if(JSON.parse(localStorage.getItem("position")!).position.profitPrice){
        setStopEarning(JSON.parse(localStorage.getItem("position")!).position.profitPrice)
        api.getData(`/order/position/stop-price?symbol=${symbol}&profitPrice=`+JSON.parse(localStorage.getItem("position")!).position.profitPrice).then(x=>{
          if(x.status !== 400 ){
            setPredictEarning(x.data)
            setEarnError("")
          }else{
            setEarnError(x.data.msg)
          }
        })
      }
    })
  }

  const getPrice = () => {
    let symbol = JSON.parse(localStorage.getItem("position")!).position.symbol
    axios
      .get(`https://api1.binance.com/api/v3/ticker/price?symbol=${symbol.split("-")[0]}USDT`)
      .then((x) => {
        setPrice(x.data.price.slice(0, -6));
      });
  };

  useEffect(()=>{
    setPosition(JSON.parse(localStorage.getItem("position")!).position)
    if(localStorage.getItem("token")){
      getPosition()
    }
    getPrice()
  },[])
  return (
    <LoadingOverlay active={loading} spinner>

    <PageContainer>
      <Commonheader title={t("stopProfitLoss")} returnPath={"/deal"} />
      <BodyContainer>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{t("entryPrice")}</p>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{position.avgPrice}</p>
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{t("marketOrder")}</p>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{price}</p>
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{t("liqPrice")}</p>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{position.forceClose}</p>
        </div>
        <SelectInputContainer style={{ marginTop: 24 }}>
          <SelectTitle>止盈</SelectTitle>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
          <SelectInput
            value={stopEarning}
            onChange={(e) => {
              if(localStorage.getItem("token")){
                  if(parseInt(e.target.value)){
                    let symbol = JSON.parse(localStorage.getItem("position")!).position.symbol

                      api.getData(`/order/position/stop-price?symbol=${symbol}&profitPrice=`+parseInt(e.target.value)).then(x=>{
                        if(x.status === 400){
                          // alert(x.data.msg)
                          setEarnError(x.data.msg)
                          setPredictEarning(0)
                        }else{
                          setPredictEarning(x.data)
                          setEarnError("")
                        }
                      })
                  }else if(e.target.value.length === 0 ){
                    setPredictEarning(0)
                    setEarnError("")
                  }
              }
              setStopEarning(e.target.value)
            }}
            type="text"
            placeholder="輸入止盈價格"
          />
          <SelectContainer defaultValue="標記" style={{ width: 80 }} onChange={handleChange}>
              <Option value="標記">標記</Option>
          </SelectContainer>
        </div>
        </SelectInputContainer>
        {<p style={{fontSize:"12px",color:"#D32F2F",marginTop:"5px"}}>{earnError}</p>}

        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>

        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px",marginTop:"10px",width:"90%"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>倉位金額</p>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{position.avgPrice} USDT</p>
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px",marginTop:"10px",width:"90%"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>預計盈虧</p>
          <p style={{color:"#29A370",fontSize:"13px"}}>{predictEarning} USDT</p>
        </div>
        </div>
        <SelectInputContainer style={{ marginTop: 24 }}>
          <SelectTitle>止損</SelectTitle>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
          <SelectInput
            value={stopLoss}
            onChange={(e) => {
              if(localStorage.getItem("token")){
                if(parseFloat(e.target.value)){
                  let symbol = JSON.parse(localStorage.getItem("position")!).position.symbol
                    api.getData(`/order/position/stop-price?symbol=${symbol}&lossPrice=`+parseFloat(e.target.value)).then(x=>{
                      if(x.status === 400){
                        setLossError(x.data.msg)
                        setPredictLoss(0)

                      }else{
                        setPredictLoss(x.data)
                        setLossError("")

                      }
                    })
                }else if(e.target.value.length === 0 ){
                  setPredictLoss(0)
                  setLossError("")
                } 
              }           
              setStopLoss(e.target.value)
            }}
            type="text"
            placeholder="輸入止損價格"
          />
          <SelectContainer defaultValue="標記" style={{ width: 80 }} onChange={handleChange}>
              <Option value="標記">標記</Option>
          </SelectContainer>
        </div>
        </SelectInputContainer>
        {<p style={{fontSize:"12px",color:"#D32F2F",marginTop:"5px"}}>{lossError}</p>
}

        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px",marginTop:"10px",width:"90%"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>倉位金額</p>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>{position.avgPrice} USDT</p>
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"10px",marginTop:"10px",width:"90%"}}>
          <p style={{color:"#5f5c70",fontSize:"13px"}}>預計盈虧</p>
          <p style={{color:"#D32F2F",fontSize:"13px"}}>{predictLoss} USDT</p>
        </div>
        </div>

        <SubmitButton onClick={()=>{
          if(!localStorage.getItem("token")){
            alert("請先登入")
          }
          else if(!stopEarning && !stopLoss){
            alert("請輸入止盈或者止損價格")
          }else{
            setLoading(true)
            api.postData("/order/position/stop-price",{profitPrice:stopEarning ? stopEarning.toString(): null,lossPrice:stopLoss?stopLoss.toString():null,symbol:symbol}).then(x=>{
              setLoading(false)
              if(x.status === 400){
                alert(x.data.msg)
              }else{
                alert("設置成功")
                navigation(-1)
              }
            })
          }
        }}>送出</SubmitButton>
      </BodyContainer>
      <Drawer
        isVisible={salePriceDrawer}
        selectVisible={handleIsVisible}
        height={308}
      >
        <DepthTitle>{"賣出量"}</DepthTitle>
        <DepthItem
          isSelect={selectItem}
          index={0.1}
          onClick={handleMount.bind(null, 0.1)}
        >
          {`100% (0.1)`}
        </DepthItem>
        <DepthItem
          isSelect={selectItem}
          index={0.075}
          onClick={handleMount.bind(null, 0.075)}
        >
          {`75% (0.075)`}
        </DepthItem>
        <DepthItem
          isSelect={selectItem}
          index={0.05}
          onClick={handleMount.bind(null, 0.05)}
        >
          {`50% (0.05))`}
        </DepthItem>
        <DepthItem
          isSelect={selectItem}
          index={0.025}
          onClick={handleMount.bind(null, 0.025)}
        >
          {`25% (0.025)`}
        </DepthItem>
      </Drawer>
    </PageContainer>
    </LoadingOverlay>
  );
};

export default StopLoss;
