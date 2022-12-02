/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import arrow from "../../assets/profile/arrow2.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



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
const AreaSpace2 = styled.p`
  padding: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  width:60%;
  margin-left:20px;
  background:#F4F4F6;
  color:#BDBCC8;
`;

const AreaSpace3 = styled.div`
  margin-bottom:20px;
  display:flex;
  justify-content: space-between;

`;

const AreaSpace4 = styled.div`
  padding: 10px;
  margin: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  background:#F4F4F6;
`;

const AreaCodeAlign = styled.div`
  display:flex;
  justify-content: space-between;
`;

const Words = styled.p`
  font-size:15px;
  line-height:18px;
  color:#BDBCC8;
 
`;

const Words2 = styled.p`
  font-size:15px;
  margin-right:45px;
  margin-top:20px;
  color: #D32F2F;
`;

const Words3 = styled.p`
  font-size:15px;
  color: #383743;
  text-align: center;
  margin-top:5px;
  padding:10px;
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

const RightButtunArrow = styled.img`
  margin-left:13px;
  width: 7.41px;
  height: 12px;
  color:#BDBCC8;
  margin-top:7px;
`;
const LeftButton = styled.button`
  background: #fff ;
  border: none ;
  margin-top:5px;
`;

const RightButtun = styled.button`
  margin-right:10px;
  display:flex;
  background: none;
  border: none ;
  margin-top:5px;
  color: #BDBCC8;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743 ;
  fontSize: 16px ;
  font-weight: bold;
  margin-right:40px;
`;

const Areaword = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color:#5F5C70;
  font-size:13px;
`;

const Inside = styled.div`
  background: #FFFFFF;
  flex: 1;
`;

//page-style end 

/* 下面的要把style都丟上去style compoents  */

const PhoneNumberVerify = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>

      <TopArea>

        < TopAreaRight>

          <Link to="/setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>驗證手機號碼</Setting1>
          <div> </div>
        </ TopAreaRight>


      </TopArea>


      <Inside>

        <Areaword>區碼</Areaword>
        <AreaSpace4
        >
          <AreaCodeAlign>
            <Words3>
              +886
            </Words3>

            <RightButtun>
              <Link to="/setting">
                <RightButtunArrow src={arrow} alt="arrow" />
              </Link>
            </RightButtun>
          </AreaCodeAlign>
        </AreaSpace4>

        <Areaword>{t("mobile")}</Areaword>
        <AreaSpace>
          <Words>
            輸入您的手機號碼
          </Words>
        </AreaSpace>
        <Areaword>簡訊驗證碼</Areaword>

        <AreaSpace3>
          <AreaSpace2>
            輸入驗證碼
          </AreaSpace2>

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

export default PhoneNumberVerify