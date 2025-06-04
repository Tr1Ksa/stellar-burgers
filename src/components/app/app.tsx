import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink
} from 'react-router-dom';
import { AppHeader } from '../app-header';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useSelector } from 'react-redux';

// Modal wrapper component
const ModalWrapper = ({ children }: { children: JSX.Element }) => (
  <Modal onClose={() => window.history.back()} title=''>
    {children}
  </Modal>
);

export const App = () => (
  <BrowserRouter>
    <div className='app'>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/feed/:number'
          element={
            <ModalWrapper>
              <OrderInfo />
            </ModalWrapper>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <ModalWrapper>
              <IngredientDetails />
            </ModalWrapper>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <ModalWrapper>
                <OrderInfo />
              </ModalWrapper>
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
