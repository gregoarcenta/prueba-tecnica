import { Injectable, inject } from '@angular/core';
import { FinancialProductsService } from '../../services/financial-products.service';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, debounceTime, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerifyIdValidator implements AsyncValidator {
  financialProductsService = inject(FinancialProductsService);
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.financialProductsService.verifyProductByID(control.value).pipe(
      debounceTime(1000),
      map((exists) => (exists ? { exists_id: true } : null)),
      catchError(() => of(null))
    );
  }
}
