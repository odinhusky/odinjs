/* 引入styled components */
import styled from "styled-components";


/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";

import Footer from "../../components/footer/PageFooter";
import add from "../../assets/profile/add.png";
import card from "../../assets/profile/card.png";
// import StreetCorner from "../../assets/profile/StreetCorner.png";
// import LinePay from "../../assets/profile/LinePay.png";

import {useEffect,useState} from "react"

import { Link } from "react-router-dom";
import api from "../../common/api";
// import Moment from "moment";
// page-style compoents start:
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position:relative;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;
`;

// const TopAreaRight = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
// `;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #FFFFFF;
  border: none;
  height: 30px;
  margin-top: 10px;
`;

const AD = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  font-size: 16px;
  font-weight: bold;
  margin-top:5px;
`;

const Inside = styled.div`
  background: none;
  flex: 1;
`;

// const LineButton = styled.button`
//   border: none;
//   background: none;
// `;

const AddButton = styled.button`
  margin-top:5px;
  border: none;
  background: none ;
  margin-right: 15px;
`;

const AddImg = styled.img`
  width: 14px;
  height: 14px;
`;

// const BuyImgArea = styled.div`
//   margin-top: 15px ;
//   display: flex ; 
//   justify-content: space-around;
// `;

// const LineP = styled.p`
//   color: #383743;
//   font-weight: 500;
//   font-size: 14px;
// `;

// const OffLineButton = styled.button`
//   border: none;
//   background: none;
// `;

// const OFFLineP = styled.p`
//   color: #8F8DA2 ;
//   font-size: 14px;
// `;

// const BorderLine1 = styled.div`
//   margin-left: 20px;
//   margin-top: 10px;
//   border-bottom: #5F5C70 2px solid;
//   width:45%;
// `;

const BorderLine2 = styled.div`
  margin-left: 50px;
  margin-top: 15px;
  border-bottom: #F4F4F6 1px solid;
  width: 90%;
`;

const BuyP = styled.p`
  margin-left: 20px ;
  font-size: 20px;
  color: #29A370;
  font-weight: bold;
`;
const SellP = styled.p`
  margin-left: 20px ;
  font-size: 20px;
  color: #D32F2F;
  font-weight: bold;
`;

const CardImg = styled.img`
  margin-right: 20px ;
  width: 18.75px;
  height: 15px;
`;

// const StreetCornerImg = styled.img`
//   margin-right: 25px ;
//   margin-top: -2px;
//   width: 18px ;
//   height: 18px;
// `;

const BuyTopArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BuyArea2 = styled.div`
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const BuyAreaRight = styled.div`
  width:35%;
  font-size: 12px;
`;

const BuyAreaLeft = styled.div`
  width:35%;

  font-size: 12px;
  margin-right: 40px;
`;

// const SoldP = styled.p`
//   margin-left: 20px;
//   font-size: 20px;
//   color: #29A370;
//   font-weight: bold;
// `;

// const CardIMg2 = styled.img`
//   margin-right: 17px;
//   width: 18.75px;
//   height: 15px;
// `;

// const LinePayImg = styled.img`
//   margin-right: 12px;
//   width: 19px;
//   height: 19px;
// `;

// const StreetCornerImg2 = styled.img`
//   margin-right: 25px;
//   margin-top: -2px;
//   width: 18px;
//   height: 18px;
// `;

// const SoldArea = styled.div`
//   margin-top: 20px;
//   /* margin-left: 20px; */
// `;

// const SoldAreaLeft = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const SoldAreaRight = styled.div`
//   margin-left: 20px;
//   margin-top: 20px;
//   display: flex;
//   justify-content: space-between;
// `;

const EditButton = styled.button`
  margin-top: 15px;
  border: none;
  background: #F4F4F6;
  line-height: 26px;
  width: 119%;
`;

const CloseButton = styled.button`
  margin-top: 15px;
  border: none;
  background: #F4F4F6 ;
  width: 115%;
  line-height: 26px;
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

const BuyArea1 = styled.div`
  margin-top: 20px;
  /* margin-left: 20px; */
`;

const NoticeArea = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  z-index:10;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;

const RemoveP = styled.p`
  text-align: center ;
  margin-top: 15px;
  font-size: 16px;
  color: #595959;
  font-weight: 500;
`;

const RemovePContent = styled.p`
  text-align: center;
  margin-top: 15px ;
  font-size: 14px;
  color: #595959;
  padding:11px;
`;
const NotAllow = styled.button`
 border: none;
 border-right: 1px solid #D9D9D9 ;
 background: none;
 font-size: 16px;
 width: 50%;
`;

const Allow = styled.button`
 border: none;
 background: none;
 font-size: 16px;
 width: 50%;
 color:#296DF1;
`;

const Windows1 = styled.div`
  border-radius: 18px;
  width: 270px;
  height: 126px;
  background: #FFFFFF;
  border-radius: 18;
`;

const Windows2 = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 40px;
  background: #fff;
  border-radius: 18px;
`;

const BorderLine = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  border-bottom: #5F5C70 2px solid;
  width: 45%;
`;


const TopArea2 = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const OnLineButton = styled.button`
  border: none ;
  background: none;
`;

const OnLineP = styled.p`
 color: #8F8DA2;
 font-size: 14px;
 font-weight: 500;
`;

const Online = styled.div`
  display: flex;
  justify-content: space-around;
`;

const OFFLine = styled.div`
  color: #383743;
  font-size: 14px;
  
`;

const OFFLineButton = styled.button`
 border: none;
 background:none;
`;

//page-style end

/* 下面的要把style都丟上去style compoents  */

const MyAD = () => {
  // const [Arrow2, setArrow2] = useState(false)
  const [adList,setAdList] = useState([])
  const [buyFeeRate,setBuyFeeRate] = useState(0)
  const [sellFeeRate,setSellFeeRate] = useState(0)
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
            <Link to="/member">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <AD>{t("myAds")}</AD>

            <Link to="/deal/FiatAdPage">
              <AddButton>
                <AddImg src={add} alt="add" />
              </AddButton>
            </Link>

          </TopArea2>
        </TopArea>

        <Online>
          
            <OnLineButton>
              <OnLineP>{t("online")}</OnLineP>
            </OnLineButton>
          
          <Link to="/myAD2">
          <OFFLineButton>
            <OFFLine>{t("offline")}</OFFLine>
          </OFFLineButton>
          </Link>
        </Online>

        <BorderLine />

      </div>

      <Inside>
        {
          adList.map((x:any)=>{
            return(
              <> 
              {x.status === 1 && 
                  <>
                    <BuyArea1>
                      <BuyTopArea>

                        <div>
              {x.type === 0 ? <BuyP>{t("fiatOrderBuy")} {x.cryptoAsset}/{x.fiatCurrency}</BuyP>: <SellP>{t("fiatOrderSell")} {x.cryptoAsset}/{x.fiatCurrency}</SellP>}
                        </div>

                        <div style={{ marginLeft: "60px" }}>
                          <CardImg src={card} alt="card" />
                          {/* <StreetCornerImg src={StreetCorner} alt="StreetCorner" /> */}
                        </div>
                      </BuyTopArea>


                      <BuyArea2>
                        <BuyAreaRight>
                          <P1>廣告手續費率</P1>
                          <P2>{x.type === 0 ? buyFeeRate : sellFeeRate}</P2>
                          <P3>{t("limitedAmount")}(TWD)</P3>
                          <P2>{x.orderLimitMin} - {x.orderLimitMax}</P2>
                          {/* <P3>更新時間</P3>
                          <P2>2021-10-23 20:10:04</P2> */}
                          <CloseButton   onClick={()=>{
                          api.put("/otc/api/advertisement/"+x.id+"/offline").then(x=>{
                            console.log(x)
                            if(x.status!==400){
                              getAd()
                            }else{
                              alert(x.data.msg)
                            }
                          })
                      }}>下架</CloseButton>
                        </BuyAreaRight>

                        <BuyAreaLeft>
                          <P1>{t("tradeAmount")}</P1>
                          <P2>{x.totalTradingAmount}</P2>
                          
                          <P3>創建時間</P3>
                          <P2>              {`${new Date(x.createdDate).getFullYear()}-${new Date(x.createdDate).getMonth() < 10 ? "0"+(new Date(x.createdDate).getMonth()+1) : new Date(x.createdDate).getMonth()+1}-${new Date(x.createdDate).getDate() < 10 ? "0"+new Date(x.createdDate).getDate():new Date(x.createdDate).getDate()}`}
</P2>
                          <EditButton onClick={()=>{
                            api.put("/otc/api/advertisement/"+x.id+"/close").then(x=>{
                              console.log(x)
                              if(x.status!==400){
                                getAd()
                              }else{
                                alert(x.data.msg)
                              }
                            })
                            
                          }}>關閉</EditButton>
                        </BuyAreaLeft>
                      </BuyArea2>
                    </BuyArea1>

                    <BorderLine2 />
                  </>   
              }
              
              </>
            )}
            )
        }
        

      </Inside>

      {false &&
        <NoticeArea>

          <Windows1>
            <div>
              <RemoveP>確定關閉？</RemoveP>
              <RemovePContent>廣告關閉後將自動移至您的下架廣告，並於法幣交易中下架。</RemovePContent>
            </div>
            <BorderLine>
            </BorderLine>

            <Windows2>
              <NotAllow><p>不允許</p></NotAllow>
              <Allow><p>允許</p></Allow>
            </Windows2>

          </Windows1>



        </NoticeArea>
      }


      <Footer />
    </PageContainer >
  );
};

export default MyAD;