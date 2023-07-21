import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import getURl from "../../utils/constant";
import "react-toastify/dist/ReactToastify.css";
import { getApi, putApi } from "../../utils/apiUtils";

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
    .matches(/^([a-z][a-z0-9@._]*$)/, `${getURl.username_check}`)
    .min(10, `${getURl.username_min_length}`)
    .required(`${getURl.username_required}`),
  name: Yup.string().required(`${getURl.name_required}`),
  email: Yup.string().email().required(`${getURl.email_required}`),
  age: Yup.string().required(`${getURl.age_required}`),
  gender: Yup.string().required(`${getURl.gender_required}`),
  myfile: Yup.mixed().test(
    "is-valid-type",
    `${getURl.image_check_type}`,
    (value) => isValidFileType(value && value.name, "image")
  ),
});
function UpdateUser() {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState();
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  const routeParams = useParams();

  async function createData(data1) {
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

    try {
      const result = await putApi(
        `${getURl.BASE_URL_USER}/update`,
        Formdata,
        false
      );
      console.log("res", result);
      if (result.status === 200) {
        toast.success("updated successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");
        setLoader(false);
      } else {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }
  async function getSingleDataUSer() {
    try {
      console.log("idd", routeParams.id);
      const result = await getApi(
        `${getURl.BASE_URL_USER}/getOne/${routeParams.id}`,
        false
      );
      console.log("result...", result);
      if (result.status === 200) {
        setData(result.data.data[0]);
        setLoader(false);
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }
  useEffect(() => {
    getSingleDataUSer();
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
                    placeholder="Your Name"
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
                    placeholder="Date Of birth"
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

export default UpdateUser;
