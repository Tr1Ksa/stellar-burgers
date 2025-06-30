import { rootReducer, store, RootState } from '../../../services/store';
import {
  INGRIDIENTS_SLICE_NAME,
  CONSTRUCTOR_BURGER_SLICE_NAME,
  FEEDS_SLICE_NAME,
  USER_SLICE,
  ORDER_SLICE_NAME
} from '../sliceNames';

describe('Проверка rootReducer', () => {
  test('возвращает начальное состояние при undefined', () => {
    const expectedInitialState: RootState = {
      [INGRIDIENTS_SLICE_NAME]: {
        data: [],
        isLoading: false,
        error: null
      },
      [CONSTRUCTOR_BURGER_SLICE_NAME]: {
        bun: null,
        ingredients: []
      },
      [FEEDS_SLICE_NAME]: {
        isLoading: true,
        error: null,
        data: {
          orders: [],
          total: NaN,
          totalToday: NaN
        }
      },
      [USER_SLICE]: {
        isAuthChecked: false,
        isAuthenticated: false,
        isLoading: false,
        errorText: null,
        data: {
          name: '',
          email: ''
        }
      },
      [ORDER_SLICE_NAME]: {
        isOrderLoading: true,
        isOrdersLoading: true,
        orderRequest: false,
        orderModalData: null,
        error: null,
        data: []
      }
    };
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(expectedInitialState);
  });

  test('при UNKNOWN_ACTION возвращает текущее состояние', () => {
    const before = store.getState();
    const after = rootReducer(before, { type: 'UNKNOWN_ACTION' });
    expect(after).toBe(before);
  });
});
