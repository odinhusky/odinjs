/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */
import check from "../../assets/ProfileSetting/check.png";
import Arrow from "../../assets/ProfileSetting/arrow.png";
import Dot from "../../assets/ProfileSetting/dot.png";
import Left from "../../assets/ProfileSetting/left.png";
import GrayCheck from "../../assets/ProfileSetting/GrayCheck.png";
import Footer from "../../components/footer/PageFooter";

//steve's Drawer
import Drawer from '../../components/UI/Drawer'


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../common/api"
import { useEffect } from "react"
import { useTranslation } from "react-i18next";

// page-style compoents start:

const Space1 = styled.div`
  color: #333333;
  background: #ffffff;
`;

const Space1Inside1 = styled.div`
  position: relative;
  top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Space1Inside2 = styled.div`
  margin-left: 30px;
`;

const Space1Inside3 = styled.div`
  position: relative;
  top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Space1Inside4 = styled.div`
  margin-left: 30px;
`;

const Space2 = styled.div`
  display: flex;
  justify-content: space-between;
  color: #333333;
  background: #ffffff;
`;

const PageContainer = styled.div`
  height: 100vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
  position:relative;
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
`;

const AreaSpace = styled.div`
  border: 1px solid #f0f0f0;
  padding: 20px;
  background: #fff;
`;

const CangeAccountPassWord = styled.div`
  color: #383743;
  font-weight: bold;
  font-size: 16px;
  padding: 23px;
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
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: 10px;
`;

const RightButtun = styled.button`
  margin-right: 10px;
  margin-top: 20px;
  display: flex;
  background: #fff;
  border: none;
  height: 30px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  fontsize: 16px;
  font-weight: bold;
  margin-right: 40px;
`;

const PhoneAndEmail = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color: #8f8da2;
  font-size: 13px;
`;

const PassWord = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color: #8f8da2;
  font-size: 13px;
`;

const CheckImg = styled.img`
  width: 16px;
  height: 16px;
`;

const DotImg = styled.img`
  width: 16px;
  height: 4px;
`;

const Inside = styled.div`
  background: #f0f0f0;
  flex: 1;
`;

const GrayCheckImg = styled.img`
  width: 32.78px;
  height: 32.78px;
  z-index: 3;
  margin-left:30px;
  margin-top:15px;
`;

const ResetSuccessfully = styled.div`
  position: fixed;
  left: 160px;
  top: 350px;
  width: 91px;
  height: 91px;
  zIndex: 10px;
  background: rgba(56, 55, 67, 0.6);
  border-radius:8px;
`;

const NoticeArea = styled.div`
  position: fixed;
  left: 70px;
  top: 300px;
  width: 270px;
  height: 140px;
  zIndex: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius:18px; 
`;

const GrayP = styled.p`
color:white;
margin-left:8px;
margin-top:10px;
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

const RemoveP = styled.p`
  text-align: center ;
  margin-top: 15px;
  font-size: 16px;
  color: #595959;
  font-weight: 500px;
`;

const RemovePContent = styled.p`
  text-align: center;
  margin-top: 15px ;
  font-size: 14px;
  color: #595959;
`;

const CancelButton = styled.button`
  border: none;
  line-height: 50px;
  background: #F4F4F6;
  border-radius: 4px;
`;

const CancelP = styled.p`
  font-size: 14px;
  color: #5F5C70;
`;


// age-style end

/* 下面的要把style都丟上去style compoents  */

const ProfileSetting = () => {
  let navigate = useNavigate();
  const [DotDotDot1, setDotDotDot1] = useState(false)
  const handleDrawer1 = () => {
    setDotDotDot1(prev => !prev)
  }

  const [DotDotDot2, setDotDotDot2] = useState(false)
  const [, setCount] = useState(1);
  const { t } = useTranslation();
  const handleDrawer2 = () => {
    setDotDotDot2(prev => !prev)
  }
  const getStatus = ()=>{
    api.getData("/user/security").then(x=>{
      console.log(x.data)
      if(x.data.kyc === "PERMIT"){
        setCount(prev => prev + 1)
      }
      if(x.data.phone){
        setCount(prev => prev + 1)
      }
      if(x.data.googleAuth){
        setCount(prev => prev + 1)
      }
      if(x.data.financePwd){
        setCount(prev => prev + 1)
      }
    })
  }
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getStatus()
    }
  },[])
  return (
    <PageContainer>
      {/* 先關掉"重置成功"顯示 */}
      {false &&
        <ResetSuccessfully>
          <GrayCheckImg src={GrayCheck} alt="graycheck" />
          <button style={{ border: "none", background: "none" }} onClick={() => {
            navigate('/Phonenumber')
          }}>
            <GrayP>重置成功</GrayP>
          </button>
        </ResetSuccessfully>
      }
      {/* 先關掉"重置成功"顯示 */}


      {/* 先關掉"確定移除"顯示 */}

      {false &&
        <NoticeArea>
          <div style={{ padding: "12px" }}>
            <div>
              <RemoveP>確定移除</RemoveP>
              <RemovePContent>移除手機號碼後，您需要再次完成手機號碼驗證才可以開始進行交易。</RemovePContent>
            </div>

          </div>

          {/* 這幾段無法 style component */}
          <div style={{
            borderTop: "1px solid black",
            marginTop: "1px",
            borderColor: "#D9D9D9"
          }}>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", width: "100%", height: "40px" }}>
            <button style={{ border: "none", borderRight: "1px solid #D9D9D9", background: "none", fontSize: "16px", width: "50%" }}><p>{t("cancel")}</p></button>
            <button style={{ border: "none", background: "none", fontSize: "16px", color: "#296DF1", width: "50%" }}><p>移除</p></button>
          </div>

          {/* 這幾段無法 style component */}

        </NoticeArea>
      }
      {/* 先關掉"確定移除"顯示 */}


      <TopArea>
        <TopAreaRight>
          <Link to="/">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>

          <Setting1>設定</Setting1>

          <div> </div>
        </TopAreaRight>
      </TopArea>

      <Inside>
        <PhoneAndEmail>手機號碼與電子信箱驗證</PhoneAndEmail>
        <AreaSpace>
          <Space1>
            <Space1Inside1>
              <CheckImg src={check} alt="check" />
              <button style={{ border: "none", background: "none" }} onClick={() => {
                handleDrawer1()
              }}>
                <DotImg src={Dot} alt="Dot" />
              </button>
            </Space1Inside1>

            <div>
              <Space1Inside2>
                <SafeItems>
                  <SafeSetting>手機號碼驗證</SafeSetting>
                </SafeItems>

                <SettingWords>091****912</SettingWords>
              </Space1Inside2>
            </div>
          </Space1>
        </AreaSpace>
        <AreaSpace>
          <Space1>
            <Space1Inside3>
              <CheckImg src={check} alt="check" />
              <button style={{ border: "none", background: "none" }} onClick={() => {
                handleDrawer2()
              }}>
                <DotImg src={Dot} alt="Dot" />
              </button>
            </Space1Inside3>

            <Space1Inside4>
              <SafeItems>
                <SafeSetting>{t("emailVerify")}</SafeSetting>
              </SafeItems>
              <SettingWords>abc******@gmail.com</SettingWords>
            </Space1Inside4>
          </Space1>
        </AreaSpace>
        <PassWord>帳戶密碼</PassWord>
        <div>
          <Space2>
            <div>
              <CangeAccountPassWord>變更帳戶密碼</CangeAccountPassWord>
            </div>
            <Link to="/chang-account-password">
              <RightButtun>
                <img src={Arrow} alt="Arrow" />
              </RightButtun>
            </Link>
          </Space2>
        </div>
      </Inside>
      <Drawer isVisible={DotDotDot1} selectVisible={handleDrawer1} height={230}>
        <PhoneButtonSetting>

          <PhoneButton>
            <Link to="/reset-phone-number">
              <PhoneButtonP>重置手機號碼</PhoneButtonP>
            </Link>
          </PhoneButton>

          <PhoneButton>
            <PhoneButtonP>移除手機號碼</PhoneButtonP>
          </PhoneButton>
        </PhoneButtonSetting>

        <button
          style={{
            border: "none",
            lineHeight: "50px",
            background: "#F4F4F6",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
        </button>
      </Drawer>

      <Drawer isVisible={DotDotDot2} selectVisible={handleDrawer2} height={230}>
        <PhoneButtonSetting>

          <PhoneButton>
            <Link to="/reset-email">
              <PhoneButtonP>重置電子信箱</PhoneButtonP>
            </Link>
          </PhoneButton>

          <PhoneButton>
            <PhoneButtonP>移除電子信箱</PhoneButtonP>
          </PhoneButton>
        </PhoneButtonSetting>

        <CancelButton
        >
          <CancelP>{t("cancel")}</CancelP>
        </CancelButton>
      </Drawer>

      <Footer />
    </PageContainer >
  );
};

export default ProfileSetting;