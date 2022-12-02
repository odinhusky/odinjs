import React, { useState, useEffect } from "react";
import Footer from "../../../components/footer/HomeFooter";
import styled from "styled-components";
import Back from "../../../assets/fund/back.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../../common/api";
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

const History = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate();
  const [positionArray, setPositionArray] = useState([]);
  const { t } = useTranslation();
  const getPosition = () => {
    api.get("/investor/finance?type=20").then(x => {
      setPositionArray(x.data);
    });
  };
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      getPosition();
    }
  }, []);
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
        {positionArray.map((x: any) => {
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
                  {x.remark}
                </p>
                <p style={{ color: "#8F8DA2", fontSize: "12px" }}>
                  {" "}
                  {new Date(x.createdDate).getFullYear()}-
                  {new Date(x.createdDate).getMonth() + 1 < 10
                    ? "0" + (new Date(x.createdDate).getMonth() + 1)
                    : new Date(x.createdDate).getMonth() + 1}
                  -
                  {new Date(x.createdDate).getDate() < 10
                    ? "0" + new Date(x.createdDate).getDate()
                    : new Date(x.createdDate).getDate()}{" "}
                  {new Date(x.createdDate).getHours() < 10
                    ? "0" + new Date(x.createdDate).getHours()
                    : new Date(x.createdDate).getHours()}
                  :
                  {new Date(x.createdDate).getMinutes() < 10
                    ? "0" + new Date(x.createdDate).getMinutes()
                    : new Date(x.createdDate).getMinutes()}
                </p>
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
                  {x.payment.toFixed(2)} {x.coin}
                </p>
                <p style={{ color: "#29A370", fontSize: "12px" }}>
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
