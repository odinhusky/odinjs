import React from "react"
import styled from "styled-components";
import nodata from "@/assets/icon/no-item-find.png";
import { COLORS } from "@/constants/colors";
import { useTranslation } from "react-i18next";
import Cancel from "@/assets/icon/Deal/backArrow.png";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${COLORS.EXLight_gray};
`;

const NoItemFindIcon = styled.img`
  width: 135px;
  height: 135px;
  margin: 60px auto 24px auto;
`;

const NoItemFindContent = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Light_gray};
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

const MissionContainerList = styled.div`
  width: 100%;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectTitle = styled.h1`

    font-weight: 600;
    font-size: 24px;
    color: #383743;
    margin: 10px;
`;

const MissionCenter = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

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
                    <SetButton>{t("welfare")}</SetButton>
                </HeaderRight>
            </HeaderContainer>
            <SelectTitle>{t("welfare")}</SelectTitle>
            <MissionContainerList>
                <NoItemFindIcon src={nodata} alt="no item" />
                <NoItemFindContent>
                    當前沒有任務
                </NoItemFindContent>
                <NoItemFindContent style={{marginBottom: "30%"}}>
                    更多任務敬請期待
                </NoItemFindContent>
            </MissionContainerList>
        </PageContainer>
    )
}

export default MissionCenter