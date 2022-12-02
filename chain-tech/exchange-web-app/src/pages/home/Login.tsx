import React,{ useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/cancel.png";
import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// % context
import { useGlobalCtx } from "@/components/Layout/GlobalContext";

// import { isNil } from 'lodash'

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
const HeaderRight = styled.div`
  float: Right;
  display: flex;
  align-items: center;
  height: 44px;
`;
const SelectIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 7px;
`;

const Login = () => {
  // const { t } = useTranslation();
  const [username,setUsername] = useState("")
  const [loading,setLoading] = useState(false)
  const [isLoginPhone,setIsLoginPhone] = useState(false)
  const [password,setPassword] = useState("")
  const navigation = useNavigate()
  const { t } = useTranslation();

  // % context
  const { setIsLogin } = useGlobalCtx();

  return (
    <LoadingOverlay
    active={loading}
    spinner
  >
    <div style={{height:"100vh"}}>
    {true &&
        <div>
        <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            style={{ width: 28, height: 28 }}
            src={Cancel}
            alt="cancel"
            onClick={()=>{navigation("/home")}}
          />
        </HeaderLeft>
        <HeaderRight>
          <button style={{color:COLORS.Primary,fontSize:"16px",border:"none",backgroundColor:"transparent",fontWeight:600}} onClick={()=>{
            // setIsRegister(true)
            // setIsLogin(false)
            navigation("/Register")
          }}>
            <p>{t("signUp")}</p>
          </button>
        </HeaderRight>
      </HeaderContainer>
      {isLoginPhone ? 

      <div style={{padding:"16px"}}>
      <h2 style={{color:"#383743",fontSize:"32px",fontWeight:600,marginBottom:"16px"}}>{t("login")}</h2>
      <div style={{marginBottom:"24px"}}>
        {/* <button style={isLoginPhone ? {backgroundColor:"#5F5C70",borderRadius:"16px",padding:"5px 12px 5px 12px",border:"none",color:"#F4F4F6",fontSize:"14px",marginRight:"20px"}: {color:"#8F8DA2",fontSize:"14px",border:"none",backgroundColor:"transparent",marginRight:"20px"}} onClick={()=>{setIsLoginPhone(true)}}>手機</button> */}
        <button style={!isLoginPhone ? {backgroundColor:"#5F5C70",borderRadius:"16px",padding:"5px 12px 5px 12px",border:"none",color:"#F4F4F6",fontSize:"14px",marginRight:"20px"}: {color:"#8F8DA2",fontSize:"14px",border:"none",backgroundColor:"transparent"}} onClick={()=>{setIsLoginPhone(false)}}>{t("email")}</button>
      </div>
      <div style={{display:"flex",flexDirection:"row",width:"100%",marginBottom:"24px",justifyContent:"space-between"}}>
        <div style={{width:"30%"}}>
          <h2 style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>區碼</h2>
          <button style={{width:"100%",padding:"16px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}}>+886</button>
        </div>
        <div style={{width:"60%"}}>
          <h2  style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>{t("mobile")}</h2>
          <input placeholder="輸入手機號碼" style={{width:"100%",padding:"13px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}}/>
        </div>
      </div>
      <div style={{marginBottom:"48px"}}>
        <h2  style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>{t("password")}</h2>
        <input placeholder="輸入密碼" style={{width:"100%",padding:"13px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}}/>
      </div>
      <button style={{width:"100%",padding:"12px",backgroundColor:COLORS.Primary,fontSize:"14px",border:"none",borderRadius:"4px",color:"white"}}>{t("login")}</button>
      <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}} onClick={()=>{navigation("/forget")}}>忘記密碼？</button>
    </div>:

    <div style={{padding:"16px"}}>
    <h2 style={{color:"#383743",fontSize:"32px",fontWeight:600,marginBottom:"16px"}}>{t("login")}</h2>
    <div style={{marginBottom:"24px"}}>
      {/* <button style={isLoginPhone ? {backgroundColor:"#5F5C70",borderRadius:"16px",padding:"5px 12px 5px 12px",border:"none",color:"#F4F4F6",fontSize:"14px",marginRight:"20px"}: {color:"#8F8DA2",fontSize:"14px",border:"none",backgroundColor:"transparent",marginRight:"20px"}} onClick={()=>{setIsLoginPhone(true)}}>手機</button> */}
      {/* <button style={!isLoginPhone ? {backgroundColor:"#5F5C70",borderRadius:"16px",padding:"5px 12px 5px 12px",border:"none",color:"#F4F4F6",fontSize:"14px",marginRight:"20px"}: {color:"#8F8DA2",fontSize:"14px",border:"none",backgroundColor:"transparent"}} onClick={()=>{setIsLoginPhone(false)}}>信箱</button> */}
    </div>
    <div style={{marginBottom:"24px"}}>
      <h2  style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>{t("email")}</h2>
      <input placeholder="輸入電子信箱" style={{width:"100%",padding:"13px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}} onChange={
        event => {
          setUsername(event.target.value)
        }
      }
      />
    </div>
    <div style={{marginBottom:"48px"}}>
      <h2  style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>{t("password")}</h2>
      <input placeholder="輸入密碼" type="password" style={{width:"100%",padding:"13px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}} onChange={event => setPassword(event.target.value)}/>
    </div>
    <button style={{width:"100%",padding:"12px",backgroundColor: COLORS.Primary ,fontSize:"14px",border:"none",borderRadius:"4px",color:"white"}} onClick={()=>{
      setLoading(true)
      api.postData("/auth/login",{account:username,password:password}).then(x=>{
        console.log(x)
        setLoading(false)

        if(x.status === 401){
          alert("帳號密碼錯誤")
        }else if(x.status !== 400){
          localStorage.setItem("token",x.data.token)
          localStorage.setItem("user",JSON.stringify(x.data.user))
          setIsLogin(true);
          navigation("/home")
          window.location.reload()
        }
      })
    }}>{t("login")}</button>
    <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}} onClick={()=>{navigation("/forget")}}>{t("forgetPass")}？</button>
  </div>
      }
      </div>
      }
    </div>
      </LoadingOverlay>

  );
};

export default Login;
