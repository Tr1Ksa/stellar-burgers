import { getFeedsApi } from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { FEEDS_SLICE_NAME } from './sliceNames';

type TFeedsState = {
  isLoading: boolean;
  error: null | SerializedError;
  data: TOrdersData;
};

export const initialState: TFeedsState = {
  isLoading: true,
  error: null,
  data: {
    orders: [],
    total: NaN,
    totalToday: NaN
  }
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>(`${FEEDS_SLICE_NAME}/fetch`, async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (error) {
    return rejectWithValue('Ошибка загрузки ленты заказов');
  }
});

const feedsSlice = createSlice({
  name: FEEDS_SLICE_NAME,
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
  selectors: {
    selectFeedsLoading: (state) => state.isLoading,
    selectOrders: (state) => state.data.orders,
    selectTotal: (state) => state.data.total,
    selectTotalToday: (state) => state.data.totalToday
  }
});

export const {
  selectFeedsLoading,
  selectOrders,
  selectTotal,
  selectTotalToday
} = feedsSlice.selectors;

export default feedsSlice.reducer;
