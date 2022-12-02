import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
// import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import backIcon from "../../assets/icon/back.png";
import SuperiorityFirstIcon from "../../assets/icon/firstIcon.png";
import PartnerLogo1 from "../../assets/icon/logo1.png";
import PartnerLogo2 from "../../assets/icon/logo2.png";
import PartnerLogo3 from "../../assets/icon/logo3.png";

const Container = styled.div`
  overflow: hidden;
`;
const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  color: #383743;
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.Dark_gray};
  height: 44px;
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
`;
const NavImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 12px;
`;
const TitleContainer = styled.div`
  width: 100%;
  height: 412px;
  background: ${COLORS.Dark_gray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 0 25px 0 39px;
`;
const CompanyTitle = styled.p`
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  color: ${COLORS.EXLight_gray};
  margin-bottom: 25px;
`;
const CompanyIntro = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.Light_gray};
  line-height: 24px;
`;
const PartnerContainer = styled.div`
  width: 100%;
  height: 368px;
  background: ${COLORS.EXLight_gray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
`;
const PartnerTitle = styled.p`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  color: ${COLORS.Dark_gray};
  margin-bottom: 40px;
  text-align: center;
  line-height: 30px;
`;
const LogoContainer = styled.div`
  width: 464px;
  height: 198px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LogoImage = styled.img`
  width: 104px;
  height: 50px;
  margin: 0 8px;
`;
const IntroCompanyContainer = styled.div`
  width: 100%;
  height: 570px;
  background: ${COLORS.Light_gray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 0 32px;
`;
const IntroCompanyImage = styled.div`
  width: 188px;
  height: 188px;
  border-radius: 8px;
  opacity: 0.32;
  background: ${COLORS.Light_gray};
  margin-bottom: 30px;
`;
const IntroCompanyContent = styled.p`
  height: 192px;
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.Gray};
  line-height: 24px;
`;
const SuperiorityContainer = styled.div`
  width: 100%;
  height: 1386px;
  background: ${COLORS.EXLight_gray};
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  padding: 0 16px;
`;
const CardContainer = styled.div`
  width: 100%;
  height: 230px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin-bottom: 10px;
`;
const CardTitle = styled.p`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  color: ${COLORS.Dark_gray};
  line-height: 30px;
  margin-bottom: 10px;
`;
const CardContent = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.Mid_gray};
  line-height: 24px;
`;

const AboutModal: React.FC = () => {
    return (
        <Container>
            <HeaderContainer>
                <HeaderLeft>
                    <LinkText to="/member">
                        <NavImage src={backIcon} alt="language" />
                    </LinkText>
                </HeaderLeft>
            </HeaderContainer>
            <TitleContainer>
                <CompanyTitle>企業理念標題</CompanyTitle>
                <CompanyIntro>
                    企業理念內文企業理念內文企業理念內文企業理念內文企業理念內文企業理念內文企業理念內文企業理念內文企業理念內文
                </CompanyIntro>
            </TitleContainer>
            <PartnerContainer>
                <PartnerTitle>合作夥伴</PartnerTitle>
                <LogoContainer>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 24,
                        }}
                    >
                        <LogoImage src={PartnerLogo1} alt="logo" />
                        <LogoImage src={PartnerLogo1} alt="logo" />
                        <LogoImage src={PartnerLogo1} alt="logo" />
                    </div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 24,
                        }}
                    >
                        <LogoImage src={PartnerLogo2} alt="logo" />
                        <LogoImage src={PartnerLogo2} alt="logo" />
                        <LogoImage src={PartnerLogo2} alt="logo" />
                        <LogoImage src={PartnerLogo2} alt="logo" />
                    </div>
                    <div
                        style={{ width: "100%", display: "flex", justifyContent: "center" }}
                    >
                        <LogoImage src={PartnerLogo3} alt="logo" />
                        <LogoImage src={PartnerLogo3} alt="logo" />
                        <LogoImage src={PartnerLogo3} alt="logo" />
                    </div>
                </LogoContainer>
            </PartnerContainer>
            <IntroCompanyContainer>
                <IntroCompanyImage />
                <PartnerTitle style={{ marginBottom: 30 }}>企業介紹</PartnerTitle>
                <IntroCompanyContent>
                    企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文
                    企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文企業介紹內文
                </IntroCompanyContent>
            </IntroCompanyContainer>
            <SuperiorityContainer>
                <PartnerTitle
                    style={{ marginBottom: 24, marginTop: 60, textAlign: "left" }}
                >
                    企業優勢
                </PartnerTitle>
                {[1, 2, 3].map((e) => {
                    return (
                        <CardContainer>
                            <img
                                src={SuperiorityFirstIcon}
                                alt="icon"
                                style={{ width: 82, height: 82 }}
                            />
                            <CardTitle>優勢標題</CardTitle>
                            <CardContent>
                                企業優勢內文企業優勢內文企業優勢內文企業優勢內文企業優勢內文企業優勢內文企業優勢內文企業優勢內文
                            </CardContent>
                        </CardContainer>
                    );
                })}
                <PartnerTitle
                    style={{ marginBottom: 24, marginTop: 60, textAlign: "left" }}
                >
                    團隊介紹
                </PartnerTitle>
                <div style={{ width: "100%" }}>
                    <div
                        style={{
                            display: "inline-block",
                            width: 163,
                            height: 183,
                            borderRadius: 8,
                            position: "relative",
                            marginBottom: 16,
                            marginRight: 16,
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1628890920690-9e29d0019b9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            alt="avatar"
                            style={{
                                width: 163,
                                height: 183,
                                borderRadius: 8,
                                position: "absolute",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            width: 163,
                            height: 183,
                            borderRadius: 8,
                            position: "relative",
                            marginBottom: 16,
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            alt="avatar"
                            style={{
                                width: 163,
                                height: 183,
                                borderRadius: 8,
                                position: "absolute",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            width: 163,
                            height: 183,
                            borderRadius: 8,
                            position: "relative",
                            marginRight: 16,
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1601168658155-24ba806c086a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            alt="avatar"
                            style={{
                                width: 163,
                                height: 183,
                                borderRadius: 8,
                                position: "absolute",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            width: 163,
                            height: 183,
                            borderRadius: 8,
                            position: "relative",
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                            alt="avatar"
                            style={{
                                width: 163,
                                height: 183,
                                borderRadius: 8,
                                position: "absolute",
                            }}
                        />
                    </div>
                </div>
            </SuperiorityContainer>
        </Container>
    );
};

export default AboutModal;
