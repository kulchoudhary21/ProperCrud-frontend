import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import getURl from "../../utils/constant";
import "react-toastify/dist/ReactToastify.css";
import { getApi, putApi } from "../../utils/apiUtils";

const MAX_FILE_SIZE = 1024000; //110KB
const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp", "avif"],
};
function isValidFileType(fileName, fileType) {
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
  productName: Yup.string().required(`${getURl.productName}`),
  productModel: Yup.string().required(`${getURl.productModel}`),
  productTitle: Yup.string().required(`${getURl.productTitle}`),
  myfile: Yup.mixed().test(
    "is-valid-type",
    `${getURl.image_check_type}`,
    (value) => isValidFileType(value && value.name, "image")
  ),
});
function EditProduct() {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState();
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  const routeParams = useParams();

  async function createProduct(data1) {
    setLoader(true);
    console.log("data", data1);
    const Formdata = new FormData();
    Formdata.append("id", routeParams.id);
    Formdata.append("productName", data1.productName);
    Formdata.append("productModel", data1.productModel);
    Formdata.append("productTitle", data1.productTitle);
    Formdata.append("myfile", data1.myfile);
    console.log("for id", Formdata);

    try {
      const result = await putApi(
        `${getURl.BASE_URL_PRODUCT}/updateProduct`,
        Formdata,
        true
      );
      console.log("res", result);
      if (result.status === 200) {
        toast.success("updated successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/product");
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
        `${getURl.BASE_URL_PRODUCT}/getOneProduct/${routeParams.id}`,
        true
      );
      console.log("result...", result);
      if (result.status === 200) {
        setData(result.data.data);
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
          productName: data.productName,
          productModel: data.productModel,
          productTitle: data.productTitle,
          myfile: data.image,
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
                      src={`http://localhost:3001/productDataImages/${data.image}`}
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
                  <h4>edit product</h4>
                </center>
              </div>
              <div
                className="col-5"
                style={{ marginLeft: "auto", marginRight: "auto" }}
              >
                <div className="input-group mb-3">
                  <Field
                    name="productName"
                    type="text"
                    className="form-control"
                    placeholder="product name"
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
                    placeholder="model name"
                  />
                </div>
                {errors.productModel && touched.productModel ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.productModel}
                  </div>
                ) : null}
                <div className="input-group mb-3">
                  <Field
                    name="productTitle"
                    type="text"
                    className="form-control"
                    placeholder="product title"
                  />
                </div>
                {errors.productTitle && touched.productTitle ? (
                  <div style={{ color: "red" }} className="mb-4">
                    {errors.productTitle}
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

                <div className="col-12">
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
                            navigate("/product");
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

export default EditProduct;
