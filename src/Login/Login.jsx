import React, { useState } from "react";
import "./Login.css";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import OtpInput from "react-otp-input";
import { NavLink, useNavigate } from "react-router-dom";
import { resendOtp, resetUser, verifyOtp } from "../redux/userSlice";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { authenticateUser } from "../redux/userSlice";

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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    screen,
    loginStatus,
    user,
    userLoading,
    userMessage,
    userVerifyStatus,
    resendStatus,
  } = useSelector((state) => state.user);
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  console.log(tempData, "te");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const loginClick = () => {
    const { email, password } = formData;
    if (email === "" || password === "") {
      toast.error("All fields are required !");
    } else {
      dispatch(
        authenticateUser({
          email,
          password,
        })
      );
    }
  };

  React.useEffect(() => {
    if (userLoading === false && loginStatus === true) {
      dispatch(resetUser());
      navigate("/");
      setError("");
      setIsModalOpen(false);
      setFormData({
        email: "",
        password: "",
      });
    } else if (userLoading === false && loginStatus === false) {
      if (
        userMessage?.message ===
        "Your account has not been activated yet. We have sent verification email."
      ) {
        setTempData(userMessage);
        dispatch(resetUser());
      } else if (userMessage?.message === "User doesn't exist.") {
        toast.error("User does not exist !");
        dispatch(resetUser());
      } else if (userMessage?.message === "Incorrect email or password.") {
        toast.error("Incorrect email or password !");
        dispatch(resetUser());
      }
    }
  }, [userLoading]);

  React.useEffect(() => {
    if (
      tempData &&
      tempData !== null &&
      tempData !== "" &&
      tempData !== "undefined" &&
      tempData !== undefined
    ) {
      setIsModalOpen(true);
    }
  }, [tempData]);

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
        dispatch(resetUser());
        setIsModalOpen2(true);
        setIsModalOpen(false);
        setTempData(null);
        setOtp("");
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const modalLoginClick = () => {
    navigate("/login");
    setIsModalOpen2(false);
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
      <div className="login">
        <div
          className="login-box"
          style={{
            width: screen < 420 ? "100%" : "400px",
            padding: "1rem",
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
              Login
            </p>
          </div>

          <div style={{ width: "100%" }}>
            <p style={pStyle}>Email</p>
            <Input
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="Email"
              size="large"
              allowClear={true}
              bordered={false}
              style={inputStyle}
            />

            <p style={pStyle}>Password</p>
            <Input.Password
              onChange={handleChange}
              name="password"
              value={formData.password}
              placeholder="Password"
              size="large"
              // allowClear={true}
              bordered={false}
              style={inputStyle}
            />
          </div>

          <div style={{ width: "100%", marginTop: "1rem" }}>
            <button className="login-btn" onClick={loginClick}>
              Login
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
              Don't have an account ?&nbsp;&nbsp;
              <span
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "white",
                }}
              >
                <NavLink to="/signup" className="signup-nav-style">
                  Sign up
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

      <Backdrop sx={{ color: "#fff",zIndex:"70000" }} open={userLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
            <button className="verify-btn" onClick={modalLoginClick}>
              LOGIN
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
