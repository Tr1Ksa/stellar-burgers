import type { Middleware } from '@reduxjs/toolkit';
import { postOrder } from '../orderSlice';
import { clearConstructor } from '../constructorBurgerSlice';

export const orderMiddleware: Middleware = (store) => (next) => (action) => {
  if (postOrder.fulfilled.match(action)) {
    store.dispatch(clearConstructor());
  }
  return next(action);
};
