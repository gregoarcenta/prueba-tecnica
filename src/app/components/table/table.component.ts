import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { IProduct } from '../../interfaces/product';
import { ContextualMenuComponent } from '../contextual-menu/contextual-menu.component';
import { Router } from '@angular/router';
import { ModalMessageService } from '../../services/modal-message.service';
import { FinancialProductsService } from '../../services/financial-products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from "rxjs";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe, ContextualMenuComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // services
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private modalMessageService = inject(ModalMessageService);
  private financialProductsService = inject(FinancialProductsService);

  public products = input.required<IProduct[]>();

  public limit = signal<number>(5);
  public page = signal<number>(1);

  public productsData = computed(() => {
    const index = (this.page() - 1) * this.limit();
    const lastIndex = index + this.limit();

    return this.products().slice(index, lastIndex);
  });

  handleImageError(event: any) {
    event.target.src = 'assets/default.png';
  }

  changeLimitPage(value: string) {
    const lastPage = this.lastPage(Number(value));

    if (this.page() > lastPage) this.page.set(lastPage);

    this.limit.set(Number(value));
  }

  previusPage() {
    this.page.update((currentValue) => currentValue - 1);
  }

  nextPage() {
    this.page.update((currentValue) => currentValue + 1);
  }

  lastPage(limit: number): number {
    return Math.ceil(this.products().length / limit);
  }

  /**
   *
   * Update and delete product
   *
   */

  onUpdateProduct(productId: string) {
    this.router.navigate(['/edit-product', productId]);
  }

  onDeleteProduct(product: IProduct) {
    this.modalMessageService.add({
      title: 'Eliminar Producto',
      detail: `Estas seguro de eliminar el producto "${product.name}"?`,
      confirm: () => this.deleteProduct(product.id),
    });
  }

  deleteProduct(productId: string) {
    this.financialProductsService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.modalMessageService.alert({
            title: 'Listo',
            detail: 'Producto Eliminado Correctamente',
            type: 'success',
          });
          this.updateTable(productId);
        },
        error: (error) => console.log(error),
      });
  }

  updateTable(id: string) {
    this.financialProductsService.products$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        const newProducts = products.filter((product) => product.id !== id);
        this.financialProductsService.products$.next(newProducts);
      });
  }
}
