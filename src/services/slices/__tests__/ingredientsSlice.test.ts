import ingredientsSlice, { fetchIngredients } from '../ingredientsSlice';
import { mockIngredientsList } from '../mocks/mockData';

jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice — загрузка ингредиентов', () => {
  const initialState = {
    data: [],
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('начальное состояние корректно', () => {
    const result = ingredientsSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  test('fetchIngredients.pending — загрузка начата', () => {
    const result = ingredientsSlice(initialState, fetchIngredients.pending(''));
    expect(result.isLoading).toBe(true);
  });

  test('fetchIngredients.fulfilled — данные загружены', async () => {
    const { getIngredientsApi } = require('../../../utils/burger-api');
    getIngredientsApi.mockResolvedValueOnce({ data: mockIngredientsList });

    const action = await fetchIngredients.fulfilled(mockIngredientsList, '');
    const result = ingredientsSlice(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.data).toEqual(mockIngredientsList);
  });

  test('fetchIngredients.rejected — ошибка загрузки', async () => {
    const { getIngredientsApi } = require('../../../utils/burger-api');
    getIngredientsApi.mockRejectedValueOnce(new Error('Ошибка загрузки'));

    const action = await fetchIngredients.rejected(
      new Error('Ошибка загрузки'),
      ''
    );
    const result = ingredientsSlice(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки');
  });
});
