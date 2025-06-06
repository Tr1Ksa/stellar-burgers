import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import {
  addBun,
  addIngredient
} from '../../services/slices/constructorBurgerSlice';
import { BurgerIngredientUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
