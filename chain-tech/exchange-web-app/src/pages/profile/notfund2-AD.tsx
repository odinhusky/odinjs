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

const NotFundImg = styled.img`
  width: 137px;
  height: 135px;
  margin-left: 137px ;
  margin-top: 56px;
`;


//page-style end

/* 下面的要把style都丟上去style compoents  */

const NotFundAD = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div style={{ borderBottom: "#F4F4F6 solid 2px" }}>
        <TopArea>
          <TopAreaRight>
            <Link to="/profile">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <AD>{t("myAds")}</AD>

            <button style={{ border: "none", background: "none", marginRight: "15px" }}>
              <img style={{ width: "14px", height: "14px" }} src={add} alt="add" />
            </button>

          </TopAreaRight>
        </TopArea>

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-around" }}>
          <button style={{ border: "none", background: "none" }}>
            <p style={{ color: "#383743", fontWeight: 500, fontSize: "14px" }}>{t("online")}</p>
          </button>

          <Link to="/myAD2">
            <button style={{ border: "none", background: "none" }}>
              <p style={{ color: "#8F8DA2", fontSize: "14px" }}>{t("offline")}</p>
            </button>
          </Link>

        </div>

        <div style={{ marginLeft: "20px", marginTop: "10px", borderBottom: "#5F5C70 2px solid", width: "45%" }} />


      </div>

      <Inside>

        <NotFundImg src={notfundAD} alt="notfundAD" />

        <div>
          <p style={{ marginTop: "30px", textAlign: "center", color: "#383743", fontWeight: 600, fontSize: "16px" }}>尚無廣告</p>
          <p style={{ marginTop: "10px", textAlign: "center", color: "#BDBCC8", fontSize: "13px" }}>尚無在線廣告，請新增並發布廣告。</p>
        </div>

        <button style={{ marginTop: "63px", marginLeft: "36px", width: "343px", height: "44px", border: "none", background: "#D32F2F", color: "#FFFFFF", borderRadius: "4px" }}><p style={{ fontSize: "14px" }}>新增廣告</p></button>
      </Inside>
      <Footer />
    </PageContainer >
  );
};

export default NotFundAD;