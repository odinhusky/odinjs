/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
// import arrow from "../../assets/profile/arrow2.png";
import cancel from "../../assets/profile/cancel.png";

import Footer from "../../components/footer/PageFooter";

//steve's Drawer
import Drawer from "../../components/UI/Drawer";

import { useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../common/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// import { useNavigat } from "react-router-dom";

// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom: 2px;
`;

const TopAreaRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AreaSpace2 = styled.input`
  padding: 20px;
  background: none;
  opacity: 0.6;
  border-radius: 4px;
  width: 90%;
  margin-left: 20px;
  background: #f4f4f6;
  color: #bdbcc8;
  border: none;
`;

const AreaSpace3 = styled.p`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const AreaSpace4 = styled.div`
  padding: 10px;
  margin: 20px;
  background: #fff;
  opacity: 0.6;
  border-radius: 4px;
  background: #f4f4f6;
`;

const AreaCodeAlign = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Words3 = styled.p`
  font-size: 15px;
  color: #383743;
  text-align: center;
  margin-top: 5px;
  padding: 10px;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 4px;
  height: 44px;
  width: 90%;
  background: rgb(211, 47, 47);
  margin-left: 20px;
  margin-top: 90px;
`;

const SubmitButtonWord = styled.div`
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  border: none;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
  margin-top: 18px;
`;

// const RightButtunArrow = styled.img`
//   margin-left: 13px;
//   width: 7.41px;
//   height: 12px;
//   color: #bdbcc8;
//   margin-top: 7px;
// `;
const LeftButton = styled.button`
  background: #fff;
  border: none;
`;

// const RightButtun = styled.button`
//   margin-right: 10px;
//   display: flex;
//   background: none;
//   border: none;
//   margin-top: 5px;
//   color: #bdbcc8;
// `;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  font-size: 16px;
  font-weight: bold;
  margin-right: 40px;
`;

const Areaword = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color: #5f5c70;
  font-size: 13px;
`;

const Inside = styled.div`
  background: #ffffff;
  flex: 1;
`;

const PhoneButtonSetting = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountButton = styled.button`
  border: none;
  background: none;
  border-bottom: 0.03px solid #f4f4f6;
  margin-top: 10px;
`;

const AliPay = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;

const WeChatPay = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;
const MoneyTransfer = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #d32f2f;
`;
const StreetPay = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;

const LinePay = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;

const CancelButton = styled.button`
  border: none;
  line-height: 50px;
  background: #f4f4f6;
  border-radius: 4px;
`;

const New = styled.p`
  fontsize: 14px;
  color: #5f5c70;
`;

const AccountP = styled.p`
  margin-top: -40px;
  text-align: center;
  color: #383743;
  font-weight: 600;
`;

const CancelImg = styled.img`
  margin: 15px;
  width: 14px;
  height: 14px;
`;

const CancelButton2 = styled.button`
  border: none;
  background: none;
`;

//page-style end

/* 下面的要把style都丟上去style compoents  */

const CreateNewAccount = () => {
  // let navigate = useNavigate();
  const { t } = useTranslation();
  const [Account, setAccount] = useState(false);

  const [obj, setObj] = useState({
    type: "BANK",
    name: "",
    code: "",
    account: ""
  });

  const handleDrawer1 = () => {
    setAccount(prev => !prev);
  };

  const navigation = useNavigate();
  return (
    <PageContainer>
      <TopArea>
        <TopAreaRight>
          <Link to="/account-setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>{t("addAccount")}</Setting1>
          <div> </div>
        </TopAreaRight>
      </TopArea>

      <Inside>
        <Areaword>{t("accountType")}</Areaword>
        <AreaSpace4>
          <AreaCodeAlign>
            <Words3>{t("fiatOrderNum")}</Words3>

            {/* <RightButtun>
              <Link to="/setting">
                <RightButtunArrow src={arrow} alt="arrow" />
              </Link>
            </RightButtun> */}
          </AreaCodeAlign>
        </AreaSpace4>

        <Areaword>{t("accountName")}</Areaword>
        <AreaSpace3>
          <AreaSpace2
            placeholder={t("enterBankName")}
            onChange={e => {
              setObj({ ...obj, name: e.target.value });
            }}
          />
        </AreaSpace3>

        <Areaword>{t("bankName")}</Areaword>
        <AreaSpace3>
          <AreaSpace2
            placeholder="輸入銀行代碼"
            onChange={e => {
              setObj({ ...obj, code: e.target.value });
            }}
          />
        </AreaSpace3>

        <Areaword>{t("accountNum")}</Areaword>
        <AreaSpace3>
          <AreaSpace2
            placeholder={t("enteraccountNum")}
            onChange={e => {
              setObj({ ...obj, account: e.target.value });
            }}
          />
        </AreaSpace3>

        <SubmitButton
          onClick={() => {
            if (!localStorage.getItem("token")) {
              alert("請先登入");
            } else {
              if (!obj.name) {
                alert("請輸入帳號名稱");
              } else if (!obj.code) {
                alert("請輸入銀行代碼");
              } else if (!obj.account) {
                alert("請輸入銀行帳號");
              } else {
                Api.postData("/user/payment", obj).then(x => {
                  if (x.status !== 400) {
                    alert("新增成功");
                    navigation("/account-setting");
                  } else {
                    alert(x.data.msg);
                  }
                });
              }
            }
          }}
        >
          <SubmitButtonWord>{t("add")}</SubmitButtonWord>
        </SubmitButton>
      </Inside>

      <Drawer isVisible={Account} selectVisible={handleDrawer1} height={500}>
        <PhoneButtonSetting>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <CancelButton2 onClick={() => setAccount(false)}>
                <CancelImg src={cancel} alt="cancel" />
              </CancelButton2>

              <p style={{ margin: "10px" }}>{t("OK")}</p>
            </div>
            <AccountP>{t("accountType")}</AccountP>
          </div>

          <AccountButton>
            <AliPay>支付寶</AliPay>
          </AccountButton>

          <AccountButton>
            <WeChatPay>微信支付</WeChatPay>
          </AccountButton>

          <AccountButton>
            <MoneyTransfer>{t("fiatOrderNum")}</MoneyTransfer>
          </AccountButton>

          <AccountButton>
            <StreetPay>街口支付</StreetPay>
          </AccountButton>

          <AccountButton>
            <LinePay>Line Pay</LinePay>
          </AccountButton>
        </PhoneButtonSetting>

        <CancelButton>
          <New>{t("add")}</New>
        </CancelButton>
      </Drawer>
      <Footer />
    </PageContainer>
  );
};

export default CreateNewAccount;
