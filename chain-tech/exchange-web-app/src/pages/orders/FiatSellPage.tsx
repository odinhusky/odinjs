import React, { useState, useEffect } from "react";
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

const Contract = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const { t } = useTranslation();
  const [blockButton, setBlockButton] = useState(true);
  const [status, setStatus] = useState(0);
  const [id, setId] = useState("");
  const [ad, setAd] = useState({
    id: "",
    amount: 0,
    price: 0,
    quantity: 0
  });
  const navigation = useNavigate();

  const handlerModal = () => {
    setModalVisible(true);
  };

  const getStatus = () => {
    Api.get(
      `/otc/api/otcOrder/${JSON.parse(localStorage.getItem("sellItem")!).id}`
    ).then(x => {
      console.log(x);
      setStatus(x.status);
      setId(x.id);
    });
  };

  useEffect(() => {
    setBlockButton(false);
    setAd(JSON.parse(localStorage.getItem("sellItem")!));
  }, []);

  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("sellItem")!));
    Api.get(
      "/otc/api/otcOrder/" +
        JSON.parse(localStorage.getItem("sellItem")!).id +
        "/payments/"
    ).then(x => {
      // console.log(x)
    });
    getStatus();
    const interval = setInterval(() => {
      Api.get(
        `/otc/api/otcOrder/${JSON.parse(localStorage.getItem("sellItem")!).id}`
      ).then(x => {
        console.log(x);
        setStatus(x.status);
        setId(x.id);
        localStorage.setItem("sellResult", JSON.stringify(x));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === -1) {
      alert("訂單已取消");
      navigation(-1);
    }
    if (status === -2) {
      alert("訂單申訴中");
      navigation(-1);
    }
    if (status === 2) {
      navigation("/orders/fiatSellComplete");
    }
  }, [status, navigation]);

  const Modalhandler = (status: string) => {
    if (status === "confirm") {
      Api.post(`/otc/api/otcOrder/${ad.id}/confirm`).then(x => {
        console.log(x);
        if (x.status !== 400) {
          // navigation("/fiat-orders")
        } else {
          alert(x.data.msg);
        }
      });
    } else {
      setModalVisible(v => !v);
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            src={Cancel}
            alt="cancel"
            onClick={() => {
              navigation("/fiat-orders");
            }}
          />
        </HeaderLeft>
        <HeaderRight>
          <SetButton>{t("fiatBuy")} USDT</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <PayContentContainer>
        <TitleContainer>
          <PayTitle>
            {status === 4 && "請確認交易"}
            {status === 0 && t("waitBuyerPay")}
            {status === 1 && "請放行"}
            {status === 3 && t("fiatBuyerCheck2")}
            {/* {"確認買方已付款，請放行"} */}
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
              NT$<p style={{ marginLeft: 4, fontSize: 24 }}>{ad.amount}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 18 }}>
            <PayContentItemName>{t("amount")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
              {ad.quantity}
            </PayContentItemContent>
          </PayContentDesContainerItem>
          <PayContentDesContainerItem style={{ marginTop: 20 }}>
            <PayContentItemName>{t("unitPrice")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Dark_gray }}>
              NT$<p style={{ marginLeft: 4 }}>{ad.price}</p>
            </PayContentItemContent>
          </PayContentDesContainerItem>
        </PayContentDesContainer>
        <TitleContainer
          style={{
            margin: `20% 0 0 0`,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {status !== 1 ? (
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
          {status === 0 && (
            <PayConfirmButton
              progressOrder={2}
              onClick={handlerModal}
              disabled={blockButton}
            >
              {t("paidAndTransfer")}
            </PayConfirmButton>
          )}
          {status === 4 && (
            <PayConfirmButton
              progressOrder={2}
              onClick={() => {
                Api.postData(`/otc/api/otcOrder/${id}/check`).then(x => {
                  console.log(x);
                  getStatus();
                });
              }}
            >
              確認交易
            </PayConfirmButton>
          )}
          {status === 1 && (
            <PayConfirmButton
              progressOrder={2}
              onClick={handlerModal}
              disabled={blockButton}
            >
              {t("paidAndTransfer")}
            </PayConfirmButton>
          )}
          {status === 3 && (
            <PayConfirmButton
              progressOrder={2}
              onClick={handlerModal}
              disabled={true}
            >
              {t("fiatBuyerCheck2")}
            </PayConfirmButton>
          )}
        </TitleContainer>
        {modalVisible && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>{t("transferToken")}</ConfirmContentTitle>
                <ConfirmContent>
                {t("receiveMoneyTransfer")}
                </ConfirmContent>
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
                    Api.postData(`/otc/api/otcOrder/${ad.id}/cancel`, {
                      id: ad.id
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
