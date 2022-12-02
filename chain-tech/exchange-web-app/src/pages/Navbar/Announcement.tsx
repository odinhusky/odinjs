import React, { useState,useEffect } from "react";
import AnnouncementHeader from "../../components/header/AnnouncementHeader";
import AnnouncementModal from "../../components/modal/AnnouncementModal";
import styled from "styled-components";
// import HightLightIcon from "../../assets/icon/star.png";
import api from "../../common/api"
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const NavItem = styled.div`
  display: flex;
  align-items: center;
  height: 71px;
  padding: 16px;
`;
// const HighLightLogo = styled.img`
//   width: 28px;
//   height: 28px;
//   margin-right: 12px;
// `;
const NavItemContainer = styled.div``;
const NavTitle = styled.p`
  font-size: 15px;
  color: #383743;
  margin-bottom: 4px;
`;
const NavDate = styled.p`
  font-size: 12px;
  color: #8f8da2;
`;

const Announcement = () => {
  const [navSelectItem, setNavSelectItem] = useState(false);
  const [index, setIndex] = useState(-1);
  const [announce, setAnnounce] = useState([]);  
  const [obj, setObj] = useState({
    subject:"",
    content:"",
    createDate:0
  });  
  // const changeSelectHandler = (selectNumber: string) => {
  //   setSelectItem(selectNumber);
  // };
  const { i18n } = useTranslation();

  const selectContentHandler = (x:any) => {
    setNavSelectItem((v) => !v);
    setObj(x)
  };

  useEffect(() => {
    let category = "ACTIVITY"
    if(index === -1){
      api.get("/info/announcement?lang="+i18n.language).then(x=>{
        setAnnounce(x.data)
      })
    }else{
      if(index === 1){
        category = "OTC"
      }else if(index === 2){
        category = "CONTRACT"
      }else if(index === 3){
        category = "NEWS"
      }
      api.get("/info/announcement?topic="+category+"&lang="+i18n.language).then(x=>{
        setAnnounce(x.data)
      })
    }
  }, [index,i18n.language]);
  return (
    <PageContainer>
      {navSelectItem ? (
        <AnnouncementModal
          navTitle={""}
          itemTitle={obj.subject}
          content={obj}
          setNavSelectItem={setNavSelectItem}
        />
      ) : (
        <>
          <AnnouncementHeader
            currentItem={index}
            select={setIndex}
          />
          <div style={{ flex: 1, width: "100%" }}>
            {announce.map((x:any) => {
              return (
                <NavItem key={x.id} onClick={()=>{selectContentHandler(x)}}>
                  {/* {item.isImport && (
                    <HighLightLogo src={HightLightIcon} alt="highLight" />
                  )} */}
                  <NavItemContainer>
                    <NavTitle>{x.subject}</NavTitle>
                    <NavDate>{`${new Date(x.createdDate).toISOString().split("T")[0]}`}</NavDate>
                  </NavItemContainer>
                </NavItem>
              );
            })}
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default Announcement;
