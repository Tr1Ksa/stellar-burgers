import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../services/slices/ingredientsSlice';
import constructorBurgerReducer from '../services/slices/constructorBurgerSlice';
import userSlice from './slices/userSlice';
import feedsSlice from './slices/feedsSlice';
import orderSlice from './slices/orderSlice';
import { orderMiddleware } from './slices/middlewares/orderMiddleware';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorBurgerReducer,
  feeds: feedsSlice,
  user: userSlice,
  order: orderSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
