import { React, useState, useEffect } from "react";
import { Fragment } from "react";
import { Formik, Form, Field, Dropdown } from "formik";
import * as Yup from "yup";
import axios from "axios";
import constant, { BASE_URL } from "../utils/constants";

const validatio12 = Yup.object().shape({
  title: Yup.string()
    .min(3, "Please enter valid Title")
    .required("Title is Required"),

  book: Yup.string().required("Book is Required"),

  myfile: Yup.string(),

  subject: Yup.string().required("subject is Required"),

  course: Yup.string().required("Course is Required"),
  price: Yup.string().required("Price is Required"),
  tag: Yup.string().required("Tag is Required"),
});

const UploadpageEdit = (props) => {
  const [title1, setTitle] = useState("");
  const [book1, setBook] = useState("");
  const [subject1, setSubject] = useState("");
  const [course1, setCourse] = useState("");
  const [price1, setPrice] = useState("");
  const [tag1, setTag] = useState("");
  const [image, setImage] = useState("");

  const submitForm = async (values) => {
    try {
      var formData = new FormData();
      formData.append("values", JSON.stringify(values));
      formData.append("file", values.myfile);
      formData.append("_id", props.id);

      const response = await axios.post(
        `${constant.BASE_IP}/webapi/update_tupleData`,
        formData
      );
      if (response.data.status === 200) {
        props.handleClose();
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err);
    }
  };

  const onSignSuccess = async () => {
    try {
      var formData = new FormData();
      formData.append("_id", props.id);

      const response = await axios.post(
        `${constant.BASE_IP}/webapi/fetch_tupleData`,
        formData
      );

      setImage(response.data.data[0].image_name);
      setTitle(response.data.data[0].title);
      setBook(response.data.data[0].book);
      setSubject(response.data.data[0].subject);
      setCourse(response.data.data[0].course);
      setPrice(response.data.data[0].price);
      setTag(response.data.data[0].tag);

      //console.log(data2);
      // console.log(data2.length);
      // console.log("hellooooo", response.data.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    onSignSuccess();
  }, []);

  return (
    <Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: String(title1),
          book: String(book1),
          subject: String(subject1),
          course: String(course1),
          myfile: "",
          price: String(price1),
          tag: String(tag1),
        }}
        validationSchema={validatio12}
        onSubmit={(values) => {
          // console.log(values);
          submitForm(values);
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <div class="col-md-12">
            <div class="uploads-right-area">
              <div class="uploads-right-top">
                <div class="sec-head">
                  <h2>Please Update Document</h2>
                </div>
                {/ <div class="upload-dock-top card card-body box-sh">Drag & Drop Document here</div> /}
              </div>
              <div class="uploads-right-main">
                <div class="uploads-right-main-items">
                  <div class="uploads-document-box box-sh card card-body">
                    <div class="row">
                      <div class="col-md-3">
                        <div class="uploads-document-lft">
                          <span>
                            <i class="far fa-file"></i>
                          </span>
                        </div>
                      </div>
                      <div class="col-md-9">
                        <div class="uploads-document-area">
                          <Form action="" class="uploads-document-form">
                            <div class="row">
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label>Title</label>
                                  <Field
                                    name="title"
                                    type="text"
                                    class="form-control"
                                    value={values.title}
                                    placeholder="Enter title"
                                  />
                                </div>
                              </div>
                              {errors.title && touched.title ? (
                                <div style={{ color: "red" }}>
                                  {errors.title}
                                </div>
                              ) : null}

                              <div class="col-md-12">
                                <div class="form-group">
                                  <div class="form-group">
                                    <label>Book</label>

                                    <Field
                                      as="select"
                                      name="book"
                                      class="form-control"
                                      value={values.book}
                                    >
                                      <option value="Fiction Book">
                                        Fiction Book
                                      </option>
                                      <option value="Non-Fiction Book">
                                        Non-Fiction Book
                                      </option>
                                      <option value="Text Book">
                                        Text Book
                                      </option>
                                    </Field>
                                  </div>
                                  {errors.book && touched.book ? (
                                    <div style={{ color: "red" }}>
                                      {errors.book}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label>Subject</label>
                                  <Field
                                    as="select"
                                    name="subject"
                                    class="form-control"
                                    value={values.subject}
                                  >
                                    <option
                                      value=""
                                      label="Select a subject"
                                    ></option>
                                    <option value="English">English</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Maths">Maths</option>
                                    <option value="Physics">Physics</option>
                                  </Field>
                                </div>
                              </div>
                              {errors.subject && touched.subject ? (
                                <div style={{ color: "red" }}>
                                  {errors.subject}
                                </div>
                              ) : null}
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label>Course</label>

                                  <Field
                                    as="select"
                                    name="course"
                                    class="form-control"
                                    value={values.course}
                                  >
                                    <option
                                      value=""
                                      label="Select a subject"
                                    ></option>
                                    <option value="English">English</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Maths">Maths</option>
                                    <option value="Physics">Physics</option>
                                  </Field>
                                </div>
                              </div>
                              {errors.course && touched.course ? (
                                <div style={{ color: "red" }}>
                                  {errors.course}
                                </div>
                              ) : null}
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label> Documents</label>

                                  <label class="inputfile-label" for="file-1">
                                    <input
                                      type="file"
                                      title="&nbsp;"
                                      onChange={(e) =>
                                        setFieldValue(
                                          "myfile",
                                          e.target.files[0]
                                        )
                                      }
                                    />{" "}
                                    <div style={{ height: 80, width: 80 }}>
                                      <img
                                        src={`${constant.BASE_URL}/uploads/TutorAddDocumentImage/${image}`}
                                      />
                                    </div>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="#2c2f8c" viewBox="0 0 20 17">
                                          <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                        </svg> */}
                                    {/ <span>Sample Documents</span> /}
                                  </label>
                                  {errors.myfile && touched.myfile ? (
                                    <div style={{ color: "red" }}>
                                      {errors.myfile}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label>Price</label>
                                  <Field
                                    type="text"
                                    class="form-control"
                                    placeholder="$"
                                    name="price"
                                    value={values.price}
                                  />
                                </div>
                                {errors.price && touched.price ? (
                                  <div style={{ color: "red" }}>
                                    {errors.price}
                                  </div>
                                ) : null}
                              </div>
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label>Tags</label>

                                  <Field
                                    as="select"
                                    name="tag"
                                    class="form-control"
                                    value={values.tag}
                                  >
                                    <option
                                      value=""
                                      label="Select a Tag"
                                    ></option>
                                    <option value="English">English</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Maths">Maths</option>
                                    <option value="Physics">Physics</option>
                                  </Field>
                                  {errors.tag && touched.tag ? (
                                    <div style={{ color: "red" }}>
                                      {errors.tag}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div class="col-md-12 ">
                                <div class="form-group text-success ">
                                  <input
                                    type="submit"
                                    class="btn"
                                    value="Update"
                                  />
                                </div>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </Fragment>
  );
};

export default UploadpageEdit;