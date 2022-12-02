import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/Deal/backArrow.png";
// import payment from "../../assets/icon/Deal/payment.png";
import Modal from "../../components/UI/CoverModal";
import Api from "../../common/api";
import { useTranslation } from "react-i18next";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 4px;
`;
const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;
const SelectIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const SetButton = styled.div`
  text-align: center;
  color: ${COLORS.Dark_gray};
  font-weight: 600;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const ProgressBar = styled.div`
  width: 119px;
  height: 4px;
  background: #ff786b;
  border-radius: 0px 2px 2px 0px;
`;

const PayContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 21px 16px;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PayTitle = styled.p`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  color: #383743;
`;
// const PayContent = styled.p`
//   font-weight: 500;
//   font-size: 13px;
//   line-height: 20px;
//   letter-spacing: 0.4px;
//   color: #8f8da2;
// `;

// const PayTitleIcon = styled.img`
//   width: 28px;
//   height: 28px;
// `;

// const PayDeadTimeTitleContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 5px;
// `;

// const PayDeadTimeTitle = styled.p`
//   font-weight: 500;
//   font-size: 13px;
//   line-height: 20px;
//   display: flex;
//   align-items: center;
//   letter-spacing: 0.4px;
//   color: #8f8da2;
//   margin-right: 8px;
// `;

// const PayDeadTime = styled.p`
//   font-weight: 700;
//   font-size: 16px;
//   line-height: 20px;
//   display: flex;
//   align-items: center;
//   letter-spacing: 0.004em;
//   color: #383743;
// `;

const PayContentDesContainer = styled.div`
  width: 100%;
  padding: 17px 16px 24px 16px;
  border-radius: 8px;
`;

const PayContentDesContainerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PayContentItemName = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: #5f5c70;
  display: flex;
  flex-direction: column;
`;

const PayContentItemContent = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  letter-spacing: 0.004em;
  display: flex;
  align-items: flex-end;
`;

const PayConfirmButton = styled.button<{ progressOrder: number }>`
  border: none;
  width: 240px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background: ${COLORS.Red};
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #fff;
`;

const ConfirmContainer = styled.div`
  width: 270px;
  height: 140px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  margin-bottom: 20%;
`;
const ConfirmContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;
const ConfirmContentTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #262626;
  margin: 0 0 8px 0;
`;
const ConfirmContent = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #595959;
`;
const ConfirmCheckbox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CheckboxCancel = styled.div`
  margin-top: 16px;
  width: 50%;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #8c8c8c;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
`;
const CheckboxConfirm = styled.div`
  margin-top: 16px;
  width: 50%;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #296df1;
`;

const CancelButton = styled.button`
  border: none;
  width: 87px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background: #f4f4f6;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #5f5c70;
`;

const Contract: React.FC<{
  progressOrder: number;
  setProgressOrder: Dispatch<SetStateAction<number>>;
  setClickButton: Dispatch<SetStateAction<boolean>>;
  amount: number;
  number: number;
  id: string;
  price: string;
}> = ({
  progressOrder,
  setProgressOrder,
  setClickButton,
  amount,
  number,
  id,
  price
}) => {
  const [orderComplete, setOrderComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [blockButton, setBlockButton] = useState(true);
  const [orderStatus, setOrderStatus] = useState(0);
  const { t } = useTranslation();
  const handlerModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    setBlockButton(false);
  }, []);

  const navigation = useNavigate();

  const Modalhandler = (status: string) => {
    if (status === "confirm") {
      Api.post(`/otc/api/otcOrder/${id}/confirm`).then(x => {
        console.log(x);
        if (x.status !== 400) {
          setOrderComplete(true);
          navigation("/deal/fiatSellComplete");
          console.log("order is complete", orderComplete);
        } else {
          alert(x.data.msg);
        }
      });
    } else {
      setModalVisible(v => !v);
    }
  };

  useEffect(() => {
    Api.get(`/otc/api/otcOrder/${id}`).then(x => {
      setOrderStatus(x.status);
    });
    const interval = setInterval(() => {
      Api.get(`/otc/api/otcOrder/${id}`).then(x => {
        setOrderStatus(x.status);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);
  useEffect(() => {
    if (orderStatus === -1) {
      alert("訂單已取消");
      navigation(-1);
    }
    if (orderStatus === -2) {
      alert("訂單申訴中");
      navigation(-1);
    }
    if (orderStatus === 2) {
      navigation("/orders/fiatSellComplete");
    }
  }, [orderStatus, navigation]);
  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            src={Cancel}
            alt="cancel"
            onClick={() => {
              setProgressOrder(0);
              setClickButton(false);
            }}
          />
        </HeaderLeft>
        <HeaderRight>
          <SetButton>{t("fiatBuy")} USDT</SetButton>
        </HeaderRight>
        <ProgressBarContainer>
          <ProgressBar />
          {<ProgressBar />}
          {<ProgressBar style={{ background: "#fff" }} />}
        </ProgressBarContainer>
      </HeaderContainer>
      <PayContentContainer>
        <TitleContainer>
          <PayTitle>
            {orderStatus === 3 && t("fiatBuyerCheck2")}
            {orderStatus === 4 && "請確認交易"}
            {orderStatus === 0 && t("waitBuyerPay")}
            {orderStatus === 1 && "請放行"}
          </PayTitle>
          {/* <PayDeadTimeTitleContainer>
            <PayDeadTimeTitle>剩餘時間</PayDeadTimeTitle>
            <PayDeadTime>{`${Math.floor(980 / 60)}:${980 % 60}`}</PayDeadTime>
          </PayDeadTimeTitleContainer> */}
        </TitleContainer>
        <PayContentDesContainer
          style={{ background: "rgb(244, 244, 246, 0.6)", marginTop: 16 }}
        >
          <PayContentDesContainerItem>
            <PayContentItemName>{t("fiatTotal")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Green }}>
              NT$<p style={{ marginLeft: 4, fontSize: 24 }}>{amount}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          {
            <PayContentDesContainerItem style={{ marginTop: 18 }}>
              <PayContentItemName>{t("amount")}</PayContentItemName>
              <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
                {JSON.parse(localStorage.getItem("sellResult")!).quantity}
              </PayContentItemContent>
            </PayContentDesContainerItem>
          }
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("unitPrice")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
              NT$<p style={{ marginLeft: 4 }}>{price}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
        </PayContentDesContainer>
        {/* <TitleContainer style={{ marginTop: 24 }}>
          <PayTitle style={{ fontSize: 16 }}>付款方式</PayTitle>
          {progressOrder === 1 && (
            <PayContent>等待買方選擇欲付款方式並完成付款</PayContent>
          )}
        </TitleContainer> */}
        {/* {progressOrder === 2 && (
          <>
            <TitleContainer
              style={{
                marginTop: 24,
                flexDirection: "row",
                alignItems: "center",
                padding: "0 0 10px 0",
              }}
            >
              <PayTitleIcon src={payment} alt="bank" />
              <PayTitle style={{ fontSize: 16 }}>{t("fiatOrderNum")}</PayTitle>
            </TitleContainer>
            <PayContentDesContainer
              style={{
                background: "#fff",
                padding: "0px 0 20px 0",
              }}
            >
              <PayContentDesContainerItem>
                <PayContentItemName
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.Mid_gray,
                  }}
                >
                  帳戶姓名
                </PayContentItemName>
                <PayContentItemContent
                  style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                >
                  劉以彤
                </PayContentItemContent>
              </PayContentDesContainerItem>
              <PayContentDesContainerItem style={{ marginTop: 14 }}>
                <PayContentItemName
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.Mid_gray,
                  }}
                >
                  {t("bankName")}
                </PayContentItemName>
                <PayContentItemContent
                  style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                >
                  {`807 永豐銀行`}
                </PayContentItemContent>
              </PayContentDesContainerItem>
              <PayContentDesContainerItem style={{ marginTop: 14 }}>
                <PayContentItemName
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.Mid_gray,
                  }}
                >
                  銀行帳號
                </PayContentItemName>
                <PayContentItemContent
                  style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                >
                  {`0000194612644252`}
                </PayContentItemContent>
              </PayContentDesContainerItem>
            </PayContentDesContainer>
          </>
        )} */}
        <TitleContainer
          style={{
            margin: `20% 0 0 0`,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {orderStatus !== 1 ? (
            <CancelButton
              onClick={() => {
                setModalVisible2(true);
              }}
            >
              {t("fiatCancelOrder")}
            </CancelButton>
          ) : (
            <CancelButton
              onClick={() => {
                setModalVisible3(true);
              }}
            >
              {t("apeal")}
            </CancelButton>
          )}

          {orderStatus === 0 && (
            <PayConfirmButton
              progressOrder={progressOrder}
              onClick={handlerModal}
              disabled={blockButton}
            >
              {t("paidAndTransfer")}
            </PayConfirmButton>
          )}
          {orderStatus === 1 && (
            <PayConfirmButton
              progressOrder={progressOrder}
              onClick={handlerModal}
              disabled={blockButton}
            >
              {t("paidAndTransfer")}
            </PayConfirmButton>
          )}
          {orderStatus === 3 && (
            <PayConfirmButton
              progressOrder={progressOrder}
              onClick={handlerModal}
              disabled={true}
            >
              {t("fiatBuyerCheck2")}
            </PayConfirmButton>
          )}
          {orderStatus === 4 && (
            <PayConfirmButton
              progressOrder={progressOrder}
              onClick={handlerModal}
              disabled={true}
            >
              確認交易
            </PayConfirmButton>
          )}
        </TitleContainer>
        {modalVisible && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>{t("transferToken")}</ConfirmContentTitle>
                <ConfirmContent>{t("receiveMoneyTransfer")}</ConfirmContent>
              </ConfirmContentContainer>
              <ConfirmCheckbox>
                <CheckboxCancel onClick={Modalhandler.bind(null, "cancel")}>
                {t("cancel")}
                </CheckboxCancel>
                <CheckboxConfirm onClick={Modalhandler.bind(null, "confirm")}>
                {t("OK")}
                </CheckboxConfirm>
              </ConfirmCheckbox>
            </ConfirmContainer>
          </Modal>
        )}
        {modalVisible2 && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>{"確定取消？"}</ConfirmContentTitle>
                <ConfirmContent>
                  {
                    "惡意取消訂單若達到 3 次或更多，您帳戶的部分功能將暫時禁用。"
                  }
                </ConfirmContent>
              </ConfirmContentContainer>
              <ConfirmCheckbox>
                <CheckboxCancel
                  onClick={() => {
                    setModalVisible2(false);
                  }}
                >
                  {t("cancel")}
                </CheckboxCancel>
                <CheckboxConfirm
                  onClick={() => {
                    Api.postData(`/otc/api/otcOrder/${id}/cancel`, {
                      id: id
                    }).then(x => {
                      if (x.status !== 400 && x.status !== 403) {
                        navigation("/fiat-orders");
                      } else {
                        if (x.data.msg === "訂單狀態錯誤") {
                          alert("訂單逾時請重新下訂");
                        } else {
                          alert(x.data.msg);
                        }
                      }
                    });
                  }}
                >
                  {t("OK")}
                </CheckboxConfirm>
              </ConfirmCheckbox>
            </ConfirmContainer>
          </Modal>
        )}
        {modalVisible3 && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>{t("sureApeal")}</ConfirmContentTitle>
                <ConfirmContent>
                  {
                    "惡意申訴訂單若達到 3 次或更多，您帳戶的部分功能將暫時禁用。"
                  }
                </ConfirmContent>
              </ConfirmContentContainer>
              <ConfirmCheckbox>
                <CheckboxCancel
                  onClick={() => {
                    setModalVisible2(false);
                  }}
                >
                  {t("cancel")}
                </CheckboxCancel>
                <CheckboxConfirm
                  onClick={() => {
                    Api.postData(`/otc/api/otcOrder/${id}/appeal`, {
                      id: id
                    }).then(x => {
                      if (x.status !== 400 && x.status !== 403) {
                        navigation("/fiat-orders");
                      } else {
                        if (x.data.msg === "訂單狀態錯誤") {
                          alert("訂單逾時請重新下訂");
                        } else {
                          alert(x.data.msg);
                        }
                      }
                    });
                  }}
                >
                  {t("OK")}
                </CheckboxConfirm>
              </ConfirmCheckbox>
            </ConfirmContainer>
          </Modal>
        )}
      </PayContentContainer>
    </>
  );
};

export default Contract;
