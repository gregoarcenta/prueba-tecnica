import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { FinancialProductsService } from './financial-products.service';
import { environment } from '../../environments/environment.development';
import { IProduct } from "../interfaces/product";

const mockData = [
  {
    id: 'abc',
    name: 'Tarjetas d credito',
    description: 'Tarjetas de consumo bajo la modalidad de credito',
    logo: 'logoUrl',
    date_release: '2023-02-01T00:00:00.000+00:00',
    date_revision: '2024-02-01T00:00:00.000+00:00',
  },
  {
    id: 'abc1',
    name: 'Tarjetas d credito',
    description: 'Tarjetas de consumo bajo la modalidad de credito',
    logo: 'logoUrl',
    date_release: '2023-02-01T00:00:00.000+00:00',
    date_revision: '2024-02-01T00:00:00.000+00:00',
  },
];

describe('FinancialProductsService', () => {
  const url: string = environment.url;
  let service: FinancialProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductsService],
    });
    service = TestBed.inject(FinancialProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('Debe de retornar un el array de productos', (done) => {
    service.getProducts().subscribe((response) => {
      expect(response).toEqual(mockData);
      expect(service.products$.getValue()).toEqual(mockData);
      done();
    });
    const request = httpMock.expectOne(`${url}/bp/products`);
    expect(request.request.method).toEqual('GET');
    request.flush(mockData);
    httpMock.verify();
  });
  it('Debe de retornar true si el ID ya existe', (done) => {
    const id = 'abc123'
    service.verifyProductByID(id).subscribe((response) => {
      expect(response).toBe(true);
      done();
    });
    const request = httpMock.expectOne(`${url}/bp/products/verification?id=${id}`);
    expect(request.request.method).toEqual('GET');
    request.flush(true);
    httpMock.verify();
  });
  it('Debe de agregar un producto', (done) => {
    service.addProduct({} as IProduct).subscribe((response) => {
      expect(response).toEqual({});
      done();
    });
    const request = httpMock.expectOne(`${url}/bp/products`);
    expect(request.request.method).toEqual('POST');
    request.flush({});
    httpMock.verify();
  });
  it('Debe de actualizar un producto', (done) => {
    service.updateProduct({} as IProduct).subscribe((response) => {
      expect(response).toEqual({});
      done();
    });
    const request = httpMock.expectOne(`${url}/bp/products`);
    expect(request.request.method).toEqual('PUT');
    request.flush({});
    httpMock.verify();
  });
  it('Debe de eliminar un producto', (done) => {
    const id = 'abc123'
    service.deleteProduct(id).subscribe((response) => {
      expect(response).toEqual({});
      done();
    });
    const request = httpMock.expectOne(`${url}/bp/products?id=${id}`);
    expect(request.request.method).toEqual('DELETE');
    request.flush({});
    httpMock.verify();
  });
});
