import { createSlice,createAsyncThunk  } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

const localData=window.localStorage.getItem("ecomUser");

const initialState={
    userLoading:false,
    registerStatus:false,
    userVerifyStatus:false,
    loginStatus:false,
    resendStatus:false,
    userMessage:"",
    user:localData?JSON.parse(localData):null,
    screen:window.innerWidth,
}


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ firstname, lastname, email, password, role }, thunkAPI) => {
    try {
      // Make a POST request to the registration endpoint
      const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        firstname,
        lastname,
        email,
        password,
        role,
      });

      // Return the response data, which might contain a token or user information
      return response.data;
    } catch (error) {

  
  

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ id, code }, thunkAPI) => {
    try {
      // Make a POST request to the specified API endpoint
      const response = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp/${id}/otpCode/${code}`);

      // Return the response data
      return response.data;
    } catch (error) {
      // Handle errors and reject the promise with an error message
   

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const authenticateUser = createAsyncThunk(
  'auth/authenticate',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/authenticate`, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (id, thunkAPI) => {
    try {
      // Make a POST request to the specified API endpoint
      const response = await axios.post(`${BASE_URL}/api/v1/auth/resend-otp/${id}`);

      // Return the response data (if needed)
      return response.data;
    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getScreenWidth: (state, action) => {
      state.screen = action.payload;
    },
    resetUser:(state)=>{
      state.registerStatus=false;
      state.userMessage="";
      state.userVerifyStatus=false;
      state.loginStatus=false;
      state.resendStatus=false;
    }
    
  },
  extraReducers:(builder)=>{
    builder
      .addCase(registerUser.pending, (state) => {
        state.userLoading=true;
        state.registerStatus=false;
        state.userMessage="";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userLoading=false;
        state.registerStatus=true;
        state.userMessage=action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userLoading=false;
        state.registerStatus=false;
        state.userMessage=action.payload;
      })
      //verifyOtp

      .addCase(verifyOtp.pending, (state) => {
        state.userLoading=true;
        state.userVerifyStatus=false;
        state.userMessage="";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.userLoading=false;
        state.userVerifyStatus=true;
        state.userMessage=action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.userLoading=false;
        state.userVerifyStatus=false;
        state.userMessage=action.payload;
      })
      //authenticateUser
      .addCase(authenticateUser.pending, (state) => {
        state.userLoading=true;
        state.loginStatus=false;
        state.userMessage="";
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.userLoading=false;
        state.loginStatus=true;
        state.userMessage="";
        state.user=action.payload;
        window.localStorage.setItem("ecomUser",JSON.stringify(state.user))
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.userLoading=false;
        state.loginStatus=false;
        state.userMessage=action.payload;
      })
      //    resendOtp

      .addCase(resendOtp.pending, (state) => {
        state.userLoading=true;
        state.resendStatus=false;
        state.userMessage="";
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.userLoading=false;
        state.resendStatus=true;
        state.userMessage=action.payload;
      
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.userLoading=false;
        state.resendStatus=false;
        state.userMessage=action.payload;
      })




  }
});

export const { getScreenWidth, resetUser  } = userSlice.actions;

export default userSlice.reducer;
