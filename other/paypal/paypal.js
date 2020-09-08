function preparePaypalBtn () {

  let script = document.createElement('script');
  let paypalUrl = 'https://www.paypal.com/sdk/js?client-id=' + paypalClientId;
  script.src = paypalUrl;
  script.setAttribute('data-sdk-integration-source', 'button-factory');
  document.head.appendChild(script)
  
  let tag = '#paypal-button-container'
  let productId = $(tag).data('product-id');
  let agentCode = $(tag).data('agent-code');
  
  script.onload = function () {
      
      if (!productId) {
          return fasle;
      }
      
      reqeustRenderButton();
      
  };

  function reqeustRenderButton() {
      let nextReqRender = new XMLHttpRequest();
      nextReqRender.addEventListener("load", nextReqRenderListener);
      nextReqRender.open("GET", apiPath + "/students/current/products/" + productId);
      nextReqRender.setRequestHeader('Authorization', 'Bearer ' + token);
      nextReqRender.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      nextReqRender.setRequestHeader("Accept", "application/json");
      nextReqRender.setRequestHeader("Accept-Language", i18nlanguage);
      nextReqRender.send();
  }

  function nextReqRenderListener () {
      let response = JSON.parse(this.responseText);

      if(response.data) {
          let salePrice;

          // if (agentCode) {
          //     salePrice = response.data.usd_sale_price;
          // } else {
          //     salePrice = response.data.usd_price;
          // }

          salePrice = response.data.usd_sale_price;
          
          paypal.Buttons({
              style: {
                  shape: 'rect',
                  color: 'gold',
                  layout: 'vertical',
                  label: 'paypal',
              },
              createOrder: function(data, actions) {
                  return actions.order.create({
                      purchase_units: [{
                          amount: {
                              currencd_code: 'USD',
                              value: salePrice
                          },
                      }]
                  });
              },
              onApprove: function(data, actions) {
                  console.log(data);
                  return actions.order.capture().then(function(details) {
                      requestPaypalOrder(details.id);
                  });
              },
              onError: function (err) {
                  console.log(err);
              }
          }).render(tag);
      } else if(response.message) {
          if (response.message==="Unauthenticated.") {
              logOutClear();
          } else {
              alert(response.message);
          }

          return false;
      }
  }

  function requestPaypalOrder(orderId) {
      let orderData = { "product_id" : productId, "paypal_id" : orderId, "agent_code" : agentCode };
      let nextReqOrder = new XMLHttpRequest();
      nextReqOrder.addEventListener("load", nextReqOrderListener);
      nextReqOrder.open("POST", apiPath + "/students/current/paypal-orders");
      nextReqOrder.setRequestHeader('Authorization', 'Bearer ' + token);
      nextReqOrder.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      nextReqOrder.setRequestHeader("Accept", "application/json");
      nextReqOrder.setRequestHeader("Accept-Language", i18nlanguage);
      nextReqOrder.send(JSON.stringify(orderData));
  }

  function nextReqOrderListener() {
      let response = JSON.parse(this.responseText);
      console.log(response);
  }
}