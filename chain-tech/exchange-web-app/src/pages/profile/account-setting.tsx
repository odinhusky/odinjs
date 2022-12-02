/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */
import Left from "../../assets/ProfileSetting/left.png";
import Footer from "../../components/footer/PageFooter";
import add from "../../assets/profile/add.png";
import card from "../../assets/profile/card.png";
import noAccount from "../../assets/profile/no-account.png";
// import LinePay from "../../assets/profile/LinePay.png";
// import StreetCorner from "../../assets/profile/StreetCorner.png";
import pen from "../../assets/profile/pen.png";
import remove123 from "../../assets/profile/remove123.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { NONAME } from "dns";

import * as React from "react";

// import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
// import DialogActions from '@mui/material/DialogActions';

import api from "../../common/api";
import { useTranslation } from "react-i18next";

// page-style compoents start:

const Space1 = styled.div`
  color: #333333;
  background: #ffffff;
  width: 100%;
`;

const Space1Inside3 = styled.div`
  position: relative;
  top: 20px;
  display: flex;
  justify-content: space-between;
  padding: 10px 21px 10px 0px;
`;

const Space1Inside4 = styled.div`
  margin-left: 40px;
  margin-top: -40px;
`;

const PageContainer = styled.div`
  height: 100vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;
`;

const TopAreaRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SafeItems = styled.div`
  margin-top: -5px;
  display: flex;
  justify-content: space-around;
`;

const SafeSetting = styled.div`
  width: 100%;
  color: #383743;
  font-size: 13px;
  margin-top: 30px;
`;

const AreaSpace = styled.div`
  border: 1px solid #f0f0f0;
  padding: 0px 0px 12px 20px;
  background: #fff;
`;

const SettingWords = styled.div`
  margin-top: 10px;
  color: #8f8da2;
  font-size: 13px;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
  margin-top: 20px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  height: 40px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  font-size: 16px;
  font-weight: bold;
  margin-left: 45px;
`;

const Inside = styled.div`
  background: #ffffff;
  flex: 1;
`;

const ButtonButton = styled.button`
  border: none;
  background: none;
  width: 100%;
  text-align: left;
`;

const IMGSTYLE = styled.img`
  width: 18.75px;
  height: 15px;
  margin-top: 10px;
  margin-left: 10px;
`;

const ImgPen = styled.img`
  width: 15px;
  height: 15px;
`;

const ButtunPen = styled.button`
  border: none;
  background: none;
  margin-right: -40px;
  width: 20px;
`;

const Buttunadd = styled.button`
  border: none;
  background: none;
  margin-right: 25px;
  width: 20px;
`;

const IMGREMOVE = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 8px;
`;

const NoticeArea = styled.div`
  position: fixed;
  left: 70px;
  top: 250px;
  width: 270px;
  height: 126px;
  background: #ffffff;
  border-radius: 18px;
`;

const RemoveP = styled.p`
  text-align: center;
  font-size: 16px;
  color: #595959;
  font-weight: 500px;
`;

const RemovePContent = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #595959;
`;

// const modal = styled(Modal)`

// `

//page-style end

/* 下面的要把style都丟上去style compoents  */

const AccountSetting = () => {
  const [remove, setRemove] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [payment, setPayment] = React.useState([]);
  const [id, setId] = useState("");
  const { t } = useTranslation();
  const getAccount = () => {
    api.getData("/user/security").then(x => {
      api.get("/user/payment").then(x => {
        console.log(x);
        setPayment(x.data);
      });
    });
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAccount();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PageContainer>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {true && (
            <NoticeArea>
              <div style={{ padding: "12px" }}>
                <div>
                  <RemoveP>確定移除</RemoveP>
                  <RemovePContent>
                    您使用此收款/付款方式的在線廣告將會暫時中止
                  </RemovePContent>
                </div>
              </div>
              {/* 
                這幾段無法 style component */}
              <div
                style={{
                  borderTop: "1px solid black",
                  marginTop: "1px",
                  borderColor: "#D9D9D9"
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  height: "40px"
                }}
              >
                <button
                  style={{
                    border: "none",
                    borderRight: "1px solid #D9D9D9",
                    background: "none",
                    fontSize: "16px",
                    width: "50%"
                  }}
                  onClick={() => setOpen(false)}
                >
                  <p>{t("cancel")}</p>
                </button>

                <button
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "16px",
                    color: "#296DF1",
                    width: "50%"
                  }}
                  onClick={() => {
                    api.delete("/user/payment/" + id).then(x => {
                      getAccount();
                      setOpen(false);
                    });
                  }}
                >
                  <p>移除</p>
                </button>
              </div>

              {/* 這幾段無法 style component */}
            </NoticeArea>
          )}
        </Dialog>
      </div>

      <TopArea>
        <TopAreaRight>
          <Link to="/c2c">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>

          <Setting1>{t("accountSet")}</Setting1>

          <ButtunPen onClick={() => setRemove(!remove)}>
            <ImgPen src={pen} alt="pen " />
          </ButtunPen>

          <Link to="/create-new-account">
            <Buttunadd>
              <ImgPen src={add} alt="add" />
            </Buttunadd>
          </Link>
        </TopAreaRight>
      </TopArea>

      <Inside>
        {payment.length !== 0 ? (
          payment.map((x: any) => {
            return (
              <AreaSpace>
                <Space1>
                  <Space1Inside3>
                    <IMGSTYLE src={card} alt="card" />
                    {remove && (
                      <button
                        style={{ border: "none", background: "none" }}
                        onClick={() => {
                          setId(x.id);
                          setOpen(true);
                        }}
                      >
                        <IMGREMOVE src={remove123} alt="remove" />
                      </button>
                    )}
                  </Space1Inside3>

                  <Space1Inside4>
                    <ButtonButton>
                      <SafeItems>
                        <SafeSetting>{t("fiatOrderNum")}</SafeSetting>
                      </SafeItems>
                      <SettingWords>
                        ({x.code}) {x.account}
                      </SettingWords>
                    </ButtonButton>
                  </Space1Inside4>
                </Space1>
              </AreaSpace>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30
            }}
          >
            <img src={noAccount} style={{ width: 135, height: 135 }} alt="" />
            <p
              style={{
                color: "#383743",
                fontSize: 16,
                fontWeight: 600,
                marginTop: 30
              }}
            >
              {t("noAccount")}
            </p>
            <p
              style={{
                color: "#BDBCC8",
                fontSize: 13,
                fontWeight: 500,
                marginTop: 30
              }}
            >
              尚無帳戶，請新增帳戶以利收付款項。
            </p>
          </div>
        )}

        {/* <AreaSpace>
          <Space1>
            <Space1Inside3>
              <IMGSTYLE src={LinePay} alt="LinePay" />
              {remove && <button style={{ border: "none", background: "none" }} onClick={() => setOpen(true)}><IMGREMOVE src={remove123} alt="remove" /></button>}
            </Space1Inside3>

            <Space1Inside4>
              <ButtonButton>
                <SafeItems>
                  <SafeSetting>LINEPay</SafeSetting>
                </SafeItems>
                <SettingWords>393716544197532567</SettingWords>
              </ButtonButton>
            </Space1Inside4>

          </Space1>
        </AreaSpace> */}

        {/* <AreaSpace>
          <Space1>
            <Space1Inside3>
              <IMGSTYLE src={StreetCorner} alt="StreetCorner" />
              {remove && <button style={{ border: "none", background: "none" }} onClick={() => setOpen(true)}><IMGREMOVE src={remove123} alt="remove" /></button>}
            </Space1Inside3>

            <Space1Inside4>
              <ButtonButton>
                <SafeItems>
                  <SafeSetting>街口支付</SafeSetting>
                </SafeItems>
                <SettingWords>86 9231 4826 7263 8273</SettingWords>
              </ButtonButton>
            </Space1Inside4>

          </Space1>
        </AreaSpace> */}

        {/* <AreaSpace>
          <Space1>
            <Space1Inside3>
              <IMGSTYLE src={card} alt="card" />
              {remove && <button style={{ border: "none", background: "none" }} onClick={() => setOpen(true)}><IMGREMOVE src={remove123} alt="remove" /></button>}

            </Space1Inside3>

            <Space1Inside4>
              <ButtonButton>
                <SafeItems>
                  <SafeSetting>{t("fiatOrderNum")}</SafeSetting>
                </SafeItems>
                <SettingWords>(013 國泰世華)0000483611250797 </SettingWords>
              </ButtonButton>
            </Space1Inside4>

          </Space1>

        </AreaSpace> */}
      </Inside>

      <Footer />
    </PageContainer>
  );
};

export default AccountSetting;
