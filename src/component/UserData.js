import React from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validatio12 = Yup.object().shape({
  username: Yup.string().required("Username is Required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("email is Required"),
  age: Yup.string()
    .min(0, "too short")
    .max(5, "too long")
    .required("age is Required"),
  gender: Yup.string().required("gender is Required"),
  myfile: Yup.string().required("Image must be required"),
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
  function createData(data){
    const obj={}
    for(let item in data){
      if(item!=="myfile"){
        obj[item]=data[item]
      }
    }
    obj.image=data.myfile.name
    console.log("obj: ",obj)
    axios.post("http://localhost:4001/user/create",obj).then((req,resp)=>{
      console.log("Created succesfully",resp)
    })
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
          createData(values)
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <Form action="" class="uploads-document-form">
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
                    name="age"
                    type="number"
                    className="form-control"
                    placeholder="your Age"
                  />
                </div>
                {errors.age && touched.age ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.age}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    as="select"
                    className="form-select"
                    aria-label="Default select example"
                    name="gender"
                    defaultValue
                  >
                    <option selected>selet gender</option>
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

                <label class="inputfile-label" for="file-1">
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
                <div className="col-12">
                  <center>
                    <input type="submit" className="btn" value="Submit" />
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

export default UserData;
