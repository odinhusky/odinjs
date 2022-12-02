import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
// import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import cancelIcon from "../../assets/icon/cancel.png";
// import navAvatar from "../../assets/icon/navAvatar.png";

// const DUMMY_DATA = [
//   { id: "1231232", title: "將於 9 月 26 日移除 18 種交易對" },
//   { id: "dfgdg", title: "即將支援 aelf (ELF) 主網升級代幣置換作業" },
//   { id: "dfgdf", title: "完成 Channels (CAN) 置換" },
//   { id: "werwer", title: "試行降低特定代幣充幣/提幣最低限額公告" },
//   { id: "cvbcvb", title: "即將進行 Channels (CAN) 幣兌換" },
// ];

const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  color: #383743;
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  /* height: 44px; */
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  border-bottom: 1px solid #f4f4f6;
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
`;
const TitleContainer = styled.div`
  height: 75px;
  border-bottom: 1px solid #f4f4f6;
`;
// const FooterContainer = styled.div`
//   height: 300px;
//   padding: 16px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
  padding: 0 30px 0 0;
`;
const NavImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 12px;
`;
const ArticleContainer = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;
const ContentTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
`;
// const Avatar = styled.img`
//   width: 32px;
//   height: 32px;
//   margin-right: 12px;
// `;
// const TitleTextContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
// const TitleText = styled.p`
//   font-size: 12px;
//   font-weight: 400;
//   color: #8f8da2;
// `;
const ArticleContent = styled.div`
  color: #383743;
  font-weight: 400;
  font-size: 15px;
  padding: 24px 0 30px 0;
  /* border-bottom: 1px solid #f4f4f6; */
`;
// const FooterTitle = styled.p`
//   color: #383743;
//   font-weight: 600;
//   font-size: 16px;
//   margin: 0 0 18px 0;
// `;
// const FooterItemContainer = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
// `;
// const FooterTextContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 15px 0;
// `;
// const FooterLightLight = styled.div`
//   background: red;
//   height: 6px;
//   width: 6px;
//   border-radius: 3px;
//   margin-right: 12px;
// `;
// const FooterItemContent = styled.p`
//   font-weight: 500;
//   font-size: 14px;
//   color: #8f8da2;
// `;

const AnnouncementModal: React.FC<{
  content: any;
  navTitle: string;
  itemTitle: string;
  setNavSelectItem: (text: boolean) => void;
}> = ({ content, navTitle, itemTitle,setNavSelectItem}) => {
  // const { t } = useTranslation();
  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <LinkText to="/home" onClick={()=>{setNavSelectItem(false)}}>
            <NavImage src={cancelIcon} alt="language" />
          </LinkText>
          <LogoImage>{navTitle}</LogoImage>
        </HeaderLeft>
      </HeaderContainer>
      <ArticleContainer>
        <TitleContainer>
          <ContentTitle>{itemTitle}</ContentTitle>
          <div style={{ display: "flex", marginTop: 6 }}>
            {/* <Avatar src={navAvatar} alt="avatar" /> */}
            {/* <TitleTextContainer style={{marginBottom:20}}>
              <TitleText>{new Date(content.createdDate).toDateString()}</TitleText>
              <TitleText>{new Date(content.createdDate).toLocaleTimeString()}</TitleText>
            </TitleTextContainer> */}
          </div>
        </TitleContainer>
        <ArticleContent
          dangerouslySetInnerHTML={{
            __html: content.content,
          }}
        />
      </ArticleContainer>
      {/* <FooterContainer>
        <FooterTitle>相關文章</FooterTitle>
        <FooterItemContainer>
          {DUMMY_DATA.map((item) => {
            return (
              <FooterTextContainer key={item.id}>
                <FooterLightLight />
                <FooterItemContent>{item.title}</FooterItemContent>
              </FooterTextContainer>
            );
          })}
        </FooterItemContainer>
      </FooterContainer> */}
    </>
  );
};

export default AnnouncementModal;
