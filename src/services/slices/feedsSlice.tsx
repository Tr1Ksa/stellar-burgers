import { getFeedsApi } from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

// Тип состояния для ленты заказов
type TFeedsState = {
  isLoading: boolean; // Флаг загрузки данных
  error: null | SerializedError; // Ошибка (если возникла)
  data: TOrdersData; // Данные о заказах
};

// Начальное состояние
export const initialState: TFeedsState = {
  isLoading: true, // По умолчанию загрузка true, так как данные запрашиваются сразу
  error: null, // Ошибок нет
  data: {
    orders: [], // Пустой массив заказов
    total: NaN, // Общее количество заказов (пока не известно)
    totalToday: NaN // Заказов сегодня (пока не известно)
  }
};

// Асинхронный action для загрузки данных о заказах
export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feeds/fetch', // Уникальное имя action
  async () => await getFeedsApi() // Запрос к API
);

// Создание слайса
const feedsSlice = createSlice({
  name: 'feeds', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Синхронные редюсеры (пока не нужны)

  // Обработка асинхронных actions
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем ошибку
      })

      // Обработка успешной загрузки
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.data = action.payload; // Сохраняем полученные данные
      })

      // Обработка ошибки
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.error = action.error; // Сохраняем ошибку
      });
  },

  // Селекторы для доступа к данным
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

// Экспорт селекторов для использования в компонентах
export const {
  selectFeeds,
  selectFeedsLoading,
  selectFeedsError,
  selectOrders,
  selectTotal,
  selectTotalToday
} = feedsSlice.selectors;

// Экспорт редюсера по умолчанию
export default feedsSlice.reducer;
