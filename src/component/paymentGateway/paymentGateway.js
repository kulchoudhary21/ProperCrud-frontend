import React from "react";
import { getApi, postApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import logo from "../../assets/lgo.png";
function PaymentGateway() {
  function loadScript(src) {
    console.log("yaha tk11");
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      console.log("sresrs11", script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      console.log("sresrs1122", src);
      document.body.appendChild(script);
    });
  }

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    console.log("res,,,,,",res)
    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const paymentOptions = {
      amount: 1000,
      currency: "INR",
      order_id: "ljendfechn",
      payment_capture: 0,
    };
    const result = await postApi(
      `${getURl.BASE_URL_PAYMENT}/create`,
      paymentOptions,
      true
    );

    if (!result) {
      console.log("Server error. Are you online?");
      return;
    }
    console.log("amamam", result);
    const { amount, id: order_id, currency } = result.data.data;
    
    const options = {
      key: "rzp_test_vwK5Q8YXbcB5nG", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "kuldeep corp...",
      description: "Test Transaction",
      image:{logo},
      order_id: order_id,
      handler: async function (response) {
        console.log("response",response)
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        console.log("---3r2drfrecd--dfewd", options);
        const result = await postApi(
          `${getURl.BASE_URL_PAYMENT}/success`,
          data,
          true
        );

        console.log("-----", result.data.msg);
      },
      prefill: {
        name: "Kuldeep",
        email: "kuldeep@example.com",
        contact: "6264438588",
      },
      notes: {
        address: "kuldeep Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <button onClick={handlePayment}>Click</button>
    </div>
  );
}

export default PaymentGateway;
