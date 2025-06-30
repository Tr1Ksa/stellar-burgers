import { mockOrder, mockOrdersList } from '../mocks/mockData';
import {
  orderSlice,
  createOrder,
  fetchOrder,
  fetchOrders,
  closeOrderModal,
  resetOrderError
} from '../orderSlice';

jest.mock('../../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('orderSlice — обработка заказов', () => {
  const initialState = {
    isOrderLoading: true,
    isOrdersLoading: true,
    orderRequest: false,
    orderModalData: null,
    error: null,
    data: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('начальное состояние корректно', () => {
    const result = orderSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('синхронные экшены', () => {
    test('closeOrderModal очищает данные модального окна', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };
      const result = orderSlice.reducer(stateWithOrder, closeOrderModal());
      expect(result.orderModalData).toBeNull();
    });

    test('resetOrderError очищает ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: { message: 'Ошибка' }
      };
      const result = orderSlice.reducer(stateWithError, resetOrderError());
      expect(result.error).toBeNull();
    });
  });

  describe('асинхронные экшены', () => {
    test('createOrder.pending — начинается оформление', () => {
      const result = orderSlice.reducer(
        initialState,
        createOrder.pending('', ['ing1', 'ing2'])
      );
      expect(result.orderRequest).toBe(true);
    });

    test('createOrder.fulfilled — заказ создан', () => {
      const result = orderSlice.reducer(
        initialState,
        createOrder.fulfilled(mockOrder, '', ['ing1', 'ing2'])
      );
      expect(result.orderRequest).toBe(false);
      expect(result.orderModalData).toEqual(mockOrder);
    });

    test('createOrder.rejected — ошибка создания', () => {
      const error = new Error('Ошибка');
      const result = orderSlice.reducer(
        initialState,
        createOrder.rejected(error, '', ['ing1', 'ing2'])
      );
      expect(result.orderRequest).toBe(false);
      expect(result.error?.message).toBe('Ошибка');
    });

    test('fetchOrder.fulfilled — заказ загружен', () => {
      const result = orderSlice.reducer(
        initialState,
        fetchOrder.fulfilled(mockOrder, '', 12345)
      );
      expect(result.isOrderLoading).toBe(false);
      expect(result.orderModalData).toEqual(mockOrder);
    });

    test('fetchOrders.fulfilled — список заказов загружен', () => {
      const result = orderSlice.reducer(
        initialState,
        fetchOrders.fulfilled(mockOrdersList, '')
      );
      expect(result.isOrdersLoading).toBe(false);
      expect(result.data).toEqual(mockOrdersList);
    });
  });
});
