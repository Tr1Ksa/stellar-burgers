import React, { FC } from 'react';
import { OrderStatusUI } from '@ui';
import { OrderStatusProps } from './type';

const statusText: Record<string, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан',
  cancelled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
