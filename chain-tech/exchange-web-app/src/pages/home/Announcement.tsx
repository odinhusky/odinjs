import React, { useState,useEffect } from "react";
import AnnouncementModal from "../../components/modal/AnnouncementModalHome";
import styled from "styled-components";
// import HightLightIcon from "../../assets/icon/star.png";
import api from "../../common/api"
import { useParams } from "react-router-dom";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// const HighLightLogo = styled.img`
//   width: 28px;
//   height: 28px;
//   margin-right: 12px;
// `;

const Announcement = () => {
  const [, setNavSelectItem] = useState(false);
  const [obj, setObj] = useState({
    subject:"",
    content:"",
    createDate:0
  });  
  let {id} = useParams();

  // const changeSelectHandler = (selectNumber: string) => {
  //   setSelectItem(selectNumber);
  // };

  useEffect(() => {
    api.get("/info/announcement/"+id).then(x=>{
      console.log(x.data)
      setObj(x.data)
    })
  }, [id]);
  return (
    <PageContainer>
        <AnnouncementModal
          navTitle={""}
          itemTitle={obj.subject}
          content={obj}
          setNavSelectItem={setNavSelectItem}
        />
    </PageContainer>
  );
};

export default Announcement;
