import React, {  } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { NavLink } from "react-router-dom";
import BackIcon from "../../assets/icon/back.png";
import { useTranslation } from "react-i18next";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  display: flex;
  flex-direction: row;
  align-items:center;
  border-bottom: 0.5px solid #f4f4f6;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  width: 100%;
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
const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
`;
const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
`;

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const EditName = () => {
  // const [selectItem, setSelectItem] = useState("最新公告");
  const { t } = useTranslation();
  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderLeft>
          <LinkText to="/memberCenter">
            <NavImage src={BackIcon} alt="language" />
          </LinkText>
          <LogoImage>名稱</LogoImage>
        </HeaderLeft>
        <div style={{float:"right",color:"#D32F2F",fontSize:16,fontWeight:600,width:50}}>{t("nickNameDone")}</div>
      </HeaderContainer>
      <div style={{marginBottom:"24px",width:"90%",marginTop:20}}>
      <h2  style={{color:"#5F5C70",fontSize:"13px",fontWeight:500,marginBottom:"5px"}}>{t("nickName")}</h2>
      <input placeholder="輸入暱稱" style={{width:"100%",padding:"13px",backgroundColor:"#F4F4F6",fontSize:"15px",border:"none",borderRadius:"4px"}} onChange={
        event => {
          // setUsername(event.target.value)                
        }
      }
      />
      <p style={{color:"#8F8DA2",fontSize:13,fontWeight:500,marginTop:10}}>{t("nickNameMsg")}</p>
    </div>
    </PageContainer>
  );
};

export default EditName;
