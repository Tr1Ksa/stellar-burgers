import type { Middleware } from '@reduxjs/toolkit';
import { createOrder } from '../orderSlice';
import { clearConstructor } from '../constructorBurgerSlice';

export const orderMiddleware: Middleware = (store) => (next) => (action) => {
  if (createOrder.fulfilled.match(action)) {
    store.dispatch(clearConstructor());
  }
  return next(action);
};
