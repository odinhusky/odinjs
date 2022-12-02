import React ,{useState} from "react";
import Footer from "../../../components/footer/HomeFooter";
import styled from "styled-components";
import Back from "../../../assets/fund/back.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Next from "../../../assets/fund/next_gray.png";
import Drawer from '../../../components/UI/Drawer'
import Payment from "../../../assets/fund/payment.png";
import Check from "../../../assets/fund/check.png";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  padding: 16px 16px 16px 0px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  text-align:center;
  background-color:white;
  margin-bottom:1px;
  
`;

const Container = styled.div`
  padding: 16px 0 16px 0;
  height:65px;
  width:100%;
  margin:auto;
  background-color:white;
  
`;


const BackButton = styled.button`
  border:none;
  background-color:transparent;
  width:40px;
  height:30px;
  float:left;
  margin-top:-5px;
  margin-left:-10px;
`

const Title = styled.h2`
  color:#383743;
  font-size:16px;
  font-weight:600;
`

const BackImg = styled.img`
  width: 30px;
  height: 30px;
`;


const Withdraw = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate()
  const [isDrawer,setIsDrawer] = useState(false)
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div style={{flex:1}}>
        <Header>
          <BackButton onClick={()=>{navigation(-1)}}>
            <BackImg src={Back} />
          </BackButton>
        <Title>{t("widthdraw")}</Title>
        </Header>
       
        <Container>
          <div style={{backgroundColor:"white",paddingBottom:"16px"}}>
              <div style={{textAlign:"center",width:"95%",margin:"auto",marginTop:"15px",flex:1}}>
               
                <h2 style={{textAlign:"left",color:"#5F5C70",fontSize:"13px",fontWeight:500,marginTop:"10px"}}>{t("fundFiat")}</h2>
                <button style={{width:"100%",backgroundColor:"#F4F4F6",border:"none",borderRadius:"4px",padding:"16px 10px 16px 10px",textAlign:"left",marginTop:"10px",marginBottom:"10px"}} onClick={()=>{
                  setIsDrawer(true)
                }}>
                  <p style={{float:"left",color:"#BDBCC8"}}>USD</p>
                  <img src={Next} style={{width:"7px",height:"14px",float:"right"}} alt=""/>
                </button>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <h2 style={{textAlign:"left",color:"#5F5C70",fontSize:"13px",fontWeight:500}}>金額</h2>
                  <p style={{color:"#383743",fontSize:"12px",fontWeight:400}}>{t("availableU")} 0.17947065 BTC</p>
                </div>
                <div style={{width:"100%",backgroundColor:"#F4F4F6",border:"none",borderRadius:"4px",padding:"16px 10px 16px 10px",textAlign:"left",marginTop:"10px"}}>
                <input type="text" style={{backgroundColor:"transparent",border:"none",fontSize:"15px",fontWeight:400,width:"100%"}} placeholder="輸入提現金額"/>
                </div>
                <h2 style={{textAlign:"left",color:"#5F5C70",fontSize:"13px",fontWeight:500,marginTop:"10px",marginBottom:"10px"}}>提現方式</h2>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",border:"1px solid #5F5C70",padding:"16px",borderRadius:"4px"}}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <img src={Payment} alt="" style={{width:"28px",height:"28px"}}/>
                        <div style={{marginLeft:"10px"}}>
                          <h2 style={{color:"#383743",fontSize:"14px",fontWeight:500,marginBottom:"5px"}}>{t("fiatOrderNum")}</h2>
                          <p style={{color:"#8F8DA2",fontSize:"12px",fontWeight:400}}>5 USD {t("withdrawFee")}</p>
                        </div>
                    </div>
                    <img src={Check} alt="" style={{width:"24px",height:"24px"}}/>
                </div>

              </div>
          </div>
          <div style={{padding:"16px",position:"absolute",bottom:0,marginBottom:"80px",width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500}}>{t("withdrawFee")}</p>
                <p style={{color:"#383743",fontSize:"15px",fontWeight:400}}>0.00000000 BTC</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500}}>實際到帳</p>
                <p style={{color:"#383743",fontSize:"24px",fontWeight:700}}>0 BTC</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <button style={{backgroundColor:"#D32F2F",color:"white",borderRadius:"4px",width:"100%",padding:"16px 0 16px 0",border:"none",opacity:"0.5"}}>{t("widthdraw")}</button>
            </div>
          </div>
        </Container>
        <Drawer isVisible={isDrawer} selectVisible={()=>{}} height={270}>
            <div>
              {/* <button style={{border:"none",backgroundColor:"transparent"}} onClick={()=>{
                  setIsDrawer(false)
                }}>
                <img src={Cancel} alt="" style={{width:"15px",height:"15px"}}/>
              </button> */}
                 <h2 style={{textAlign:"center",color:"#383743",fontSize:"16px",fontWeight:600}}>{t("network")}</h2>
                 {/* <button  style={{border:"none",backgroundColor:"transparent",color:"#8F8DA2",fontSize:"14px",fontWeight:500}} onClick={()=>{
                  setIsDrawer(false)
                }}>確定</button> */}
            </div>
            <button style={{height:"35px",marginBottom:"10px",border:"none",borderBottom:"1px solid #F4F4F6",width:"100%",backgroundColor:"transparent"}}  onClick={()=>{
           setIsDrawer(false)
            }}>
            <p style={{marginLeft:"10px",color:"#BDBCC8",fontSize:"14px",fontWeight:600}}>Ethereum</p>
            
          </button>
          <button style={{height:"35px",marginBottom:"10px",border:"none",borderBottom:"1px solid #F4F4F6",width:"100%",backgroundColor:"transparent"}}  onClick={()=>{
           setIsDrawer(false)
            }}>
            <p style={{marginLeft:"10px",color:"#BDBCC8",fontSize:"14px",fontWeight:600}}>BTC</p>
            
          </button>
          <button style={{height:"35px",marginBottom:"10px",border:"none",borderBottom:"1px solid #F4F4F6",width:"100%",backgroundColor:"transparent"}}  onClick={()=>{
            setIsDrawer(false)
            }}>
            <p style={{marginLeft:"10px",color:"#BDBCC8",fontSize:"14px",fontWeight:600}}>Bitcoin Chain</p>
            
          </button>
          <button style={{height:"35px",marginBottom:"10px",border:"none",width:"100%",backgroundColor:"transparent"}}  onClick={()=>{
            setIsDrawer(false)
            }}>
            <p style={{marginLeft:"10px",color:"#BDBCC8",fontSize:"14px",fontWeight:600}}>Bitcoin SmartChain</p>
            
          </button>
          
         </Drawer>
          
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default Withdraw;
