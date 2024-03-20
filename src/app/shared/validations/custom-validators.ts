import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, debounceTime, map, of } from "rxjs";
import { FinancialProductsService } from "../../services/financial-products.service";

export const dateValidator = (): ValidatorFn => {
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

export const verifyIdValidator = (financialProductsService:FinancialProductsService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return financialProductsService.verifyProductByID(control.value).pipe(
      debounceTime(1000),
      map((exists) => (exists ? { exists_id: true } : null)),
      catchError(() => of(null))
    );
  };
}
