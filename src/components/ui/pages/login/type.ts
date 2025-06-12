import { ChangeEvent, SyntheticEvent } from 'react';

export type LoginUIProps = {
  email: string;
  password: string;
  errorText: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
