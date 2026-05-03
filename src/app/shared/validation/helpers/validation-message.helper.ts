import {
  MaxValidationError,
  MinValidationError,
  ValidationError,
} from '@angular/forms/signals';

export const validationMessageHelper = (error: ValidationError) => {
  if (error.message) {
    return error.message;
  }

  switch (error.kind) {
    case 'required':
      return 'This field is required';
    case 'email':
      return 'Please enter a valid email address';
    case 'min':
      const newErrorMin = error as MinValidationError;
      return `Minimum value is ${newErrorMin.min}`;
    case 'max':
      const newErrorMax = error as MaxValidationError;
      return `Maximum value is ${newErrorMax.max}`;
    case 'pattern':
      return 'Invalid format';
    default:
      return error.message || 'Invalid field';
  }
};
