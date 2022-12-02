import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface Position {
  positionId: string;
  owner: string;
  side: string;
  status: string;
  leverage: number;
  symbol: string;
  tagPrice: number;
  securityDeposit: number;
  profitAndLoss: number;
  type: string;
  avgPrice: number;
  quantity: number;
  margin: number;
  forceClose: number;
}

const Card: React.FC<{
  setCurrencyOption: Dispatch<SetStateAction<number>>;
  data: Position;
  getPosition;
  setLoading;
  getBalance;
  remark;
}> = ({
  setCurrencyOption,
  data,
  getPosition,
  setLoading,
  getBalance,
  remark
}) => {
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
        textAlign: "left"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <div>
          <p
            style={{
              color: data.side === "BUY" ? "#29A370" : "#D32F2F",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 5,
              fontFamily: "Open Sans"
            }}
          >
            {`${data.side === "BUY" ? "多 " : "空 "}` +
              data.symbol.split("-")[0] +
              "/" +
              data.symbol.split("-")[1]}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#5F5C70",
              fontWeight: 600,
              fontFamily: "Open Sans"
            }}
          >
            {data.type === "FULL" ? t("crossPosition") : t("isolatedPosition")}
            {data.leverage + "X"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              marginBottom: 5,
              fontSize: 15,
              color: "#8F8DA2",
              fontWeight: 400
            }}
          >
            {t("pnlU")}
          </p>
          <p
            style={
              data.profitAndLoss >= 0
                ? {
                    fontSize: 15,
                    color: "#29A370",
                    fontWeight: 600,
                    fontFamily: "Open Sans"
                  }
                : {
                    fontSize: 15,
                    color: "#D32F2F",
                    fontWeight: 600,
                    fontFamily: "Open Sans"
                  }
            }
          >
            {data.profitAndLoss}
          </p>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          // height: 130,
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
          justifyContent: "space-between",
          marginBottom: 12
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div style={{ width: "25%" }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5
              }}
            >
              {t("positionSize")}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#5F5C70",
                fontWeight: 600,
                fontFamily: "Open Sans"
              }}
            >
              {data.quantity}
            </p>
          </div>
          <div style={{ width: "25%" }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5
              }}
            >
              {t("entryPrice")}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#5F5C70",
                fontWeight: 600,
                fontFamily: "Open Sans"
              }}
            >
              {data.avgPrice &&
                data.avgPrice
                  .toString()
                  .substring(0, data.avgPrice.toString().indexOf(".") + 3)}
            </p>
          </div>
          <div style={{ width: "25%" }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5
              }}
            >
              {t("marketPrice")}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#5F5C70",
                fontWeight: 600,
                fontFamily: "Open Sans"
              }}
            >
              {remark && remark.slice(0, -4)}
            </p>
          </div>
          <div style={{ width: "25%" }}>
            <p
              style={{
                fontSize: 12,
                color: "#8F8DA2",
                fontWeight: 400,
                marginBottom: 5
              }}
            >
              {t("liqPrice")}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#5F5C70",
                fontWeight: 600,
                fontFamily: "Open Sans"
              }}
            >
              {data.forceClose &&
                data.forceClose
                  .toString()
                  .substring(0, data.forceClose.toString().indexOf(".") + 3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
