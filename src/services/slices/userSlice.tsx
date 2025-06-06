import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { USER_SLICE } from './sliceNames';

type TInitialState = {
  user: TUser;
  isAuthenticated: boolean;
  isInit: boolean;
  loading: boolean;
  errorText: string;
};

export const fetchLoginUser = createAsyncThunk(
  `${USER_SLICE}/login'`,
  async (data: TLoginData) => loginUserApi(data)
);

export const fetchRegisterUser = createAsyncThunk(
  `${USER_SLICE}/register'`,
  async (data: TRegisterData) => registerUserApi(data)
);

export const getUserThunk = createAsyncThunk(`${USER_SLICE}/get`, async () =>
  getUserApi()
);

export const fetchLogout = createAsyncThunk(`${USER_SLICE}/logout`, async () =>
  logoutApi()
);

export const fetchUpdateUser = createAsyncThunk(
  `${USER_SLICE}/update`,
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const initialState: TInitialState = {
  user: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  isInit: false,
  loading: false,
  errorText: ''
};

const userSlice = createSlice({
  name: USER_SLICE,
  initialState,
  reducers: {
    init(state) {
      state.isInit = true;
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectLoading: (state) => state.loading,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      });
  }
});

export const {
  selectUser,
  selectIsAuthenticated,
  selectIsInit,
  selectLoading,
  selectErrorText
} = userSlice.selectors;

export const { init, setErrorText, removeErrorText } = userSlice.actions;

export default userSlice.reducer;
