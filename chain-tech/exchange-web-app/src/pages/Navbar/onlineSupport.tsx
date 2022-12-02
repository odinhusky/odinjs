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
  height: 376px;
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
  height: 176px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ContractItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 376px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const ContractDealItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 216px;
  padding: 16px;
  background: #fff;
  margin-top: 10px;
`;
const SecurityItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 216px;
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
          navTitle={"帳號與安全驗證"}
          itemTitle={"註冊帳號"}
          content={
            "<p>親愛的用戶：<br /><br /><br />一直以來努力推動區塊鏈產業的健康發展、維護用戶權益，有鑒於 BCX (BitcoinX)、BIFI (Bitcoin File)、SBTC (Super Bitcoin) 代幣違反《火幣代幣管理規則》第十九條規定，將於 2021 年 10 月 19 日 16:00 (GMT+8) 停止 BCX、BIFI、SBTC 的交易並進行下架。<br /><br /><br />若下架後您仍持有 BCX、BIFI、SBTC 代幣，將依停盤前七日的收盤均價，將您的代幣兌換為等值的 HUSD ，預計兩週時間完成兌換作業。<br /><br /><br />注意事項：<br /><br />BCX、BIFI、SBTC 未曾開放充幣/提幣，因此目前無法進行相關操作。若您在前述代幣交易對中有掛單，請於期限內完成撤單。<br />交易對下架後，系統將自動為您撤單，並將相關資產退還至您的帳戶。請取消隱藏小額資產，即可在資產中看到前述幣種。<br /><br /><br />感謝您的支持與理解。</p><br /><br /><br /><p>親愛的用戶：<br /><br /><br />一直以來努力推動區塊鏈產業的健康發展、維護用戶權益，有鑒於 BCX (BitcoinX)、BIFI (Bitcoin File)、SBTC (Super Bitcoin) 代幣違反《火幣代幣管理規則》第十九條規定，將於 2021 年 10 月 19 日 16:00 (GMT+8) 停止 BCX、BIFI、SBTC 的交易並進行下架。<br /><br /><br />若下架後您仍持有 BCX、BIFI、SBTC 代幣，將依停盤前七日的收盤均價，將您的代幣兌換為等值的 HUSD ，預計兩週時間完成兌換作業。<br /><br /><br />注意事項：<br /><br />BCX、BIFI、SBTC 未曾開放充幣/提幣，因此目前無法進行相關操作。若您在前述代幣交易對中有掛單，請於期限內完成撤單。<br />交易對下架後，系統將自動為您撤單，並將相關資產退還至您的帳戶。請取消隱藏小額資產，即可在資產中看到前述幣種。<br /><br /><br />感謝您的支持與理解。</p>"
          }
          setNavSelectItem={setNavSelectItem}
        />
      ) : (
        <>
          <QuestionHeader />
          <ItemContainer>
            <AccountItem>
              <ContentTitle>帳號與安全認證</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>註冊帳號</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>個人身份實名認證</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>綁定 Google 驗證</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>重置密碼</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>重置 Google 驗證</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>重置手機驗證</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>收不到 Google 郵件該怎麼辦？</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>收不到手機簡訊該怎麼辦？</p>
                </ListContainer>
              </ContentContainer>
            </AccountItem>
            <PaymentItem>
              <ContentTitle>付收款方式</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>新增收付款方式</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>移除收付款方式</p>
                </ListContainer>
              </ContentContainer>
            </PaymentItem>
            <CurrencyDealItem>
              <ContentTitle>法幣交易操作指南</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>買幣/賣幣</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>發佈買幣/賣幣廣告</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>沒收到幣怎麼辦？</p>
                </ListContainer>
              </ContentContainer>
            </CurrencyDealItem>
            <ContractItem>
              <ContentTitle>合約交易介紹</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>合約功能概述及規範</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>合約資金費率簡介</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>合約的強行平倉</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>自動減倉</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>如何計算合約盈虧</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>了解訂單簿和訂單深度</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>了解合約槓桿和保證金</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>計算開倉成本和強平價格</p>
                </ListContainer>
              </ContentContainer>
            </ContractItem>
            <ContractDealItem>
              <ContentTitle>合約交易操作指南</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>開倉/平倉</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>設置止盈止損</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>撤銷委託單</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>{t("fundingTransfer")}方式</p>
                </ListContainer>
              </ContentContainer>
            </ContractDealItem>
            <SecurityItem>
              <ContentTitle>安全專欄</ContentTitle>
              <ContentContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>安全指南</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>防病毒和木馬指南</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>釣魚郵件詐騙案例</p>
                </ListContainer>
                <ListContainer onClick={selectContentHandler}>
                  <ItemLightLight />
                  <p>詐騙防制注意事項</p>
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
