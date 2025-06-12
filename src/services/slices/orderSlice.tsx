import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
  SerializedError,
  PayloadAction
} from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { ORDER_SLICE_NAME } from './sliceNames';
import { TOrder } from '@utils-types';

type TOrdersState = {
  isOrderLoading: boolean;
  isOrdersLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: null | SerializedError;
  data: TOrder[];
};

export const initialState: TOrdersState = {
  isOrderLoading: true,
  isOrdersLoading: true,
  orderRequest: false,
  orderModalData: null,
  error: null,
  data: []
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  `${ORDER_SLICE_NAME}/createOrder`,
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue('Ошибка при создании заказа');
    }
  }
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  `${ORDER_SLICE_NAME}/fetchOrder`,
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      if (!response?.success) {
        return rejectWithValue('Не удалось получить данные заказа');
      }
      return response.orders[0];
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке заказа');
    }
  }
);

export const fetchOrders = createAsyncThunk<TOrder[]>(
  `${ORDER_SLICE_NAME}/fetchOrders`,
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке заказов');
    }
  }
);

const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    resetOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderLoading: (state) => state.isOrderLoading
  }
});

export const { closeOrderModal, resetOrderError } = orderSlice.actions;
export const { selectOrderRequest, selectOrderModalData, selectOrderLoading } =
  orderSlice.selectors;

export default orderSlice.reducer;
