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
import { SerializedError } from '@reduxjs/toolkit';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorText: string | null;
  loginError?: SerializedError;
  registerError?: SerializedError;
  data: TUser;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  errorText: null,
  data: {
    name: '',
    email: ''
  }
};

export const register = createAsyncThunk<TUser, TRegisterData>(
  `${USER_SLICE}/register`,
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  `${USER_SLICE}/login`,
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return user;
  }
);

export const logout = createAsyncThunk(
  `${USER_SLICE}/logout`,
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    deleteCookie('accessToken');
  }
);

export const fetchUser = createAsyncThunk(
  `${USER_SLICE}/fetch`,
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE}/updateUser`,
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
  }
);

const userSlice = createSlice({
  name: USER_SLICE,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.registerError = undefined;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.loginError = undefined;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.errorText = 'Ошибка при регистрации';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.errorText = 'Ошибка при входе';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.data = {
          email: '',
          name: ''
        };
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.errorText = action.payload as string;
      });
  }
});

export {
  login as fetchLoginUser,
  register as fetchRegisterUser,
  updateUser as fetchUpdateUser,
  logout as fetchLogout
};

export const selectUser = (state: { user: TUserState }) => state.user.data;
export const selectIsAuthenticated = (state: { user: TUserState }) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
