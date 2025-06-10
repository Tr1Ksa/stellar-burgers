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

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>(`${INGRIDIENTS_SLICE_NAME}/fetch`, async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error) {
    return rejectWithValue('Ошибка загрузки ингредиентов');
  }
});

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
    selectIngredients: (state) => state.data,
    selectIngredientsLoading: (state) => state.isLoading
  }
});

export const { selectIngredients, selectIngredientsLoading } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
