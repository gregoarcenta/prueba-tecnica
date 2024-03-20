import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { FinancialProductsService } from '../../services/financial-products.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableComponent } from '../../components/table/table.component';
import { IProduct } from '../../interfaces/product';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SkeletonTableComponent } from '../../components/skeleton-table/skeleton-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    RouterLink,
    TableComponent,
    ReactiveFormsModule,
    SkeletonTableComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent implements OnInit {
  products$ = new BehaviorSubject<IProduct[] | null>(null);
  searchControl = new FormControl();
  errorMessage = signal('');

  //services
  financialProducts = inject(FinancialProductsService);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.financialProducts.products$
      .pipe(
        filter((products) => products.length > 0),
        takeUntilDestroyed()
      )
      .subscribe((products) => this.products$.next(products));

    this.financialProducts
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => this.products$.next(data),
        error: (err) => this.errorMessage.set(err),
      });
  }
  ngOnInit(): void {
    this.setupSearch();
  }

  searchProduct(value: string) {
    return this.financialProducts.products$.pipe(
      map((products) => {
        if (value.length === 0) return products;
        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.id.includes(value.toLowerCase())
        );
      })
    );
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.searchProduct(value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products) => {
        this.products$.next(products);
      });
  }
}
