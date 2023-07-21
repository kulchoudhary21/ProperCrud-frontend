import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import getURl from "../../utils/constant";
import * as Yup from "yup";
import { postApi } from "../../utils/apiUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../store/isLoginSlice";

const validatio12 = Yup.object().shape({
  username: Yup.string().required(`${getURl.username_required}`),
  passwd: Yup.string().required(`${getURl.passwd_required}`),
});
function Login() {
  const count = useSelector((state) => state.isLogin.value);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState();
  const [userType, setUserType] = useState();
  const navigate = useNavigate();
  async function loginCheck(data) {
    const Formdata = new FormData();
    Formdata.append("username", data.username);
    Formdata.append("passwd", data.passwd);
    console.log("for id", Formdata);
    try {
      const result = await postApi(
        `${getURl.BASE_URL_USER}/login`,
        Formdata,
        false
      );
      console.log("reslogin", result);
      if (result.status === 200) {
        localStorage.setItem("userInfo", result.data.userdataAccess);
        localStorage.setItem("accessToken", result.data.token);
        toast.success("Welcome to my app !", {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoader(false);
        dispatch(setIsLogin(!count));
        navigate("/product");
      } else if (result.response.status === 404) {
        console.log("dddddddd1",result)
        toast.error("404 " + result.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.log("dddddddd2",result)
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.log("err.....",err)
      toast.error("Error 404", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.log("ee", err);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          passwd: "",
        }}
        validationSchema={validatio12}
        onSubmit={(values) => {
          console.log("values20", values);
          loginCheck(values);
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <Form action="" className="uploads-document-form">
            <div className="row">
              <div className="col-12 m-4">
                <center>
                  <h4>Login</h4>
                </center>
              </div>

              <div
                className="col-7"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "40%",
                }}
              >
                <div className="input-group  mb-3">
                  <Field
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="Username"
                  />
                </div>
                {errors.username && touched.username ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.username}
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <Field
                    name="passwd"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                {errors.passwd && touched.passwd ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.passwd}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col-12 m-4">
              <div
                className="row"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "40%",
                }}
              >
                <div className="col">
                  <center>
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Login"
                    />
                  </center>
                </div>
                <div className="col">
                  <center>
                    <input
                      type="button"
                      className="btn btn-primary"
                      value="Cancel"
                      onClick={() => {
                        navigate("/");
                      }}
                    />
                  </center>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
