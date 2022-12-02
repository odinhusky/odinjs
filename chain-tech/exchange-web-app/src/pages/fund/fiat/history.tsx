import React from "react";
import Footer from "../../../components/footer/HomeFooter";
import styled from "styled-components";
import Back from "../../../assets/fund/back.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  text-align: center;
`;

const Container = styled.div`
  padding: 16px 0 16px 0;
  height: 65px;
  border-bottom: 1px solid #f4f4f6;
  width: 95%;
  margin: auto;
`;

const BackButton = styled.button`
  border: none;
  background-color: transparent;
  width: 40px;
  height: 30px;
  float: left;
  margin-top: -5px;
  margin-left: -10px;
`;

const Title = styled.h2`
  color: #383743;
  font-size: 16px;
  font-weight: 600;
`;

const BackImg = styled.img`
  width: 30px;
  height: 30px;
`;

const data = [
  {
    type: "充值",
    time: "2021-10-19 13:35:08",
    price: "0.002 BTC",
    category: "充值成功"
  },
  {
    type: "提現",
    time: "2021-10-19 13:35:08",
    price: "21,587 ETH",
    category: "提現成功"
  },
  {
    type: "充值",
    time: "2021-10-19 13:35:08",
    price: "10,793 ETH",
    category: "充值成功"
  }
];

const History = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate();
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div>
        <Header>
          <BackButton
            onClick={() => {
              navigation(-1);
            }}
          >
            <BackImg src={Back} />
          </BackButton>
          <Title>{t("depositRecord")}</Title>
        </Header>
        {data.map(x => {
          return (
            <Container>
              <div style={{ float: "left" }}>
                <p
                  style={{
                    color: "#383743",
                    fontSize: "15px",
                    marginBottom: "10px"
                  }}
                >
                  {x.type}
                </p>
                <p style={{ color: "#8F8DA2", fontSize: "12px" }}>{x.time}</p>
              </div>
              <div style={{ float: "right", textAlign: "right" }}>
                <p
                  style={{
                    color: "#383743",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px"
                  }}
                >
                  {x.price}
                </p>
                <p style={{ color: "#8F8DA2", fontSize: "12px" }}>
                  {x.category}
                </p>
              </div>
            </Container>
          );
        })}
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default History;
