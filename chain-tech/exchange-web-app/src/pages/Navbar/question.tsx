import React, { useState } from "react";
import QuestionHeader from "../../components/header/questiontHeader";
import AnnouncementModal from "../../components/modal/AnnouncementModal";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const ItemContainer = styled.div`
  flex: 1;
  width: 100%;
  background: #f4f4f6;
`;
const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const AccountItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 216px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ItemLightLight = styled.div`
  background: red;
  height: 6px;
  width: 6px;
  border-radius: 3px;
  margin-right: 12px;
`;
const PaymentItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 136px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const CurrencyDealItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 96px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ContractItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 136px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ContractDealItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 336px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const FundTransferItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 96px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const SecurityItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 176px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ContentTitle = styled.p`
  margin-bottom: 10px;
  font-weight: 600;
`;
const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Announcement = () => {
  // const [selectItem, setSelectItem] = useState("最新公告");
  const [navSelectItem, setNavSelectItem] = useState(false);
  const { t } = useTranslation();
  const selectContentHandler = () => {
    setNavSelectItem(v => !v);
  };
  return (
    <PageContainer>
      {navSelectItem ? (
        <AnnouncementModal
          navTitle={"會員帳號"}
          itemTitle={"如何設置 Google 驗證與身份驗證"}
          content={
            "<p>請根據以下指示進行實名認證：<br /><br /><br />1. 登錄火幣帳戶<br /><br /><br />2. 點擊右上角【會員中心】位置下拉式功能表的【安全設置】<br /><br />3. 填入自己的詳細資訊請嚴格根據以下要求填寫、避免認證過程延遲：證件必須是護照、身份證、駕照姓名和國家必須和證件保持完全一致，如果您來自臺灣，請選擇臺灣證件認證照片的要求：支持 JPG、PNG 格式；請不要上傳掃描件或複印件；照片必須小於 5MB；證件上的資訊須清晰可見，不允許任何修改和遮擋，必須能看清證件號和姓名。<br /><br /><br />4. 耐心等待審核即可，一般情況下 24 小時內即可完成審核。</p><br /><br /><br />"
          }
          setNavSelectItem={setNavSelectItem}
        />
      ) : (
        <>
          <QuestionHeader />
          <ItemContainer>
            <AccountItem>
              <ContentTitle>會員帳號</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何設置 Google 驗證與身份驗證</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何設置收付款資金密碼</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何邀請更多用戶獲得豐厚返佣</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何邀請更多用戶獲得豐厚返佣</p>
                </ListContainer>
              </ContentContainer>
            </AccountItem>
            <PaymentItem>
              <ContentTitle>{t("transferSpot")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何充值現貨</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何提現現貨</p>
                </ListContainer>
              </ContentContainer>
            </PaymentItem>
            <CurrencyDealItem>
              <ContentTitle>{t("transferFutures")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何劃轉資金</p>
                </ListContainer>
              </ContentContainer>
            </CurrencyDealItem>
            <ContractItem>
              <ContentTitle>{t("transferFutures")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何充值法幣</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何提現法幣</p>
                </ListContainer>
              </ContentContainer>
            </ContractItem>
            <ContractDealItem>
              <ContentTitle>{t("tradeFutures")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何開倉/平倉</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何選擇交易對</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何查看合約賬戶餘額</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何自行調整槓桿倍數</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何切換全倉/逐倉模式</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何撤銷委託單</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何降低強制平倉風險</p>
                </ListContainer>
              </ContentContainer>
            </ContractDealItem>
            <FundTransferItem>
              <ContentTitle>{t("fundingTransfer")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何劃轉資金</p>
                </ListContainer>
              </ContentContainer>
            </FundTransferItem>
            <ContractItem>
              <ContentTitle>{t("tradeFiat")}</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何買幣/賣幣</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何新增收付款方式</p>
                </ListContainer>
              </ContentContainer>
            </ContractItem>
            <ContractItem>
              <ContentTitle>法幣廣告</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何發佈廣告</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何管理我的廣告訂單</p>
                </ListContainer>
              </ContentContainer>
            </ContractItem>
            <SecurityItem>
              <ContentTitle>服務協議</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>合約手續費計算方式</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>合約市場介紹</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>使用條款與規則說明</p>
                </ListContainer>
              </ContentContainer>
            </SecurityItem>
          </ItemContainer>
        </>
      )}
    </PageContainer>
  );
};

export default Announcement;
