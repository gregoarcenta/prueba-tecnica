import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const dateValidate = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const date: string = control.value;

    if (!date) return null;

    const [year, month, day] = date.split('-');

    const newDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).getTime();

    const actualDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();

    if (newDate < actualDate) return { date_invalid: true };
    return null;
  };
};
