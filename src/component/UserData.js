import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import Loader from "../loader/Loader";
import { useState } from "react";

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
    .matches(/^([a-z][a-z0-9@._]*$)/, "Enter valid user it contains only @_.")
    .min(10, "Too short min length 10")
    .required("Username is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  age: Yup.string().required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  myfile: Yup.mixed()
    .required("Required")
    .test("is-valid-type", "Not a valid image type", (value) =>
      isValidFileType(value && value.name.toLowerCase(), "image")
    )
    .test(
      "is-valid-size",
      "Max allowed size is 100KB",
      (value) => value && value.size <= MAX_FILE_SIZE
    ),

  passwd: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  cpasswd: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("passwd")], "Passwords do not match"),
});
function UserData() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState();
  function createData(data) {
    setLoader(true);
    console.log("data", data);

    const Formdata = new FormData();
    Formdata.append("username", data.username);
    Formdata.append("age", data.age);
    Formdata.append("email", data.email);
    Formdata.append("gender", data.gender);
    Formdata.append("myfile", data.myfile);
    Formdata.append("name", data.name);
    Formdata.append("passwd", data.passwd);
    console.log("for id", Formdata);
    axios
      .post("http://localhost:3001/user/create", Formdata)
      .then((req, resp) => {
        console.log("Created succesfully", resp);
        toast.success("user successfully created !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err.response.data.message, "eroor");
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          name: "",
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
                  <h4>User data</h4>
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
                  <Field as="select" name="gender" className="form-control">
                    <option defaultValue="gender">selet gender</option>
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
                            navigate("/");
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
      <ToastContainer />
    </div>
  );
}

export default UserData;
