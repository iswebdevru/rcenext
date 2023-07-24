import { FieldError } from 'react-hook-form';

export function getFieldError(fieldError: FieldError) {
  switch (fieldError.type) {
    case 'required':
      return 'Это поле обязательно';
    default:
      return 'Поле содержит ошибку';
  }
}
