import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import payment from "../../assets/icon/Deal/payment.png";
import check from "../../assets/icon/Deal/selected.png";
import cancelDrawer from "../../assets/icon/cancel.png";
import qr_code from "../../assets/icon/Deal/qr_code.png";
import Drawer from "../../components/UI/Drawer";
import Modal from "../../components/UI/CoverModal";
import api from "../../common/api";
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

const PayTitleIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const CheckIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-left: auto;
`;

const PayDeadTimeTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const PayDeadTimeTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  color: #8f8da2;
  margin-right: 8px;
`;

const PayDeadTime = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.004em;
  color: #383743;
`;

const PayContentDesContainer = styled.div<{ index: number; active: number }>`
  width: 100%;
  padding: 17px 16px 24px 16px;
  border-radius: 8px;
`;

const PayContentDesContainer2 = styled.div`
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

const PayContentItemSplit = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
`;

const CancelButton = styled.button<{ progressOrder: number }>`
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
  opacity: ${props => (props.progressOrder === 2 ? 0.5 : 1)};
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
  opacity: ${props => (props.progressOrder === 2 ? 0.5 : 1)};
`;

const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DrawerTitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QrcodeIcon = styled.img`
  width: 137px;
  height: 137px;
  margin-top: 47px;
  margin-bottom: 24px;
`;

const DrawerTitleDescription = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  color: #8f8da2;
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

const Contract = () => {
  const [paymentOpretion, setPaymentOpretion] = useState(0);
  const [orderStatus, setOrderStatus] = useState(0);
  const { t } = useTranslation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [blackButton, setBlackButton] = useState(false);
  const [ad, setAd] = useState({
    amount: 0,
    paymentTimeLimit: 0,
    id: "",
    sellUser: "",
    quantity: 0,
    price: 0
  });
  const [status, setStatus] = useState(0);
  const [id, setId] = useState("");
  const [paymentList, setPaymentList] = useState([]);
  const [usePayment, setUsePayment] = useState({});
  const handlerDrawer = () => {
    setDrawerVisible(v => !v);
  };
  const handlerModal = (status: number) => {
    setModalVisible(v => !v);
    setOrderStatus(status);
  };

  const navigation = useNavigate();

  const Modalhandler = (status: number, action: number) => {
    setModalVisible(v => !v);
    if (status) {
      !!action && setBlackButton(true);
      !!action && setTimeout(() => navigation("/deal/fiatBuyComplete"), 1000);
    } else {
    }
  };
  const getStatus = () => {
    api
      .get(
        `/otc/api/otcOrder/${JSON.parse(localStorage.getItem("buyItem")!).id}`
      )
      .then(x => {
        console.log(x);
        setStatus(x.status);
        setId(x.id);
      });
  };
  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("buyItem")!));
    api
      .get(
        "/otc/api/otcOrder/" +
          JSON.parse(localStorage.getItem("buyItem")!).id +
          "/payments/"
      )
      .then(x => {
        // console.log(x)
        setUsePayment(x[0]);
        setPaymentList(x);
      });
    getStatus();
    const interval = setInterval(() => {
      api
        .get(
          `/otc/api/otcOrder/${JSON.parse(localStorage.getItem("buyItem")!).id}`
        )
        .then(x => {
          // console.log(x)
          setStatus(x.status);
          setId(x.id);
          localStorage.setItem("buyResult", JSON.stringify(x));
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
      navigation("/orders/fiatBuyComplete");
    }
  }, [status, navigation]);
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
          <SetButton>{t("fiatBuy")} USD</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <PayContentContainer>
        <TitleContainer>
          <PayTitle>
            {status === 4 && t("waitSellerConfirm")}
            {status === 3 && "請確認交易"}
            {status === 0 && "請付款"}
            {status === 1 && t("waitSellerTransfer")}
          </PayTitle>
          <PayDeadTimeTitleContainer>
            <PayDeadTimeTitle>{t("payIn")}</PayDeadTimeTitle>
            <PayDeadTime>
              {ad.paymentTimeLimit / 1000 / 60}
              {t("minutesPay")}
            </PayDeadTime>
          </PayDeadTimeTitleContainer>
        </TitleContainer>
        <PayContentDesContainer2
          style={{ background: "rgb(244, 244, 246, 0.6)", marginTop: 16 }}
        >
          <PayContentDesContainerItem>
            <PayContentItemName>{t("fiatTotal")}</PayContentItemName>
            <PayContentItemContent style={{ color: COLORS.Red }}>
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
        </PayContentDesContainer2>
        <TitleContainer style={{ marginTop: 24 }}>
          <PayTitle style={{ fontSize: 16 }}>{t("payments")}</PayTitle>
        </TitleContainer>
        <PayContentDesContainer2
          style={{
            background: "rgb(255, 120, 107,0.07)",
            border: "1px solid rgb(153, 0, 7,0.07)",
            padding: 16,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "20px",
            letterSpacing: "0.4px",
            color: "#5F5C70",
            marginTop: 10
          }}
        >
          {t("fiatPayMsg")}。
        </PayContentDesContainer2>
        {paymentList.map((x: any, index) => {
          return (
            <>
              <TitleContainer
                style={{
                  marginTop: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "0 0 10px 0"
                }}
                onClick={() => {
                  setPaymentOpretion(index);
                  setUsePayment(x);
                }}
              >
                <PayTitleIcon src={payment} alt="bank" />
                <PayTitle style={{ fontSize: 16 }}>{x.name}</PayTitle>
                {index === paymentOpretion && (
                  <CheckIcon src={check} alt="bank" />
                )}
              </TitleContainer>
              {index === paymentOpretion && (
                <PayContentDesContainer
                  index={index}
                  active={paymentOpretion}
                  style={{
                    background: "#fff",
                    padding: "0px 0 20px 0"
                  }}
                >
                  <PayContentDesContainerItem>
                    <PayContentItemName
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: COLORS.Mid_gray
                      }}
                    >
                      帳戶姓名
                    </PayContentItemName>
                    <PayContentItemContent
                      style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                    >
                      {x.name}
                    </PayContentItemContent>
                  </PayContentDesContainerItem>
                  <PayContentDesContainerItem style={{ marginTop: 14 }}>
                    <PayContentItemName
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: COLORS.Mid_gray
                      }}
                    >
                      {t("bankName")}
                    </PayContentItemName>
                    <PayContentItemContent
                      style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                    >
                      {x.code}
                    </PayContentItemContent>
                  </PayContentDesContainerItem>
                  <PayContentDesContainerItem style={{ marginTop: 14 }}>
                    <PayContentItemName
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: COLORS.Mid_gray
                      }}
                    >
                      {t("accountNum")}
                    </PayContentItemName>
                    <PayContentItemContent
                      style={{ fontWeight: 400, color: COLORS.Dark_gray }}
                    >
                      {x.account}
                    </PayContentItemContent>
                  </PayContentDesContainerItem>
                </PayContentDesContainer>
              )}
            </>
          );
        })}
        <PayContentItemSplit />

        <TitleContainer
          style={{
            margin: "10px 0 100px 0",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <CancelButton
            progressOrder={1}
            onClick={() => {
              setModalVisible2(true);
            }}
            disabled={blackButton}
          >
            {t("fiatCancelOrder")}
          </CancelButton>
          {status === 0 && (
            <PayConfirmButton
              progressOrder={1}
              onClick={() => {
                handlerModal(1);
                // handlerModal(1);

                //
              }}
              disabled={blackButton}
            >
              {t("paidAndNext")}
            </PayConfirmButton>
          )}
          {status === 3 && (
            <PayConfirmButton
              progressOrder={1}
              onClick={() => {
                // handlerModal(1);
                // handlerModal(1);
                //
                api.postData(`/otc/api/otcOrder/${id}/check`).then(x => {
                  console.log(x);
                  getStatus();
                });
              }}
            >
              {"確認交易"}
            </PayConfirmButton>
          )}
          {status === 1 && (
            <PayConfirmButton
              progressOrder={1}
              onClick={() => {
                // handlerModal(1);
                // handlerModal(1);
                //
              }}
              disabled={true}
            >
              {t("waitSellerTransfer")}
            </PayConfirmButton>
          )}
          {status === 4 && (
            <PayConfirmButton
              progressOrder={1}
              onClick={() => {
                // handlerModal(1);
                // handlerModal(1);
                //
              }}
              disabled={true}
            >
              {"等待賣家確認交易"}
            </PayConfirmButton>
          )}
        </TitleContainer>
        <Drawer
          isVisible={drawerVisible}
          selectVisible={handlerDrawer}
          height={351}
        >
          <DrawerContainer>
            <DrawerTitleContainer>
              <DepthTitle>{t("orderType")}</DepthTitle>
              <CheckIcon
                src={cancelDrawer}
                alt="bank"
                onClick={handlerDrawer}
              />
            </DrawerTitleContainer>
            <QrcodeIcon src={qr_code} alt="qr_code" />
            <DrawerTitleDescription>
              街口用戶掃描此行動條碼後，即可進行付款。
            </DrawerTitleDescription>
          </DrawerContainer>
        </Drawer>
        {modalVisible && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>
                  {t("paidYet")}
                  {/* {!!orderStatus ? "確定已完成付款？" : "確定取消訂單？"} */}
                </ConfirmContentTitle>
                <ConfirmContent>
                  {t("payConfirmMsg")}
                  {/* {!!orderStatus
                    ? "請確定您已向賣方完成付款，惡意點擊系統將直接凍結您的賬戶。"
                    : "惡意取消訂單若達到 3 次或更多，您帳戶的部分功能將暫時禁用。"} */}
                </ConfirmContent>
              </ConfirmContentContainer>
              <ConfirmCheckbox>
                <CheckboxCancel
                  onClick={() => {
                    Modalhandler(orderStatus, 0);
                  }}
                >
                  {t("cancel")}
                </CheckboxCancel>
                <CheckboxConfirm
                  onClick={() => {
                    api
                      .postData(`/otc/api/otcOrder/${ad.id}/paid`, {
                        payment: usePayment
                      })
                      .then(x => {
                        if (x.status !== 400 && x.status !== 403) {
                          setModalVisible(false);
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
                    api
                      .postData(`/otc/api/otcOrder/${ad.id}/cancel`, {
                        id: ad.id
                      })
                      .then(x => {
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
