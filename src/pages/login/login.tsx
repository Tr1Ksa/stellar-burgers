import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { fetchLoginUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const [form, handleChange] = useForm({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchLoginUser(form))
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText=''
      email={form.email}
      password={form.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
