import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FinancialProductsService } from '../../services/financial-products.service';
import {
  dateValidator,
  verifyIdValidator,
} from '../../shared/validations/custom-validators';
import { IProduct } from '../../interfaces/product';
import { EMPTY, map, pipe, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalMessageService } from '../../services/modal-message.service';

interface IProductForm {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  logo: FormControl<string>;
  date_release: FormControl<string>;
  date_revision: FormControl<string>;
}

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css',
})
export default class AddProductsComponent implements OnInit {
  // services
  private financialProductService = inject(FinancialProductsService);
  private modalMessageService = inject(ModalMessageService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private nnfb = inject(NonNullableFormBuilder);

  //FormGoup
  public productForm = this.nnfb.group<IProductForm>({
    id: this.nnfb.control(
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
      [verifyIdValidator(this.financialProductService)]
    ),
    name: this.nnfb.control('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: this.nnfb.control('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: this.nnfb.control('', [Validators.required]),
    date_release: this.nnfb.control('', [Validators.required, dateValidator()]),
    date_revision: this.nnfb.control({ value: '', disabled: true }, [
      Validators.required,
    ]),
  });

  public productId: string | null = null;
  private product: IProduct | null = null;

  constructor() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.productId) this.getPorductById(this.productId);
  }

  ngOnInit(): void {
    this.productForm
      .get('date_release')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
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

  getPorductById(productId: string) {
    this.financialProductService
      .getProductById(productId)
      .pipe(takeUntilDestroyed())
      .subscribe((product) => {
        if (product) {
          this.product = product;
          this.fillFormPorduct(product);

          const controlId = this.productForm.controls['id'];
          controlId.disable();
          controlId.clearAsyncValidators();
          controlId.updateValueAndValidity();
          return;
        }

        this.router.navigateByUrl('/');
      });
  }

  fillFormPorduct(product: IProduct) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release.toLocaleString().slice(0, 10),
      date_revision: product.date_revision.toLocaleString().slice(0, 10),
    });
  }

  formReset() {
    if (this.product) return this.fillFormPorduct(this.product);

    this.productForm.reset();
  }

  formSubmit() {
    if (this.productForm.invalid) return this.productForm.markAllAsTouched();

    if (this.product) return this.updateProduct();

    return this.createProduct();
  }

  updateProduct() {
    this.financialProductService
      .updateProduct(this.productForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.modalMessageService.alert({
            title: 'Listo',
            detail: `Producto "${response.name}" actualizado correctamente`,
            type: 'success',
          });
          (this.product = response)
        },
        error: (err) => console.error(err),
      });
  }

  createProduct() {
    this.financialProductService
      .addProduct(this.productForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.modalMessageService.alert({
            title: 'Listo',
            detail: `Producto "${response.name}" creado correctamente`,
            type: 'success',
          });
          this.formReset();
        },
        error: (err) => console.error(err),
      });
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
