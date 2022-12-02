import styled from "styled-components";

const ContractContainer = styled.div`
  width: 100%;
  flex: 1;
  background: #fff;
  padding: 16px 16px 70px 16px;
`;

const data = [
  {
    type:"手續費",
    time:"2021-10-19 13:35:08",
    price:"-5.0000 USDT",
    category:"ETH/USDT・10X"
  },
  {
    type:"開倉",
    time:"2021-10-19 13:35:08",
    price:"--",
    category:"ETH/USDT・10X"
  },
  
]
const OrderPage5 = () => {
  return (
      <ContractContainer>
        {data.map((x)=>{
          return(
            <div style={{flex:1,flexDirection:"row",marginBottom: "55px"}}>
              <div style={{float:"left"}}>
                  <p style={{color:"#383743",fontSize:"15px",marginBottom:"10px"}}>{x.type}</p>
                  <p style={{color:"#8F8DA2",fontSize:"12px"}}>{x.time}</p>
                </div>
                <div style={{float:"right"}}>
                  <p style={{color:"#383743",fontSize:"16px",fontWeight:"bold",marginBottom:"10px"}}>{x.price}</p>
                  <p style={{color:"#29A370",fontSize:"12px"}}>{x.category}</p>
              </div>
            </div>
          )
        })}
        
      </ContractContainer>
  );
};

export default OrderPage5;
