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
  padding:5px;
  border:none;
  background:none;
  width:100%;
`;

const SaveButton = styled.button`
  display: flex;
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 44px ;
  width: 100% ;
  background: rgb(211,47,47,1);
  margin-top:40px;
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
  color:#5F5C70;
  font-size:13px;
  margin-bottom:5px;
`;


const Inside = styled.div`
  background: #FFFFFF;
  flex: 1;
  padding-left:20px;
  padding-right:20px;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */

const SetTheFundPassword = () => {

  const navigation = useNavigate()
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("")
  const { t } = useTranslation();

  
  return (
    <LoadingOverlay
    active={loading}
    spinner
  >
    <PageContainer>

      <TopArea>

        < TopAreaRight>
          <Link to="/login">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <ChangeAccountName>{t("forgetPass")}</ChangeAccountName>

        </ TopAreaRight>
      </TopArea>

      <Inside>
      <PassWord>{t("email")}</PassWord>
        <AreaSpace>
          <AreaContent>
            <Words placeholder="請輸入信箱" onChange={(e)=>{
              setEmail(e.target.value)
            }}/>

            {/* <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun> */}
          </AreaContent>
        </AreaSpace>
        <SaveButton onClick={()=>{
          if(!email){
            alert("請輸入信箱")
          }else{
            setLoading(true)
            api.postData("/auth/forgot-password",{account:email}).then(x=>{
            setLoading(false)
            if(x.status !== 400){
              navigation(-1)
              alert("新密碼已寄送至您的信箱")
            }else{
              alert(x.data.msg)
            }
          })
          }
          
        }}>
          <SaveButtonWord>{t("OK")}</SaveButtonWord>
        </SaveButton>

      </Inside >
      <Footer />
    </PageContainer >
    </LoadingOverlay>
  );
}

export default SetTheFundPassword 
