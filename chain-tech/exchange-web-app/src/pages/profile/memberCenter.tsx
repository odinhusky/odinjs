/* 引入styled components */
import styled from "styled-components";
/* 下面放圖片 */
import avatar from "../../assets/profile/circle.png";
import swap from "../../assets/profile/swap.png";
import back from "../../assets/profile/back.png";
import check from "../../assets/profile/check.png";
import help from "../../assets/profile/help.png";
import edit from "../../assets/profile/edit.png";
import Footer from "../../components/footer/HomeFooter";
//轉向網址
import { useLocation } from "react-router-dom";
import api from "../../common/api"
import { useEffect, useState } from "react"
//page-style compoents start
import { useNavigate } from "react-router-dom";
import Drawer from "../../components/UI/Drawer";
import cancel from "../../assets/icon/cancel.png";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

const Email = styled.div`
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 22px;
  color: #f4f4f6;
`;

const ID = styled.div`
  font-family: PingFang TC;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: #dedde3;
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

const TopArea = styled.div`
  background: #383743;
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
  height: 120px;
`;

const TopAreaItems = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 68px;
`;

const Avatar = styled.div`
  margin-left: 16px;
  margin-top: 10px;

`;

const EmailSetting = styled.div`
  margin-left: 16px;
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


// const LineWord = styled.div`
//   display: inline-block;
//   font-size: 13px;
// `;

// const JaoPayWord = styled.div`
//   display: inline-block;
//   font-size: 13px;
// `;

const DrawerFullWarehouseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;
const DrawerFullWarehouseTitle = styled.p`
  flex: 1;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;


//page-style end

/* 下面的要把style都丟上去style compoents  */


const MemberCenter = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate()
  const [role, setRole] = useState("user");
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const [obj, setObj] = useState({
    "accountCreatedTime": 7606317426,
    "averageConfirmTime30days": 0,
    "averagePayTime30days": 0,
    "buyCompleteAmount": 0,
    "buyCompleteOrdersCount": 0,
    "completeAmount30days": 0,
    "completeOrders30daysCount": 0,
    "completeOrders30daysRate": 0,
    "completeUsers": 0,
    "firstCompleteTime": 0,
    "sellCompleteAmount": 0,
    "sellCompleteOrdersCount": 0,
  });
  const [user, setUser] = useState({
    "buyFeeRate": 0,
    "forbiddens": [],
    "sellFeeRate": 0,
    "advertiserDeposit": 0,
    "advertiserLevel":{
      name:""
    }
  });
  const [kyc, setKyc] = useState({
    "financePwd": false,
    "googleAuth": false,
    "kyc": null,
    "phone": true,
  });

  useEffect( () => {
    let user = localStorage.getItem("user")
    api.get(`/otc/api/user/${JSON.parse(user!).account}/otcOrders/statistics?type=advertiser`).then(x=>{
      setObj(x)
    })
    api.get(`/otc/api/user/${JSON.parse(user!).account}`).then(x=>{
      console.log(x)
      setUser(x)
    })
    api.get("/user/security").then(x=>{
      console.log(x.data)
      setKyc(x.data)
    })
    
  }, [])
  useEffect( () => {
    let user = localStorage.getItem("user")
    api.get(`/otc/api/user/${JSON.parse(user!).account}/otcOrders/statistics?type=${role}`).then(x=>{
      setObj(x)
    })
  }, [role])

  return (
    <PageContainer>
      <TopArea>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16, marginTop: 10 }}>
          <img src={back} alt="" style={{ width: 28, height: 28 }} onClick={()=>{navigation("/c2c")}}/>
          {role === "user" ? 
          <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ color: "#F4F4F6", fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500 }}>{t("switchMch")}</p>
          <img src={swap} alt="" style={{ width: 28, height: 28, marginLeft: 5 }} onClick={()=>{setRole("advertiser")}}/>
        </div>:
        <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ color: "#F4F4F6", fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500 }}>{t("switchUser")}</p>
        <img src={swap} alt="" style={{ width: 28, height: 28, marginLeft: 5 }} onClick={()=>{setRole("user")}}/>
      </div>}
          
        </div>
        <TopAreaItems>
          <Avatar>
            <AvatarImg src={avatar} alt="avatar" />
          </Avatar>
          <EmailSetting>
            <div style={{display:"flex",alignItems:"center"}}>
            <Email>abc123</Email>
            <img src={edit} alt="" style={{width:20,height:20,marginLeft:5}} onClick={()=>{navigation("/editName")}}/>

            </div>
            {role === "user" ? 
            <ID>{t("verifiedUser")}</ID>:
            <ID>{t("verifiedMch")}</ID>}
          </EmailSetting>
        </TopAreaItems>
      </TopArea>

      <div style={{ background: "#F0F0F0", flex: 1,overflow:"scroll",height:"100vh",paddingBottom:200 }}>
        <div style={{ width: "100%", background: "white", height: 52, marginTop: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 16, paddingRight: 16 }}>
          <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("verifyStatus")}</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            {kyc.phone && <>
              <p style={{ fontFamily: "PingFang TC", fontSize: 12, fontWeight: 400, color: "#383743" }}>{t("mobile")}</p>
              <img src={check} alt="" style={{ width: 14, height: 14, marginLeft: 5, marginRight: 5 }} />
            </>}
            <p style={{ fontFamily: "PingFang TC", fontSize: 12, fontWeight: 400, color: "#383743" }}>{t("email")}</p>
            <img src={check} alt="" style={{ width: 14, height: 14, marginLeft: 5, marginRight: 5 }} />
            {kyc.kyc && <>
              <p style={{ fontFamily: "PingFang TC", fontSize: 12, fontWeight: 400, color: "#383743" }}>身份</p>
              <img src={check} alt="" style={{ width: 14, height: 14, marginLeft: 5, marginRight: 5 }} />
            </>}           
            {/* <p style={{ fontFamily: "PingFang TC", fontSize: 12, fontWeight: 400, color: "#383743" }}>質押</p>
            <img src={check} alt="" style={{ width: 14, height: 14, marginLeft: 5, marginRight: 5 }} /> */}
          </div>
        </div>
        <div style={{ width: "100%", background: "white", display: "flex", flexDirection:"column",alignItems:"center" }}>
          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("thirtyDaysDeal")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.completeOrders30daysCount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("thirtyDaysDealRate")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.completeOrders30daysRate}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>%</p>
              </div>
            </div>
          </div>
          <div style={{width:"93%",height:1,backgroundColor:"#F4F4F6"}}></div> 
          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("thirtyDaysAvgSellTime")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.averageConfirmTime30days > 0 ? obj.averageConfirmTime30days/(1000*60) : obj.averageConfirmTime30days}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("minutes")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("thirtyDaysAvgBuyTime")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.averagePayTime30days > 0 ? obj.averagePayTime30days/(1000*60) : obj.averagePayTime30days}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("minutes")}</p>
              </div>
            </div>
          </div> 
          <div style={{width:"93%",height:1,backgroundColor:"#F4F4F6"}}></div> 

          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("accountEst")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.accountCreatedTime > 0 ? (obj.accountCreatedTime/(1000*60*60*24)).toFixed(0):obj.accountCreatedTime}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("days")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("firstDealtill")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.firstCompleteTime > 0 ?(obj.firstCompleteTime/(1000*60*60*24)).toFixed(0):obj.firstCompleteTime}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("days")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("dealPeopleNum")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.completeUsers}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("people")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("dealNum")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.buyCompleteOrdersCount + obj.sellCompleteOrdersCount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}></p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.buyCompleteOrdersCount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("fiatOrderBuy")}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 5,marginRight:5 }}>|</p>                
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.sellCompleteOrdersCount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("fiatOrderSell")}</p>
              </div>
            </div>
          </div> 
          <div style={{width:"93%",height:1,backgroundColor:"#F4F4F6"}}></div> 
          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("thirtyDaysDealAmount")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.completeAmount30days}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>USDT</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("totalDealAmount")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{obj.buyCompleteAmount + obj.sellCompleteAmount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>USDT</p>
              </div>
            </div>
          </div> 
          <div style={{width:"93%",height:1,backgroundColor:"#F4F4F6"}}></div> 
          {role === "advertiser" && <>
          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("stackLevel")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{user.advertiserLevel ? user.advertiserLevel.name :t("noLevel")}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("maxAmountPer")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>0</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("maxAmountPerDay")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>0</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("fiatBuyFee")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>0</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center",marginTop:16}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("fiatSellFee")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>0</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>{t("times")}</p>
              </div>
            </div>
          </div> 
          <div style={{width:"93%",height:1,backgroundColor:"#F4F4F6"}}></div> 
          <div style={{ width: "100%",display:"flex",flexDirection:"column", padding: 16 }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("restrictTime")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
              <img src={help} alt="" style={{width:24,height:24}} onClick={()=>{setModalVisible(true)}}/>
              </div>
            </div>
          </div> 
          </>}
        </div>
        <Drawer
            isVisible={modalVisible}
            selectVisible={()=>{}}
            height={200}
          >
            <DrawerFullWarehouseTitleContainer>
              <DrawerFullWarehouseImage
                src={cancel}
                alt="cancel"
                onClick={()=>{setModalVisible(false)}}
              />
              <DrawerFullWarehouseTitle>
                {t("restrictTime")}
              </DrawerFullWarehouseTitle>
            </DrawerFullWarehouseTitleContainer>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"#8F8DA2",fontWeight:500,fontSize:13}}>{t("adsRestrict")}</p>
              <p style={{color:"#383743",fontWeight:500,fontSize:13}}>0</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"#8F8DA2",fontWeight:500,fontSize:13}}>{t("fiatRestrict")}</p>
              <p style={{color:"#383743",fontWeight:500,fontSize:13}}>0</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"#8F8DA2",fontWeight:500,fontSize:13}}>{t("transferRestrict")}</p>
              <p style={{color:"#383743",fontWeight:500,fontSize:13}}>0</p>
            </div>
          </Drawer>    
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default MemberCenter;
