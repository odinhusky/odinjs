/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */
import check from "../../assets/ProfileSetting/check.png";
// import Arrow from "../../assets/ProfileSetting/arrow.png";
// import Dot from "../../assets/ProfileSetting/dot.png";
import Left from "../../assets/ProfileSetting/left.png";
import GrayCheck from "../../assets/ProfileSetting/GrayCheck.png";
import Footer from "../../components/footer/PageFooter";
import time from "../../assets/profile/time.png";
import Dot from "../../assets/ProfileSetting/dot.png";

//steve's Drawer
import Drawer from "../../components/UI/Drawer";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../common/api";
import LoadingOverlay from "react-loading-overlay-ts";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// page-style compoents start:

const Space1 = styled.div`
  color: #333333;
  background: #ffffff;
  height: 72px;
`;

const Space1Inside1 = styled.div`
  display: flex;
  height: 72px;
  justify-content: space-between;
  align-items: center;
`;

const Space1Inside4 = styled.div`
  margin-left: 30px;
`;

// const Space1Inside3 = styled.div`
//   position: relative;
//   top: 30px;
//   display: flex;
//   justify-content: space-between;
//   padding-bottom:6px;
// `;

// const Space1Inside2 = styled.div`
//   margin-left: 30px;
// `;

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

const TopArealeft = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

// const SafeItems = styled.div`
//   top: 30px;
//   display: flex;
//   justify-content: space-between;
// `;

const Safe = styled.div`
  width: 100%;
  color: #383743;
  font-size: 16px;
`;

const AreaSpace = styled.div`
  border: 1px solid #f0f0f0;
  background: #fff;
  padding: 2px 12px 2px 12px;
`;

const SettingWords = styled.div`
  padding-top: 10px;
  padding-bottom: 15px;
  color: #8f8da2;
  font-size: 13px;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: 12px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  fontsize: 16px;
  font-weight: bold;
  margin-right: 60px;
  margin-top: 10px;
`;

const TimeImg = styled.img`
  width: 135px;
  height: 135px;
  margin-top: 23px;
`;

// const DotImg = styled.img`
//   width: 16px;
//   height: 4px;
// `;

const Inside = styled.div`
  background: #ffffff;
  flex: 1;
`;

const GrayCheckImg = styled.img`
  width: 32.78px;
  height: 32.78px;
  z-index: 3;
  margin-left: 30px;
  margin-top: 15px;
`;

const GrayArea = styled.div`
  position: fixed;
  left: 160px;
  top: 350px;
  width: 91px;
  height: 91px;
  zindex: 10px;
  background: rgba(56, 55, 67, 0.6);
  border-radius: 8px;
`;

const BackGround = styled.div`
  position: fixed;
  left: 70px;
  top: 300px;
  width: 270px;
  height: 140px;
  zindex: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
`;

const GrayP = styled.p`
  color: white;
  margin-left: 8px;
  margin-top: 10px;
`;

const PhoneButtonSetting = styled.div`
  display: flex;
  flex-direction: column;
`;

const PhoneButton = styled.button`
  border: none;
  background: none;
  border-bottom: 0.03px solid #f4f4f6;
`;

const PhoneButtonP = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;

const Safe123 = styled.div`
  color: #383743;
  font-weight: bold;
  font-size: 16px;
  margin-right: 5px;
`;

const SafeNumber = styled.div`
  width: 100%;
  font-weight: bold;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CheckImg = styled.img`
  width: 16px;
  height: 16px;
`;

const SureRemove = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 16px;
  color: #595959;
  font-weight: 500;
`;

const SureRemoveP = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #595959;
`;

const TheLine = styled.div`
  border-top: 1px black solid;
  margin-top: 1px;
  border-color: #d9d9d9;
`;

const CancelButtom = styled.button`
  border: none;
  border-right: 1px solid #d9d9d9;
  background: none;
  font-size: 16px;
  width: 50%;
`;
const CancelButtom2 = styled.button`
  border: none;
  line-height: 50px;
  background: #f4f4f6;
  border-radius: 4px;
`;

// const OnClickButtom = styled.button`
//   border: none;
//   background: none;
// `;

const RemoveButtom = styled.button`
  border: none;
  background: none;
  font-size: 16px;
  color: #296df1;
  width: 50%;
`;

const CancelAndRemove = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 40px;
`;

const Number32 = styled.div`
  marginleft: 8px;
`;

const Verify = styled.div`
  color: #d32f2f;
  text-align: right;
`;

const ChangeP = styled.div`
  color: #8f8da2;
  text-align: right;
`;

const DotImg = styled.img`
  width: 16px;
  height: 4px;
`;

//page-style end

/* 下面的要把style都丟上去style compoents  */

const SafeSetting = () => {
  let navigate = useNavigate();
  const [DotDotDot1, setDotDotDot1] = useState(false);
  const handleDrawer1 = () => {
    setDotDotDot1(prev => !prev);
  };

  const [DotDotDot2, setDotDotDot2] = useState(false);
  const [DotDotDot3, setDotDotDot3] = useState(false);
  const [DotDotDot4, setDotDotDot4] = useState(false);
  const [kyc, setKyc] = useState("");
  const [owner, setOwner] = useState(false);
  const [googleAuth, setGoogleAuth] = useState(false);
  const [financePwd, setFinancePwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const { t } = useTranslation();
  const handleDrawer2 = () => {
    setDotDotDot2(prev => !prev);
  };
  const handleDrawer3 = () => {
    setDotDotDot3(prev => !prev);
  };
  const handleDrawer4 = () => {
    setDotDotDot4(prev => !prev);
  };
  const getStatus = () => {
    api.getData("/user/security").then(x => {
      console.log(x.data);
      if (x.data.kyc === "PERMIT") {
        setCount(prev => prev + 1);
      }
      if (x.data.phone) {
        setCount(prev => prev + 1);
      }
      if (x.data.googleAuth) {
        setCount(prev => prev + 1);
      }
      if (x.data.financePwd) {
        setCount(prev => prev + 1);
      }
      setKyc(x.data.kyc);
      setOwner(x.data.phone);
      setGoogleAuth(x.data.googleAuth);
      setFinancePwd(x.data.financePwd);
    });
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getStatus();
    }
  }, []);
  return (
    <LoadingOverlay active={loading} spinner>
      <PageContainer>
        {/* 先關掉"重置成功"顯示 */}
        {false && (
          <GrayArea>
            <GrayCheckImg src={GrayCheck} alt="graycheck" />
            <button
              style={{ border: "none", background: "none" }}
              onClick={() => {
                navigate("/Phonenumber");
              }}
            >
              <GrayP>重置成功</GrayP>
            </button>
          </GrayArea>
        )}
        {/* 先關掉"重置成功"顯示 */}

        {/* 先關掉"確定移除"顯示 */}

        {false && (
          <BackGround>
            <div style={{ padding: "12px" }}>
              <div>
                <SureRemove>確定移除</SureRemove>

                <SureRemoveP>
                  移除手機號碼後，您需要再次完成手機號碼驗證才可以開始進行交易。
                </SureRemoveP>
              </div>
            </div>

            <TheLine></TheLine>

            <CancelAndRemove>
              <CancelButtom>
                <p>{t("cancel")}</p>
              </CancelButtom>

              <RemoveButtom>
                <p>移除</p>
              </RemoveButtom>
            </CancelAndRemove>
          </BackGround>
        )}

        {/* 先關掉"確定移除"顯示 */}

        <TopArea>
          <TopArealeft>
            <Link to="/member">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <Setting1 onClick={() => { }}>{t("security")}</Setting1>

            <div> </div>
          </TopArealeft>
        </TopArea>

        <Inside>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TimeImg src={time} alt="time" />
          </div>

          <SafeNumber>
            <Safe123>{t("referralCompleted")}</Safe123>
            <div> </div>
            <Number32>
              <span style={{ color: "red" }}>
                {localStorage.getItem("token") ? count : 0}
              </span>
              /5
            </Number32>
          </SafeNumber>

          <div style={{ marginTop: "30px" }}>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex" }}>
                    {localStorage.getItem("token") ? (
                      <CheckImg src={check} alt="check" />
                    ) : (
                      <div style={{ marginLeft: "15px" }}></div>
                    )}
                    <Space1Inside4>
                      <Safe>{t("emailVerification")}</Safe>
                    </Space1Inside4>
                  </div>
                </Space1Inside1>
              </Space1>
            </AreaSpace>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex" }}>
                    {owner ? (
                      <CheckImg src={check} alt="check" />
                    ) : (
                      <div style={{ marginLeft: "15px" }}></div>
                    )}
                    <Space1Inside4>
                      <Safe>{t("mobileVerification")}</Safe>
                    </Space1Inside4>
                  </div>
                  {!owner && localStorage.getItem("token") && (
                    <Link to="/reset-phone-number">
                      <ChangeP>{t("verificationUnset")}</ChangeP>
                    </Link>
                  )}
                  {owner && (
                    <button
                      style={{ border: "none", background: "none" }}
                      onClick={() => {
                        setDotDotDot1(true);
                      }}
                    >
                      <DotImg src={Dot} alt="Dot" />
                    </button>
                  )}
                </Space1Inside1>
              </Space1>
            </AreaSpace>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex" }}>
                    {googleAuth ? (
                      <CheckImg src={check} alt="check" />
                    ) : (
                      <div style={{ marginLeft: "15px" }}></div>
                    )}
                    <Space1Inside4>
                      <Safe>{t("googleAuth")}</Safe>
                    </Space1Inside4>
                  </div>
                  {!googleAuth && localStorage.getItem("token") && (
                    <Link to="/download">
                      <ChangeP>{t("verificationUnset")}</ChangeP>
                    </Link>
                  )}
                  {googleAuth && localStorage.getItem("token") && (
                    <Link to="/update-google">
                      <ChangeP>重置</ChangeP>
                    </Link>
                  )}
                </Space1Inside1>
              </Space1>
            </AreaSpace>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {kyc === "PERMIT" ? (
                      <CheckImg src={check} alt="check" />
                    ) : (
                      <div style={{ marginLeft: "15px" }}></div>
                    )}
                    <Space1Inside4 style={{ marginTop: "15px" }}>
                      <Safe>{t("idAuth")}</Safe>
                      {!kyc && <SettingWords>{t("unverified")}</SettingWords>}
                      {kyc === "CREATE" && <SettingWords>審核中</SettingWords>}
                      {kyc === "PERMIT" && (
                        <SettingWords>審核通過</SettingWords>
                      )}
                      {kyc === "DENY" && <SettingWords>審核失敗</SettingWords>}
                    </Space1Inside4>
                  </div>
                  {kyc === "DENY" && localStorage.getItem("token") && (
                    <Link to="/id-verify">
                      <Verify>{t("verificationUnavb")}</Verify>
                    </Link>
                  )}

                  {!kyc && localStorage.getItem("token") && (
                    <Link to="/id-verify">
                      <Verify>{t("verificationUnavb")}</Verify>
                    </Link>
                  )}
                </Space1Inside1>
              </Space1>
            </AreaSpace>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {financePwd ? (
                      <CheckImg src={check} alt="check" />
                    ) : (
                      <div style={{ marginLeft: "15px" }}></div>
                    )}
                    <Space1Inside4 style={{ marginTop: "15px" }}>
                      <Safe>{t("fundPass")}</Safe>
                      {financePwd ? (
                        <SettingWords>{t("verificationSet")}</SettingWords>
                      ) : (
                        <SettingWords>{t("unset")}</SettingWords>
                      )}
                    </Space1Inside4>
                  </div>
                  {financePwd && (
                    <Link to="/update-the-fund-password">
                      <ChangeP>變更</ChangeP>
                    </Link>
                  )}
                  {localStorage.getItem("token") && !financePwd && (
                    <Link to="/set-the-fund-password">
                      <ChangeP>{t("verificationUnset")}</ChangeP>
                    </Link>
                  )}
                </Space1Inside1>
              </Space1>
            </AreaSpace>
            <AreaSpace>
              <Space1>
                <Space1Inside1>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginLeft: "15px" }}></div>
                    <Space1Inside4 style={{}}>
                      <Link to="/reset-password">
                        <Safe>{t("resetFundPass")}</Safe>
                      </Link>
                    </Space1Inside4>
                  </div>
                </Space1Inside1>
              </Space1>
            </AreaSpace>
          </div>
        </Inside>

        <Drawer
          isVisible={DotDotDot1}
          selectVisible={handleDrawer1}
          height={160}
        >
          <PhoneButtonSetting>
            <PhoneButton
              onClick={() => {
                setLoading(true);
                api.delete("/user/phone").then(x => {
                  console.log(x);
                  setLoading(false);
                  getStatus();
                  setDotDotDot1(false);
                });
              }}
            >
              <PhoneButtonP>移除手機號碼</PhoneButtonP>
            </PhoneButton>
          </PhoneButtonSetting>

          <CancelButtom2
            onClick={() => {
              setDotDotDot1(false);
            }}
          >
            <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
          </CancelButtom2>
        </Drawer>

        <Drawer
          isVisible={DotDotDot2}
          selectVisible={handleDrawer2}
          height={230}
        >
          <PhoneButtonSetting>
            <PhoneButton>
              <PhoneButtonP>{t("resetGA")}</PhoneButtonP>
            </PhoneButton>

            <PhoneButton>
              <PhoneButtonP>移除 Google 驗證</PhoneButtonP>
            </PhoneButton>
          </PhoneButtonSetting>

          <button
            style={{
              border: "none",
              lineHeight: "50px",
              background: "#F4F4F6",
              borderRadius: "4px"
            }}
          >
            <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
          </button>
        </Drawer>

        <Drawer
          isVisible={DotDotDot3}
          selectVisible={handleDrawer3}
          height={230}
        >
          <PhoneButtonSetting>
            <PhoneButton>
              <PhoneButtonP>{t("resetGA")}</PhoneButtonP>
            </PhoneButton>

            <PhoneButton>
              <PhoneButtonP>移除 Google 驗證</PhoneButtonP>
            </PhoneButton>
          </PhoneButtonSetting>

          <button
            style={{
              border: "none",
              lineHeight: "50px",
              background: "#F4F4F6",
              borderRadius: "4px"
            }}
          >
            <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
          </button>
        </Drawer>

        <Drawer
          isVisible={DotDotDot4}
          selectVisible={handleDrawer4}
          height={230}
        >
          <PhoneButtonSetting>
            <PhoneButton>
              <PhoneButtonP>{t("resetGA")}</PhoneButtonP>
            </PhoneButton>

            <PhoneButton>
              <PhoneButtonP>移除 Google 驗證</PhoneButtonP>
            </PhoneButton>
          </PhoneButtonSetting>

          <button
            style={{
              border: "none",
              lineHeight: "50px",
              background: "#F4F4F6",
              borderRadius: "4px"
            }}
          >
            <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
          </button>
        </Drawer>

        <Footer />
      </PageContainer>
    </LoadingOverlay>
  );
};

export default SafeSetting;
