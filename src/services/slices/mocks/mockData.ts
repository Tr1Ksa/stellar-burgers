// mockData.ts
import { TIngredient, TOrder, TUser } from '@utils-types';

export const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

export const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

export const mockIngredientsList: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

export const mockOrder: TOrder = {
  _id: '664e973297ede0001d06bdbe',
  ingredients: ['testid1', 'testid2'],
  status: 'done',
  name: 'Флюоресцентный люминесцентный бургер',
  createdAt: '2024-05-23T01:09:06.622Z',
  updatedAt: '2024-05-23T01:09:06.967Z',
  number: 40682
};

export const mockOrdersList: TOrder[] = [
  {
    _id: '664e927097ede0001d06bdb9',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-05-23T00:48:48.039Z',
    updatedAt: '2024-05-23T00:48:48.410Z',
    number: 40680
  },
  {
    _id: '664e85e497ede0001d06bda7',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-05-22T23:55:16.472Z',
    updatedAt: '2024-05-22T23:55:16.866Z',
    number: 40679
  }
];

export const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

export const mockLoginData = {
  email: 'test@example.com',
  password: 'password'
};

export const mockRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password'
};

export const mockUpdatedUser: TUser = {
  name: 'Updated Name',
  email: 'updated@example.com'
};
