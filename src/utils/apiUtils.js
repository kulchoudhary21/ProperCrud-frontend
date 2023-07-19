import axios from "axios";
async function getApi(url, auth) {
  console.log("--", url);
  return await axios
    .get(url, auth)
    .then((result) => {
      console.log("u", result);
      return result;
    })
    .catch((err) => {
      console.log("Resulterr..", err.response);
      return err;
    });
}
async function postApi(url, data, auth) {
  return await axios
    .post(url, data)
    .then((result) => {
      console.log("Result", result);
      return result;
    })
    .catch((err) => {
      console.log("Resulterr", err.response);
      return err;
    });
  //   return obj;
}
async function putApi(url, data, auth) {
  return await axios
    .put(url, data)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

async function deletApi(url, auth) {
  return await axios
    .delete(url, auth)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

export { getApi, postApi, putApi, deletApi };
