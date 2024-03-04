import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FinancialProductsService } from '../../services/financial-products.service';
import { dateValidate } from '../../shared/validations/custom-validators';
import { VerifyIdValidator } from '../../shared/validations/verify-id.service';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css',
})
export default class AddProductsComponent implements OnInit {
  // services
  financialProductService = inject(FinancialProductsService);
  verifyIdValidator = inject(VerifyIdValidator);
  fb = inject(FormBuilder);

  //FormGoup
  productForm = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control<string>(
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
      [this.verifyIdValidator.validate.bind(this.verifyIdValidator)]
    ),
    name: this.fb.nonNullable.control<string>('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: this.fb.nonNullable.control<string>('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: this.fb.nonNullable.control<string>('', [Validators.required]),
    date_release: this.fb.nonNullable.control<string>('', [
      Validators.required,
      dateValidate(),
    ]),
    date_revision: this.fb.nonNullable.control<string>(
      { value: '', disabled: true },
      [Validators.required]
    ),
  });

  ngOnInit(): void {
    this.productForm.get('date_release')?.valueChanges.subscribe((date) => {
      if (!date) return;
      const initDate = new Date(date);
      const newDate = new Date(date);
      newDate.setFullYear(initDate.getFullYear() + 1);
      const newDateString = newDate.toISOString().slice(0, 10);
      this.productForm.get('date_revision')?.setValue(newDateString);
    });
  }

  validInput(name: string) {
    return (
      this.productForm.get(name)!.invalid && this.productForm.get(name)!.touched
    );
  }

  formSubmit() {
    if (this.productForm.invalid) return this.productForm.markAllAsTouched();

    this.financialProductService
      .addProduct(this.productForm.getRawValue())
      .subscribe({
        next: (response) => {
          this.formReset();
        },
        error: (err) => console.warn(err),
      });
  }
  formReset() {
    this.productForm.reset();
  }

  /**
   *
   * Inicio mensajes de error productForm
   *
   */

  getErrorID() {
    const idControl = this.productForm.controls['id'];
    if (idControl.getError('required')) {
      return 'El ID es requerido';
    }
    if (idControl.getError('minlength') || idControl.getError('maxlength')) {
      return 'El ID debe contener entre 5 a 10 caracteres';
    }
    if (idControl.getError('exists_id')) {
      return 'El ID ya existe';
    }
    return '';
  }
  getErrorName() {
    const nameControl = this.productForm.controls['name'];
    if (nameControl.getError('required')) {
      return 'El nombre es requerido';
    }
    if (
      nameControl.getError('minlength') ||
      nameControl.getError('maxlength')
    ) {
      return 'El nombre debe contener entre 5 a 100 caracteres';
    }
    return '';
  }
  getErrorDescription() {
    const descriptionControl = this.productForm.controls['description'];
    if (descriptionControl.getError('required')) {
      return 'La descripción es requerida';
    }
    if (
      descriptionControl.getError('minlength') ||
      descriptionControl.getError('maxlength')
    ) {
      return 'La descripción debe contener entre 10 a 200 caracteres';
    }
    return '';
  }
  getErrorDate() {
    const dateControl = this.productForm.controls['date_release'];
    if (dateControl.getError('required')) {
      return 'La fecha de liberación es requerida';
    }
    if (dateControl.getError('date_invalid')) {
      return 'La fecha no puede se inferior a la fecha actual';
    }
    return '';
  }
  /**
   *
   * Fin mensajes de error productForm
   *
   */
}
