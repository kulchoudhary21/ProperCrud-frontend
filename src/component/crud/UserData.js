import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import Loader from "../../loader/Loader";
import { useState } from "react";
import getURl from "../../utils/constant";
import { postApi } from "../../utils/apiUtils";

const MAX_FILE_SIZE = 1024000; //110KB

const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp", "avif"],
};

function isValidFileType(fileName, fileType) {
  console.log("filename", fileName);
  console.log("fileType", fileType);
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const validatio12 = Yup.object().shape({
  username: Yup.string()
    .matches(/^([a-z][a-z0-9@._]*$)/, `${getURl.username_check}`)
    .min(10, `${getURl.username_min_length}`)
    .required(`${getURl.username_required}`),
  name: Yup.string().required(`${getURl.name_required}`),
  email: Yup.string().email().required(`${getURl.email_required}`),
  age: Yup.string().required(`${getURl.age_required}`),
  gender: Yup.string().required(`${getURl.gender_required}`),
  userType: Yup.string().required(`${getURl.userType_required}`),
  myfile: Yup.mixed()
    .required(`${getURl.image_required}`)
    .test("is-valid-type", `${getURl.image_check_type}`, (value) =>
      isValidFileType(value && value.name.toLowerCase(), "image")
    )
    .test(
      "is-valid-size",
      `${getURl.image_check_size}`,
      (value) => value && value.size <= MAX_FILE_SIZE
    ),

  passwd: Yup.string()
    .required(`${getURl.passwd_required}`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\$%\^&\*])(?=.{8,})/, 
      `${getURl.passwd_check}`
    ),
  cpasswd: Yup.string()
    .required(`${getURl.cpasswd_required}`)
    .oneOf([Yup.ref("passwd")], `${getURl.cpasswd_match}`),
});
function UserData() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState();
  console.log(getURl);
  async function createData(data) {
    setLoader(true);
    console.log("data", data);

    const Formdata = new FormData();
    Formdata.append("username", data.username);
    Formdata.append("age", data.age);
    Formdata.append("email", data.email);
    Formdata.append("userType", data.userType);
    Formdata.append("gender", data.gender);
    Formdata.append("myfile", data.myfile);
    Formdata.append("name", data.name);
    Formdata.append("passwd", data.passwd);
    console.log("for id", Formdata);
    try {
      const result = await postApi(
        `${getURl.BASE_URL_USER}/create`,
        Formdata,
        true
      );
      console.log("res", result);
      if (result.status === 200) {
        toast.success("user successfully created !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
        setLoader(false);
      } else {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          name: "",
          userType:'',
          age: "",
          gender: "",
          passwd: "",
          cpasswd: "",
          myfile: "",
        }}
        validationSchema={validatio12}
        onSubmit={(values) => {
          console.log("values20", values);
          createData(values);
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <Form action="" className="uploads-document-form">
            <div className="row">
              <div className="col-12 m-4">
                <center>
                  <h4>Registration</h4>
                </center>
              </div>

              <div
                className="col-7"
                style={{ marginLeft: "auto", marginRight: "auto" }}
              >
                <div className="input-group mb-3">
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
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="your name"
                  />
                </div>
                {errors.name && touched.name ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.name}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    placeholder="date of birth"
                    name="age"
                    type="date"
                    className="form-control"
                    // placeholder="date of birth"
                  />
                </div>
                {errors.age && touched.age ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.age}
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <Field as="select" name="userType" className="form-control">
                    <option value="" disabled selected hidden>user type</option>
                    <option value="shopOwner">shop owner</option>
                    <option value="user">user</option>
                  </Field>
                </div>
                {errors.userType && touched.userType ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.userType}
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <Field as="select" name="gender" className="form-control">
                    <option value="" disabled selected hidden>selet gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                </div>
                {errors.gender && touched.gender ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.gender}
                  </div>
                ) : null}
                <label className="m-2 mb-3"> image</label>

                <label className="inputfile-label" htmlFor="file-1">
                  <input
                    name="myfile"
                    type="file"
                    title="&nbsp;"
                    onChange={(e) => setFieldValue("myfile", e.target.files[0])}
                  />{" "}
                </label>
                {errors.myfile && touched.myfile ? (
                  <div style={{ color: "red" }}>{errors.myfile}</div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    name="email"
                    type="text"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
                {errors.email && touched.email ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.email}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    name="passwd"
                    type="password"
                    className="form-control"
                    placeholder="password"
                  />
                </div>
                {errors.passwd && touched.passwd ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.passwd}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    name="cpasswd"
                    type="password"
                    className="form-control"
                    placeholder="confirm password"
                  />
                </div>
                {errors.cpasswd && touched.cpasswd ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.cpasswd}
                  </div>
                ) : null}
                <div className="col-12 m-4">
                  <div className="row">
                    <div className="col">
                      <center>
                        {loader ? (
                          <Loader />
                        ) : (
                          <input
                            type="submit"
                            className="btn btn-primary"
                            value="Submit"
                          />
                        )}
                      </center>
                    </div>
                    <div className="col">
                      <center>
                        <input
                          type="button"
                          className="btn btn-primary"
                          value="Cancel"
                          onClick={() => {
                            navigate("/login");
                          }}
                        />
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UserData;
