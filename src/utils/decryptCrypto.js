import CryptoJS from "crypto-js"
import getURl from "./constant"
  async function decryptCrypto(){
    const encrptedUserInfo=await localStorage.getItem("userInfo")
    const bytes=await CryptoJS.AES.decrypt(encrptedUserInfo,getURl.cryptojs)
    const jdata=await bytes.toString(CryptoJS.enc.Utf8)
    const data=JSON.parse(jdata); 
    return data
  }
export default decryptCrypto