import React, { useState } from "react";
import "./Signup.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { registerUser, resendOtp, resetUser, verifyOtp } from "../redux/userSlice";
import { Modal } from "antd";
import OtpInput from "react-otp-input";

const inputStyle = {
  border: "2px solid white",
  background: "white",
  width: "100%",
  fontFamily: "'Open Sans', sans-serif",
  borderRadius: "8px",
};

const pStyle = {
  fontFamily: "'Open Sans', sans-serif",
  fontSize: "1.1rem",
  fontWeight: "bold",
  letterSpacing: "0.1rem",
  marginBottom: "0.1rem",
  marginTop: "1rem",
  color: "white",
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { screen, userLoading, registerStatus, userMessage, userVerifyStatus,resendStatus } =
    useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempData, setTempData] = React.useState(null);
  const [error, setError] = React.useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const signupClick = () => {
    // setIsModalOpen(true);
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      resendStatus,
    } = formData;

    if (
      firstname === "" ||
      lastname === "" ||
      password === "" ||
      email === "" ||
      confirmPassword === ""
    ) {
      toast.error("All fields are required !");
    } else if (password?.length < 8) {
      toast.error("Password should contain at least 8 characters !");
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password must match !");
    } else {
      dispatch(
        registerUser({ firstname, lastname, email, password, role: "USER" })
      );
    }
  };

  React.useEffect(() => {
    if (userLoading === false && registerStatus === true) {
      if (userMessage?.message === "We have sent verification email.") {
        // setIsModalOpen(true);
        setTempData(userMessage);
        dispatch(resetUser());
      }
      //  toast.success("Registered successfully !");
      //  dispatch(resetUser())
    } else if (userLoading === false && registerStatus === false) {
      if (userMessage?.message === "User already exists ! please login") {
        toast.error("User already exist ! please login");
        dispatch(resetUser());
      }
    }
  }, [userLoading]);

  React.useEffect(() => {
    if (
      tempData !== null &&
      tempData !== "undefined" &&
      tempData &&
      tempData !== undefined
    ) {
      setIsModalOpen(true);
    }
  }, [tempData]);
  console.log(tempData, "tempData");

  const verifyClick = () => {
    setError("");
    if (otp === "") {
      toast.error("Otp is required !");
    } else if (otp?.length !== 6) {
      toast.error("Please enter valid otp !");
    } else {
      const numericRegex = /^[0-9]*$/;
      if (numericRegex.test(otp)) {
        // console.log("valid",otp)
        dispatch(
          verifyOtp({
            id: tempData?.id,
            code: otp,
          })
        );
      } else {
        toast.error("Otp must contain only numbers !");
      }
    }
  };

  React.useEffect(() => {
    if (userLoading === false && userVerifyStatus === true) {
      if (
        userMessage?.message ===
        "OTP verification successful. User is now activated."
      ) {
        setError("");
        setIsModalOpen2(true);
        dispatch(resetUser());
        setIsModalOpen(false);
        setOtp("");
        setTempData(null);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } else if (userLoading === false && userVerifyStatus === false) {
      if (
        userMessage?.message ===
        "You took so long to verify. please login again"
      ) {
        setError("You took long. please login !");
        dispatch(resetUser());
      } else if (userMessage?.message === "Invalid OTP. Please try again.") {
        setError("Invalid Otp. please try again");
        dispatch(resetUser());
      }
    }
  }, [userLoading]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const resendClick=()=>{
    if(tempData?.id){
      dispatch(resendOtp(tempData?.id))
    }
  };

  React.useEffect(()=>{
    if(userLoading===false && resendStatus===true){
      if(userMessage?.message==="We have sent otp code again"){
        toast.success("An otp has been sent again !")
      }
    }else if(userLoading===false && resendStatus===false){
        if(userMessage?.message==="User doesn't exist"){
          dispatch(resetUser());
          toast.error("User doesn't exist !")
        }
    }
  },[userLoading]);



  return (
    <>
      <div className="sign-up">
        <div
          className="signup-box"
          style={{
            width: screen < 420 ? "100%" : "400px",
            padding: "1rem",
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontSize: "1.9rem",
                fontWeight: "bold",
                letterSpacing: "0.1rem",
                color: "white",
              }}
            >
              Sign Up
            </p>
          </div>

          <div style={{ width: "100%" }}>
            <p style={pStyle}>First Name</p>
            <Input
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="First Name"
              size="large"
              allowClear={true}
              bordered={false}
              style={inputStyle}
            />

            <p style={pStyle}>Last Name</p>
            <Input
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Last Name"
              size="large"
              allowClear={true}
              bordered={false}
              style={inputStyle}
            />

            <p style={pStyle}>Email</p>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              size="large"
              allowClear={true}
              bordered={false}
              style={inputStyle}
            />

            <p style={pStyle}>Password</p>
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              size="large"
              // allowClear={true}
              bordered={false}
              style={inputStyle}
            />

            <p style={pStyle}>Confirm Password</p>
            <Input.Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              size="large"
              // allowClear={true}
              bordered={false}
              style={inputStyle}
            />
          </div>

          <div style={{ width: "100%", marginTop: "1rem" }}>
            <button className="signup-btn" onClick={signupClick}>
              Sign up
            </button>
          </div>

          <div
            style={{
              marginTop: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{ color: "white", fontFamily: "'Open Sans', sans-serif" }}
            >
              Already have an account ?&nbsp;&nbsp;
              <span
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "white",
                }}
              >
                <NavLink to="/login" className="login-nav-style">
                  Login
                </NavLink>
              </span>
            </p>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
            marginTop: "12vh",
          },

          // Default options for specific types
          success: {
            duration: 2000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />

      <Backdrop sx={{ color: "#fff" , zIndex:"70000"}} open={userLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        centered={true}
        closeIcon={false}
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        zIndex={60000}
        //  onCancel={handleCancel}
      >
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#17c404",
                fontWeight: "bold",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              An OTP code has been sent to your email for verification.
            </p>
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: "1rem",
                color: "black",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Please check the inbox and spam folder of the email address
              <span style={{ textDecoration: "underline", color: "blue" }}>
                {" "}
                {tempData?.email}
              </span>
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>&nbsp;&nbsp;</span>}
              renderInput={(props, index) => (
                <input
                  {...props}
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                />
              )}
            />
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center",marginTop:"1rem" }}>
            <p
              style={{
                fontSize: "1rem",
                color: "black",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              If you haven't received the OTP, please click on the <span onClick={resendClick} style={{color:"blue",fontFamily: "'Open Sans', sans-serif",textDecoration:"underline",cursor:"pointer"}}>Resend OTP</span>
              <span style={{ textDecoration: "underline", color: "blue" }}>
               
              </span>
            </p>
          </div>

          {/* <div style={{width:"100%",marginTop:"0.1rem",display:"flex",alignItems:"center",}}>
                  <p style={{color:"blue",fontFamily: "'Open Sans', sans-serif",textDecoration:"underline"}}>Resend</p>
          </div> */}

          {error !== "" && (
            <div
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: "0.3rem",
                display: "flex",
              }}
            >
              <p
                style={{
                  color: "red",
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: "1rem",
                }}
              >
                *{error}
              </p>
            </div>
          )}

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button className="verify-btn" onClick={verifyClick}>
              VERIFY
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        centered={true}
        closeIcon={false}
        open={isModalOpen2}
        onOk={handleOk}
        footer={null}
        zIndex={60000}
        //  onCancel={handleCancel}
      >
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#17c404",
                fontWeight: "bold",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Congratulations! Your account has been successfully verified.
            </p>
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: "1rem",
                color: "black",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              You are now ready to access your account. Please proceed to the
              login page to enjoy our services.
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button className="verify-btn" onClick={() => navigate("/login")}>
              LOGIN
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Signup;
