import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { closeOrderModal as closeOrderModalAction } from '../../services/slices/orderSlice';
import {
  postOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/orderSlice';
import {
  selectConstructorItems,
  clearConstructor
} from '../../services/slices/constructorBurgerSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const ingredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ing) => ing._id),
        constructorItems.bun._id
      ];

      const resultAction = await dispatch(postOrder(ingredientsIds));

      if (postOrder.fulfilled.match(resultAction)) {
        dispatch(clearConstructor());
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
