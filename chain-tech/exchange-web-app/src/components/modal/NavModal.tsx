import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/cancel.png";
import Agent from "../../assets/icon/home/Vector.png";
// import { useTranslation } from "react-i18next";
import { ReactComponent as Next } from "../../assets/icon/next.svg";
import { NavLink } from "react-router-dom";
import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
// import { useNavigate } from "react-router-dom";
import coolIconWhite from '../../assets/home/coolicon-white.png'
import coolIcon from '../../assets/home/coolicon.png'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #383743;
`;

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
const ProfileContainer = styled.div`
  width: 100%;
  height: 102px;
  padding: 16px 16px 24px 16px;
  display: flex;
  align-items: center;
`;
const ProfileAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background: ${COLORS.Red};
  color: #fff;
  text-align: center;
  font-size: 24px;
  line-height: 52px;
  margin-right: 12px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const AccountEmail = styled.div`
  color: #5f5c70;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;
const AccountId = styled.div`
  color: ${COLORS.Mid_gray};
  font-size: 13px;
  font-weight: 600;
`;
const SelectContainer = styled.div`
  flex: 1;
  padding: 11px 16px;
`;
const SelectTable = styled.ul`
  width: 100%;
`;
const SelectItem = styled.li`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f6;
  font-weight: 400;
  font-size: 15px;
  color: #383743;
`;
const FooterContainer = styled.div`
  height: 154px;
  padding: 0px 16px;
`;
const RegisterButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  background: #d32f2f;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  background: #F4F4F6;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
`;

const DescriptionContainer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal: React.FC<{
  changeModal: (modal: string) => void;
}> = ({ changeModal }) => {
  // const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [isLoginPhone, setIsLoginPhone] = useState(true)
  const [isRegisterPhone, setIsRegisterPhone] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [read, setIsRead] = useState(false)
  const [emailVerify, setEmailVerify] = useState(false)
  const navigation = useNavigate()
  const { t } = useTranslation();
  return (
    <LoadingOverlay
      active={loading}
      spinner
    >
      <>
        {!isLogin && !isRegister &&
          <>
            <HeaderContainer>
              <HeaderLeft>
                <SelectIcon
                  style={{ width: 28, height: 28 }}
                  src={Cancel}
                  alt="cancel"
                  onClick={changeModal.bind(null, "NavModal")}
                />
              </HeaderLeft>
              <HeaderRight>
                <LinkText to="/online-support">
                  <SelectIcon style={{ marginRight: 12 }} src={Agent} alt="cancel" />
                </LinkText>
              </HeaderRight>
            </HeaderContainer>
            {
              localStorage.getItem("token") && localStorage.getItem("user") &&
              <ProfileContainer>
                <ProfileAvatar>A</ProfileAvatar>
                <ContentContainer>
                  <AccountEmail>{JSON.parse(localStorage.getItem("user")!).account}</AccountEmail>
                  <AccountId>ID: {JSON.parse(localStorage.getItem("user")!).userId.slice(0, 8) + "**********"}</AccountId>
                </ContentContainer>
              </ProfileContainer>
            }

            <SelectContainer>
              <SelectTable>
                <SelectItem>
                  <LinkText to="/announcement">
                    <p>{t("announcement")}</p>
                    <Next />
                  </LinkText>
                </SelectItem>
                <SelectItem>
                  <LinkText to="/user-guide">
                    <p>{t("guide")}</p>
                    <Next />
                  </LinkText>
                </SelectItem>
                <SelectItem>
                  <LinkText to="/question">
                    <p>{t("questions")}</p>
                    <Next />
                  </LinkText>
                </SelectItem>
                <SelectItem>
                  <LinkText to="/about">
                    <p>{t("aboutUs")}</p>
                    <Next />
                  </LinkText>
                </SelectItem>
                <SelectItem>
                  <LinkText to="/privacy">
                    <p>{t("privacy")}</p>
                    <Next />
                  </LinkText>
                </SelectItem>
              </SelectTable>
            </SelectContainer>
            {!localStorage.getItem("token") ?
              <FooterContainer>
                <RegisterButton onClick={() => {
                  navigation("/Register")
                }}>
                  <p>{t("signUp")}</p>
                </RegisterButton>
                <DescriptionContainer>
                  <p
                    style={{
                      marginRight: 4,
                      color: "#8F8DA2",
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    已有帳號?
                  </p>
                  <button style={{ border: "none", backgroundColor: "transparent", color: "#383743" }} onClick={() => {
                    navigation("/login")
                  }}>
                    <p
                      style={{
                        marginRight: 4,
                        color: "#383743",
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      {t("login")}
                    </p>
                  </button>
                </DescriptionContainer>
              </FooterContainer> :
              <FooterContainer>
                <LogoutButton onClick={() => {
                  setLoading(true)
                  // localStorage.removeItem("token")
                  // localStorage.removeItem("user")
                  // window.location.reload()
                  setLoading(false)
                }} style={{ marginTop: "30px" }}>
                  <p style={{ color: "#5F5C70", fontSize: "14px" }}>{t("logOut")}</p>
                </LogoutButton>
              </FooterContainer>
            }

          </>
        }
        {isLogin &&
          <div>
            <HeaderContainer>
              <HeaderLeft>
                <SelectIcon
                  style={{ width: 28, height: 28 }}
                  src={Cancel}
                  alt="cancel"
                  onClick={changeModal.bind(null, "NavModal")}
                />
              </HeaderLeft>
              <HeaderRight>
                <button style={{ color: "#D32F2F", fontSize: "16px", border: "none", backgroundColor: "transparent", fontWeight: 600 }} onClick={() => {
                  // setIsRegister(true)
                  // setIsLogin(false)  
                  navigation("/Register")
                }}>
                  <p>{t("signUp")}</p>
                </button>
              </HeaderRight>
            </HeaderContainer>
            {isLoginPhone ?

              <div style={{ padding: "16px" }}>
                <h2 style={{ color: "#383743", fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>{t("login")}</h2>
                <div style={{ marginBottom: "24px" }}>
                  <button style={isLoginPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent", marginRight: "20px" }} onClick={() => { setIsLoginPhone(true) }}>{t("mobile")}</button>
                  <button style={!isLoginPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsLoginPhone(false) }}>信箱</button>
                </div>
                <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: "24px", justifyContent: "space-between" }}>
                  <div style={{ width: "30%" }}>
                    <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>區碼</h2>
                    <button style={{ width: "100%", padding: "16px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }}>+886</button>
                  </div>
                  <div style={{ width: "60%" }}>
                    <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("mobile")}</h2>
                    <input placeholder="輸入手機號碼" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "48px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>密碼</h2>
                  <input placeholder="輸入密碼" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: "#D32F2F", fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }}>{t("login")}</button>
                <button style={{ backgroundColor: "transparent", fontSize: "14px", border: "none", color: "#8F8DA2", marginTop: "10px" }}>{t("forgetPass")}？</button>
              </div> :

              <div style={{ padding: "16px" }}>
                <h2 style={{ color: "#383743", fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>{t("login")}</h2>
                <div style={{ marginBottom: "24px" }}>
                  <button style={isLoginPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent", marginRight: "20px" }} onClick={() => { setIsLoginPhone(true) }}>{t("mobile")}</button>
                  <button style={!isLoginPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsLoginPhone(false) }}>信箱</button>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>電子信箱</h2>
                  <input placeholder="輸入電子信箱" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={
                    event => {
                      setUsername(event.target.value)
                    }
                  }
                  />
                </div>
                <div style={{ marginBottom: "48px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>密碼</h2>
                  <input placeholder="輸入密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => setPassword(event.target.value)} />
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: "#D32F2F", fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }} onClick={() => {
                  setLoading(true)
                  api.post("/auth/login", { account: username, password: password }).then(x => {
                    // console.log(x.data)
                    localStorage.setItem("token", x.data.token)
                    localStorage.setItem("user", JSON.stringify(x.data.user))
                    setLoading(false)
                    window.location.reload()
                  })
                }}>{t("login")}</button>
                <button style={{ backgroundColor: "transparent", fontSize: "14px", border: "none", color: "#8F8DA2", marginTop: "10px" }}>{t("forgetPass")}？</button>
              </div>
            }

          </div>

        }
        {isRegister &&
          <div>
            <HeaderContainer>
              <HeaderLeft>
                <SelectIcon
                  style={{ width: 28, height: 28 }}
                  src={Cancel}
                  alt="cancel"
                  onClick={changeModal.bind(null, "NavModal")}
                />
              </HeaderLeft>
              <HeaderRight>
                <button style={{ color: "#D32F2F", fontSize: "16px", border: "none", backgroundColor: "transparent", fontWeight: 600 }} onClick={() => {
                  setIsRegister(false)
                  setIsLogin(true)
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
                  <button style={!isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsRegisterPhone(false) }}>信箱</button>
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
                    <p style={{ color: "#D32F2F", fontSize: "12px", marginTop: "3px" }}>請輸入8位以上密碼</p>
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
                  <p style={{ color: "#5F5C70", fontSize: "12px" }}>{t("iAgree")} <span style={{ color: "#A60008", fontSize: "12px" }}>《服務條款》</span></p>
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: "#D32F2F", fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }}>{t("signUp")}</button>
                {/* <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}}>{t("forgetPass")}？</button> */}
              </div> :

              <div style={{ padding: "16px" }}>
                <h2 style={{ color: "#383743", fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>{t("signUp")}</h2>
                <div style={{ marginBottom: "24px" }}>
                  <button style={isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent", marginRight: "20px" }} onClick={() => { setIsRegisterPhone(true) }}>手機</button>
                  <button style={!isRegisterPhone ? { backgroundColor: "#5F5C70", borderRadius: "16px", padding: "5px 12px 5px 12px", border: "none", color: "#F4F4F6", fontSize: "14px", marginRight: "20px" } : { color: "#8F8DA2", fontSize: "14px", border: "none", backgroundColor: "transparent" }} onClick={() => { setIsRegisterPhone(false) }}>信箱</button>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>電子信箱</h2>
                  <input placeholder="輸入電子信箱" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={
                    event => {
                      setUsername(event.target.value)
                      if (event.target.value) {
                        api.postData("/auth/account/check", { account: event.target.value }).then(x => {
                          console.log(x.status)
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
                    (username && !emailVerify) && <p style={{ color: "#D32F2F", fontSize: "12px", marginTop: "3px" }}>此電子信箱已註冊為會員</p>
                  }

                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>密碼</h2>
                  <input placeholder="輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setRegisterPassword(event.target.value)
                  }} />
                  {registerPassword.length !== 0 && registerPassword.length < 8 &&
                    <p style={{ color: "#D32F2F", fontSize: "12px", marginTop: "3px" }}>請輸入8位以上密碼</p>
                  }
                </div>
                <div style={{ marginBottom: "38px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("passConfirm")}</h2>
                  <input placeholder="再次輸入8位以上密碼" type="password" style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} onChange={event => {
                    setConfirmPassword(event.target.value)
                  }} />
                  {registerPassword && confirmPassword && registerPassword !== confirmPassword &&
                    <p style={{ color: "#D32F2F", fontSize: "12px", marginTop: "3px" }}>密碼不一致，請重新輸入</p>
                  }
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <h2 style={{ color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginBottom: "5px" }}>{t("referralCode")}</h2>
                  <input placeholder={t("optional")} style={{ width: "100%", padding: "13px", backgroundColor: "#F4F4F6", fontSize: "15px", border: "none", borderRadius: "4px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", alignItems: "center" }}>
                  <button style={{ border: "none", backgroundColor: "transparent" }}><img src={read ? coolIcon : coolIconWhite} alt="" style={{ width: "15px", height: "15px", marginTop: "2px" }} onClick={() => {
                    setIsRead(!read)
                  }} /></button>
                  <p style={{ color: "#5F5C70", fontSize: "12px" }}>{t("iAgree")} <span style={{ color: "#A60008", fontSize: "12px" }}>《服務條款》</span></p>
                </div>
                <button style={{ width: "100%", padding: "12px", backgroundColor: "#D32F2F", fontSize: "14px", border: "none", borderRadius: "4px", color: "white" }} onClick={() => {
                  if (!username) {
                    alert("請輸入信箱")
                  } else if (!registerPassword) {
                    alert("請輸入密碼")
                  } else if (registerPassword !== confirmPassword) {
                    alert("密碼不一致請重新輸入")
                  } else if (!read) {
                    alert("請先同意服務條款")
                  } else if (!emailVerify) {
                    alert("此電子信箱已註冊為會員")
                  } else {
                    api.postData("/auth/email/check-code", { email: username }).then(x => {

                    })
                  }
                }}>{t("signUp")}</button>
                {/* <button  style={{backgroundColor:"transparent",fontSize:"14px",border:"none",color:"#8F8DA2",marginTop:"10px"}}>{t("forgetPass")}？</button> */}
              </div>
            }

          </div>

        }

      </>
    </LoadingOverlay>

  );
};

export default Modal;
