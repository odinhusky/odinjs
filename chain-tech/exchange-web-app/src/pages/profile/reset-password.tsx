/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";
import {useState,useEffect} from "react"
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
  display: flex, 
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
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false);
  const [originPassword, setOriginPassword] = useState("")
  const [, setEmail] = useState("")
  const [, setPhone] = useState("")
  const [count,setCount] = useState(0)
  const [count2,setCount2] = useState(0)
  const [emailSend, setEmailSend] = useState(false);
  const [phoneSend, setPhoneSend] = useState(false);
  const { t } = useTranslation();
  const [, setKyc] = useState({
    phone: false
  });
  useEffect(()=>{
    setPhone(JSON.parse(localStorage.getItem("user")!).phone)
    setEmail(JSON.parse(localStorage.getItem("user")!).account)
    if(localStorage.getItem("token")){
      api.getData("/user/security").then(x => {
        // console.log(x)
        setKyc(x.data);
      });
    }
    if(emailSend){
      setTimeout(()=>{
        if(count > 0){
          setCount(c => c - 1)    
        }
      },1000)
    }
    if(count === 0){
      setEmailSend(false)
    }
  },[count,emailSend])

  useEffect(()=>{
    if(phoneSend){
      setTimeout(()=>{
        if(count2 > 0){
          setCount2(c => c - 1)
        }
      },1000)
    }
    if(count2 === 0){
      setPhoneSend(false)
    }
  },[count2,phoneSend])
  
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
          <ChangeAccountName>重設密碼</ChangeAccountName>

        </ TopAreaRight>
      </TopArea>

      <Inside>
      <PassWord>{t("oldPass")}</PassWord>
        <AreaSpace
        >
          <AreaContent>
            <Words type="password" placeholder="請輸入登入密碼" onChange={(e)=>{
              setOriginPassword(e.target.value)
            }}/>

            {/* <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun> */}
          </AreaContent>
        </AreaSpace>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <PassWord>{t("newPass")}</PassWord>
        </div>
        <AreaSpace
        >
          <AreaContent>
            <Words type="password" placeholder={t("enterNewPass")} onChange={(e)=>{
              setPassword(e.target.value)
            }}/>

            {/* <CloseEyeButtun>
              <Link to="/area-zone">
                <CloseEyeImg src={ClosEye} alt="閉眼" />
              </Link>
            </CloseEyeButtun> */}
          </AreaContent>
        </AreaSpace>
        
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <PassWord>{t("checkNewPass")}</PassWord>
        </div>
        <AreaSpace
        >
          <AreaContent>
            <Words type="password" placeholder={t("enterAgainNewPass")} onChange={(e)=>{
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
          if(!originPassword){
            alert(t("enterOldPass"))
          }else if(!password){
            alert("請輸入新密碼")
          }else if(password.length < 8){
            alert("密碼不得小於8碼")
          }else if(!confirmPassword){
            alert("請輸入新密碼確認")
          }else if(password !== confirmPassword){
            alert("新密碼與新密碼確認不相同，請重新輸入")
          }else{
            setLoading(true)
            api.postData("/user/reset/password",{current:originPassword,changed:password}).then(x=>{
            setLoading(false)
            if(x.status !== 400){
              navigation(-1)
              alert("重設成功")
            }else{
              alert(x.data.msg)
            }
          })
          }
          
        }}>
          <SaveButtonWord>重設</SaveButtonWord>
        </SaveButton>

      </Inside >
      <Footer />
    </PageContainer >
    </LoadingOverlay>
  );
}

export default SetTheFundPassword 
