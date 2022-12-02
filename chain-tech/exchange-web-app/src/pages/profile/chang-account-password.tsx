/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import ClosEye from "../../assets/profile/close-eyes.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";
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

const AreaSpace = styled.div`
  padding: 10px;
  margin: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  background:#F4F4F6;
`;

const AreaContent = styled.div`
  display:flex;
  justify-content: space-between;
`;

const Words = styled.input`
  font-size:15px;
  color: #BDBCC8;
  text-align: center;
  margin-top:5px;
  padding:10px;
  border:none;
  background:none;
  width:100%;
`;

const SaveButton = styled.button`
  display: flex, 
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 44px ;
  width: 90% ;
  background: rgb(211,47,47,0.3);
  margin-left:20px;
  margin-top:90px;
`;

const SaveButtonWord = styled.div`
  color:#FFFFFF;
  font-size:14px;
  text-align:center;
  border: none ;
`;

const ArrowContent = styled.img`
  margin-left:13px;
  width: 12px;
  height: 16px;
`;

const CloseEyeImg = styled.img`
  margin-left:13px;
  width: 28px;
  height: 28px;
  color:#BDBCC8;
  margin-top:7px;
`;
const LeftButton = styled.button`
  background: #fff ;
  border: none ;;
  margin-top:20px;
  display:flex;
  justify-content:start;
`;

const CloseEyeButtun = styled.button`
  margin-right:10px;
  display:flex;
  background: none;
  border: none ;
  margin-top:5px;
  color: #BDBCC8;
`;

const ChangeAccountName = styled.div`
  color: #383743 ;
  fontSize: 16px ;
  font-weight: bold;
  margin-right:160px;
  margin-top:5px;
`;

const PassWord = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color:#5F5C70;
  font-size:13px;
`;


const Inside = styled.div`
  background: #FFFFFF;
  flex: 1;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */

const ChangAccountPassword = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>

      <TopArea>

        < TopAreaRight>
          <Link to="/setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />

            </LeftButton>
          </Link>
          <ChangeAccountName>變更帳戶密碼</ChangeAccountName>

        </ TopAreaRight>
      </TopArea>

      <Inside>

        <PassWord>原密碼</PassWord>
        <AreaSpace
        >
          <AreaContent>

            <Words placeholder="輸入原密碼" />

            <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun>
          </AreaContent>
        </AreaSpace>

        <PassWord>{t("newPass")}</PassWord>
        <AreaSpace
        >
          <AreaContent>
            <Words placeholder={t("enterNewPass")} />

            <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun>
          </AreaContent>
        </AreaSpace>

        <PassWord>新密碼確定</PassWord>
        <AreaSpace
        >
          <AreaContent>
            <Words placeholder={t("enterAgainNewPass")} />


            <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun>
          </AreaContent>
        </AreaSpace>

        <SaveButton>
          <SaveButtonWord>{t("saveIdCard")}</SaveButtonWord>
        </SaveButton>

      </Inside >
      <Footer />
    </PageContainer >
  );
}

export default ChangAccountPassword
