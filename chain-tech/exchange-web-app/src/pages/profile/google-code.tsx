/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import Copy from "../../assets/profile/copy.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";
import api from "../../common/api"
import {useState,useEffect} from "react"
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

const CopyImg = styled.img`
  width:18px;
  height:20px;
`;

const ImageButton = styled.button`
  width:24px;
  height:24px;
  background:none;
  border:none;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */


const ResetPhoneNumber = () => {
  const navigation = useNavigate()
  const [code,setCode] = useState("")
  const { t } = useTranslation();
  const getCode = () =>{
    api.getData("/user/google-auth").then(x=>{
      console.log(x)
      setCode(x.data)
    })  
  }
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getCode()
    }
  })
  function copyToClipboard(text){
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
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

        <Areaword>請複製下方代碼後至 Google 驗證 APP 貼上。</Areaword>
        <div style={{display:"flex",alignItems:"center",marginTop:"30px"}}>
          <h2 style={{color:"#383743",fontSize:"24px",fontWeight:700}}>{code}</h2>
          <ImageButton onClick={()=>{
            copyToClipboard(code)
            alert("複製成功")
          }}>
            <CopyImg src={Copy} alt="" />
          </ImageButton>
        </div>

        <SubmitButton onClick={()=>{
          navigation("/google-verify")
        }}>
          <SubmitButtonWord>{t("nextStep")}</SubmitButtonWord>
        </SubmitButton>


      </Inside >
      <Footer />
    </PageContainer >
  );
}

export default ResetPhoneNumber
