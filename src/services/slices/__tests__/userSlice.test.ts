import {
  mockLoginData,
  mockUser,
  mockRegisterData,
  mockUpdatedUser
} from '../mocks/mockData';

import userSlice, {
  fetchUser,
  login,
  register,
  updateUser,
  logout,
  checkUserAuth
} from '../userSlice';

jest.mock('../../../utils/burger-api', () => ({
  fetchUserApi: jest.fn(),
  loginApi: jest.fn(),
  registerApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

describe('userSlice — авторизация', () => {
  const initialState = {
    isAuthChecked: false,
    isAuthenticated: false,
    isLoading: false,
    errorText: null,
    data: {
      name: '',
      email: ''
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('начальное состояние корректно', () => {
    const result = userSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('вход пользователя', () => {
    test('login.pending — вход начат', () => {
      const result = userSlice(undefined, login.pending('', mockLoginData));
      expect(result.isLoading).toBe(true);
    });

    test('login.fulfilled — пользователь вошёл', () => {
      const result = userSlice(
        undefined,
        login.fulfilled(mockUser, '', mockLoginData)
      );
      expect(result.isLoading).toBe(false);
      expect(result.data).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
    });

    test('login.rejected — ошибка входа', () => {
      const result = userSlice(
        undefined,
        login.rejected(new Error(), '', mockLoginData)
      );
      expect(result.isLoading).toBe(false);
      expect(result.errorText).toBe('Ошибка при входе');
    });
  });

  describe('выход пользователя', () => {
    test('logout.fulfilled — пользователь вышел', () => {
      const stateWithUser = {
        ...initialState,
        isAuthenticated: true,
        data: mockUser
      };
      const result = userSlice(stateWithUser, logout.fulfilled(true, ''));
      expect(result.isAuthenticated).toBe(false);
      expect(result.data).toEqual({ name: '', email: '' });
    });
  });

  describe('регистрация пользователя', () => {
    test('register.pending — регистрация начата', () => {
      const result = userSlice(
        undefined,
        register.pending('', mockRegisterData)
      );
      expect(result.isLoading).toBe(true);
    });

    test('register.fulfilled — регистрация успешна', () => {
      const result = userSlice(
        undefined,
        register.fulfilled(mockUser, '', mockRegisterData)
      );
      expect(result.isLoading).toBe(false);
      expect(result.data).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
    });

    test('register.rejected — ошибка регистрации', () => {
      const result = userSlice(
        undefined,
        register.rejected(new Error(), '', mockRegisterData)
      );
      expect(result.isLoading).toBe(false);
      expect(result.errorText).toBe('Ошибка при регистрации');
    });
  });

  describe('обновление данных', () => {
    test('updateUser.fulfilled — данные обновлены', () => {
      const result = userSlice(
        undefined,
        updateUser.fulfilled(mockUpdatedUser, '', { name: 'New Name' })
      );
      expect(result.isLoading).toBe(false);
      expect(result.data).toEqual(mockUpdatedUser);
    });

    test('updateUser.rejected — ошибка обновления', () => {
      const result = userSlice(
        undefined,
        updateUser.rejected(new Error(), '', { name: 'New Name' })
      );
      expect(result.isLoading).toBe(false);
    });
  });

  describe('проверка авторизации', () => {
    test('checkUserAuth.fulfilled — авторизация подтверждена', () => {
      const result = userSlice(undefined, checkUserAuth.fulfilled(true, ''));
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(true);
    });

    test('checkUserAuth.rejected — проверка не пройдена', () => {
      const result = userSlice(
        undefined,
        checkUserAuth.rejected(new Error(), '')
      );
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(false);
    });
  });
});
