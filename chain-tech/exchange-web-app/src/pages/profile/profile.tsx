/* 引入styled components */
import styled from "styled-components";
/* 下面放圖片 */
import avatar from "../../assets/profile/personal.png";
// import LinePay from "../../assets/profile/LinePay.png";
// import StreetCorner from "../../assets/profile/StreetCorner.png";
import time from "../../assets/profile/time.png";
import arrow from "../../assets/profile/arrow.png";
import Footer from "../../components/footer/HomeFooter";
//轉向網址
import { useLocation, Link } from "react-router-dom";
import api from "../../common/api"
import { useEffect,useState } from "react"
//page-style compoents start
import { useTranslation } from "react-i18next";

const Email = styled.div`
  font-family: Open Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 22px;
  color: #f4f4f6;
`;

const ID = styled.div`
  font-family: Open Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #dedde3;
`;

const SafeLeft = styled.div`
  width: 80%;
  float: left;
  color: #333333;
`;

const Saferight = styled.div`
  width: 52px;
  height: 52px;
`;

const AcountAll = styled.div`
  margin: 30px;
  background: #ffffff;
  border-radius: 8px;
`;

const Account = styled.div`
  color: #333333;
  display: flex;
  justify-content: space-between;
`;


const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AvatarImg = styled.img`
  width: 52px;
  height: 52px;
  margin-bottom: 10px;
`;

const MyAd1 = styled.div`
  margin: 30px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 10px 0px 0px 10px;
`;

const MyAd2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MyAdSelf = styled.div`
  color: #383743;
  font-weight: bold;
  font-size: 16px;
`;

const MyAdBS = styled.div`
  margin: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Income = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #383743;
`;

const TradedUser = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #383743;
`;

const SuggestUser = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #383743;
`;

const TopArea = styled.div`
  background: #d32f2f;
  display: flex;
  align-items: flex-end;
  height: 94px;
`;

const TopAreaItems = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 68px;
`;

const Avatar = styled.div`
  margin-left: 32px;
  margin-top: 10px;
`;

const EmailSetting = styled.div`
  margin-left: 16px;
`;

const SafeItems = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SafeSetting = styled.p`
  width: 100%;
  color: #383743;
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
  white-space:nowrap;
  margin-left: -10px;
`;

const SafeNumber = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-weight: bold;
  margin-left: 20px;
`;

const AccountSetting = styled.div`
  margin: 30px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  height: 76px;
  padding: 16px 6px 6px 6px;
  background: #fff;
`;

const ArrowButtun = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: -5px;
  margin-left: 60px;
`;

const ArrowButtun3 = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: -5px;
`;
const ArrowButtun2 = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: 10px;
`;


// const Line = styled.img`
//   width: 18px;
//   height: 18px;
//   margin-right: 15px;
// `;

// const JaoPay = styled.img`
//   width: 18px;
//   height: 18px;
//   margin-right: 15px;
// `;

const AccountWord = styled.p`
  color: #383743;
  font-weight: 700;
  font-family:Open Sans;
  font-size: 16px;
  padding: 14px;
`;

const SettingWords = styled.div`
  margin-top: 10px;
  color: #8f8da2;
  font-size: 13px;
  font-weight:500;
  font-family:Open Sans;
  margin-left:5px;
`;

const TimePng = styled.img`
  width: 36px;
  height: 36px;
  margin-left: 20px;
`;

// const LineWord = styled.div`
//   display: inline-block;
//   font-size: 13px;
// `;

// const JaoPayWord = styled.div`
//   display: inline-block;
//   font-size: 13px;
// `;

const ActingAll = styled.div`
  text-align: left;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px 9px 18px 16px;
  margin: 30px;
  margin-bottom:100px;
`;

const ActingInside = styled.div`
  width: 100%;
`;

const ActingWords = styled.div`
  textalign: left;
  color: #383743;
  font-weight: bold;
  font-size: 16px;
  hight: 30px;
  line-hight: 30px;
`;

const ActingForm = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IncomeWord = styled.div`
  color: #8f8da2;
  font-size: 13px;
`;

const IncomeNum = styled.div`
  color: #383743;
  font-size: 16px;
  font-weight: 700;
  font-family:Open Sans;
`;

const TradWords = styled.div`
  color: #8f8da2;
  font-size: 13px;
`;

const TradNum = styled.div`
  color: #383743;
  font-size: 16px;
  font-weight: 700;
  font-family:Open Sans;
`;

const SugWords = styled.div`
  color: #8f8da2;
  font-size: 13px;
`;

const SugNum = styled.div`
  color: #383743;
  font-size: 16px;
  font-weight: 700;
  font-family:Open Sans;
`;

const IncomeBackground = styled.div`
  background: #ffffff;
`;

//page-style end

/* 下面的要把style都丟上去style compoents  */


const Profile = () => {
  const location = useLocation().pathname;
  const [count, setCount] = useState(1);
  const [, setPayment] = useState([]);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);

  const [memberNumber, setMemberNumber] = useState(0);
  const [, setRecord] = useState([]);
  const [tradeMembers, setTradeMembers] = useState([]);
  const [sum, setSum] = useState(0);
  const { t } = useTranslation();
  const getAccount = ()=>{
    api.getData("/user/security").then(x=>{
      api.get("/user/payment").then(x=>{
        console.log(x)
        setPayment(x.data)
      })
    })
  }
  const getStatus = ()=>{
    api.getData("/user/security").then(x=>{
      console.log(x.data)
      if(x.data.kyc === "PERMIT"){
        setCount(prev => prev + 1)
      }
      if(x.data.phone){
        setCount(prev => prev + 1)
      }
      if(x.data.googleAuth){
        setCount(prev => prev + 1)
      }
      if(x.data.financePwd){
        setCount(prev => prev + 1)
      }
    })
  }
  const getAd = ()=>{
    let buy = 0
    let sell = 0
    api.getData("/otc/api/advertisement/?my=true").then(x=>{
      console.log(x)
      for(let i = 0;i<x.length;i++){
        if(x[i].type === 0 && x[i].status !== -1){
          buy = buy + x[i].price * x[i].totalTradingAmount
          setBuyCount(buy)
        }else if(x[i].type === 1 && x[i].status !== -1){
          sell = sell + x[i].price * x[i].totalTradingAmount
          setSellCount(sell)
        }
      }
    })
  }
  const getRebate = ()=>{
    api.get("/investor/commission").then(x=>{
      // console.log(x.data)
      let sum = 0
      setMemberNumber(x.data.memberNumber)
      setRecord(x.data.records.reverse())
      setTradeMembers(x.data.tradeMembers)
      for(let i = 0;i < x.data.records.length ; i++){
        sum = sum + x.data.records[i].amount
      }
      setSum(sum)
    })
  }
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getStatus()
      getAccount()
      getAd()
      getRebate()
    }
  },[])
  return (
    <PageContainer>
      <TopArea>
        <TopAreaItems>
          <Avatar>
            <AvatarImg src={avatar} alt="avatar" />
          </Avatar>
          <EmailSetting>
            {localStorage.getItem("token") 
            ? <>
            <Email>{JSON.parse(localStorage.getItem("user")!).account}</Email>
            <ID>用戶ID: {JSON.parse(localStorage.getItem("user")!).userId.slice(0,10)}</ID>
            </>:
            <>
            <Email>{t("notSignIn")}</Email>
            {/* <ID>用戶ID: 92610012</ID> */}
            </>}
          </EmailSetting>
        </TopAreaItems>
      </TopArea>

      <div style={{ background: "#F0F0F0", flex: 1 }}>
        <AccountSetting>
          <SafeLeft>
            <Link to="/safe-setting">
              <button style={{ border: "none", background: "none" }}>
                <SafeItems>
                  <SafeSetting>{t("security")}</SafeSetting>

                  <SafeNumber>
                    <p style={{ color: "red",fontFamily:"Open Sans",fontWeight:500 }}>{localStorage.getItem("token") ? count : 0}</p>
                    <p style={{ marginRight: "100px", color: "black",fontFamily:"Open Sans",fontWeight:500 }}>/5</p>
                  </SafeNumber>
                </SafeItems>
              </button>
            </Link>

            <SettingWords>{t("googleAuth")}、{t("idAuth")}、{t("fundPass")}</SettingWords>
          </SafeLeft>
          <div style={{ width: "20%", float: "right" }}>
            <div style={{ width: "50%", display: "inline-block" }}>
              <Saferight>
                <TimePng src={time} alt="設置" />
              </Saferight>
            </div>
          </div>

          {/* </Safe> */}
        </AccountSetting>

        <AcountAll>
        <Link to="/c2c">
          <div>
            <Account>
              <div>
                <AccountWord>{t("fiatManage")}</AccountWord>
              </div>

              <ArrowButtun2>
                <img src={arrow} alt="arrow" />
              </ArrowButtun2>
            </Account>
          </div>
          </Link>

          {/* <AccountFormAll>
            {payment.length !== 0 ? payment.map((x:any)=>{
              return(
                <AccountForm>
                  <CTBC src={card} alt="卡片" />
                  <CTBCWord>({x.code}) {x.account} </CTBCWord>
                </AccountForm>
              )
            }) : <p style={{fontSize:13,marginLeft:10,marginBottom:10}}>尚無資料</p>
          }
          </AccountFormAll> */}
        </AcountAll>

        <MyAd1>
          <MyAd2>
            <MyAdSelf>
              <p
                style={{ fontWeight: 600, color: "#383743", marginLeft: "3px" }}
              >
                {t("myAds")}
              </p>
            </MyAdSelf>

            <div>
              <Link to="/myAD">
                <ArrowButtun>
                  <img src={arrow} alt="arrow" />
                </ArrowButtun>
              </Link>
            </div>
          </MyAd2>

          {/*  以下沒辦法sytle component 會跑版  */}
          <div>
            <MyAdBS>
              <p
                style={{
                  textAlign: "left",
                  color: "#29A370",
                  background: "#FFFFFF",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily:"Open Sans"
                }}
              >
                {t("fiatOrderBuy")} USDT
              </p>

              <div style={{ display: "flex", color: "#383743" }}>
                <p
                  style={{
                    fontSize: "12px",
                    marginRight: "10px",
                    alignItems: "center",
                    lineHeight: "15px",
                    fontFamily:"Open Sans",
                    fontWeight:600
                  }}
                >
                  NT$
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: 10,
                    fontWeight: 700,
                    fontFamily:"Open Sans"
                  }}
                >
                  {buyCount}
                </p>
              </div>
            </MyAdBS>

            <MyAdBS>
              <p
                style={{
                  color: "#D32F2F",
                  background: "#FFFFFF",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily:"Open Sans"
                }}
              >
                {t("fiatOrderSell")} BTC
              </p>

              <div style={{ display: "flex", color: "#383743" }}>
                <p
                  style={{
                    fontSize: "12px",
                    marginRight: "10px",
                    alignItems: "center",
                    lineHeight: "15px",
                    fontFamily:"Open Sans",
                    fontWeight:600
                  }}
                >
                  NT$
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: 10,
                    fontWeight: 700,
                    fontFamily:"Open Sans"
                  }}
                >
                 {sellCount}
                </p>
              </div>
            </MyAdBS>
          </div>
        </MyAd1>

        <ActingAll>
          <ActingInside>
            <Link to="/profile/Rebate">
              <ActingForm>
                <div>
                  <ActingWords>{t("referralManage")}</ActingWords>
                </div>

                <div>
                  <ArrowButtun3>
                    <img src={arrow} alt="arrow" />
                  </ArrowButtun3>
                </div>
              </ActingForm>
            </Link>
          </ActingInside>

          <IncomeBackground>
            <Income>
              <IncomeWord>{t("referralIncome")}</IncomeWord>
              <IncomeNum>{sum ? sum.toFixed(6):0}</IncomeNum>
            </Income>

            <TradedUser>
              <TradWords>{t("referralActiveMember")}</TradWords>
              <TradNum>{tradeMembers.length}</TradNum>
            </TradedUser>

            <SuggestUser>
              <SugWords>{t("referralAllMember")}</SugWords>
              <SugNum>{memberNumber}</SugNum>
            </SuggestUser>
          </IncomeBackground>
        </ActingAll>
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default Profile;
