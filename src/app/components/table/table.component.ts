import { AsyncPipe, DatePipe, JsonPipe, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  input,
  signal,
} from '@angular/core';
import { IProduct } from '../../interfaces/product';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe, SlicePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // @Input({ required: true }) products: IProduct[] = [];
  products = input.required<IProduct[]>()

  limit = signal<number>(5);
  page = signal<number>(1);

  productsData = computed(() => {
    const index = (this.page() - 1) * this.limit();
    const lastIndex = index + this.limit();

    return this.products().slice(index, lastIndex);
  });

  changeLimitPage(value: string) {
    const lastPage = this.lastPage(Number(value))

    if (this.page() > lastPage) this.page.set(lastPage);

    this.limit.set(Number(value));
  }

  previusPage() {
    this.page.update((currentValue) => currentValue - 1);
  }

  nextPage() {
    this.page.update((currentValue) => currentValue + 1);
  }

  lastPage(limit:number): number {
    return Math.ceil(this.products().length / limit);
  }
}
