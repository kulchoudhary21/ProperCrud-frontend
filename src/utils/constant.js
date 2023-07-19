const getURl = {
  BASE_URL_USER: "http://localhost:3001/user",
  BASE_URL_PRODUCT: "http://localhost:3001/product",
  cryptojs: "uewyhf84yhrt082",

  username_required: "Username is required",
  username_min_length: "Too short min length 10",
  username_check: "Enter valid user it contains only @_.",

  name_required: "Name is required",

  email_required: "Email is required",

  age_required: "Age is required",

  gender_required: "Gender is required",
  userType_required: "user type is required",

  image_required: "Image is required",
  image_check_type: "Not a valid image type",
  image_check_size: "Max allowed size is 1000KB",

  passwd_required: "Password is required",
  passwd_check:
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",

  cpasswd_required: "Confirm Password is required",
  cpasswd_match: "Passwords do not match",
  //-----product------------
  productName: "product name is required",
  productModel: "product model is required",
  productTitle:"title is required"
};
export default getURl;
