import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { fetchUpdateUser, selectUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: ''
  });

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      const values = {
        name: user.name || '',
        email: user.email || ''
      };
      setInitialValues(values);
      setFormValue((prev) => ({
        ...prev,
        name: values.name,
        email: values.email
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== initialValues.name ||
    formValue.email !== initialValues.email;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchUpdateUser(formValue))
      .unwrap()
      .then(() => {
        setInitialValues({
          name: formValue.name,
          email: formValue.email
        });
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue((prev) => ({
      ...prev,
      name: initialValues.name,
      email: initialValues.email,
      password: ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
