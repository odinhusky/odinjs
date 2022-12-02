/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import Appstore from "../../assets/profile/appstore.png";
import Googleplay from "../../assets/profile/googleplay.png";
import Footer from "../../components/footer/PageFooter";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh ; 
  widht: 100%;
  display: flex ; 
  flex-direction: column ;
`;

const TopArea = styled.div`
  height:50px;
  line-height:50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom:2px;
`;

const TopAreaRight = styled.div`
  width: 100% ;
  display: flex ;
  justify-content: space-between;
`;


const SubmitButton = styled.button`
  display: flex, 
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 44px ;
  width: 90% ;
  background: rgb(211,47,47,1);
  margin-top:90px;
`;

const SubmitButtonWord = styled.div`
  color:#FFFFFF;
  font-size:14px;
  text-align:center;
  border: none ;
`;

const ArrowContent = styled.img`
  margin-left:13px;
  width: 16px;
  height: 16px;
`;


const LeftButton = styled.button`
  background: #fff ;
  border: none ;
  margin-top:5px;
`;


const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743 ;
  fontSize: 16px ;
  font-weight: bold;
  margin-right:40px;
`;



const Areaword = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color:#5F5C70;
  font-size:13px;
`;

const Inside = styled.div`
  background: #FFFFFF;
  display:flex;
  flex:1;
  flex-direction:column;
  align-items:center;

`;

const StoreImg = styled.img`
  width:200px;
  height:68px;
`;


const ImageButton = styled.button`
  margin-top:30px;
  width:223px;
  height:68px;
  background:none;
  border:none;
`;



//page-style end 

/* 下面的要把style都丟上去style compoents  */

const ResetPhoneNumber = () => {
  const navigation = useNavigate()
  const { t } = useTranslation();
  return (
    <PageContainer>

      <TopArea>

        < TopAreaRight>

          <Link to="/safe-setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>{t("googleAuth")}</Setting1>
          <div> </div>
        </ TopAreaRight>


      </TopArea>


      <Inside>

        {/* <Notice>
          <NoticeP>為了你的帳戶安全，請謹慎選擇需要重置的項目，系統將根據您的操作行為決定是否禁用提現48小時。
          </NoticeP>
        </Notice> */}

        <Areaword>請下載 Google 驗證 APP。</Areaword>
        <ImageButton onClick={()=>{
          window.open(
            'https://apps.apple.com/tw/app/google-authenticator/id388497605',
            '_blank' // <- This is what makes it open in a new window.
          );
        }}>
          <StoreImg src={Appstore} alt=""/>
        </ImageButton>
        <ImageButton onClick={()=>{
          window.open(
            'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=zh_TW&gl=US',
            '_blank' // <- This is what makes it open in a new window.
          );
        }}>
          <StoreImg src={Googleplay} alt=""/>
        </ImageButton>
        <SubmitButton onClick={()=>{
          navigation("/google-code")
        }}>
          <SubmitButtonWord>{t("nextStep")}</SubmitButtonWord>
        </SubmitButton>
      </Inside >
      <Footer />
    </PageContainer >
  );
}

export default ResetPhoneNumber
