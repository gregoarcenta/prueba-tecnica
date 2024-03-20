import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { IProduct } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class FinancialProductsService {
  public products$ = new BehaviorSubject<IProduct[]>([]);
  private http = inject(HttpClient);
  private url = environment.url;

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.url}/bp/products`).pipe(
      tap((products) => this.products$.next(products)),
      catchError((err) =>
        throwError(
          () => 'Lo sentimos, hubo un error. Vuelva a cargar la página'
        )
      )
    );
  }

  getProductById(id: string): Observable<IProduct | undefined> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  verifyProductByID(id: string): Observable<boolean> {
    const params = new HttpParams().set('id', id);
    return this.http.get<boolean>(`${this.url}/bp/products/verification`, {
      params,
    });
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.url}/bp/products`, product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.url}/bp/products`, product);
  }

  deleteProduct(id: string): Observable<string> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<any>(`${this.url}/bp/products`, {
      params,
      responseType: 'text' as 'json',
    });
  }
}
