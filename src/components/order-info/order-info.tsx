import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfoUI, Preloader } from '@ui';
import { TIngredient } from '@utils-types';

import {
  fetchOrder,
  selectOrderLoading,
  selectOrderModalData
} from '../../services/slices/orderSlice';

import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const isOrderLoading = useSelector(selectOrderLoading);
  const orderData = useSelector(selectOrderModalData);

  useEffect(() => {
    if (!number || isNaN(Number(number))) return;
    dispatch(fetchOrder(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientWithCount = TIngredient & { count: number };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: Record<string, TIngredientWithCount>, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (!ingredient) return acc;

        if (!acc[id]) {
          acc[id] = { ...ingredient, count: 1 };
        } else {
          acc[id].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isIngredientsLoading || isOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <p>Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
