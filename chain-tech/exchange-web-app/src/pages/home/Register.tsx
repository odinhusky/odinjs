import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/cancel.png";
import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
// import { useNavigate } from "react-router-dom";
import coolIconWhite from '../../assets/home/coolicon-white.png'
import coolIcon from '../../assets/home/coolicon.png'
import { useNavigate } from "react-router-dom";
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

const Register = () => {
  // const { t } = useTranslation();
  const [isRegister] = useState(true)
  const [isRegisterPhone, setIsRegisterPhone] = useState(true)
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [read, setIsRead] = useState(false)
  const [emailVerify, setEmailVerify] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const { t } = useTranslation();
  const navigation = useNavigate()

  return (
    <LoadingOverlay
      active={loading}
      spinner
    >
      <div style={{ height: "100vh" }}>
        {isRegister &&
          <div>
            <HeaderContainer>
              <HeaderLeft>
                <SelectIcon
                  style={{ width: 28, height: 28 }}
                  src={Cancel}
                  alt="cancel"
                  onClick={() => { navigation("/home") }}
                />
              </HeaderLeft>
              <HeaderRight>
                <button style={{ color: COLORS.Primary, fontSize: "16px", border: "none", backgroundColor: "transparent", fontWeight: 600 }} onClick={() => {
                  navigation("/login")
                }}>
                  <p>{t("login")}</p>
                </button>
              </HeaderRight>
            </HeaderContainer>
            {isRegisterPhone ?

              <div style={{ padding: "16px" }}>
                <h2 style={{ color: "#383743", fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>{t("signUp")}</h2>
                <div style={{ marginBottom: "24px" }}>
                  <button style={isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent", marginRight: "20px" }} onClick={() => { setIsRegisterPhone(true) }}>{t("mobile")}</button>
                  <button style={!isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsRegisterPhone(false) }}>{t("email")}</button>
                </div>
                <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: "24px", justifyContent: "space-between" }}>
                  <div style={{ width: "30%" }}>
                    <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>區碼</h2>
                    <button style={{ width: "100%", padding: "16px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onClick={() => {
                    }}>+886</button>
                  </div>
                  <div style={{ width: "60%" }}>
                    <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("mobile")}</h2>
                    <input placeholder="輸入手機號碼" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>密碼</h2>
                  <input placeholder="輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setRegisterPassword(event.target.value)
                  }} />
                  {registerPassword.length !== 0 && registerPassword.length < 8 &&
                    <p style={{ color: COLORS.Primary, fontSize: "12px", marginTop: "3px" }}>請輸入8位以上密碼</p>
                  }
                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("passConfirm")}</h2>
                  <input placeholder="再次輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("referralCode")}</h2>
                  <input placeholder={t("optional")} style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", alignItems: "center" }}>
                  <button style={{ border: "none", backgroundColor: "transparent" }}><img src={read ? coolIcon : coolIconWhite} alt="" style={{ width: "15px", height: "15px", marginTop: "2px" }} onClick={() => {
                    setIsRead(!read)
                  }} /></button>
                  <p style={{ color: "#5F5C70", fontSize: "12px" }}>{t("iAgree")} <span style={{ color: COLORS.Primary, fontSize: "12px" }}>《服務條款》</span></p>
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: COLORS.Primary, fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }}>{t("signUp")}</button>
                {/* <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}}>忘記密碼？</button> */}
              </div> :

              <div style={{ padding: "16px" }}>
                <h2 style={{ color: "#383743", fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>{t("signUp")}</h2>
                <div style={{ marginBottom: "24px" }}>
                  <button style={isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent", marginRight: "20px" }} onClick={() => { setIsRegisterPhone(true) }}>{t("mobile")}</button>
                  <button style={!isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsRegisterPhone(false) }}>{t("email")}</button>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("email")}</h2>
                  <input placeholder="輸入電子信箱" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={
                    event => {
                      setUsername(event.target.value)
                      if (event.target.value.length >= 8) {
                        api.postData("/auth/account/check", { account: event.target.value }).then(x => {
                          if (x.status === "OK") {
                            setEmailVerify(true)
                          } else {
                            setEmailVerify(false)
                          }
                        })
                      }
                    }
                  } />
                  {
                    (username.length > 8 && !emailVerify) && <p style={{ color: COLORS.Primary, fontSize: "12px", marginTop: "3px" }}>此電子信箱已註冊為會員</p>
                  }
                  {
                    (username.length < 8 && username.length > 0) && <p style={{ color: COLORS.Primary, fontSize: "12px", marginTop: "3px" }}>電子信箱不得小於8位</p>
                  }

                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>密碼</h2>
                  <input placeholder="輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setRegisterPassword(event.target.value)
                  }} />
                  {registerPassword.length !== 0 && registerPassword.length < 8 &&
                    <p style={{ color: COLORS.Primary, fontSize: "12px", marginTop: "3px" }}>請輸入8位以上密碼</p>
                  }
                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("passConfirm")}</h2>
                  <input placeholder="再次輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setConfirmPassword(event.target.value)
                  }} />
                  {registerPassword && confirmPassword && registerPassword !== confirmPassword &&
                    <p style={{ color: COLORS.Primary, fontSize: "12px", marginTop: "3px" }}>密碼不一致，請重新輸入</p>
                  }
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("referralCode")}</h2>
                  <input placeholder={t("optional")} style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setPromoCode(event.target.value)
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", alignItems: "center" }}>
                  <button style={{ border: "none", backgroundColor: "transparent" }}><img src={read ? coolIcon : coolIconWhite} alt="" style={{ width: "15px", height: "15px", marginTop: "2px" }} onClick={() => {
                    setIsRead(!read)
                  }} /></button>
                  <p style={{ color: "#5F5C70", fontSize: "12px" }}>{t("iAgree")} <span style={{ color: "#A60008", fontSize: "12px" }}>《服務條款》</span></p>
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: COLORS.Primary, fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }} onClick={() => {
                  // console.log("123")
                  // console.log("456")


                  if (!username) {
                    alert("請輸入信箱")
                  } else if (username.length < 8) {
                    alert("信箱不得小於8位")
                  } else if (!registerPassword) {
                    alert("請輸入密碼")
                  } else if (registerPassword.length < 8) {
                    alert("密碼不得小於8碼")
                  } else if (registerPassword !== confirmPassword) {
                    alert("密碼不一致請重新輸入")
                  } else if (!read) {
                    alert("請先同意服務條款")
                  } else if (!emailVerify) {
                    alert("此電子信箱已註冊為會員")
                  } else {
                    setLoading(true)
                    api.postData("/auth/email/verify-code", { email: username }).then(x => {
                      console.log(x)
                      if (x.status === 400) {
                        alert(x.data.msg)
                      } else {
                        setLoading(false)
                        localStorage.setItem("email", username)
                        localStorage.setItem("password", registerPassword)
                        localStorage.setItem("promoCode", promoCode)
                        navigation("/emailVerify")
                      }

                    })
                  }
                }}>{t("signUp")}</button>
                {/* <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}}>{t("forgetPass")}？</button> */}
              </div>
            }

          </div>

        }

      </div>
    </LoadingOverlay>

  );
};

export default Register;
