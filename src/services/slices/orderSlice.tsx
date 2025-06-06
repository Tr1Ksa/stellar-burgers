// src/services/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api'; // Предположим, что такой API уже существует
import { TOrder } from '@utils-types';

// Типы для состояния
export type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронный thunk для создания заказа
export const postOrder = createAsyncThunk<TOrder, string[]>(
  'order/postOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order; // предположим, что ответ содержит объект order
    } catch (error) {
      return rejectWithValue('Ошибка при создании заказа');
    }
  }
);

// Создаем слайс
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderError: (state) => state.error
  }
});

// Экспортируем экшены и селекторы
export const { closeOrderModal } = orderSlice.actions;
export const { selectOrderRequest, selectOrderModalData, selectOrderError } =
  orderSlice.selectors;

export default orderSlice.reducer;
