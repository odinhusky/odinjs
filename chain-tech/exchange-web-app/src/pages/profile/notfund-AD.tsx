/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";

import Footer from "../../components/footer/PageFooter";
import add from "../../assets/profile/add.png";
import notfundAD from "../../assets/profile/notfundAD.png";


import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


// page-style compoents start:

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

const TopAreaRight = styled.div`
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

const AddImg = styled.img`
  width: 14px;
  height: 14px;
`;

const AddButton = styled.button`
  border: none ;
  background: none ;
  margin-right: 15px;
`;

const Border = styled.div`
  margin-left: 20px;
  margin-top: 8px ;
  border-bottom: #5F5C70 2px solid;
  width: 45%;
`;

const OnlineP = styled.p`
 color: #383743;
 font-weight: 500;
 font-size: 14px;

`;

const OffLineP = styled.p`
  color: #8F8DA2;
  font-size: 14px;
`;

const OnLineOffLineButton = styled.button`
  border: none;
  background: none;
`;


const OnLineOffLineArea = styled.div`
  display: flex;
  justify-content: space-around;
`;

const NotFundADImg = styled.img`
  width: 137px;
  height: 135 ;
  margin-left: 137px;
  margin-top: 56px;
`;

const NoADP = styled.p`
  margin-top: 30px;
  text-align: center ;
  color: #383743;
  font-weight: 600;
  font-size: 16px;
`;

const ADP = styled.p`
  margin-top: 10px;
  text-align: center;
  color: #BDBCC8;
  font-size: 13px;
`;

const NewADButton = styled.button`
  margin-top: 63px;
  margin-left: 36px;
  width: 343px;
  height: 44px;
  border: none;
  background: #D32F2F ;
  color: #FFFFFF;
  border-radius: 4px;
`;
//page-style end

/* 下面的要把style都丟上去style compoents  */

const NotFundAD = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div style={{ borderBottom: "#F4F4F6 solid 2px", height: "76px" }}>
        <TopArea>
          <TopAreaRight>
            <Link to="/profile">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <AD>{t("myAds")}</AD>

            <AddButton>
              <AddImg src={add} alt="add" />
            </AddButton>

          </TopAreaRight>
        </TopArea>

        <OnLineOffLineArea>
          <OnLineOffLineButton>
            <OnlineP>{t("online")}</OnlineP>
          </OnLineOffLineButton>

          <Link to="/myAD2">
            <OnLineOffLineButton>
              <OffLineP>{t("offline")}</OffLineP>
            </OnLineOffLineButton>
          </Link>

        </OnLineOffLineArea>
        <Border />
      </div>

      <Inside>
        <NotFundADImg src={notfundAD} alt="notfundAD" />
        <div>
          <NoADP>尚無廣告</NoADP>
          <ADP>尚無在線廣告，請新增並發布廣告。</ADP>
        </div>
        <NewADButton><p style={{ fontSize: "14px" }}>新增廣告</p></NewADButton>
      </Inside>
      <Footer />
    </PageContainer >
  );
};

export default NotFundAD;