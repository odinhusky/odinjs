/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";
import {useState} from "react"
import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
// page-style compoents start:
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  color: #383743;
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
  background: rgb(211,47,47,1);
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
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff ;
  border: none ;
  margin-top:20px;
  display:flex;
  justify-content:start;
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

const SetTheFundPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  return (
    <LoadingOverlay
    active={loading}
    spinner
  >
    <PageContainer>

      <TopArea>

        < TopAreaRight>
          <Link to="/safe-setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <ChangeAccountName>設置資金密碼</ChangeAccountName>

        </ TopAreaRight>
      </TopArea>

      <Inside>

        <PassWord>{t("password")}</PassWord>
        <AreaSpace
        >
          <AreaContent>

            <Words  type="password" placeholder={t("enterFundingPass")} onChange={(e)=>{
              setPassword(e.target.value)
            }}/>

            {/* <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun> */}
          </AreaContent>
        </AreaSpace>

        <PassWord>再次輸入密碼</PassWord>
        <AreaSpace
        >
          <AreaContent>
            <Words  type="password" placeholder="再次輸入資金密碼" onChange={(e)=>{
              setConfirmPassword(e.target.value)
            }}/>

            {/* <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun> */}
          </AreaContent>
        </AreaSpace>

        <SaveButton onClick={()=>{
          setLoading(true)
          api.postData("/user/finance-password",{password:password,password2:confirmPassword}).then(x=>{
            setLoading(false)
            if(x.status !== 400){
              navigation(-1)
            }else{
              alert(x.data.msg)
            }
          })
        }}>
          <SaveButtonWord>{t("saveIdCard")}</SaveButtonWord>
        </SaveButton>

      </Inside >
      <Footer />
    </PageContainer >
    </LoadingOverlay>
  );
}

export default SetTheFundPassword 
