import { useState, Dispatch, SetStateAction, useEffect } from "react";
import Footer from "../footer/HomeFooter";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import BackIcon from "../../assets/icon/Deal/backArrow.png";
import add from "../../assets/icon/Deal/add.png";
import payment from "../../assets/icon/Deal/payment.png";
// import line_pay from "../../assets/icon/Deal/line_pay.png";
import coolicon from "../../assets/icon/Deal/coolicon.png";
// import arrowRight from "../../assets/icon/Deal/arrowRight.png";
import Drawer from "../UI/Drawer";
import cancel from "../../assets/icon/cancel.png";
import uploadqrcode from "../../assets/icon/Deal/uploadqrcode.png";
import qr_code from "../../assets/icon/Deal/qr_code.png";
import api from "../../common/api";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
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
`;
const AddImage = styled.img`
  width: 28px;
  height: 29px;
  margin-left: 12px;
`;
const AddPayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
`;
const AddPayTitle = styled.p`
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;
const AddPayItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 32px;
`;
const AddPayContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const AddPayIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 16.6px;
`;
const AddPayContent = styled.p`
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;
const AddPayContentDes = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Mid_gray};
`;
const TradeFunctionCheckBox = styled.div<{ check: boolean; id: string }>`
  width: 18px;
  height: 18px;
  background-color: ${props => (props.check ? "#5F5C70" : "#fff")};
  border: 1.5px solid #dedde3;
  border-radius: 9px;
  margin: 0 0 0 auto;
`;
const CheckItemIcon = styled.img`
  width: 18px;
  height: 18px;
  margin: 0 0 0 auto;
`;

const BodyContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #f4f4f6;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
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
const SelectAD = styled.div`
  height: 48px;
  width: 100%;
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 16px;
  color: ${COLORS.Dark_gray};
  border-radius: 4px;
  letter-spacing: 0.004em;
  line-height: 24px;
`;
const SelectInput = styled.input`
  height: 48px;
  width: 100%;
  border: none;
  background: rgb(244, 244, 246, 0.6);
  padding: 12px 16px;
  color: ${COLORS.Dark_gray};
  border-radius: 4px;
  padding-right: 18%;
  letter-spacing: 0.004em;
`;
// const InputLabelIcon = styled.img`
//   height: 12px;
//   width: 7.5px;
//   position: absolute;
//   bottom: 18px;
//   right: 22px;
// `;
const SubmitButton = styled.button`
  margin-top: 50px;
  border: none;
  width: 100%;
  height: 44px;
  color: #fff;
  background: ${COLORS.Red};
  border-radius: 4px;
`;
const AddPayWayContaier = styled.div`
  height: 100%;
  width: 100%;
  background: #fff;
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
  height: 220px;
  overflow: scroll;
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
const UploadImageIcon = styled.img`
  width: 141px;
  height: 141px;
  margin: 60px auto 0 auto;
`;

const FiatAdDealHint: React.FC<{
  payArray: string[];
  setPayArray: Dispatch<SetStateAction<any>>;
  setAddPayDetail: Dispatch<SetStateAction<any>>;
  setAddPayWayStatus: Dispatch<SetStateAction<boolean>>;
  setAddPaySecess: Dispatch<SetStateAction<boolean>>;
}> = ({
  payArray,
  setPayArray,
  setAddPayDetail,
  setAddPayWayStatus
  // setAddPaySecess,
}) => {
  const [userName, setUserName] = useState("");
  const [accountBank, setAccountBank] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [payMethod, setPayMethod] = useState("銀行轉帳");
  const [payConfirmMethod, setPayConfirmMethod] = useState("");

  const [addPayway, setAddPayway] = useState(false);
  const [payWayDrawer, setPayWayDrawer] = useState(false);
  const [uploadQrCode, setUploadQrCode] = useState(false);
  // const navigation = useNavigate()
  const { t } = useTranslation();
  const payWayDrawerHandler = () => {
    setPayWayDrawer(v => !v);
  };
  const submitHandler = () => {
    setAddPayDetail({
      userName,
      accountBank,
      userAccount,
      payMethod: payConfirmMethod
    });
    if (!localStorage.getItem("token")) {
      alert("請先登入");
    } else {
      if (!userName) {
        alert("請輸入帳號名稱");
      } else if (!accountBank) {
        alert("請輸入銀行代碼");
      } else if (!userAccount) {
        alert("請輸入銀行帳號");
      } else {
        api
          .postData("/user/payment", {
            type: "BANK",
            name: userName,
            code: accountBank,
            account: userAccount
          })
          .then(x => {
            if (x.status !== 400) {
              alert("新增成功");
              // setAddPayWayStatus(false);
              // setAddPaySecess(true);
              getAccount();
              setAddPayway(false);
            } else {
              alert(x.data.msg);
            }
          });
      }
    }
  };

  const [paymentArr, setPaymentArr] = useState([]);
  const [, setPaymentArr2] = useState([{ id: "" }]);
  const [checkedState, setCheckedState] = useState(
    new Array(paymentArr.length).fill(false)
  );
  // const [id,setId] = useState("")
  const getAccount = () => {
    api.get("/user/payment").then(x => {
      console.log(x);
      setPaymentArr(x.data);
      setPaymentArr2(x.data);
      let a: any = [];
      let b: any = [];
      b = JSON.parse(localStorage.getItem("EditAd")!).payments;
      for (let i = 0; i < x.data.length; i++) {
        console.log(x.data);
        const index = b.findIndex(object => {
          return object.id === x.data[i].id;
        });
        if (index !== -1) {
          a.push(true);
        } else {
          a.push(false);
        }
        // for(let j = 0 ; j < b.length;j++){
        //   console.log(paymentArr2[i].id )
        //   console.log(b[j].id )
        //   if(paymentArr2[i].id === b[j].id){
        //     a.push(true)
        //   }else{
        //     a.push(false)
        //   }
        // }
      }
      setCheckedState(a);
    });
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAccount();
    }
    // console.log(JSON.parse(localStorage.getItem("EditAd")!).payments[1].id)
  }, []);
  useEffect(() => {
    setCheckedState(new Array(paymentArr.length).fill(false));
  }, [paymentArr]);

  return (
    <>
      {addPayway ? (
        <AddPayWayContaier>
          <HeaderContainer>
            <HeaderLeft>
              <NavImage
                src={BackIcon}
                alt="language"
                onClick={() => {
                  setAddPayway(false);
                }}
              />
              <LogoImage>{"新增付款方式"}</LogoImage>
            </HeaderLeft>
          </HeaderContainer>
          <BodyContainer>
            <SelectInputContainer
            // onClick={() => {
            //   setPayWayDrawer((v) => !v);
            // }}
            >
              <SelectTitle>{t("payments")}</SelectTitle>
              <SelectAD>{payMethod}</SelectAD>
              {/* <InputLabelIcon src={arrowRight} alt="select" /> */}
            </SelectInputContainer>
            <SelectInputContainer style={{ marginTop: 24 }}>
              <SelectTitle>帳戶姓名</SelectTitle>
              <SelectInput
                value={userName}
                onChange={e => setUserName(e.target.value)}
                type="text"
                placeholder="輸入戶名"
              />
            </SelectInputContainer>
            {payConfirmMethod === "街口支付" ||
            payConfirmMethod === "LINE Pay" ? (
              <>
                <SelectInputContainer style={{ marginTop: 24 }}>
                  <SelectTitle>街口帳號</SelectTitle>
                  <SelectInput
                    value={userAccount}
                    onChange={e => setUserAccount(e.target.value)}
                    type="text"
                    placeholder="輸入街口帳號"
                  />
                </SelectInputContainer>
                {uploadQrCode ? (
                  <UploadImageIcon src={qr_code} alt="upload" />
                ) : (
                  <UploadImageIcon
                    src={uploadqrcode}
                    alt="upload"
                    onClick={() => {
                      setUploadQrCode(v => !v);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <SelectInputContainer style={{ marginTop: 24 }}>
                  <SelectTitle>{t("bankName")}</SelectTitle>
                  <SelectInput
                    value={accountBank}
                    onChange={e => setAccountBank(e.target.value)}
                    type="text"
                    placeholder="輸入銀行代碼或名稱"
                  />
                </SelectInputContainer>
                <SelectInputContainer style={{ marginTop: 24 }}>
                  <SelectTitle>{t("accountNum")}</SelectTitle>
                  <SelectInput
                    value={userAccount}
                    onChange={e => setUserAccount(e.target.value)}
                    type="text"
                    placeholder={t("enteraccountNum")}
                  />
                </SelectInputContainer>
              </>
            )}
            <SubmitButton
              style={{
                marginTop:
                  payConfirmMethod === "街口支付" ||
                  payConfirmMethod === "LINE Pay"
                    ? "30%"
                    : "55%"
              }}
              onClick={submitHandler}
            >
              {t("add")}
            </SubmitButton>
          </BodyContainer>
        </AddPayWayContaier>
      ) : (
        <>
          <TitleContainer>
            <NavImage
              src={BackIcon}
              alt="language"
              onClick={() => {
                setAddPayWayStatus(false);
                var a = [];
                for (let i = 0; i < checkedState.length; i++) {
                  if (checkedState[i] === true) {
                    a.push(paymentArr[i]);
                  }
                }
                setPayArray(a);
              }}
            />
            <LogoImage>{t("payments")}</LogoImage>
            <AddImage src={add} alt="add" onClick={() => setAddPayway(true)} />
          </TitleContainer>
          <AddPayContainer>
            <AddPayTitle>請選擇最少一種最多三種付款方式</AddPayTitle>
            {paymentArr.map((x: any, i) => {
              return (
                <AddPayItem
                  onClick={() => {
                    const updatedCheckedState = checkedState.map(
                      (item, index) => (index === i ? !item : item)
                    );

                    console.log(updatedCheckedState);

                    setCheckedState(updatedCheckedState);
                    // if (paySelect.includes("0013725399811211")) {
                    //   setPaySelect((prev) =>
                    //     prev.filter((e) => e !== "0013725399811211")
                    //   );
                    // } else {
                    //   setPaySelect((prev) => [...prev, "0013725399811211"]);
                    // }
                  }}
                >
                  <AddPayIcon src={payment} alt="pay" />
                  <AddPayContentContainer>
                    <AddPayContent>{t("bankTrasfer")}</AddPayContent>
                    <AddPayContentDes>{`(${x.code}) ${x.account}`}</AddPayContentDes>
                  </AddPayContentContainer>
                  {checkedState[i] ? (
                    <CheckItemIcon src={coolicon} alt="check" />
                  ) : (
                    <TradeFunctionCheckBox check={false} id={x.id} />
                  )}
                </AddPayItem>
              );
            })}

            {/* <AddPayItem
              onClick={() => {
                if (paySelect.includes("393716544197532567")) {
                  setPaySelect((prev) =>
                    prev.filter((e) => e !== "393716544197532567")
                  );
                } else {
                  setPaySelect((prev) => [...prev, "393716544197532567"]);
                }
              }}
            >
              <AddPayIcon src={line_pay} alt="pay" />
              <AddPayContentContainer>
                <AddPayContent>LINE Pay</AddPayContent>
                <AddPayContentDes>{`393716544197532567`}</AddPayContentDes>
              </AddPayContentContainer>
              {paySelect.includes("393716544197532567") ? (
                <CheckItemIcon src={coolicon} alt="check" />
              ) : (
                <TradeFunctionCheckBox check={false} />
              )}
            </AddPayItem>
            <AddPayItem
              onClick={() => {
                if (paySelect.includes("0000483611250797")) {
                  setPaySelect((prev) =>
                    prev.filter((e) => e !== "0000483611250797")
                  );
                } else {
                  setPaySelect((prev) => [...prev, "0000483611250797"]);
                }
              }}
            >
              <AddPayIcon src={payment} alt="pay" />
              <AddPayContentContainer>
                <AddPayContent>銀行轉帳</AddPayContent>
                <AddPayContentDes>{`(013 國泰世華) 0000483611250797`}</AddPayContentDes>
              </AddPayContentContainer>
              {paySelect.includes("0000483611250797") ? (
                <CheckItemIcon src={coolicon} alt="check" />
              ) : (
                <TradeFunctionCheckBox check={false} />
              )}
            </AddPayItem> */}
          </AddPayContainer>
        </>
      )}
      <Drawer
        isVisible={payWayDrawer}
        selectVisible={payWayDrawerHandler}
        height={309}
      >
        <DrawerFullWarehouseTitleContainer>
          <DrawerFullWarehouseImage
            src={cancel}
            alt="cancel"
            onClick={payWayDrawerHandler}
          />
          <DrawerFullWarehouseTitle>{t("priceMethod")}</DrawerFullWarehouseTitle>
          <CancelButton
            onClick={() => {
              setPayConfirmMethod(payMethod);
              setPayWayDrawer(v => !v);
            }}
          >{t("OK")}</CancelButton>
        </DrawerFullWarehouseTitleContainer>
        <DrawerDeadTimeContainer>
          {["支付寶", "微信支付", t("bankTrasfer"), "街口支付", "LINE Pay"].map(
            (item, i) => {
              return (
                <DepthUnitItem
                  key={item}
                  onClick={() => {
                    setPayMethod(item);
                  }}
                >
                  <p
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color:
                        payMethod === item
                          ? COLORS.Red
                          : COLORS.Gray
                    }}
                  >
                    {item}
                  </p>
                </DepthUnitItem>
              );
            }
          )}
        </DrawerDeadTimeContainer>
      </Drawer>
      <Footer locationPage={"/deal"} />
    </>
  );
};

export default FiatAdDealHint;
