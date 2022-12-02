/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";

import Footer from "../../components/footer/PageFooter";
import add from "../../assets/profile/add.png";
import card from "../../assets/profile/card.png";





import { Link } from "react-router-dom";

import api from "../../common/api";
import {useEffect,useState} from "react"
// import Moment from "moment";
// page-style compoents start:
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
  position:relative;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;

`;

const TopArea3 = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const TopArea2 = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  height: 30px;
  margin-top: 10px;
  
`;

const AD = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  fontsize: 16px;
  font-weight: bold;
  margin-top:5px;
`;

const Inside = styled.div`
  background: none;
  flex: 1;
`;

const P1 = styled.p`
  color: #8F8DA2;
`;

const P2 = styled.p`
  margin-top: 10px;
  font-weight: 600 ;
 `;

const P3 = styled.p`
  margin-top: 15px;
  color: #8F8DA2;
`;

const BuyP = styled.p`
  font-size: 20px;
  color: #29A370;
  font-weight: bold;
`;

const SellP = styled.p`
  font-size: 20px;
  color: #D32F2F;
  font-weight: bold;
`;

const AddButton = styled.button`
  margin-top: 5px ;
  border: none ;
  background: none ;
  margin-right: 15px;
`;

const TopAreaLeft = styled.div`
  font-size: 12px;
`;

const AddImg = styled.img`
  width: 14px;
  height: 14px;
`;

const BorderLine = styled.div`
  margin-left: 200px;
  margin-top: 10px;
  border-bottom: #5F5C70 2px solid;
  width: 45%;
`;

const CardImg = styled.img`
  margin-right: 20px;
  width: 18.75px;
  height: 15px;
`;

const OFFLine = styled.div`
  color: #383743;
  font-size: 14px;
  font-weight: 500;
`;

const EditButton = styled.button`
  margin-top: 15px;
  border: none;
  background: #F4F4F6;
  line-height: 26px;
  width: 135px;
`;
const OnTheShelf = styled.button`
  margin-top: 15px;
  border: none;
  background: #F4F4F6 ;
  width: 135px;  
  line-height: 26px;
`;

const BuyArea = styled.div`
  margin-top: 20px;
  margin-left: 20px;
`;

const OnLineButton = styled.button`
  border: none ;
  background: none;
  
`;

const TopAreaRight = styled.div`
  font-size: 12px;
  margin-right: 20px;
`;

const BuyArea2 = styled.div`
 display: flex;
 justify-content: space-between;
`;

const OnLineP = styled.p`
 color: #8F8DA2;
 font-size: 14px;
`;

const OFFLineButton = styled.button`
 border: none;
 background:none;
 
`;

const Online = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CardDiv = styled.div`
  marginLeft: 60px;
`;




//page-style end

/* 下面的要把style都丟上去style compoents  */

const MyAD2 = () => {
  const [adList,setAdList] = useState([])
  const [buyFeeRate,setBuyFeeRate] = useState(0)
  const [sellFeeRate,setSellFeeRate] = useState(0)
  const navigation = useNavigate();
  const { t } = useTranslation();
  const getAd = () =>{
    api.get("/otc/api/advertisement/?my=true").then(x=>{
      setAdList(x)
      console.log(x)
    })
  }
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getAd()
      api.get("/otc/api/user/"+JSON.parse(localStorage.getItem("user")!).account).then(x=>{
        console.log(x)
        setBuyFeeRate(x.buyFeeRate)
        setSellFeeRate(x.sellFeeRate)
      })
    }
  },[])
  return (
    <PageContainer>
      <div>
        <TopArea>
          <TopArea2>
            <Link to="/profile">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <AD>{t("myAds")}</AD>

            <Link to="/FiatAdPage">
              <AddButton>
                <AddImg src={add} alt="add" />
              </AddButton>
            </Link>

          </TopArea2>
        </TopArea>

        <Online>
          <Link to="/myAD">
            <OnLineButton>
              <OnLineP>{t("online")}</OnLineP>
            </OnLineButton>
          </Link>

          <OFFLineButton>
            <OFFLine>{t("offline")}</OFFLine>
          </OFFLineButton>

        </Online>

        <BorderLine />

      </div>

      <Inside>
      {
            adList.map((x:any)=>{
              return(
                <>
                {x.status === 0 && 
                  <BuyArea>
                  <BuyArea2>
        
                    <div>
                    {x.type === 0 ? <BuyP>{t("fiatOrderBuy")} {x.cryptoAsset}/{x.fiatCurrency}</BuyP>: <SellP>{t("fiatOrderSell")} {x.cryptoAsset}/{x.fiatCurrency}</SellP>}
                      
                    </div>
                    <CardDiv>
                      <CardImg src={card} alt="card" />
                    </CardDiv>
                  </BuyArea2>
                  
                  <TopArea3>
                    <TopAreaLeft>
                      {/* <P1>數量(ETH)</P1>
                      <P2>{x.orderLimitMin}</P2> */}
                      <P1>廣告手續費率</P1>
                      <P2>{x.type === 0 ? buyFeeRate : sellFeeRate}</P2>
                      <P3>{t("limitedAmount")}(TWD)</P3>
                      <P2>{x.orderLimitMin} - {x.orderLimitMax}</P2>
                      {/* <P3>更新時間</P3>
                      <P2>2021-10-06 19:21:33</P2> */}
        
                      <OnTheShelf onClick={()=>{
                        api.put("/otc/api/advertisement/"+x.id+"/online").then(x=>{
                          console.log(x)
                          if(x.status!==400){
                            getAd()
                          }else{
                            alert(x.data.msg)
                          }
                        })
                      }}>重新上架</OnTheShelf>
                    </TopAreaLeft>
        
                    <TopAreaRight>
                      <P1>{t("tradeAmount")}</P1>
                      <P2>{x.totalTradingAmount}</P2>
                      
                      <P3>創建時間</P3>
                      <P2>              {`${new Date(x.createdDate).getFullYear()}-${new Date(x.createdDate).getMonth() < 10 ? "0"+(new Date(x.createdDate).getMonth()+1) : new Date(x.createdDate).getMonth()+1}-${new Date(x.createdDate).getDate() < 10 ? "0"+new Date(x.createdDate).getDate():new Date(x.createdDate).getDate()}`}
</P2>        
                      <EditButton  onClick={()=>{
                        localStorage.setItem("EditAd",JSON.stringify(x))
                        navigation("/EditFiatAdPage")
                      }}>編輯</EditButton>
                    </TopAreaRight>
        
                  </TopArea3>
                </BuyArea>
                }
                
              </>
              )
            })
          }
        

      </Inside>
      <Footer />
    </PageContainer >
  );
};

export default MyAD2;