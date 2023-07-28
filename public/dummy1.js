import Axios from "axios";
import UrlConstants from "./UrlConstants";
import { toastMessage } from "../components/Common/Common";
import * as code from "./Constants";
var excludeAPIMethodsPost = [
  "api/auth",
  "api/contact",
  "api/discussion/reply",
  "api/users/reset",
  "api/userrole",
  "api/comments/attachment",
  "api/transactionevent",
  "api/comments/moveDocument",
  "api/comments/removeFolder",
  "api/users",
  "api/transactions",
  "subscription/setUpNewSubscription",
  "users/addPaymentMethod",
];
var excludeAPIMethodsGet = [
  "api/transactions/checkshortname",
  "api/contact/email",
];
var excludeAPIMethodsPut = [
  "api/transactionevent",
  "api/transactions?id",
  "subscription/updateSubscriptionSetUp?id=",
  "api/usertemplate/deleteusercampaign/",
  "api/template/deletesystemcampaign/",
];
var excludeAPIMethodsDelete = ["api/subscription/removeProduct"];
var extraField = ["api/copytemplates"];
/**
 * @desc APIUtil class for common action/function to call get,post,put,delete requests with auth or without auth
 */
class APIUtil {
  /**
   * @desc api call with only url
    @param {} url
   */
  externalAPI(url) {
    return Axios({
      method: "get",
      url: url,
    })
      .then((response) => response)
      .catch((error) => {
        if (error.response) {
          return error.response;
        } else {
          return { status: "404" };
        }
      });
  }

  /**
   * @desc API call with GET method
    @param {} url
    @param {} auth
   */
  getMethod(url, auth) {
    var headersSet = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (auth) {
      var accessToken = localStorage.getItem("accessToken");
      headersSet = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      };
    } else {
      headersSet = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "access-token": process.env.REACT_APP_ACCESS_TOKEN,
      };
    }
    return Axios({
      method: "get",
      url: url,
      headers: headersSet,
    })
      .then((response) => response)
      .catch((error) => {
        if (
          !excludeAPIMethodsGet.some((substring) => url.includes(substring))
        ) {
          toastMessage(code.ERROR);
        }
        if (error.response) {
          if (error.response.data === "Invalid token.") {
            this.inValidToken();
          } else {
            return error.response;
          }
        } else {
          return { status: "404" };
        }
      });
  }

  /**
   * @desc checking access token
   */
  inValidToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usertype");
    localStorage.removeItem("currentRole");
    localStorage.removeItem("taskType");

    window.location.href = UrlConstants.SiteUrl + "login";
    window.location.reload();
  }

  /**
   * @desc API call with POST method
    @param {} url
    @param {} data
    @param {} auth
   */
  postMethod(url, data, auth) {
    var headersSet = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (auth) {
      var accessToken = localStorage.getItem("accessToken");
      headersSet = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      };
    }

    return Axios({
      method: "post",
      url: url,
      headers: headersSet,
      data: data,
    })
      .then((response) => {
        let isSuccessMsgDisplay =
          data.showSuccessMessage !== undefined
            ? data.showSuccessMessage
            : true;

        if (response.status == code.OK) {
          if (
            !excludeAPIMethodsPost.some((substring) =>
              url.includes(substring)
            ) &&
            response.data != "" &&
            isSuccessMsgDisplay
          ) {
            toastMessage(code.SUCCESS, response.data);
          }
        } else {
          toastMessage(code.ERROR);
        }
        return response;
      })
      .catch((error) => {
        let isSuccessMsgDisplay =
          data.showSuccessMessage !== undefined
            ? data.showSuccessMessage
            : true;

        if (
          !excludeAPIMethodsPost.some((substring) => url.includes(substring)) &&
          !extraField.some((substring) => url.includes(substring)) &&
          isSuccessMsgDisplay
        ) {
          toastMessage(code.ERROR);
        }
        if (error.response) {
          if (error.response.data === "Invalid token.") {
            this.inValidToken();
          } else {
            return error.response;
          }
        } else {
          return { status: "404" };
        }
      });
  }

  /**
   * @desc API call with PUT method
    @param {} url
    @param {} data
    @param {} auth
   */
  putMethod(url, data, auth, type = "PUT") {
    var headersSet = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (auth) {
      var accessToken = localStorage.getItem("accessToken");
      headersSet = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      };
    }

    return Axios({
      method: type,
      url: url,
      headers: headersSet,
      data: data,
    })
      .then((response) => {
        if (response.status == code.OK) {
          let isSuccessMsgDisplay =
            data.showSuccessMessage !== undefined
              ? data.showSuccessMessage
              : true;

          if (
            !excludeAPIMethodsPut.some((substring) =>
              url.includes(substring)
            ) &&
            isSuccessMsgDisplay &&
            response.data != ""
          ) {
            toastMessage(code.SUCCESS, response.data);
          }
        } else {
          toastMessage(code.ERROR);
        }
        return response;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data === "Invalid token.") {
            this.inValidToken();
          } else if (error.response.data.statusCode === code.CONFLICT) {
            toastMessage(code.ERROR, error.response.data.message);
          } else {
            return error.response;
          }
        } else {
          return { status: "404" };
        }
        if (
          !excludeAPIMethodsPut.some((substring) => url.includes(substring))
        ) {
          toastMessage(code.ERROR);
        }
      });
  }

  /**
   * @desc API call with DELETE method
    @param {} url
    @param {} data
    @param {} auth
   */
  deleteMethod(url, auth, data) {
    var headersSet = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (auth) {
      var accessToken = localStorage.getItem("accessToken");
      headersSet = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": accessToken,
      };
    }

    return Axios({
      method: "DELETE",
      url: url,
      data: data ? data : null,
      headers: headersSet,
    })
      .then((response) => {
        if (response.status == code.OK) {
          if (
            !excludeAPIMethodsDelete.some((substring) =>
              url.includes(substring)
            ) &&
            response.data != ""
          ) {
            toastMessage(code.SUCCESS, response.data);
          }
        } else {
          toastMessage(code.ERROR);
        }
        return response;
      })
      .catch((error) => {
        if (
          !excludeAPIMethodsDelete.some((substring) => url.includes(substring))
        ) {
          toastMessage(code.ERROR);
        }
        if (error.response) {
          if (error.response.data === "Invalid token.") {
            this.inValidToken();
          } else {
            return error.response;
          }
        } else {
          return { status: "404" };
        }
      });
  }
  /**
   * @desc Upload files with multipart form data
    @param {} url
    @param {} data
    @param {} auth
   */
  postFormDataMethod(url, data, auth, uploadedFiles) {
    var headersSet = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };
    if (auth) {
      var accessToken = localStorage.getItem("accessToken");
      if (uploadedFiles !== undefined) {
        headersSet = {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "x-auth-token": accessToken,
          UploadedFiles: uploadedFiles,
        };
      } else {
        headersSet = {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "x-auth-token": accessToken,
        };
      }
    }

    return Axios({
      method: "post",
      url: url,
      headers: headersSet,
      data: data,
    })
      .then((response) => {
        if (response.status == code.OK) {
          let isSuccessMsgDisplay =
            data.showSuccessMessage !== undefined
              ? data.showSuccessMessage
              : true;
          if (isSuccessMsgDisplay && response.data != "") {
            toastMessage(code.SUCCESS, response.data);
          }
        } else {
          toastMessage(code.ERROR);
        }
        return response;
      })
      .catch((error) => {
        toastMessage(code.ERROR);
        if (error.response) {
          if (error.response.data === "Invalid token.") {
            this.inValidToken();
          } else {
            return error.response;
          }
        } else {
          return { status: "404" };
        }
      });
  }
}
export default new APIUtil();

// async function getCount() {
//   try {
//     setUserInfoToken(await decryptCrypto());
//     const result = await getApi(`${getURl.BASE_URL_CART}/getCountCart`, true);
//     console.log("rrr..", result);

//     if (result.status === 200) {
//       console.log("tryueue");
//       setCounter(result.data.count);
//       console.log("cccccccc",cartCounter)
//       dispatch((!checker));
//     } else {
//       toast.error(result.message, {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     }
//   } catch (err) {
//     console.log("in count", err);
//   }
// }


// const order = await createOrder(params);
    
// const options: RazorpayOptions = {
//   key: "YOUR_KEY_ID",
//   amount: "3000",
//   currency: "INR",
//   name: "Acme Corp",
//   description: "Test Transaction",
//   image: "https://example.com/your_logo",
//   order_id: order.id,
//   handler: (res) => {
//     console.log(res);
//   },
//   prefill: {
//     name: "KULDEEP CHOUDHARY",
//     email: "kul@gmail.com",
//     contact: "9999999999",
//   },
//   notes: {
//     address: "Razorpay Corporate Office",
//   },
//   theme: {
//     color: "#3399cc",
//   },
// };

// const rzpay = new Razorpay(options);
// rzpay.open();
// }, [Razorpay]);

//////////////////////////////----------dummy chat ui start-------//////////////////

// import React from "react";
// import "./chat.css";
// import { useEffect, useState } from "react";
// import socket from "./io";

// function Chat() {
//   const [inputField, setInputField] = useState({
//     name: "",
//     room: "",
//     message: "",
//   });
//   const [isChatting, setIsChatting] = useState(false);
//   const [messageList, setMessageList] = useState([]);
//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       setMessageList([...messageList, data]);
//     });
//   });

//   function inputHandler(e) {
//     setInputField({
//       ...inputField,
//       [e.target.name]: e.target.value,
//     });
//   }
//   function enterRoom() {
//     console.log(inputField);
//     socket.emit("join_room", inputField.room);
//     setIsChatting(true);
//   }
//   async function sendMessage() {
//     await socket.emit("send_message", inputField);
//     setMessageList([...messageList, inputField]);
//     setInputField({ ...inputField, message: "" });
//   }

//   return (
//     <section style={{ backgroundColor: "#eee" }}>
//       <div class="container py-5">
//         <div class="row">
//           <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
//             <h5 class="font-weight-bold mb-3 text-center text-lg-start">
//               Member
//             </h5>

//             <div class="card">
//               <div class="card-body">
//                 <ul class="list-unstyled mb-0">
//                   <li
//                     class="p-2 border-bottom"
//                     style={{ backgroundColor: "#eee" }}
//                   >
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">John Doe</p>
//                           <p class="small text-muted">Hello, Are you there?</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">Just now</p>
//                         <span class="badge bg-danger float-end">1</span>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2 border-bottom">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Danny Smith</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">5 mins ago</p>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2 border-bottom">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Alex Steward</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">Yesterday</p>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2 border-bottom">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-3.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Ashley Olsen</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">Yesterday</p>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2 border-bottom">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Kate Moss</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">Yesterday</p>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2 border-bottom">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Lara Croft</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">Yesterday</p>
//                       </div>
//                     </a>
//                   </li>
//                   <li class="p-2">
//                     <a href="#!" class="d-flex justify-content-between">
//                       <div class="d-flex flex-row">
//                         <img
//                           src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
//                           alt="avatar"
//                           class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
//                           width="60"
//                         />
//                         <div class="pt-1">
//                           <p class="fw-bold mb-0">Brad Pitt</p>
//                           <p class="small text-muted">Lorem ipsum dolor sit.</p>
//                         </div>
//                       </div>
//                       <div class="pt-1">
//                         <p class="small text-muted mb-1">5 mins ago</p>
//                         <span class="text-muted float-end">
//                           <i class="fas fa-check" aria-hidden="true"></i>
//                         </span>
//                       </div>
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div class="col-md-6 col-lg-7 col-xl-8">
//             <ul class="list-unstyled">
//               <li class="d-flex justify-content-between mb-4">
//                 <img
//                   src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
//                   alt="avatar"
//                   class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
//                   width="60"
//                 />
//                 <div class="card">
//                   <div class="card-header d-flex justify-content-between p-3">
//                     <p class="fw-bold mb-0">Brad Pitt</p>
//                     <p class="text-muted small mb-0">
//                       <i class="far fa-clock"></i> 12 mins ago
//                     </p>
//                   </div>
//                   <div class="card-body">
//                     <p class="mb-0">
//                       Lorem ipsum dolor sit amet, consectetur adipiscing elit,
//                       sed do eiusmod tempor incididunt ut labore et dolore magna
//                       aliqua.
//                     </p>
//                   </div>
//                 </div>
//               </li>
//               <li class="d-flex justify-content-between mb-4">
//                 <div class="card w-100">
//                   <div class="card-header d-flex justify-content-between p-3">
//                     <p class="fw-bold mb-0">Lara Croft</p>
//                     <p class="text-muted small mb-0">
//                       <i class="far fa-clock"></i> 13 mins ago
//                     </p>
//                   </div>
//                   <div class="card-body">
//                     <p class="mb-0">
//                       Sed ut perspiciatis unde omnis iste natus error sit
//                       voluptatem accusantium doloremque laudantium.
//                     </p>
//                   </div>
//                 </div>
//                 <img
//                   src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
//                   alt="avatar"
//                   class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
//                   width="60"
//                 />
//               </li>
//               <li class="d-flex justify-content-between mb-4">
//                 <img
//                   src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
//                   alt="avatar"
//                   class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
//                   width="60"
//                 />
//                 <div class="card">
//                   <div class="card-header d-flex justify-content-between p-3">
//                     <p class="fw-bold mb-0">Brad Pitt</p>
//                     <p class="text-muted small mb-0">
//                       <i class="far fa-clock"></i> 10 mins ago
//                     </p>
//                   </div>
//                   <div class="card-body">
//                     <p class="mb-0">
//                       Lorem ipsum dolor sit amet, consectetur adipiscing elit,
//                       sed do eiusmod tempor incididunt ut labore et dolore magna
//                       aliqua.
//                     </p>
//                   </div>
//                 </div>
//               </li>
//               <li class="bg-white mb-3">
//                 <div class="form-outline">
//                   <textarea
//                     class="form-control"
//                     id="textAreaExample2"
//                     rows="4"
//                     style={{ height: "10px" }}
//                   ></textarea>
//                   <label class="form-label" for="textAreaExample2">
//                     Message
//                   </label>
//                 </div>
//               </li>
//               <button type="button" class="btn btn-info btn-rounded float-end">
//                 Send
//               </button>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Chat;

//////////////////////////////----------dummy chat ui end-------//////////////////



