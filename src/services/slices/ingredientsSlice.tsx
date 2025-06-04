import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { INGRIDIENTS_SLICE_NAME } from './sliceNames';

type TIngredientsState = {
  data: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  data: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  `${INGRIDIENTS_SLICE_NAME}/fetch`,
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: INGRIDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  },
  selectors: {
    // Селектор для получения всех ингредиентов
    selectIngredients: (state) => state.data,
    // Селектор для получения статуса загрузки
    selectIngredientsLoading: (state) => state.isLoading,
    // Селектор для получения ошибки
    selectIngredientsError: (state) => state.error,
    // Селектор для получения ингредиентов по типу
    selectIngredientsByType: (state) => (type: string) =>
      state.data.filter((ingredient) => ingredient.type === type)
  }
});

// Экспортируем селекторы напрямую
export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredientsByType
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
