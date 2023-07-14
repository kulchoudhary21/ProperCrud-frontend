import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import "react-toastify/dist/ReactToastify.css";

// const MAX_FILE_SIZE = 1024000;
const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp", "avif"],
};
function isValidFileType(fileName, fileType) {
  console.log("filename", fileName);
  console.log("fileType", fileType);
  if (fileName) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
    );
  } else {
    return true;
  }
}

const validatio12 = Yup.object().shape({
  username: Yup.string()
    .matches(/^([a-z][a-z0-9@._]*$)/, "Enter valid user it contains only @_.")
    .min(10, "Too short min length 10")
    .required("Username is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("email is Required"),
  age: Yup.string().required("age is Required"),
  gender: Yup.string().required("gender is Required"),
  myfile: Yup.mixed()
    .test("is-valid-type", "Not a valid image type", (value) =>
      isValidFileType(value && value.name, "image")
    )
    // .test(
    //   "is-valid-size",
    //   "Max allowed size is 100KB",
    //   (value) => value && value.size <= MAX_FILE_SIZE
    // ),
});
function UpdateUser() {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState();
  const [render,setRender]=useState(false);

  const navigate = useNavigate();
  const routeParams = useParams();
  function createData(data1) {
    setLoader(true);
    console.log("data", data1);
    const Formdata = new FormData();
    Formdata.append("username", data1.username);
    Formdata.append("age", data1.age);
    Formdata.append("email", data1.email);
    Formdata.append("gender", data1.gender);
    Formdata.append("myfile", data1.myfile);
    Formdata.append("name", data1.name);
    Formdata.append("id", routeParams.id);
    console.log("for id", Formdata);
    axios
      .put("http://localhost:3001/user/update", Formdata)
      .then((req, resp) => {
        console.log("Created succesfully", resp);
        toast.success("updated successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(err, "eroor");
      });
  }
  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/getOne/${routeParams.id}`)
      .then((resp) => {
        console.log(resp);
        setData(resp.data.data[0]);
        console.log("dfdf", resp.data.data[0]);
      })
      .catch((err) => {
        console.log("error ", err);
        toast.error(err.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }, []);

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          username: data.username,
          email: data.email,
          name: data.name,
          age: data.age,
          gender: data.gender,
          myfile: data.image,
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
              <div className="col-3 m-4">
                <center>
                  <div
                    style={{
                      border: "1px black solid",
                      borderRadius: "25px",
                      width: "150px",
                      height: "150px",
                    }}
                  >
                    <img
                      src={`http://localhost:3001/${data.image}`}
                      style={{
                        width: "100%",
                        border: "1px black solid",
                        borderRadius: "25px",
                        width: "150px",
                        height: "150px",
                      }}
                      alt="image"
                    />
                  </div>
                </center>
              </div>
              <div className="col-5 m-4" style={{ position: "sticky" }}>
                <center>
                  <h4>User data</h4>
                </center>
              </div>
              <div
                className="col-5"
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
                    name="age"
                    type="date"
                    className="form-control"
                    placeholder="date of birth"
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

                <div className="col-12">
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
    </div>
  );
}

export default UpdateUser;
