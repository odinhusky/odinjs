import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface Future {
  orderId:string	
  owner:string	
  side:string
  symbol:string	
  status:string	
  origQty:number	
  avgPrice:number
  executedQty:number
  price:number
  type:string	
  positionSide:string
  leverage:number
  createdDate:number	
}

const Card: React.FC<{
  setStopLossStopEarn: Dispatch<SetStateAction<boolean>>;
  setRevokeIsVisual: Dispatch<SetStateAction<boolean>>;
  data:Future
  setOrderId
  balance
}> = ({ setStopLossStopEarn, setRevokeIsVisual,data,setOrderId,balance }) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
        justifyContent: "space-between",
        padding: "0px 0 16px 0",
        borderBottom: "1px solid #F4F4F6",
        marginBottom: 16,
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            color: data.side === "BUY" ? "#29A370" :"#D32F2F",
            fontSize: 20,
            fontWeight: 700,
            fontFamily:"Open Sans"
          }}
        >
        {data.symbol.split("-")[0]+"/"+data.symbol.split("-")[1]}
        </p>
      </div>
      <p style={{marginBottom:"10px",color:"#5F5C70",fontSize:"12px"}}>{`${new Date(data.createdDate).getFullYear()}-${new Date(data.createdDate).getMonth() < 10 ? "0"+(new Date(data.createdDate).getMonth()+1) : new Date(data.createdDate).getMonth()+1}-${new Date(data.createdDate).getDate()} ${new Date(data.createdDate).getHours()}:${new Date(data.createdDate).getMinutes() < 10 ? "0"+new Date(data.createdDate).getMinutes() :new Date(data.createdDate).getMinutes() }`}</p>
      <div
        style={{
          width: "100%",
          height: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: 101 }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("tradeType")}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight: 600,fontFamily:"Open Sans" }}>
            {(data.type === "MARKET" ? t("marketOrder") : data.type === "STOP_MARKET"  ? t("stopMarketOrder") : data.type === "STOP_LIMIT" ? t("stopLimitOrder"):t("limitedOrder") )+ (data.side === "BUY" ? "/"+t("buyOrder"):"/"+t("sellOrder"))} 
            </p> 
          </div>
          <div style={{ width: 101 }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("orderSize")}{`(BTC)`}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight: 600,fontFamily:"Open Sans" }}>
              {data.origQty}
            </p>
          </div>
          <div style={{ width: 101 }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("dealRate")}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight: 600,fontFamily:"Open Sans" }}>
              {0}
            </p>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: 101 }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("conditionPrice")}{`(USDT)`}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight:600,fontFamily:"Open Sans" }}>
              {0}
            </p>
          </div>
          <div style={{ width: 101 }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("orderPrice")}{`(USDT)`}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight: 600,fontFamily:"Open Sans" }}>
              {data.price}
            </p>
          </div>
          <div style={{ width: 101 }}>
          <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5,
              }}
            >
              {t("orderStatus")}
            </p>
            <p style={{ fontSize: 13, color: "#5F5C70", fontWeight: 600,fontFamily:"Open Sans" }}>
              {data.status === "DEAL" ? t("orderFilled"): data.status === "CANCEL" ? "已撤銷" : "已建立"}
            </p>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Card;
