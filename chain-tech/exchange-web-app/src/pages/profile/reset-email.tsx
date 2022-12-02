/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
// import arrow from "../../assets/profile/arrow2.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";





// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh ; 
  widht: 100%;
  display: flex ; 
  flex-direction: column ;
`;

const TopArea = styled.div`
  height:50px;
  line-height:50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom:2px;
`;

const TopAreaRight = styled.div`
  width: 100% ;
  display: flex ;
  justify-content: space-between;
`;

const AreaSpace = styled.div`
  padding: 20px;
  margin: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  background:#F4F4F6;

`;
const AreaSpace2 = styled.input`
  padding: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  width:60%;
  margin-left:20px;
  background:#F4F4F6;
  color:#BDBCC8;
  border:none;
`;

const AreaSpace3 = styled.div`
  margin-bottom:20px;
  display:flex;
  justify-content: space-between;
`;

const Words = styled.input`
  font-size:15px;
  line-height:18px;
  color:#BDBCC8;
  border:none;
  background:none;
  width:100%;
`;

const Words2 = styled.p`
  font-size:15px;
  margin-right:45px;
  margin-top:20px;
  color: #A60008;
`;

const SubmitButton = styled.button`
  display: flex, 
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 44px ;
  width: 90% ;
  background: rgb(211,47,47,0.3);
  margin-left:20px;
  margin-top:90px;
`;

const SubmitButtonWord = styled.div`
  color:#FFFFFF;
  font-size:14px;
  text-align:center;
  border: none ;
`;

const ArrowContent = styled.img`
  margin-left:13px;
  width: 12px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff ;
  border: none ;
  margin-top:5px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743 ;
  fontSize: 16px ;
  font-weight: bold;
  margin-right:40px;
`;

const Notice = styled.div`
  width:90%;
  display: flex;
  justify-content: center;
  background: rgba(255,120,107,0.07);
  padding:25px;
  margin-left:23px;
  margin-top:20px;
  border: 1px solid rgba(154,0,7,0.1);
  box-sizing: border-box;
  border-radius: 8px;
`;

const Areaword = styled.div`
  margin-top: 40px;
  margin-bottom: 15px;
  margin-left: 23px;
  color:#5F5C70;
  font-size:13px;
`;

const Inside = styled.div`
  background: #FFFFFF;
  flex: 1;
`;

const NoticeP = styled.p`
 font-size: 13px;
 color: #5F5C70;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */

const ResetEmail = () => {
  return (
    <PageContainer>

      <TopArea>

        < TopAreaRight>

          <Link to="/setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>重置電子信箱</Setting1>
          <div> </div>
        </ TopAreaRight>

      </TopArea>


      <Inside>

        <Notice>
          <NoticeP>為了你的帳戶安全，請謹慎選擇需要重置的項目，系統將根據您的操作行為決定是否禁用提現48小時。
          </NoticeP>
        </Notice>

        <Areaword>新的電子信箱</Areaword>
        <AreaSpace>

          <Words placeholder="輸入新的電子信箱">

          </Words>
        </AreaSpace>
        <Areaword>郵件驗證碼</Areaword>

        <AreaSpace3>
          <AreaSpace2 placeholder="輸入驗證碼箱" />


          <Words2>
            取得驗證碼
          </Words2>
        </AreaSpace3>

        <SubmitButton>
          <SubmitButtonWord>送出</SubmitButtonWord>
        </SubmitButton>


      </Inside >
      <Footer />
    </PageContainer >
  );
}

export default ResetEmail
