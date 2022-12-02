import { useEffect, useState } from "react"
import styled from "styled-components";
import { COLORS } from "@/constants/colors";
import { useGlobalCtx } from '@/components/Layout/GlobalContext';
import { useTranslation } from "react-i18next";
import Cancel from "@/assets/icon/Deal/backArrow.png";
import { useNavigate } from "react-router-dom";
import api from "@/common/api";
import { Carousel, Row, Col } from 'antd';
import { Announcement } from "@/interfaces/exchange.interface";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  background: ${COLORS.EXLight_gray};
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 4px;
`;
const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;

const SelectIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const SetButton = styled.div`
  text-align: center;
  color: ${COLORS.Dark_gray};
  font-weight: 600;
`;

const Title = styled.h1`
    font-weight: 600;
    font-size: 24px;
    color: #383743;
    margin: 10px;
`;

const SubTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: ${COLORS.Light_gray};;
    margin: 10px;
`;

const CardContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin-bottom: 10px;
`;

const CardTitle = styled.p`
    display: inline;
`;

const CardContent = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.Mid_gray};
  line-height: 24px;
`;

const InstantTrend = () => {
    const { t } = useTranslation();
    const {
        currentLang,
    } = useGlobalCtx();
    const navigation = useNavigate();
    const [imgArr, setImgArr] = useState([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    useEffect(() => {
        api.get("/info/carousel?lang=" + currentLang).then(x => {
            setImgArr(x.data);
        });

        api.get("/info/announcement?topic=INSTANT_TREND&lang=" + currentLang).then(x => {
            setAnnouncements(x.data)
        })
    }, [currentLang]);

    return (
        <PageContainer>
            <HeaderContainer>
                <HeaderLeft>
                    <SelectIcon
                        src={Cancel}
                        alt="cancel"
                        onClick={() => {
                            navigation("/");
                        }}
                    />
                </HeaderLeft>
                <HeaderRight>
                    <SetButton>{t("realTimeTrend")}</SetButton>
                </HeaderRight>
            </HeaderContainer>
            <Title>全球區塊鏈與加密貨幣的重要新聞</Title>
            <SubTitle>透過區塊鏈與加密貨幣重新認識世界的科技讀物</SubTitle>
            <Carousel autoplay={true}>
                {imgArr.map((x: any) => {
                    return (
                        <img
                            key={x.imagePath}
                            src={x.imagePath}
                            style={{ width: "100%", borderRadius: 8 }}
                            alt=""
                        />
                    );
                })}
            </Carousel>
            {announcements.map((announcement) => {
                return (
                    <CardContainer>
                        <Row>
                            <Col span={10}>
                                <img
                                    src={announcement.thumbnail}
                                    alt="icon"
                                />
                            </Col>
                            <Col span={14}>
                                <CardTitle>{announcement.subject}</CardTitle>
                                <CardContent>{announcement.content}</CardContent>
                            </Col>
                        </Row>
                    </CardContainer>
                );
            })}
        </PageContainer>
    )
}

export default InstantTrend