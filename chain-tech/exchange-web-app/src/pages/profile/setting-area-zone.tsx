/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import Search from "../../assets/profile/Search.png";
// import Tick from "../../assets/profile/Tick.png";
import { PHONES } from "../../constants/PhoneList";
import { useNavigate } from "react-router-dom";

// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
`;

const TopArea = styled.div`
  height:50px;
  line-height:50px;
`;

const TopAreaRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  margin-top:5px;
`;

const AreaZone = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  font-size: 16px;
  font-weight: bold;
  margin-right: 40px;
`;

const Inside = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  flex: 1;
  height: 32px;
`;

const Button = styled.button`
  background: #ffffff;
  border-style: none;
  box-shadow: 0.5px 0.5px 2px #bebebe;
  height: 56px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 50px;
`;

const ButtonP = styled.p`
  text-align: left;
  color: #383743;
  font-size: 15px;
`;

const SearchImg = styled.img`
  width: 12px;
  height: 12px;
  margin-top: 12px;
  margin-left: 10px;
`;

const KeyInBox = styled.div`
  width: 90%;
  margin-left: 20px;
  borderadius: 4px;
  background: #f4f4f6;
  margin-bottom: 10px;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 343px;
`;

const InputBox = styled.input`
  width: 343px;
  isplay: flex;
  justify-content: center;
  border-style: none;
  margin-left: 10px;
  line-height: 20px;
  background: #f4f4f6;
  padding: 8px;
  font-size: 15px;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */

const Areazone = () => {
  const navigation = useNavigate()
  return (
    <PageContainer>
      <TopArea>
        <TopAreaRight>
          <LeftButton onClick={()=>{
            navigation(-1)
          }}>
            <ArrowContent src={Left} alt="左箭頭" />
          </LeftButton>
          <AreaZone>區碼</AreaZone>
          <div> </div>
        </TopAreaRight>
      </TopArea>

      <KeyInBox>
        <SearchDiv>
          <SearchImg src={Search} alt="Search" />
          <InputBox placeholder="請輸入地區與區碼" />
        </SearchDiv>
      </KeyInBox>

      <Inside>
        {PHONES.map((item) => {
          return (
            <Button onClick={()=>{
              localStorage.setItem("setting-phoneCode",item.phoneCode.split("+")[1])
              navigation(-1)
            }}>
              <ButtonP>{` ${item.countryName} ${item.phoneCode}`}</ButtonP>
            </Button>
          );
        })}
      </Inside>
    </PageContainer>
  );
};

export default Areazone;
