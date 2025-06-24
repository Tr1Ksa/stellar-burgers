import constructorBurgerReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorBurgerSlice';
import { orderBurgerApi } from '../../../utils/burger-api';
import { mockBun, mockIngredient } from '../mocks/mockData';

jest.mock('../../../utils/burger-api');

describe('Конструктор бургера — базовые действия', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('начальное состояние корректно', () => {
    const result = constructorBurgerReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  test('добавляет булку', () => {
    const action = addBun(mockBun);
    const result = constructorBurgerReducer(initialState, action);
    expect(result.bun).toEqual(mockBun);
  });

  test('добавляет ингредиент', () => {
    const action = addIngredient(mockIngredient);
    const result = constructorBurgerReducer(initialState, action);
    expect(result.ingredients.length).toBe(1);
    expect(result.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  test('удаляет ингредиент', () => {
    const stateWithIngredient = constructorBurgerReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;
    const result = constructorBurgerReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );
    expect(result.ingredients).toHaveLength(0);
  });

  test('перемещает ингредиенты', () => {
    const ing1 = { ...mockIngredient, _id: 'ing1' };
    const ing2 = { ...mockIngredient, _id: 'ing2' };
    let state = constructorBurgerReducer(initialState, addIngredient(ing1));
    state = constructorBurgerReducer(state, addIngredient(ing2));
    const result = constructorBurgerReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(result.ingredients[0]._id).toBe('ing2');
    expect(result.ingredients[1]._id).toBe('ing1');
  });

  test('очищает конструктор', () => {
    const stateWithItems = constructorBurgerReducer(
      initialState,
      addBun(mockBun)
    );
    const stateWithIngredients = constructorBurgerReducer(
      stateWithItems,
      addIngredient(mockIngredient)
    );
    const result = constructorBurgerReducer(
      stateWithIngredients,
      clearConstructor()
    );
    expect(result).toEqual(initialState);
  });

  test('мокирует вызов API заказа', async () => {
    const mockResponse = {
      success: true,
      order: {
        _id: 'order1',
        number: 12345,
        ingredients: [mockBun._id, mockIngredient._id],
        status: 'done',
        name: 'Тестовый бургер',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    (orderBurgerApi as jest.Mock).mockResolvedValue(mockResponse);
    const ingredients = [mockBun._id, mockIngredient._id];
    const response = await orderBurgerApi(ingredients);
    expect(orderBurgerApi).toHaveBeenCalledWith(ingredients);
    expect(response).toEqual(mockResponse);
  });
});
