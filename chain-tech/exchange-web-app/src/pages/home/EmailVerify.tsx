import React,{useState,useEffect} from "react";
import styled from "styled-components";
// import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/back.png";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
`;

const SelectIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 7px;
`;


const EmailVerify = () => {
  const [loading,setLoading] = useState(false)
  // const [code,setCode] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [promoCode,setPromoCode] = useState("")
  const [count,setCount] = useState(180)
  const navigation = useNavigate()
  const { t } = useTranslation();
  useEffect(()=>{
    setEmail(localStorage.getItem("email")!)
    setPassword(localStorage.getItem("password")!)
    setPromoCode(localStorage.getItem("promoCode")!)
    setTimeout(()=>{
      if(count > 0){
        setCount(c => c - 1)
      }
    },1000)
  },[count])

  return (
    <LoadingOverlay
    active={loading}
    spinner
  >
    <div style={{height:"100vh"}}>
    <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            style={{ width: 28, height: 28 }}
            src={Cancel}
            alt="cancel"
            onClick={()=>{navigation(-1)}}
          />
        </HeaderLeft>    
    </HeaderContainer>
    <div style={{display:"flex",flexDirection:"column",padding:16}}>
      <h2 style={{color:"#383743",fontSize:"24px",fontWeight:600,marginBottom:"30px"}}>{t("emailVerify")}</h2>
      <p  style={{color:"#5F5C70",fontSize:"15px",fontWeight:400,marginBottom:"5px"}}>請輸入您在信箱 <span style={{color:"#D32F2F",fontSize:"16px",fontWeight:700}}>{email}</span></p>
      <p  style={{color:"#5F5C70",fontSize:"15px",fontWeight:400,marginBottom:"34px"}}>收到的 6 位驗證碼</p>
      <p  style={{color:"##5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"10px"}}>郵件驗證碼</p>
      <input placeholder="輸入驗證碼" style={{background: "#F4F4F6",border:"none",borderRadius:"4px",color:"#BDBCC8",padding:"12px 16px 12px 16px",marginBottom:"10px"}}  onChange={event => {
        if(event.target.value.length === 6){
          setLoading(true)
          api.postData("/auth/email/check-code",{email:email,code:event.target.value}).then(x=>{
            if(x.status !== 400){
              api.postData("/auth/register",{account:email,password:password,password2:password,inviteCode:promoCode}).then(x=>{
                setLoading(false)
                console.log(x)
                if(x.status !== 400){
                  alert(x.msg)
                  navigation("/home")
                }else{
                  alert(x.data.msg)
                }
              })        
            }else{
              alert(x.data.msg)
              setLoading(false)
            }
          })
        }
      }}/>
      <p  style={{color:"#5F5C70",fontSize:"12px",fontWeight:400,marginBottom:"20px"}}>已發送 6 位驗證碼，請於 {Math.floor(count/60)}:{(count - Math.floor(count/60)*60) < 10 ? "0"+(count - Math.floor(count/60)*60) :(count - Math.floor(count/60)*60)} 內輸入</p>
      {count === 0
      &&  <button style={{border:"none",background:"#F4F4F6",color:"#5F5C70",fontSize:"14px",fontWeight:500,padding:"12px 12px 12px 12px",borderRadius:"4px",marginTop:"20px"}} onClick={()=>{       
        
      }}>重新發送</button>
      }
    </div>
    </div>
  </LoadingOverlay>

  );
};

export default EmailVerify;
