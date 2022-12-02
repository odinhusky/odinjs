/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import Arrow from "../../assets/profile/arrow2.png";
import notice from "../../assets/profile/notice.png";
import cancel from "../../assets/icon/cancel.png";

import Footer from "../../components/footer/PageFooter";

//steve's Drawer
import Drawer from "../../components/UI/Drawer";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom: 2px;
`;

const TopArealeft = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AddressWordArea = styled.div`
  padding: 20px;
  margin: 20px;
  background: #fff;
  opacity: 0.6;
  border-radius: 4px;
  background: #f4f4f6;
`;

const LastNameSpace = styled.div`
  padding: 5px;
  margin: 8px 20px 49px 20px;
  background: #fff;
  opacity: 0.6;
  border-radius: 4px;
  background: #f4f4f6;
  display: flex;
  justify-content: space-between;
  width: 60%;
`;

const NameSpace = styled.div`
  padding: 5px;
  margin: 8px 20px 49px -1px;
  background: #fff;
  opacity: 0.6;
  border-radius: 4px;
  background: #f4f4f6;
  display: flex;
  justify-content: space-between;
  width: 60%;
`;

const Words = styled.input`
  font-size: 15px;
  line-height: 18px;
  color: #383743;
  border: none;
  background: none;
  width: 100%;
`;

const LastName = styled.input`
  font-size: 15px;
  margin-top: 5px;
  padding: 10px;
  color: #383743;
  width: 100%;
  border: none;
  background: none;
`;

const Name = styled.input`
  font-size: 15px;
  color: #383743;
  margin-top: 5px;
  padding: 10px;
  color: #383743;
  width: 100%;
  border: none;
  background: none;
`;

const SubmitButton = styled.button`
  display: flex, 
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 57px ;
  width: 90% ;
  background: rgb(211,47,47,1);
  margin-left:20px;
  margin-top:40px;
`;

const SubmitButtonWord = styled.p`
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  border: none;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const NoticeButtom = styled.img`
  width: 13.71px;
  height: 16.71px;
  color: #bdbcc8;
  margin-top: -20px;
  margin-right: 13px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  margin-top: -2px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  fontsize: 16px;
  font-weight: bold;
  margin-right: 40px;
`;

const Notice = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-around;
  background: rgba(255, 120, 107, 0.07);
  padding: 25px;
  margin-left: 23px;
  margin-top: 20px;
  border: 1px solid rgba(154, 0, 7, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
`;

const Username = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 23px;
  color: #383743;
  font-size: 13px;
`;
const AddressP = styled.p`
  margin-top: -10px;
  margin-bottom: 20px;
  margin-left: 23px;
  color: #383743;
  font-size: 13px;
`;

const YourBirthday = styled.p`
  margin-top: 37px;
  margin-bottom: 20px;
  margin-left: 23px;
  color: #383743;
  font-size: 13px;
`;

const Inside = styled.div`
  background: #ffffff;
  flex: 1;
`;

const NoticeP = styled.p`
  font-size: 13px;
  color: #d32f2f;
`;

const RightButtonImg = styled.img`
  width: 7.41px;
  height: 12px;
  margin-top: 3px;
  margin-left: 3px;
`;

const NameSpaceArea = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -20px;
`;

const RightButtonarea = styled.button`
  margin-right: 20px;
  margin-top: -30px;
  display: flex;
  background: none;
  border: none;
  width: 7.41px;
  height: 12px;
`;

const ChooseBirthDay = styled.div`
  padding: 13px;
  background: #fff;
  opacity: 0.6;
  border-radius: 4px;
  width: 90%;
  margin-left: 20px;
  background: #f4f4f6;
  color: #bdbcc8;
`;

const BirthdayArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const RightButtonspace = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 10px;
`;

const DrawerFullWarehouseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;

const DrawerFullWarehouseTitle = styled.p`
  flex: 1;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;
const CancelButton = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #8f8da2;
`;
const DrawerPickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 250px;
  margin-top: 20px;
`;
const DrawerDeadTimeContainer = styled.div`
  width: 33.3%;
  height: 200px;
  overflow: scroll;
`;
const DepthUnitItem = styled.div`
  width: 100%;
  text-align: center;
  height: 55px;
  line-height: 55px;
  color: ${COLORS.Dark_gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
`;
const DrawerSplitStart = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
  position: absolute;
  top: 134px;
`;
const DrawerSplitEnd = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
  position: absolute;
  top: 178px;
`;
//page-style end

/* 下面的要把style都丟上去style compoents  */

const IdVerify = () => {
  let navigate = useNavigate();
  const [Arrow2, setArrow2] = useState(false);
  const [selectYear, setSelectYear] = useState(1951);
  const [selectMouth, selectSelectMouth] = useState(2);
  const [selectDate, setSelectDate] = useState(2);
  const [profileDate, setProfileDate] = useState({
    year: 0,
    mouth: 0,
    date: 0,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const { t } = useTranslation();
  const handleDrawer = () => {
    setArrow2((prev) => !prev);
  };

  const deadTimePayDrawerHandler = () => {
    setProfileDate((prev) => {
      return {
        ...prev,
        year: selectYear,
        mouth: selectMouth,
        date: selectDate,
      };
    });

    setArrow2((prev) => !prev);
  };
  const years = Array.from({ length: 75 }, (v, i) => 1950 + i);
  const mounths = Array.from({ length: 14 }, (v, i) => 1 + i);
  const dates = Array.from({ length: 33 }, (v, i) => 1 + i);
  const NowYear = new Date().getFullYear();

  return (
    <PageContainer>
      <TopArea>
        <TopArealeft>
          <Link to="/safe-setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>{t("idAuth")}</Setting1>
          <div> </div>
        </TopArealeft>
      </TopArea>

      <Inside>
        <Notice>
          <span>
            <NoticeButtom src={notice} alt="注意" />
          </span>

          <NoticeP>請輸入您的真實資料，送出後無法再次更改。</NoticeP>
          <div></div>
        </Notice>

        <Username>{t("UserName")}</Username>

        <NameSpaceArea>
          <LastNameSpace>
            <div>
              <LastName placeholder="姓" onChange={(e) => { setFirstName(e.target.value) }} />
            </div>
          </LastNameSpace>

          <NameSpace>
            <div>
              <Name placeholder="名" onChange={(e) => { setLastName(e.target.value) }} />
            </div>
          </NameSpace>
        </NameSpaceArea>

        <AddressP>{t("UserAddress")}</AddressP>

        <AddressWordArea>
          <Words placeholder="請輸入完整戶籍地址" onChange={(e) => { setAddress(e.target.value) }} />
        </AddressWordArea>

        <YourBirthday>{t("UserBirthday")}</YourBirthday>

        <BirthdayArea onClick={handleDrawer}>
          <ChooseBirthDay>
            {!!profileDate.year && !!profileDate.mouth && !!profileDate.date ? (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: "24px",
                  letterSpacing: " 0.004em",
                  color: COLORS.Dark_gray,
                }}
              >{`${profileDate.year} 年 ${profileDate.mouth}月 ${profileDate.date}日`}</p>
            ) : (
              <p
                style={{
                  marginTop: "10px",
                }}
              >
                請選擇出生年月日
              </p>
            )}
            <RightButtonspace>
              <RightButtonarea>
                <RightButtonImg src={Arrow} alt="Arrow" />
              </RightButtonarea>
            </RightButtonspace>
          </ChooseBirthDay>
        </BirthdayArea>

        <SubmitButton onClick={() => {
          if (!firstName) {
            alert("請輸入姓")
          }
          else if (!lastName) {
            alert("請輸入名")
          }
          else if (!address) {
            alert("請輸入地址")
          }
          else if (profileDate.year === 0) {
            alert("請輸入出生日期")
          } else {
            let data = {
              name: firstName + lastName,
              address: address,
              birthday: new Date(`${profileDate.year}-${profileDate.mouth < 10 ? "0" + profileDate.mouth : profileDate.mouth}-${profileDate.date < 10 ? "0" + profileDate.date : profileDate.date}`).getTime()
            }
            localStorage.setItem("verify", JSON.stringify(data))
            navigate("/id-documents")
          }
        }}>
          <SubmitButtonWord>送出</SubmitButtonWord>
        </SubmitButton>
      </Inside>
      <Drawer isVisible={Arrow2} selectVisible={handleDrawer} height={309}>
        <DrawerFullWarehouseTitleContainer>
          <DrawerFullWarehouseImage
            src={cancel}
            alt="cancel"
            onClick={handleDrawer}
          />
          <DrawerFullWarehouseTitle>{t("UserBirthday")}</DrawerFullWarehouseTitle>
          <CancelButton
            onClick={deadTimePayDrawerHandler}
          >{t("OK")}</CancelButton>
        </DrawerFullWarehouseTitleContainer>
        <DrawerPickerContainer>
          <DrawerSplitStart />
          <DrawerSplitEnd />
          <DrawerDeadTimeContainer>
            {years.map((item, i) => {
              return (
                <DepthUnitItem
                  key={item.toString()}
                  onClick={() => {
                    setSelectYear(item);
                  }}
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      color:
                        item > NowYear
                          ? "#fff"
                          : selectYear === item
                            ? COLORS.Red
                            : COLORS.Gray,
                      marginRight: 25,
                    }}
                  >
                    {item}
                  </p>
                  {item < NowYear + 1 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: COLORS.Gray,
                      }}
                    >
                      年
                    </p>
                  )}
                </DepthUnitItem>
              );
            })}
          </DrawerDeadTimeContainer>
          <DrawerDeadTimeContainer>
            {mounths.map((item, i) => {
              return (
                <DepthUnitItem
                  key={item.toString()}
                  onClick={() => {
                    selectSelectMouth(item);
                  }}
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      color:
                        i > 11
                          ? "#fff"
                          : selectMouth === item
                            ? COLORS.Red
                            : COLORS.Gray,
                      marginRight: 25,
                    }}
                  >
                    {item}
                  </p>
                  {i < 12 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: COLORS.Gray,
                      }}
                    >
                      月
                    </p>
                  )}
                </DepthUnitItem>
              );
            })}
          </DrawerDeadTimeContainer>
          <DrawerDeadTimeContainer>
            {dates.map((item, i) => {
              return (
                <DepthUnitItem
                  key={item.toString()}
                  onClick={() => {
                    setSelectDate(item);
                  }}
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      color:
                        i > 30
                          ? "#fff"
                          : selectDate === item
                            ? COLORS.Red
                            : COLORS.Gray,
                      marginRight: 25,
                    }}
                  >
                    {item}
                  </p>
                  {i < 31 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: COLORS.Gray,
                      }}
                    >
                      日
                    </p>
                  )}
                </DepthUnitItem>
              );
            })}
          </DrawerDeadTimeContainer>
        </DrawerPickerContainer>
      </Drawer>

      <Footer />
    </PageContainer>
  );
};

export default IdVerify;
