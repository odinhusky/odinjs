import React ,{useState,useEffect} from "react";
import Footer from "../../../components/footer/HomeFooter";
import styled from "styled-components";
import Back from "../../../assets/fund/back.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import Qrqode from "../../../assets/fund/qrcode.png";
// import Next from "../../../assets/fund/next_gray.png";
import Copy from "../../../assets/fund/copy.png";
import Drawer from '../../../components/UI/Drawer'
import api from "../../../common/api"
import QRCode  from 'qrcode.react';
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color:#F4F4F6;
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


const Recharge = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate()
  const search = useLocation().search
  const [currency,setCurrency] = useState("")
  const [isDrawer,setIsDrawer] = useState(false)
  const [address,setAddress] = useState("")
  const { t } = useTranslation();
  function getWallet(){
    api.get("/investor/wallet").then(x=>{
      if(x.data){
        setAddress(x.data)
      }
    })
  }
  function copyToClipboard(text){
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  useEffect(()=>{
    setCurrency(search.split("=")[1])
    if(localStorage.getItem("token")){
      getWallet()
    }
  },[search])
  return (
    <PageContainer>
      <div style={{flex:1}}>
        <Header>
          <BackButton onClick={()=>{navigation(-1)}}>
            <BackImg src={Back} />
          </BackButton>
        <Title>{t("deposit")}{currency}</Title>
        </Header>
       
        <Container>
          <div style={{backgroundColor:"white",paddingBottom:"10px"}}>
              <div style={{textAlign:"center"}}>
              <QRCode
                  id="bill_qr_code_url"
                  value={address} //value引數為生成二維碼的連結 我這裡是由後端返回
                  size={140} //二維碼的寬高尺寸
                  fgColor="#000000"  //二維碼的顏色
              />
                  <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500,marginTop:"10px"}}>{t("addressOnlyUsdt")}</p>
              </div>
              <div style={{textAlign:"center",width:"95%",margin:"auto",marginTop:"15px",flex:1}}>
                <h2 style={{textAlign:"left",color:"#5F5C70",fontSize:"13px",fontWeight:500}}>{t("network")}</h2>
                <button style={{width:"100%",backgroundColor:"#F4F4F6",border:"none",borderRadius:"4px",padding:"16px 10px 16px 10px",textAlign:"left",marginTop:"10px"}} onClick={()=>{
                  // setIsDrawer(true)
                }}>
                  <p style={{float:"left"}}>TRC (TRC20)</p>
                  {/* <img src={Next} style={{width:"7px",height:"14px",float:"right"}} alt=""/> */}
                </button>
                <h2 style={{textAlign:"left",color:"#5F5C70",fontSize:"13px",fontWeight:500,marginTop:"15px"}}>{currency}{t("depositAddress")}</h2>
                <button style={{width:"100%",backgroundColor:"#F4F4F6",border:"none",borderRadius:"4px",padding:"16px 10px 16px 10px",marginTop:"10px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>{
                  copyToClipboard(address)
                  alert("複製成功")
                }}>
                  <p style={{width:"70%",flexWrap:"wrap",fontSize:"14px"}}>{address}</p>
                  <img src={Copy} style={{width:"28px",height:"28px",float:"right",marginTop:"-5px"}} alt=""/>
                </button>
              </div>
          </div>
          <div style={{padding:"16px",backgroundColor:"#F4F4F6"}}>
            <h2 style={{color:"#383743",fontSize:"16px",fontWeight:600}}>{t("depositInfo")}</h2>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500}}>{t("minDepositAmount")}</p>
                <p style={{color:"#383743",fontSize:"15px",fontWeight:400}}>0.00000001 {currency}</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500}}>{t("expectArriveBlock")}</p>
                <p style={{color:"#383743",fontSize:"15px",fontWeight:400}}>1 {t("blockConfirm")}</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",flexDirection:"row",marginTop:"20px"}}>
                <p style={{color:"#8F8DA2",fontSize:"13px",fontWeight:500}}>{t("expectArriveBlock")}</p>
                <p style={{color:"#383743",fontSize:"15px",fontWeight:400}}>2 {t("blockConfirm")}</p>
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

export default Recharge;
