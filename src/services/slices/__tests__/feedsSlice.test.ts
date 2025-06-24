import feedsSlice, {
  fetchFeeds,
  selectFeedsLoading,
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../feedsSlice';

import { TOrder } from '@utils-types';
import { mockOrdersList } from '../mocks/mockData';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedsSlice — лента заказов', () => {
  const mockOrdersData = {
    orders: mockOrdersList as TOrder[],
    total: 123,
    totalToday: 23
  };

  const initialState = {
    isLoading: true,
    error: null,
    data: {
      orders: [],
      total: NaN,
      totalToday: NaN
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('начальное состояние корректно', () => {
    const result = feedsSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  test('fetchFeeds.pending — загрузка началась', () => {
    const result = feedsSlice(undefined, fetchFeeds.pending('', undefined));
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('fetchFeeds.fulfilled — данные загружены', async () => {
    const { getFeedsApi } = require('@api');
    getFeedsApi.mockResolvedValueOnce(mockOrdersData);

    const action = await fetchFeeds.fulfilled(mockOrdersData, '');
    const result = feedsSlice(undefined, action);

    expect(result.isLoading).toBe(false);
    expect(result.data).toEqual(mockOrdersData);
    expect(result.error).toBeNull();
  });

  test('fetchFeeds.rejected — ошибка при загрузке', async () => {
    const { getFeedsApi } = require('@api');
    getFeedsApi.mockRejectedValueOnce(new Error('Ошибка сети'));

    const action = await fetchFeeds.rejected(new Error('Ошибка сети'), '');
    const result = feedsSlice(undefined, action);

    expect(result.isLoading).toBe(false);
    expect(result.error?.message).toBe('Ошибка сети');
  });

  describe('селекторы', () => {
    const mockState = {
      feeds: {
        isLoading: false,
        error: null,
        data: mockOrdersData
      }
    };

    test('selectFeedsLoading возвращает isLoading', () => {
      const result = selectFeedsLoading(mockState as any);
      expect(result).toBe(false);
    });

    test('selectOrders возвращает список заказов', () => {
      const result = selectOrders(mockState as any);
      expect(result).toEqual(mockOrdersList);
    });

    test('selectTotal возвращает общее количество', () => {
      const result = selectTotal(mockState as any);
      expect(result).toBe(123);
    });

    test('selectTotalToday возвращает за день', () => {
      const result = selectTotalToday(mockState as any);
      expect(result).toBe(23);
    });
  });
});
