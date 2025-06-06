import { getFeedsApi } from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

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

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feeds/fetch',
  async () => await getFeedsApi()
);

const feedsSlice = createSlice({
  name: 'feeds',
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
    // Получение всех данных ленты заказов
    selectFeeds: (state) => state.data,
    // Получение статуса загрузки
    selectFeedsLoading: (state) => state.isLoading,
    // Получение ошибки (если есть)
    selectFeedsError: (state) => state.error,
    // Получение списка заказов
    selectOrders: (state) => state.data.orders,
    // Получение общего количества заказов
    selectTotal: (state) => state.data.total,
    // Получение количества заказов за сегодня
    selectTotalToday: (state) => state.data.totalToday
  }
});

export const {
  selectFeeds,
  selectFeedsLoading,
  selectFeedsError,
  selectOrders,
  selectTotal,
  selectTotalToday
} = feedsSlice.selectors;

export default feedsSlice.reducer;
