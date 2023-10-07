import React, { useState } from "react";
import Home from "./Home/Home";
import { Routes, Route } from "react-router-dom";
import { getScreenWidth } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import Login from "./Login/Login";
import Nav from "./Nav/Nav";
import Signup from "./Signup/Signup";

function App() {
  const dispatch = useDispatch();

  const updateScreenWidth = () => {
    dispatch(getScreenWidth(window.innerWidth))
  };

  React.useEffect(() => {
    window.addEventListener('resize', updateScreenWidth);
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);






  return (
    <div className="App">

      <Nav/>



   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
      </Routes>
 
     
    </div>
  );
}

export default App;
