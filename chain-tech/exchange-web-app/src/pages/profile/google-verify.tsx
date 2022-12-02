/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";

import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";

import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';

import {useState} from "react"
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

const AreaSpace2 = styled.input`
  padding: 20px;
  border-radius: 4px;
  width:90%;
  margin-left:20px;
  background:#F4F4F6;
  color:#383743;
  border:none;
`;

const AreaSpace3 = styled.div`
  margin-bottom:20px;
  display:flex;
  justify-content: space-between;
  background: #fff ;
  opacity: 0.6;
`;

const SubmitButton = styled.button`
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
  flex: 1;
`;



//page-style end 

/* 下面的要把style都丟上去style compoents  */

const ResetPhoneNumber = () => {
  const [code, setCode] = useState("")
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
          <Setting1>{t("googleAuth")}</Setting1>
          <div> </div>
        </ TopAreaRight>


      </TopArea>


      <Inside>

        {/* <Notice>
          <NoticeP>為了你的帳戶安全，請謹慎選擇需要重置的項目，系統將根據您的操作行為決定是否禁用提現48小時。
          </NoticeP>
        </Notice> */}

        <Areaword>Googlge驗證碼</Areaword>

        <AreaSpace3>
          <AreaSpace2 placeholder="輸入驗證碼" onChange={(e)=>{setCode(e.target.value)}} value={code} />
        </AreaSpace3>
        <SubmitButton onClick={()=>{
          if(!code){
            alert("請輸入驗證碼")
          }else{
            setLoading(true)
            api.postData("/user/google-auth",{code:code}).then(x=>{
              console.log(x)
              setLoading(false)
              if(x.status !== 400){
                api.postData("/user/google-auth/verify",{code:code}).then(x=>{
                  console.log(x)
                  if(x.status !== 400){
                    navigation("/safe-setting")
                  }else{
                    alert(x.data.msg)
                  }
                })
              }else{
                alert(x.data.msg)
              }
            })
          }
        }}>
          <SubmitButtonWord>送出</SubmitButtonWord>
        </SubmitButton>


      </Inside >
      <Footer />
    </PageContainer >
    </LoadingOverlay>
  );
}

export default ResetPhoneNumber
