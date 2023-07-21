import axios from "axios";
async function getApi(url, auth) {
  if (auth) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("aceess token", accessToken);
    let headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "x-auth-token": accessToken,
    };
    return await axios
      .get(url, { headers: headers })
      .then((result) => {
        console.log("u", result);
        return result;
      })
      .catch((err) => {
        console.log("Resulterr..", err);
        return err;
      });
  } else {
    return await axios
      .get(url)
      .then((result) => {
        console.log("u", result);
        return result;
      })
      .catch((err) => {
        console.log("Resulterr..", err.response);
        return err;
      });
  }
}
async function postApi(url, data, auth) {
  if (auth) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("aceess token", accessToken);
    let headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "x-auth-token": accessToken,
    };
    return await axios
      .post(url, data, { headers: headers })
      .then((result) => {
        console.log("Result", result);
        return result;
      })
      .catch((err) => {
        console.log("Resulterr", err.response);
        return err;
      });
  } else {
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
  }
}
async function putApi(url, data, auth) {
  if (auth) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("aceess token", accessToken);
    let headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "x-auth-token": accessToken,
    };
    return await axios
      .put(url, data, { headers: headers })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return await axios
      .put(url, data)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
}

async function deletApi(url, auth) {
  if (auth) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("aceess token", accessToken);
    let headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "x-auth-token": accessToken,
    };
    return await axios
      .delete(url, { headers: headers })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return await axios
      .delete(url)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
}

export { getApi, postApi, putApi, deletApi };
