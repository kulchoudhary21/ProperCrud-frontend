import React, { useState } from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import getURl from "../../utils/constant";
import { postApi } from "../../utils/apiUtils";
import decryptCrypto from "../../utils/decryptCrypto";
import { useSelector, useDispatch } from "react-redux";
const MAX_FILE_SIZE = 1024000; //110KB

const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp", "avif"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const validatio12 = Yup.object().shape({
  productName: Yup.string().required(`${getURl.productName}`),
  productModel: Yup.string().required(`${getURl.productModel}`),
  productTitle: Yup.string().required(`${getURl.productTitle}`),
  price: Yup.number().required(`${getURl.price}`).min(0,`${getURl.min_price}`),
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
});

function AddProduct() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.isLogin.value);
  const navigate = useNavigate();
  const [loader, setLoader] = useState();
  console.log(getURl);
  async function createProduct(data) {
    setLoader(true);
    const userInfo = await decryptCrypto();
    console.log("userid", userInfo.id);
    const Formdata = new FormData();
    Formdata.append("shopOwnerId", userInfo.id);
    Formdata.append("productName", data.productName);
    Formdata.append("productModel", data.productModel);
    Formdata.append("productTitle", data.productTitle);
    Formdata.append("price", data.price);
    Formdata.append("myfile", data.myfile);
    console.log("for id", await Formdata);
    try {
      const result = await postApi(
        `${getURl.BASE_URL_PRODUCT}/addProduct`,
        Formdata,
        true
      );
      console.log("res", result);
      if (result.status === 200) {
        toast.success("product successfully added !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/product");
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
          productName: "",
          productModel: "",
          productTitle: "",
          price: "",
          myfile: "",
        }}
        validationSchema={validatio12}
        onSubmit={(values) => {
          console.log("values20", values);
          createProduct(values);

        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <Form action="" className="uploads-document-form">
            <div className="row">
              <div className="col-12 m-4">
                <center>
                  <h4>Add Product</h4>
                </center>
              </div>

              <div
                className="col-7"
                style={{ marginLeft: "auto", marginRight: "auto" }}
              >
                <div className="input-group mb-3">
                  <Field
                    name="productName"
                    type="text"
                    className="form-control"
                    placeholder="Product"
                  />
                </div>
                {errors.productName && touched.productName ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.productName}
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <Field
                    name="productModel"
                    type="text"
                    className="form-control"
                    placeholder="Model name"
                  />
                </div>
                {errors.productModel && touched.productModel ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.productModel}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    placeholder="Product title"
                    name="productTitle"
                    type="text"
                    className="form-control"
                  />
                </div>
                {errors.productTitle && touched.productTitle ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.productTitle}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    placeholder="Price"
                    name="price"
                    type="number"
                    className="form-control"
                    min="0"
                  />
                </div>
                {errors.price && touched.price ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.price}
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

                <div className="col-12 m-4">
                  <div className="row">
                    <div className="col">
                      <center>
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Submit"
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

export default AddProduct;
